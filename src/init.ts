import { Game } from "./game";
import { DIR, PLAYER_TYPE, SCENE, draw_base, draw_rect, open_load_dialog, open_popup, write_text } from "./helper";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal, TutorialType, WorldGlobal } from "./types";

export class Init implements Stage {
	id = SCENE.INIT;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];

	private bg: HTMLImageElement;
	private spec_pics: HTMLImageElement;

	readonly panel_dim: Dimension = [308, 140];
	readonly type_dim: Dimension = [63, 63];
	readonly iq_dim: Dimension = [12, 11];
	readonly iq_text_dim: Dimension = [140, 11];
	readonly load_dim: Dimension = [230, 22];
	readonly next_dim: Dimension = [181, 22];

	readonly spec_offset: Point = [8, 31];
	readonly type_offset: Point = [83, 32];
	readonly load_offset: Point = [0, 458];
	readonly next_offset: Point = [459, 458];
	readonly iq_offset: Point = [158, 115];
	readonly text_iq_offset: Point = [216, 38];
	readonly text_iqs_offset: Point = [179, 58];

	readonly iq_dy = 22;
	readonly line_y = 34;
	readonly line_from_to: Point = [157, 297];
	readonly panel_soffset: Point = [0, 0];

	readonly panel_offsets: Point[] = [[8, 27], [322, 27], [8, 169], [322, 169], [8, 311], [322, 311]];
	readonly type_soffsets: Point[] = [[0, 0], [309, 65], [309, 1], [373, 1]];
	readonly iq_soffsets: Point[] = [[387, 65], [373, 65], [373, 78], [373, 91], [373, 104]];
	readonly spec_soffsets: Point[] = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];

	constructor(private game: Game, private glob: TechGlobal, private world: WorldGlobal) {
		this.bg = glob.resources.get_image('gfx/init.png');
		this.spec_pics = glob.resources.get_image('gfx/species.png');

		this.tutorials = [
			{
				'name': 'welcome',
				'pos': [140, 150],
				'arrows': [],
				'highlight': [160, 160, 161, 161],
			},
			{
				'name': 'change_language',
				'pos': [278, 45],
				'arrows': [{ dir: DIR.N, offset: 275 }, { dir: DIR.N, offset: 340 }],
				'highlight': [545, 0, 640, 21],
			},
			{
				'name': 'player_select',
				'pos': [35, 190],
				'arrows': [{ dir: DIR.N, offset: 80 }, { dir: DIR.N, offset: 128 }],
				'highlight': [8, 27, 316, 167],
			},
			{
				'name': 'next',
				'pos': [278, 435],
				'low_anchor': true,
				'arrows': [{ dir: DIR.S, offset: 290 }],
				'highlight': [this.next_offset[0], this.next_offset[1], this.next_offset[0] + this.next_dim[0], this.next_offset[1] + this.next_dim[1]],
			},
		];
	}

	initialize() {
		this.glob.resources.play_music('intro');
		this.game.reset();
		this.redraw();
		this.game.tutorial();
	}

	redraw() {
		draw_base(this.glob, this.id);

		draw_rect(this.glob.ctx, [0, 20], [640, 439]); // Main rectangle
		draw_rect(this.glob.ctx, this.load_offset, this.load_dim); // Load
		write_text(this.glob.ctx, this.glob.lang.load_game, [115, 473], 'white', 'black');
		draw_rect(this.glob.ctx, [229, 458], [231, 22]); // Bottom middle
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim); // Continue
		write_text(this.glob.ctx, this.glob.lang.next, [549, 473], 'white', 'black');

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.load_offset[0],
			y1: this.load_offset[1],
			x2: this.load_offset[0] + this.load_dim[0],
			y2: this.load_offset[1] + this.load_dim[1],
			down: () => draw_rect(this.glob.ctx, this.load_offset, this.load_dim, true, true),
			up: () => this.load_game(),
			blur: () => draw_rect(this.glob.ctx, this.load_offset, this.load_dim)
		});

		this.clickareas.push({
			x1: this.next_offset[0],
			y1: this.next_offset[1],
			x2: this.next_offset[0] + this.next_dim[0],
			y2: this.next_offset[1] + this.next_dim[1],
			down: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim)
		});

		// Lengths of lines around iq title
		const distance = Math.ceil(this.glob.ctx.measureText(this.glob.lang.iq).width / 2) + 5;
		const left_line_to = this.text_iq_offset[0] - distance;
		const right_line_from = this.text_iq_offset[0] + distance;

		for (let playernum = 0; playernum < this.panel_offsets.length; playernum++) {
			const panel_offset = this.panel_offsets[playernum];
			this.glob.ctx.drawImage(this.bg,
				this.panel_soffset[0], this.panel_soffset[1],
				this.panel_dim[0], this.panel_dim[1],
				panel_offset[0], panel_offset[1],
				this.panel_dim[0], this.panel_dim[1]);


			let soffset = this.iq_soffsets[this.world.players[playernum].iq];
			this.glob.ctx.drawImage(this.bg,
				soffset[0], soffset[1],
				this.iq_dim[0], this.iq_dim[1],
				panel_offset[0] + this.iq_offset[0],
				panel_offset[1] + this.iq_offset[1] - this.iq_dy * (this.world.players[playernum].iq - 1),
				this.iq_dim[0], this.iq_dim[1]);

			soffset = this.type_soffsets[this.world.players[playernum].type];
			this.glob.ctx.drawImage(this.bg,
				soffset[0], soffset[1],
				this.type_dim[0], this.type_dim[1],
				panel_offset[0] + this.type_offset[0], panel_offset[1] + this.type_offset[1],
				this.type_dim[0], this.type_dim[1]);

			soffset = this.spec_soffsets[playernum];
			this.glob.ctx.drawImage(this.spec_pics,
				soffset[0], soffset[1],
				this.type_dim[0], this.type_dim[1],
				panel_offset[0] + this.spec_offset[0], panel_offset[1] + this.spec_offset[1],
				this.type_dim[0], this.type_dim[1]);

			write_text(this.glob.ctx, this.glob.lang.player.replace('{num}', (playernum + 1)), [Math.floor(this.panel_dim[0] / 2) + panel_offset[0], panel_offset[1] + 15], 'black', 'white');

			write_text(this.glob.ctx, this.glob.lang.species[playernum], [panel_offset[0] + 77, panel_offset[1] + 121], 'black', 'white');

			write_text(this.glob.ctx, this.glob.lang.iq, [panel_offset[0] + this.text_iq_offset[0], panel_offset[1] + this.text_iq_offset[1]], '#000000', undefined, 'center');
			for (let iq = 0; iq < 4; iq++) {
				write_text(this.glob.ctx, this.glob.lang.iqs[iq], [panel_offset[0] + this.text_iqs_offset[0], panel_offset[1] + this.text_iqs_offset[1] + this.iq_dy * iq], '#000000', undefined, 'left');
			}

			// Draw Line around IQ title   (------ IQ ------)
			this.glob.ctx.save();
			this.glob.ctx.translate(0.5, 0.5);
			this.glob.ctx.lineWidth = 1;
			this.glob.ctx.beginPath();
			this.glob.ctx.moveTo(panel_offset[0] + this.line_from_to[0], panel_offset[1] + this.line_y);
			this.glob.ctx.lineTo(panel_offset[0] + left_line_to, panel_offset[1] + this.line_y);
			this.glob.ctx.moveTo(panel_offset[0] + right_line_from, panel_offset[1] + this.line_y);
			this.glob.ctx.lineTo(panel_offset[0] + this.line_from_to[1], panel_offset[1] + this.line_y);
			this.glob.ctx.strokeStyle = '#000000';
			this.glob.ctx.stroke();
			this.glob.ctx.restore();

			// Click areas for Type change (human, computer, inactive)
			this.clickareas.push({
				x1: panel_offset[0] + this.type_offset[0],
				y1: panel_offset[1] + this.type_offset[1],
				x2: panel_offset[0] + this.type_offset[0] + this.type_dim[0],
				y2: panel_offset[1] + this.type_offset[1] + this.type_dim[1],
				down: () => { },
				up: () => this.change_type(playernum, 0),
				blur: () => { }
			});

			// RichtClick areas for Type change (human, computer, inactive)
			this.rightclickareas.push({
				x1: panel_offset[0] + this.type_offset[0],
				y1: panel_offset[1] + this.type_offset[1],
				x2: panel_offset[0] + this.type_offset[0] + this.type_dim[0],
				y2: panel_offset[1] + this.type_offset[1] + this.type_dim[1],
				down: () => { },
				up: () => this.change_type(playernum, 1),
				blur: () => { }
			});

			// Click areas for IQ change
			for (let iq = 0; iq < 4; iq++) {
				this.clickareas.push({
					x1: panel_offset[0] + this.iq_offset[0],
					y1: panel_offset[1] + this.iq_offset[1] - this.iq_dy * iq,
					x2: panel_offset[0] + this.iq_offset[0] + this.iq_text_dim[0],
					y2: panel_offset[1] + this.iq_offset[1] - this.iq_dy * iq + this.iq_text_dim[1],
					down: () => { },
					up: () => this.change_iq(playernum, iq + 1),
					blur: () => { }
				});
			}
		}

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.next(), 'reset': true },
		];
	}

	render() {
	}

	update() {
	}

	change_type(player_num: number, value: number) {
		this.world.players[player_num].type = (this.world.players[player_num].type + value) % 3 + 1;
		const soffset = this.type_soffsets[this.world.players[player_num].type];
		const panel_offset = this.panel_offsets[player_num];
		this.glob.ctx.drawImage(this.bg,
			soffset[0], soffset[1],
			this.type_dim[0], this.type_dim[1],
			panel_offset[0] + this.type_offset[0], panel_offset[1] + this.type_offset[1],
			this.type_dim[0], this.type_dim[1]);
	}

	change_iq(player_num: number, iq: number) {
		this.world.players[player_num].iq = iq;
		const panel_offset = this.panel_offsets[player_num];

		for (let i = 1; i <= 4; i++) {
			const soffset = (i === iq) ? this.iq_soffsets[iq] : this.iq_soffsets[0];
			this.glob.ctx.drawImage(this.bg,
				soffset[0], soffset[1],
				this.iq_dim[0], this.iq_dim[1],
				panel_offset[0] + this.iq_offset[0], panel_offset[1] + this.iq_offset[1] - (i - 1) * this.iq_dy,
				this.iq_dim[0], this.iq_dim[1]);
		}
	}

	next() {
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim);
		let no_human = true;
		let known_first_player = false;

		for (let i = 0; i < this.world.players.length; i++) {
			if (!known_first_player && this.world.players[i].type !== PLAYER_TYPE.NOBODY) {
				known_first_player = true;
				this.world.current_player = this.world.players[i];
			}

			if (this.world.players[i].type === PLAYER_TYPE.HUMAN) {
				no_human = false;
				break;
			}
		}

		if (no_human) {
			open_popup(this.game, 'dino', this.glob.lang.who_plays, () => { }, this.glob.lang.next);
			return;
		}

		this.game.next_stage();
	}

	load_game() {
		draw_rect(this.glob.ctx, this.load_offset, this.load_dim);
		open_load_dialog(this.game);
	}
}
