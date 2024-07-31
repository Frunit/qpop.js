import { Game } from './game';
import { DIR, PLAYER_TYPE, SCENE, draw_base, draw_rect, open_load_dialog, write_text } from './helper';
import { Sprite } from './sprite';
import { anim_delays, anim_ranking } from './sprite_positions';
import { ClickArea, Dimension, KeyType, Point, SixNumbers, Stage, TechGlobal, TutorialType, WorldGlobal } from './types';

export class Ranking implements Stage {
	id = SCENE.RANKING;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];

	private bg_pic: HTMLImageElement;
	private pics: HTMLImageElement;
	private wreath_pic: HTMLImageElement;
	private sprites: Sprite[] = [];

	// Phase 0: Walking in from right to left
	// Phase 1: Moving upwards
	// Phase 2: Standing still, the winner waves its hand
	private phase = 0;
	private delay = anim_delays.ranking;
	private delay_counter = 0;
	private lead_x = 641;
	private height = 0;
	private heights: SixNumbers = [0, 0, 0, 0, 0, 0];
	private final_heights: SixNumbers = [0, 0, 0, 0, 0, 0];
	private winners: number[] = [];

	readonly load_dim: Dimension = [230, 22];
	readonly save_dim: Dimension = [231, 22];
	readonly next_dim: Dimension = [181, 22];
	readonly pillarbottom_dim: Dimension = [100, 100];
	readonly pillarcenter_dim: Dimension = [50, 8];
	readonly pillartop_dim: Dimension = [50, 10];
	readonly species_dim: Dimension = [64, 64];
	readonly icon_dim: Dimension = [16, 16];
	readonly draw_area_dim: Dimension = [634, 333];

	readonly load_offset: Point = [0, 458];
	readonly save_offset: Point = [229, 458];
	readonly next_offset: Point = [459, 458];
	readonly final_turn_offset: Point = [307, 147];
	readonly turn_offset: Point = [316, 39];
	readonly pillarbottom_offset: Point = [21, 356];
	readonly pillarcenter_offset: Point = [43, 325];
	readonly pillartop_offset: Point = [43, 315];
	readonly wreath_offset: Point = [140, 6];
	readonly sign_offset: Point = [39, 373];
	readonly draw_area_offset: Point = [3, 23];

	readonly sym_spec_offset: Point = [43, 372];
	readonly sym_dna_offset: Point = [43, 397];
	readonly sym_total_offset: Point = [43, 422];
	readonly text_spec_offset: Point = [83, 386];
	readonly text_dna_offset: Point = [83, 410];
	readonly text_total_offset: Point = [83, 435];

	readonly pillarbottom_soffset: Point = [0, 0];
	readonly pillarcenter_soffset: Point = [0, 111];
	readonly pillartop_soffset: Point = [0, 101];
	readonly outoforder_soffset: Point = [384, 384];
	readonly sym_dna_soffset: Point = [400, 480];
	readonly sym_total_soffset: Point = [384, 480];

	readonly sign_dx = 100;
	readonly walk_y = 252;
	readonly delta = 8;

	readonly dead_soffsets: Point[] = [
		[384, 0],
		[384, 64],
		[384, 128],
		[384, 192],
		[384, 256],
		[384, 320],
	];
	readonly sym_spec_soffsets: Point[] = [
		[384, 448],
		[400, 448],
		[416, 448],
		[432, 448],
		[384, 464],
		[400, 464],
	];
	readonly rel_dx = [0, 106, 206, 306, 406, 504];
	readonly max_heights = [167, 128, 104, 80, 56, 32];

	constructor(
		private game: Game,
		private glob: TechGlobal,
		private world: WorldGlobal,
	) {
		this.bg_pic = glob.resources.get_image('gfx/dark_bg.png');
		this.pics = glob.resources.get_image('gfx/ranking.png');
		this.wreath_pic = glob.resources.get_image('gfx/wreath.png');

		this.tutorials = [
			{
				name: 'ranking',
				pos: [140, 335],
				low_anchor: true,
				arrows: [],
				highlight: [
					this.pillarbottom_offset[0],
					this.pillarbottom_offset[1],
					this.pillarbottom_offset[0] + this.pillarbottom_dim[0] * 6,
					this.pillarbottom_offset[1] + this.pillarbottom_dim[1],
				],
			},
			{
				name: 'ranking_save',
				pos: [220, 435],
				low_anchor: true,
				arrows: [{ dir: DIR.S, offset: 55 }],
				highlight: [
					this.save_offset[0],
					this.save_offset[1],
					this.save_offset[0] + this.save_dim[0] - 1,
					this.save_offset[1] + this.save_dim[1],
				],
			},
		];
	}

	initialize(autosave = true) {
		if (autosave) {
			const saving_ok = this.game.save_locally();
			if (!saving_ok) {
				this.tutorials[1].name = 'ranking_no_save';
			}
		}

		this.glob.resources.play_music('ranking');
		this.sprites = [];
		for (let i = 0; i < 6; i++) {
			this.sprites.push(new Sprite(this.pics, anim_ranking.walking[i].offset, anim_ranking.walking[i].frames, anim_delays.ranking));

			this.world.players[i].total_score = this.world.players[i].evo_score + this.world.players[i].stats.reduce((a, b) => a + b);
		}

		this.determine_best();
		this.redraw();
		this.render();
		this.game.tutorial();
	}

	redraw() {
		draw_base(this.glob, this.id);

		draw_rect(this.glob.ctx, this.load_offset, this.load_dim); // Load
		write_text(this.glob.ctx, this.glob.lang.load_game, [115, 473], 'white', 'black');
		draw_rect(this.glob.ctx, this.save_offset, this.save_dim); // Save
		write_text(this.glob.ctx, this.glob.lang.save_game, [344, 473], 'white', 'black');
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim); // Continue
		write_text(this.glob.ctx, this.glob.lang.next, [549, 473], 'white', 'black');

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.load_offset[0],
			y1: this.load_offset[1],
			x2: this.load_offset[0] + this.load_dim[0] - 2,
			y2: this.load_offset[1] + this.load_dim[1] - 2,
			down: () => draw_rect(this.glob.ctx, this.load_offset, this.load_dim, true, true),
			up: () => this.load_game(),
			blur: () => draw_rect(this.glob.ctx, this.load_offset, this.load_dim),
		});

		this.clickareas.push({
			x1: this.save_offset[0] + 1,
			y1: this.save_offset[1] + 1,
			x2: this.save_offset[0] + this.save_dim[0] - 2,
			y2: this.save_offset[1] + this.save_dim[1] - 2,
			down: () => draw_rect(this.glob.ctx, this.save_offset, this.save_dim, true, true),
			up: () => this.save_game(),
			blur: () => draw_rect(this.glob.ctx, this.save_offset, this.save_dim),
		});

		this.clickareas.push({
			x1: this.next_offset[0] + 1,
			y1: this.next_offset[1] + 1,
			x2: this.next_offset[0] + this.next_dim[0] - 1,
			y2: this.next_offset[1] + this.next_dim[1] - 1,
			down: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim),
		});

		// Draw lower pillar parts
		for (let i = -1; i < 7; i++) {
			this.glob.ctx.drawImage(
				this.pics,
				this.pillarbottom_soffset[0],
				this.pillarbottom_soffset[1],
				this.pillarbottom_dim[0],
				this.pillarbottom_dim[1],
				this.pillarbottom_offset[0] + i * this.pillarbottom_dim[0],
				this.pillarbottom_offset[1],
				this.pillarbottom_dim[0],
				this.pillarbottom_dim[1],
			);
		}

		// Draw symbols in pillar signs
		for (let i = 0; i < 6; i++) {
			if (this.world.players[i].type === PLAYER_TYPE.NOBODY) {
				// Out of order
				this.glob.ctx.drawImage(
					this.pics,
					this.outoforder_soffset[0],
					this.outoforder_soffset[1],
					this.species_dim[0],
					this.species_dim[1],
					this.sign_offset[0] + i * this.sign_dx,
					this.sign_offset[1],
					this.species_dim[0],
					this.species_dim[1],
				);
			} else if (this.world.players[i].is_dead) {
				// Death symbol
				this.glob.ctx.drawImage(
					this.pics,
					this.dead_soffsets[i][0],
					this.dead_soffsets[i][1],
					this.species_dim[0],
					this.species_dim[1],
					this.sign_offset[0] + i * this.sign_dx,
					this.sign_offset[1],
					this.species_dim[0],
					this.species_dim[1],
				);
			} else {
				// Stats (Three symbols and 3x text)
				this.glob.ctx.drawImage(
					this.pics,
					this.sym_spec_soffsets[i][0],
					this.sym_spec_soffsets[i][1],
					this.icon_dim[0],
					this.icon_dim[1],
					this.sym_spec_offset[0] + i * this.sign_dx,
					this.sym_spec_offset[1],
					this.icon_dim[0],
					this.icon_dim[1],
				);
				this.glob.ctx.drawImage(
					this.pics,
					this.sym_dna_soffset[0],
					this.sym_dna_soffset[1],
					this.icon_dim[0],
					this.icon_dim[1],
					this.sym_dna_offset[0] + i * this.sign_dx,
					this.sym_dna_offset[1],
					this.icon_dim[0],
					this.icon_dim[1],
				);
				this.glob.ctx.drawImage(
					this.pics,
					this.sym_total_soffset[0],
					this.sym_total_soffset[1],
					this.icon_dim[0],
					this.icon_dim[1],
					this.sym_total_offset[0] + i * this.sign_dx,
					this.sym_total_offset[1],
					this.icon_dim[0],
					this.icon_dim[1],
				);

				this.glob.ctx.save();
				this.glob.ctx.textAlign = 'center';
				this.glob.ctx.fillStyle = '#ffffff';
				this.glob.ctx.fillText(
					this.world.players[i].individuals.toString(),
					this.text_spec_offset[0] + i * this.sign_dx,
					this.text_spec_offset[1] - 1,
				);
				this.glob.ctx.fillText(
					this.world.players[i].evo_score.toString(),
					this.text_dna_offset[0] + i * this.sign_dx,
					this.text_dna_offset[1] - 1,
				);
				this.glob.ctx.fillText(
					this.world.players[i].total_score.toString(),
					this.text_total_offset[0] + i * this.sign_dx,
					this.text_total_offset[1] - 1,
				);

				this.glob.ctx.fillStyle = '#000000';
				this.glob.ctx.fillText(
					this.world.players[i].individuals.toString(),
					this.text_spec_offset[0] + i * this.sign_dx,
					this.text_spec_offset[1],
				);
				this.glob.ctx.fillText(
					this.world.players[i].evo_score.toString(),
					this.text_dna_offset[0] + i * this.sign_dx,
					this.text_dna_offset[1],
				);
				this.glob.ctx.fillText(
					this.world.players[i].total_score.toString(),
					this.text_total_offset[0] + i * this.sign_dx,
					this.text_total_offset[1],
				);
				this.glob.ctx.restore();
			}
		}

		// Main rectangle (draw last to overwrite any spare pixels from pillar parts)
		draw_rect(this.glob.ctx, [0, 20], [640, 439]);

		this.keys = [{ key: 'ENTER', action: () => this.next(), reset: true }];
	}

	// MAYBE: This could be made more efficient, drawing only the necessary parts depeding on the phase
	render() {
		// Draw background in draw area
		this.glob.ctx.drawImage(
			this.bg_pic,
			this.draw_area_offset[0],
			this.draw_area_offset[1],
			this.draw_area_dim[0],
			this.draw_area_dim[1],
			this.draw_area_offset[0],
			this.draw_area_offset[1],
			this.draw_area_dim[0],
			this.draw_area_dim[1],
		);

		this.glob.ctx.save();
		this.glob.ctx.translate(this.draw_area_offset[0], this.draw_area_offset[1]);
		this.glob.ctx.beginPath();
		this.glob.ctx.rect(0, 0, this.draw_area_dim[0], this.draw_area_dim[1]);
		this.glob.ctx.clip();

		// Draw wreath only if the game is finished
		if (this.world.turn === this.world.max_turns) {
			this.glob.ctx.drawImage(this.wreath_pic, this.wreath_offset[0], this.wreath_offset[1]);

			// Draw turn number
			this.glob.ctx.save();
			this.glob.ctx.font = '24px serif';
			this.glob.ctx.textAlign = 'center';
			this.glob.ctx.fillStyle = '#c3c3c3';
			this.glob.ctx.fillText(this.world.turn.toString(), this.final_turn_offset[0] - 1, this.final_turn_offset[1] - 1);
			this.glob.ctx.fillStyle = '#000000';
			this.glob.ctx.fillText(this.world.turn.toString(), this.final_turn_offset[0], this.final_turn_offset[1]);
			this.glob.ctx.restore();
		} else {
			// Draw turn number
			this.glob.ctx.save();
			this.glob.ctx.font = 'bold 24px serif';
			this.glob.ctx.textAlign = 'center';
			this.glob.ctx.fillStyle = '#828282';
			this.glob.ctx.fillText(`${this.glob.lang.turn} ${this.world.turn}`, this.turn_offset[0], this.turn_offset[1]);
			this.glob.ctx.restore();
		}

		// Draw fixed upper pillar parts
		for (let i = -1; i < 12; i += 2) {
			this.glob.ctx.drawImage(
				this.pics,
				this.pillartop_soffset[0],
				this.pillartop_soffset[1],
				this.pillartop_dim[0],
				this.pillartop_dim[1],
				this.pillartop_offset[0] + i * this.pillartop_dim[0],
				this.pillartop_offset[1],
				this.pillartop_dim[0],
				this.pillartop_dim[1],
			);

			this.glob.ctx.drawImage(
				this.pics,
				this.pillarcenter_soffset[0],
				this.pillarcenter_soffset[1],
				this.pillarcenter_dim[0],
				this.pillarcenter_dim[1],
				this.pillarcenter_offset[0] + i * this.pillarcenter_dim[0],
				this.pillarcenter_offset[1],
				this.pillarcenter_dim[0],
				this.pillarcenter_dim[1],
			);
		}

		// Draw variable upper pillar parts
		for (let i = 0; i < 6; i++) {
			this.glob.ctx.drawImage(
				this.pics,
				this.pillartop_soffset[0],
				this.pillartop_soffset[1],
				this.pillartop_dim[0],
				this.pillartop_dim[1],
				this.pillartop_offset[0] + i * 2 * this.pillartop_dim[0],
				this.pillartop_offset[1] - this.heights[i],
				this.pillartop_dim[0],
				this.pillartop_dim[1],
			);

			this.glob.ctx.drawImage(
				this.pics,
				this.pillarcenter_soffset[0],
				this.pillarcenter_soffset[1],
				this.pillarcenter_dim[0],
				this.pillarcenter_dim[1],
				this.pillarcenter_offset[0] + i * 2 * this.pillarcenter_dim[0],
				this.pillarcenter_offset[1] - this.heights[i],
				this.pillarcenter_dim[0],
				this.heights[i] + this.pillarcenter_dim[1],
			);
		}

		// Draw species
		for (let i = 0; i < 6; i++) {
			this.sprites[i].render(this.glob.ctx, [this.lead_x + this.rel_dx[i], this.walk_y - this.heights[i]]);
		}

		this.glob.ctx.restore();
	}

	update() {
		for (const sprite of this.sprites) {
			sprite.update();
		}

		if (this.phase === 2) {
			return;
		}

		this.delay_counter++;
		if (this.delay_counter < this.delay) {
			return;
		}

		this.delay_counter = 0;

		if (this.phase === 0) {
			this.lead_x -= this.delta;

			if (this.lead_x <= 33) {
				this.lead_x = 33;
				this.next_phase();
			}
		} else if (this.phase === 1) {
			for (let i = 0; i < 6; i++) {
				this.heights[i] += this.delta;
				if (this.heights[i] > this.final_heights[i]) {
					this.heights[i] = this.final_heights[i];
				}
			}
			this.height += this.delta;

			if (this.height >= this.max_heights[0]) {
				this.next_phase();
			}
		}
	}

	private determine_best() {
		const scores = this.game.get_ranking();

		this.winners = [scores[0][0]];
		for (let i = 1; i < 6; i++) {
			if (scores[i][1] !== scores[i - 1][1] || scores[i][2] !== scores[i - 1][2]) {
				break;
			}

			this.winners.push(scores[i][0]);
		}

		if (this.world.players[scores[5][0]].is_dead || this.world.players[scores[5][0]].type === PLAYER_TYPE.NOBODY) {
			this.final_heights[scores[5][0]] = 0;
		} else {
			this.final_heights[scores[5][0]] = this.max_heights[5];
		}

		for (let i = 4; i >= 0; i--) {
			if (scores[i][1] === scores[i + 1][1] && scores[i][2] === scores[i + 1][2]) {
				this.final_heights[scores[i][0]] = this.final_heights[scores[i + 1][0]];
			} else {
				this.final_heights[scores[i][0]] = this.max_heights[i];
			}
		}
	}

	private next_phase() {
		if (this.phase === 0) {
			this.sprites = [];
			for (let i = 0; i < 6; i++) {
				this.sprites.push(new Sprite(this.pics, anim_ranking.standing[i].offset));
			}

			this.phase++;
		} else {
			for (const winner of this.winners) {
				this.sprites[winner] = new Sprite(
					this.pics,
					anim_ranking.boasting[winner].offset,
					anim_ranking.boasting[winner].frames,
					anim_delays.ranking_winner,
				);
			}

			this.delay = anim_delays.ranking_winner;

			this.phase++;
		}
	}

	next() {
		this.game.next_stage();
	}

	load_game() {
		draw_rect(this.glob.ctx, this.load_offset, this.load_dim);
		open_load_dialog(this.game);
	}

	save_game() {
		draw_rect(this.glob.ctx, this.save_offset, this.save_dim);
		if (!this.game.seen_tutorials.has('save')) {
			this.tutorials.push({
				name: 'save',
				pos: [220, 435],
				low_anchor: true,
				arrows: [{ dir: DIR.S, offset: 55 }],
				highlight: [
					this.save_offset[0],
					this.save_offset[1],
					this.save_offset[0] + this.save_dim[0],
					this.save_offset[1] + this.save_dim[1],
				],
			});

			this.game.tutorial();
		}

		this.game.save_game();
	}
}
