import type { Game } from './game';
import {
	DIR,
	PLAYER_TYPE,
	SCENE,
	WORLD_MAP,
	draw_base,
	draw_rect,
	draw_upper_left_border,
	multiline,
	open_popup,
	random_element,
	random_int,
	write_text,
} from './helper';
import { ClickArea, Dimension, KeyType, Point, SixNumbers, Stage, TechGlobal, Tuple, TutorialType, WorldGlobal } from './types';

// MAYBE: Slowly fill up bar when mouse button is kept pressed

export class Mutations implements Stage {
	id = SCENE.MUTATION;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];

	private bg_pic: HTMLImageElement;
	private pics: HTMLImageElement;
	private spec_pics: HTMLImageElement;

	private stats: Tuple<number, 13> = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
	private plant_counts: SixNumbers = [0, 0, 0, 0, 0, 0];

	readonly symbol_dim: Dimension = [24, 24];
	readonly plusminus_dim: Dimension = [16, 16];
	readonly bar_dim: Dimension = [300, 16];
	readonly spec_dim: Dimension = [64, 64];
	readonly next_dim: Dimension = [181, 22];
	readonly percent_del_dim: Dimension = [60, 16];
	readonly evo_pts_numdel_dim: Dimension = [60, 16];
	readonly pie_dim: Dimension = [16, 16];

	readonly text_offset: Point = [20, 123];
	readonly percent_offset: Point = [571, 123];
	readonly percent_del_offset: Point = [569, 111];
	readonly evo_pts_text_offset: Point = [107, 70];
	readonly evo_pts_num_offset: Point = [571, 70];
	readonly evo_pts_numdel_offset: Point = [569, 58];
	readonly symbol_offset: Point = [201, 106];
	readonly evobar_offset: Point = [248, 59];
	readonly bar_offset: Point = [248, 111];
	readonly minus_offset: Point = [233, 111];
	readonly plus_offset: Point = [547, 111];
	readonly spec_offset: Point = [23, 23];
	readonly next_offset: Point = [459, 458];
	readonly pie_offset: Point = [615, 111];
	readonly help_text_offset: Point = [80, 10];
	readonly inner_help_text_offset: Point = [10, 10];

	readonly symbol_soffset: Point = [0, 96];
	readonly plus_soffset: Point = [312, 96];
	readonly plusdown_soffset: Point = [328, 96];
	readonly minus_soffset: Point = [344, 96];
	readonly minusdown_soffset: Point = [360, 96];
	readonly evobar_soffset: Point = [0, 0];
	readonly emptybar_soffset: Point = [300, 80];
	readonly pie_soffset: Point = [376, 96];

	readonly deltay = 26;
	readonly last_bit_width = 3;
	readonly line_height = 18;
	readonly max_text_width = 400;

	readonly spec_soffsets: Point[] = [
		[0, 0],
		[64, 0],
		[128, 0],
		[192, 0],
		[256, 0],
		[320, 0],
	];
	readonly bar_soffsets: Point[] = [
		[300, 64],
		[0, 64],
		[300, 48],
		[0, 48],
		[300, 32],
		[0, 32],
		[300, 16],
		[300, 16],
		[0, 16],
		[300, 0],
	];

	constructor(
		private game: Game,
		private glob: TechGlobal,
		private world: WorldGlobal,
	) {
		this.bg_pic = glob.resources.get_image('gfx/dark_bg.png');
		this.pics = glob.resources.get_image('gfx/mutations.png');
		this.spec_pics = glob.resources.get_image('gfx/species.png');

		this.tutorials = [
			{
				name: 'mutation_start',
				pos: [5, 100],
				arrows: [{ dir: DIR.N, offset: 310 }],
				highlight: [0, 20, 640, 96],
			},
			{
				name: 'mutation_plant',
				pos: [140, 150],
				arrows: [{ dir: DIR.N, offset: 250 }],
				highlight: [0, 0, 640, 480],
			},
		];
	}

	initialize() {
		this.next_player();

		// Make sure tutorial points to the best plant
		if (!this.game.seen_tutorials.has('mutation_plant')) {
			let best = 0;
			let best_idx = 0;
			for (let i = 0; i < this.plant_counts.length; i++) {
				if (this.plant_counts[i] > best) {
					best = this.plant_counts[i];
					best_idx = i;
				}
			}

			this.tutorials[1].pos = [170, this.bar_offset[1] + this.deltay * best_idx + 33];
			this.tutorials[1].highlight = [
				0,
				this.symbol_offset[1] + this.deltay * best_idx,
				640,
				this.symbol_offset[1] + this.deltay * (best_idx + 1),
			];
		}
		this.game.tutorial();
	}

	next_player() {
		this.stats = [...this.world.current_player.stats];

		if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
			this.ai();
			this.next_popup(1);
		} else {
			this.glob.resources.play_music(`spec${this.world.current_player.id}`);
			this.plant_counts = this.count_plants();
			const total_count = this.plant_counts.reduce((a, b) => a + b);
			for (let i = 0; i < this.plant_counts.length; i++) {
				this.plant_counts[i] = Math.round((this.plant_counts[i] / total_count) * 12);
			}
			this.redraw();
		}
	}

	redraw() {
		draw_base(this.glob, this.id);

		draw_rect(this.glob.ctx, [0, 20], [640, 76]); // Upper rectangle
		draw_rect(this.glob.ctx, [0, 95], [640, 385]); // Lower rectangle
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim); // Continue
		draw_upper_left_border(this.glob.ctx, this.next_offset, this.next_dim);
		write_text(this.glob.ctx, this.glob.lang.next, [549, 473], 'white', 'black');

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.next_offset[0],
			y1: this.next_offset[1],
			x2: this.next_offset[0] + this.next_dim[0],
			y2: this.next_offset[1] + this.next_dim[1],
			down: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.glob.ctx, this.next_offset, this.next_dim),
		});

		for (let i = 0; i < 13; i++) {
			write_text(
				this.glob.ctx,
				this.glob.lang.traits[i],
				[this.text_offset[0], this.text_offset[1] + this.deltay * i],
				'white',
				'black',
				'left',
			);

			// Symbol
			this.glob.ctx.drawImage(
				this.pics,
				this.symbol_soffset[0] + this.symbol_dim[0] * i,
				this.symbol_soffset[1],
				this.symbol_dim[0],
				this.symbol_dim[1],
				this.symbol_offset[0],
				this.symbol_offset[1] + this.deltay * i,
				this.symbol_dim[0],
				this.symbol_dim[1],
			);

			// Minus and Plus
			this.draw_minus(i);
			this.draw_plus(i);

			this.clickareas.push({
				x1: this.minus_offset[0],
				y1: this.minus_offset[1] + this.deltay * i,
				x2: this.minus_offset[0] + this.plusminus_dim[0],
				y2: this.minus_offset[1] + this.plusminus_dim[1] + this.deltay * i,
				down: () => this.draw_minusdown(i),
				up: () => this.add(i, -1),
				blur: () => this.draw_minus(i),
			});

			this.clickareas.push({
				x1: this.bar_offset[0],
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.bar_offset[0] + this.bar_dim[0] * 0.49,
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => {},
				up: () => this.add(i, -10),
				blur: () => {},
			});

			this.clickareas.push({
				x1: this.plus_offset[0],
				y1: this.plus_offset[1] + this.deltay * i,
				x2: this.plus_offset[0] + this.plusminus_dim[0],
				y2: this.plus_offset[1] + this.plusminus_dim[1] + this.deltay * i,
				down: () => this.draw_plusdown(i),
				up: () => this.add(i, 1),
				blur: () => this.draw_plus(i),
			});

			this.clickareas.push({
				x1: this.bar_offset[0] + this.bar_dim[0] * 0.51,
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.bar_offset[0] + this.bar_dim[0],
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => {},
				up: () => this.add(i, 10),
				blur: () => {},
			});

			this.rightclickareas.push({
				x1: this.text_offset[0],
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.pie_offset[0],
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => this.show_info(i),
				up: () => this.redraw(),
				blur: () => this.redraw(),
			});
		}
		write_text(this.glob.ctx, this.glob.lang.evo_score, this.evo_pts_text_offset, 'white', 'black', 'left');

		this.draw_avatar();
		this.draw_evo_score();
		for (let i = 0; i < 13; i++) {
			this.draw_bar(i);
		}

		this.keys = [{ key: 'ENTER', action: () => this.next(), reset: true }];
	}

	private draw_plus(pos: number) {
		this.glob.ctx.drawImage(
			this.pics,
			this.plus_soffset[0],
			this.plus_soffset[1],
			this.plusminus_dim[0],
			this.plusminus_dim[1],
			this.plus_offset[0],
			this.plus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0],
			this.plusminus_dim[1],
		);
	}

	private draw_plusdown(pos: number) {
		this.glob.ctx.drawImage(
			this.pics,
			this.plusdown_soffset[0],
			this.plusdown_soffset[1],
			this.plusminus_dim[0],
			this.plusminus_dim[1],
			this.plus_offset[0],
			this.plus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0],
			this.plusminus_dim[1],
		);
	}

	private draw_minus(pos: number) {
		this.glob.ctx.drawImage(
			this.pics,
			this.minus_soffset[0],
			this.minus_soffset[1],
			this.plusminus_dim[0],
			this.plusminus_dim[1],
			this.minus_offset[0],
			this.minus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0],
			this.plusminus_dim[1],
		);
	}

	private draw_minusdown(pos: number) {
		this.glob.ctx.drawImage(
			this.pics,
			this.minusdown_soffset[0],
			this.minusdown_soffset[1],
			this.plusminus_dim[0],
			this.plusminus_dim[1],
			this.minus_offset[0],
			this.minus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0],
			this.plusminus_dim[1],
		);
	}

	private draw_avatar() {
		const soffset = this.spec_soffsets[this.world.current_player.id];

		this.glob.ctx.drawImage(
			this.bg_pic,
			this.spec_offset[0],
			this.spec_offset[1],
			this.spec_dim[0],
			this.spec_dim[1],
			this.spec_offset[0],
			this.spec_offset[1],
			this.spec_dim[0],
			this.spec_dim[1],
		);

		this.glob.ctx.drawImage(
			this.spec_pics,
			soffset[0],
			soffset[1],
			this.spec_dim[0],
			this.spec_dim[1],
			this.spec_offset[0],
			this.spec_offset[1],
			this.spec_dim[0],
			this.spec_dim[1],
		);
	}

	private draw_bar(num: number) {
		// Percentage
		this.glob.ctx.drawImage(
			this.bg_pic,
			this.percent_del_offset[0],
			this.percent_del_offset[1] + this.deltay * num,
			this.percent_del_dim[0],
			this.percent_del_dim[1],
			this.percent_del_offset[0],
			this.percent_del_offset[1] + this.deltay * num,
			this.percent_del_dim[0],
			this.percent_del_dim[1],
		);

		write_text(
			this.glob.ctx,
			`${this.stats[num]}%`,
			[this.percent_offset[0], this.percent_offset[1] + this.deltay * num],
			'white',
			'black',
			'left',
		);

		// Bar
		this.glob.ctx.drawImage(
			this.pics,
			this.emptybar_soffset[0],
			this.emptybar_soffset[1],
			this.bar_dim[0],
			this.bar_dim[1],
			this.bar_offset[0],
			this.bar_offset[1] + this.deltay * num,
			this.bar_dim[0],
			this.bar_dim[1],
		);

		const length = this.stats[num] * 3 - this.last_bit_width;

		if (length > 0) {
			const soffset = this.bar_soffsets[Math.min(9, Math.floor(this.stats[num] / 10))];

			// Main bar
			this.glob.ctx.drawImage(
				this.pics,
				soffset[0],
				soffset[1],
				length,
				this.bar_dim[1],
				this.bar_offset[0],
				this.bar_offset[1] + this.deltay * num,
				length,
				this.bar_dim[1],
			);
			// Last bit
			this.glob.ctx.drawImage(
				this.pics,
				soffset[0] + this.bar_dim[0] - this.last_bit_width,
				soffset[1],
				this.last_bit_width,
				this.bar_dim[1],
				this.bar_offset[0] + length,
				this.bar_offset[1] + this.deltay * num,
				this.last_bit_width,
				this.bar_dim[1],
			);
		}

		// Pie chart
		if (this.glob.options.plant_distribtion && num <= 5) {
			this.glob.ctx.drawImage(
				this.pics,
				this.pie_soffset[0] + this.pie_dim[0] * this.plant_counts[num],
				this.pie_soffset[1],
				this.pie_dim[0],
				this.pie_dim[1],
				this.pie_offset[0],
				this.pie_offset[1] + this.deltay * num,
				this.pie_dim[0],
				this.pie_dim[1],
			);
		}
	}

	private draw_evo_score() {
		// Number
		this.glob.ctx.drawImage(
			this.bg_pic,
			this.evo_pts_numdel_offset[0],
			this.evo_pts_numdel_offset[1],
			this.evo_pts_numdel_dim[0],
			this.evo_pts_numdel_dim[1],
			this.evo_pts_numdel_offset[0],
			this.evo_pts_numdel_offset[1],
			this.evo_pts_numdel_dim[0],
			this.evo_pts_numdel_dim[1],
		);

		write_text(this.glob.ctx, this.world.current_player.evo_score.toString(), this.evo_pts_num_offset, 'white', 'black', 'left');

		// Bar
		this.glob.ctx.drawImage(
			this.pics,
			this.emptybar_soffset[0],
			this.emptybar_soffset[1],
			this.bar_dim[0],
			this.bar_dim[1],
			this.evobar_offset[0],
			this.evobar_offset[1],
			this.bar_dim[0],
			this.bar_dim[1],
		);

		const length = this.world.current_player.evo_score * 3 - this.last_bit_width;
		// Main bar
		if (length) {
			this.glob.ctx.drawImage(
				this.pics,
				this.evobar_soffset[0],
				this.evobar_soffset[1],
				length,
				this.bar_dim[1],
				this.evobar_offset[0],
				this.evobar_offset[1],
				length,
				this.bar_dim[1],
			);
		}
		// Last bit
		if (length >= 0) {
			this.glob.ctx.drawImage(
				this.pics,
				this.evobar_soffset[0] + this.bar_dim[0] - this.last_bit_width,
				this.evobar_soffset[1],
				this.last_bit_width,
				this.bar_dim[1],
				this.evobar_offset[0] + length,
				this.evobar_offset[1],
				this.last_bit_width,
				this.bar_dim[1],
			);
		}
	}

	render() {}

	update() {}

	private add(attribute: number, value: number) {
		if (value === 1) {
			this.draw_plus(attribute);
		} else if (value === -1) {
			this.draw_minus(attribute);
		}

		if (value < 0) {
			if (this.world.current_player.stats[attribute] > this.stats[attribute] + value) {
				value = this.world.current_player.stats[attribute] - this.stats[attribute];
			}

			if (value !== 0) {
				this.world.current_player.evo_score -= value;
				this.stats[attribute] += value;
			}
		} else if (this.world.current_player.evo_score) {
			if (value > this.world.current_player.evo_score) {
				value = this.world.current_player.evo_score;
			}

			if (this.stats[attribute] + value > 100) {
				value = 100 - this.stats[attribute];
			}

			this.world.current_player.evo_score -= value;
			this.stats[attribute] += value;
		}

		this.draw_bar(attribute);
		this.draw_evo_score();
	}

	private ai() {
		const choosable_plants = [];
		const choosable_nonplants = [];
		for (let i = 0; i < 6; i++) {
			if (this.world.current_player.stats[i] < 100) {
				choosable_plants.push(i);
			}
		}
		for (let i = 6; i < 13; i++) {
			if (this.world.current_player.stats[i] < 100) {
				choosable_nonplants.push(i);
			}
		}

		const own_plants: number[] = [];
		for (let x = 1; x < this.world.map_positions[0].length - 1; x++) {
			for (let y = 1; y < this.world.map_positions.length - 1; y++) {
				if (this.world.map_positions[y][x] === this.world.current_player.id && choosable_plants.includes(this.world.world_map[y][x] - 1)) {
					own_plants.push(this.world.world_map[y][x] - 1);
				}
			}
		}

		for (let i = 0; i < this.world.current_player.evo_score; i++) {
			if (choosable_plants.length === 0 && choosable_nonplants.length === 0) {
				return; // All values are at 100 already
			}
			let choose_plants = false;
			if (choosable_plants.length > 0) {
				choose_plants = random_int(1, 10) <= 6; // 60% chance to choose a plant adaptation
			}

			if (choose_plants && own_plants.length) {
				// Increase the adaption to a random plant on which the player is standing
				this.world.current_player.stats[random_element(own_plants)]++;
			} else if (choosable_nonplants.length === 0) {
				// If only plants are left, increase one of them
				this.world.current_player.stats[random_element(choosable_plants)]++;
			} else {
				// Increase a random non-plant property
				this.world.current_player.stats[random_element(choosable_nonplants)]++;
			}
		}

		this.world.current_player.evo_score = 0;
		this.stats = this.world.current_player.stats;
	}

	private show_info(trait: number) {
		const text = multiline(this.glob.ctx, this.glob.lang.trait_hints[trait], this.max_text_width);

		const width = this.inner_help_text_offset[0] * 2 + this.max_text_width;
		const height = this.inner_help_text_offset[1] + this.line_height * text.length;

		let y;
		if (trait < 9) {
			y = this.symbol_offset[1] + this.deltay * (trait + 1) + this.help_text_offset[1];
		} else {
			y = this.symbol_offset[1] + this.deltay * trait - this.help_text_offset[1] - height;
		}

		this.glob.ctx.drawImage(this.bg_pic, this.help_text_offset[0], y, width, height);

		draw_rect(this.glob.ctx, [this.help_text_offset[0], y], [width, height], true);

		for (let i = 0; i < text.length; i++) {
			write_text(
				this.glob.ctx,
				text[i],
				[this.help_text_offset[0] + this.inner_help_text_offset[0], y + this.line_height * (i + 1)],
				'white',
				'black',
				'left',
			);
		}
	}

	next() {
		draw_rect(this.glob.ctx, this.next_offset, this.next_dim);

		if (this.world.current_player.evo_score > 0) {
			open_popup(
				this.game,
				'chuck_berry',
				this.glob.lang.turn_finished,
				(x: number) => this.next_popup(x),
				this.glob.lang.no,
				this.glob.lang.yes,
			);
		} else {
			this.next_popup(1);
		}
	}

	next_popup(answer: number) {
		if (answer === 1) {
			this.world.current_player.stats = this.stats;
			this.game.next_stage();
		}
	}

	private count_plants(): SixNumbers {
		const counts: SixNumbers = [0, 0, 0, 0, 0, 0];

		// TODO: I should make sure that those are never null.
		if (this.world.map_positions === null || this.world.world_map === null) {
			return counts;
		}

		const wm_width = this.world.map_positions[0].length;
		const wm_height = this.world.map_positions.length;

		// MAYBE: I could store an array of positions for each player to make this more efficient.
		for (let x = 1; x < wm_width - 1; x++) {
			for (let y = 1; y < wm_height - 1; y++) {
				if (this.world.map_positions[y][x] === this.world.current_player.id) {
					counts[this.world.world_map[y][x] - WORLD_MAP.RANGONES]++;
				}
			}
		}

		return counts;
	}
}
