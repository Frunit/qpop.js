import { Game } from './game';
import { PLAYER_TYPE, SCENE, draw_base, draw_rect, open_load_dialog, random_int, write_text } from './helper';
import { Sprite } from './sprite';
import { anim_delays } from './sprite_positions';
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal, TutorialType, WorldGlobal } from './types';

export class Turnselection implements Stage {
	id = SCENE.TURN_SELECTION;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];

	private bg: HTMLImageElement;
	private pics: HTMLImageElement;
	private animations: Sprite[] = [];
	private turn_index = 0;

	readonly turns = [5, 10, 20, 255];
	readonly bar_soffset: Point = [86, 630];

	readonly panel_dim: Dimension = [620, 211];
	readonly anim_dim: Dimension = [420, 90];
	readonly anim_part_dim: Dimension = [60, 90];
	readonly button_dim: Dimension = [43, 43];
	readonly bar_dim: Dimension = [357, 43];
	readonly load_dim: Dimension = [230, 22];
	readonly next_dim: Dimension = [181, 22];

	readonly anim_offset: Point = [98, 87];
	readonly bar_offset: Point = [138, 328];
	readonly load_offset: Point = [0, 458];
	readonly next_offset: Point = [459, 458];
	readonly bar_text_offset: Point = [316, 354];

	readonly anim_left_cb_offset: Point = [98, 87];
	readonly anim_right_cb_offset: Point = [458, 87];
	readonly anim_amorph_offset: Point = [278, 87];

	readonly panel_offsets: Point[] = [
		[9, 27],
		[9, 241],
	];
	readonly button_offsets: Point[] = [
		[95, 328],
		[495, 328],
	];
	readonly anim_soffsets: Point[] = [
		[0, 0],
		[0, 90],
		[0, 180],
	];
	readonly button_soffsets: Point[] = [
		[0, 630],
		[43, 630],
	];

	constructor(
		private game: Game,
		private glob: TechGlobal,
		private world: WorldGlobal,
	) {
		this.bg = this.glob.resources.get_image('gfx/light_bg.png');
		this.pics = this.glob.resources.get_image('gfx/turns.png');

		this.tutorials = [
			{
				name: 'turns',
				pos: [140, 300],
				low_anchor: true,
				arrows: [],
				highlight: [95, 328, 538, 371],
			},
		];
	}

	initialize() {
		this.glob.resources.play_music('intro');
		this.redraw();
		this.game.tutorial();
	}

	draw_turn_changed() {
		this.glob.ctx.drawImage(
			this.bg,
			this.anim_offset[0] - this.panel_offsets[0][0],
			this.anim_offset[1] - this.panel_offsets[0][1],
			this.anim_dim[0],
			this.anim_dim[1],
			this.anim_offset[0],
			this.anim_offset[1],
			this.anim_dim[0],
			this.anim_dim[1],
		);

		this.glob.ctx.drawImage(
			this.pics,
			this.bar_soffset[0],
			this.bar_soffset[1],
			this.bar_dim[0],
			this.bar_dim[1],
			this.bar_offset[0],
			this.bar_offset[1],
			this.bar_dim[0],
			this.bar_dim[1],
		);

		write_text(this.glob.ctx, this.glob.lang.turns[this.turn_index], this.bar_text_offset, 'black', '');

		if (this.turn_index === 3) {
			if (this.animations.length === 0) {
				if (random_int(0, 1)) {
					// Amorph splatters
					this.animations = [
						new Sprite(
							this.pics,
							[420, 450],
							[
								[0, 0],
								[0, 90],
							],
							anim_delays.turn_selection,
							this.anim_dim,
							true,
							() => this.end_animation(true),
						),
					];
				} else {
					// Chuckberry stumbles
					this.animations = [
						new Sprite(
							this.pics,
							[0, 270],
							[
								[0, 0],
								[0, 90],
								[0, 180],
								[0, 270],
							],
							anim_delays.turn_selection,
							this.anim_dim,
							true,
							() => this.end_animation(false),
						),
					];
				}
			}

			this.render();
		} else {
			this.animations = [];

			this.glob.ctx.drawImage(
				this.pics,
				this.anim_soffsets[this.turn_index][0],
				this.anim_soffsets[this.turn_index][1],
				this.anim_dim[0],
				this.anim_dim[1],
				this.anim_offset[0],
				this.anim_offset[1],
				this.anim_dim[0],
				this.anim_dim[1],
			);
		}
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
			blur: () => draw_rect(this.glob.ctx, this.load_offset, this.load_dim),
		});

		this.clickareas.push({
			x1: this.next_offset[0],
			y1: this.next_offset[1],
			x2: this.next_offset[0] + this.next_dim[0],
			y2: this.next_offset[1] + this.next_dim[1],
			down: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim),
		});

		for (let i = 0; i < 2; i++) {
			// Background panels
			draw_rect(this.glob.ctx, this.panel_offsets[i], this.panel_dim, true, false, true);
			this.glob.ctx.drawImage(this.bg, this.panel_offsets[i][0] + 3, this.panel_offsets[i][1] + 3);
		}

		for (let i = 0; i < 2; i++) {
			// Buttons
			this.glob.ctx.drawImage(
				this.pics,
				this.button_soffsets[i][0],
				this.button_soffsets[i][1],
				this.button_dim[0],
				this.button_dim[1],
				this.button_offsets[i][0],
				this.button_offsets[i][1],
				this.button_dim[0],
				this.button_dim[1],
			);

			this.clickareas.push({
				x1: this.button_offsets[i][0],
				y1: this.button_offsets[i][1],
				x2: this.button_offsets[i][0] + this.button_dim[0],
				y2: this.button_offsets[i][1] + this.button_dim[1],
				down: () => draw_rect(this.glob.ctx, this.button_offsets[i], this.button_dim, true, true),
				up: () => this.change_turn(i >= 1),
				blur: () => draw_rect(this.glob.ctx, this.button_offsets[i], this.button_dim),
			});
		}

		this.draw_turn_changed();

		this.keys = [
			{ key: 'ENTER', action: () => this.next(), reset: true },
			{ key: 'RIGHT', action: () => this.change_turn(true), reset: true },
			{ key: 'UP', action: () => this.change_turn(true), reset: true },
			{ key: 'LEFT', action: () => this.change_turn(false), reset: true },
			{ key: 'DOWN', action: () => this.change_turn(false), reset: true },
		];
	}

	render() {
		if (this.animations.length > 0) {
			this.glob.ctx.drawImage(
				this.bg,
				this.anim_offset[0] - this.panel_offsets[0][0],
				this.anim_offset[1] - this.panel_offsets[0][1],
				this.anim_dim[0],
				this.anim_dim[1],
				this.anim_offset[0],
				this.anim_offset[1],
				this.anim_dim[0],
				this.anim_dim[1],
			);

			if (this.animations.length === 1) {
				this.animations[0].render(this.glob.ctx, this.anim_offset);
			} else {
				this.glob.ctx.drawImage(
					this.pics,
					420,
					540,
					this.anim_dim[0],
					this.anim_dim[1],
					this.anim_offset[0],
					this.anim_offset[1],
					this.anim_dim[0],
					this.anim_dim[1],
				);

				// Three animations when Amorph is ripped apart
				this.animations[0].render(this.glob.ctx, this.anim_left_cb_offset);
				this.animations[1].render(this.glob.ctx, this.anim_right_cb_offset);
				this.animations[2].render(this.glob.ctx, this.anim_amorph_offset);
			}
		}
	}

	update() {
		if (this.animations.length === 1) {
			this.animations[0].update();
			if (this.animations[0].finished && this.animations[0].callback) {
				this.animations[0].callback();
			}
		} else if (this.animations.length > 1) {
			for (const anim of this.animations) {
				anim.update();
				if (anim.finished && anim.callback) {
					anim.callback();
				}
			}
		}
	}

	end_animation(not_stumbling: boolean) {
		if (not_stumbling) {
			// Amorph splatters
			this.animations = [
				// left Chuckberry
				new Sprite(
					this.pics,
					[420, 270],
					[
						[120, 0],
						[180, 0],
						[0, 0],
						[60, 0],
					],
					anim_delays.turn_selection,
					this.anim_part_dim,
				),

				// right Chuckberry
				new Sprite(
					this.pics,
					[420, 360],
					[
						[120, 0],
						[180, 0],
						[0, 0],
						[60, 0],
					],
					anim_delays.turn_selection,
					this.anim_part_dim,
				),

				// Amorph
				new Sprite(
					this.pics,
					[660, 270],
					[
						[0, 0],
						[60, 0],
						[120, 0],
					],
					anim_delays.turn_selection * 4,
					this.anim_part_dim,
					true,
					() => this.amorph_eye(),
				),
			];
		} else {
			// Chuckberry stumbles
			this.animations = [
				new Sprite(
					this.pics,
					[420, 0],
					[
						[0, 90],
						[0, 180],
						[0, 0],
					],
					anim_delays.turn_selection,
					this.anim_dim,
				),
			];
		}
	}

	amorph_eye() {
		this.animations[2] = new Sprite(
			this.pics,
			[660, 270],
			[
				[120, 0],
				[0, 90],
			],
			anim_delays.turn_selection * 4,
			this.anim_part_dim,
		);
	}

	change_turn(up: boolean) {
		draw_rect(this.glob.ctx, this.button_offsets[up ? 1 : 0], this.button_dim);
		if (up && this.turn_index < 3) {
			this.turn_index++;
		} else if (!up && this.turn_index > 0) {
			this.turn_index--;
		}

		this.world.max_turns = this.turns[this.turn_index];

		this.draw_turn_changed();
	}

	next() {
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim);

		let players_active = 0;
		for (let i = 0; i < 6; i++) {
			if (this.world.players[i].type !== PLAYER_TYPE.NOBODY) {
				players_active++;
			}
		}

		if (players_active === 1) {
			this.world.infinite_game = true;
		}

		this.game.select_evo_points();
		this.game.next_stage();
	}

	load_game() {
		draw_rect(this.glob.ctx, this.load_offset, this.load_dim);
		open_load_dialog(this.game);
	}
}
