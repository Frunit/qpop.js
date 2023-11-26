// MAYBE: Slowly fill up bar when mouse button is kept pressed


export class Mutations {
	constructor() {
		this.id = SCENE.MUTATION;
		this.bg_pic = resources.get('gfx/dark_bg.png');
		this.pics = resources.get('gfx/mutations.png');
		this.spec_pics = resources.get('gfx/species.png');

		// CONST_START
		this.symbol_dim = [24, 24];
		this.plusminus_dim = [16, 16];
		this.bar_dim = [300, 16];
		this.spec_dim = [64, 64];
		this.next_dim = [181, 22];
		this.percent_del_dim = [60, 16];
		this.evo_pts_numdel_dim = [60, 16];
		this.pie_dim = [16, 16];

		this.text_offset = [20, 123];
		this.percent_offset = [571, 123];
		this.percent_del_offset = [569, 111];
		this.evo_pts_text_offset = [107, 70];
		this.evo_pts_num_offset = [571, 70];
		this.evo_pts_numdel_offset = [569, 58];
		this.symbol_offset = [201, 106];
		this.evobar_offset = [248, 59];
		this.bar_offset = [248, 111];
		this.minus_offset = [233, 111];
		this.plus_offset = [547, 111];
		this.spec_offset = [23, 23];
		this.next_offset = [459, 458];
		this.pie_offset = [615, 111];
		this.help_text_offset = [80, 10];
		this.inner_help_text_offset = [10, 10];

		this.symbol_soffset = [0, 96];
		this.plus_soffset = [312, 96];
		this.plusdown_soffset = [328, 96];
		this.minus_soffset = [344, 96];
		this.minusdown_soffset = [360, 96];
		this.evobar_soffset = [0, 0];
		this.emptybar_soffset = [300, 80];
		this.pie_soffset = [376, 96];

		this.deltay = 26;
		this.last_bit_width = 3;
		this.line_height = 18;
		this.max_text_width = 400;
		// CONST_END
		this.spec_soffsets = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];
		this.bar_soffsets = [[300, 64], [0, 64], [300, 48], [0, 48], [300, 32], [0, 32], [300, 16], [300, 16], [0, 16], [300, 0]];
		this.stats = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
		this.plant_counts = [0, 0, 0, 0, 0, 0];

		this.tutorials = [
			{
				'name': 'mutation_start',
				'pos': [5, 100],
				'arrows': [{ dir: DIR.N, offset: 310 }],
				'highlight': [0, 20, 640, 96],
			},
			{
				'name': 'mutation_plant',
				'pos': [140, 150],
				'arrows': [{ dir: DIR.N, offset: 250 }],
				'highlight': [0, 0, 640, 480],
			},
		];

		this.clickareas = [];
		this.rightclickareas = [];
		this.keys = [];
	}
	initialize() {
		this.next_player();

		// Make sure tutorial points to the best plant
		if (!game.seen_tutorials.has('mutation_plant')) {
			let best = 0;
			let best_idx = 0;
			for (let i = 0; i < this.plant_counts.length; i++) {
				if (this.plant_counts[i] > best) {
					best = this.plant_counts[i];
					best_idx = i;
				}
			}

			this.tutorials[1].pos = [170, this.bar_offset[1] + this.deltay * best_idx + 33];
			this.tutorials[1].highlight = [0, this.symbol_offset[1] + this.deltay * best_idx, 640, this.symbol_offset[1] + this.deltay * (best_idx + 1)];
		}
		game.tutorial();
	}
	next_player() {
		this.stats = game.current_player.stats.slice();

		if (game.current_player.type === PLAYER_TYPE.COMPUTER) {
			this.ai();
			this.next_popup(1);
		}
		else {
			audio.play_music('spec' + game.current_player.id);
			this.plant_counts = game.count_plants();
			const total_count = this.plant_counts.reduce((a, b) => a + b);
			for (let i = 0; i < this.plant_counts.length; i++) {
				this.plant_counts[i] = Math.round(this.plant_counts[i] / total_count * 12);
			}
			this.redraw();
		}
	}
	redraw() {
		draw_base();

		draw_rect([0, 20], [640, 76]); // Upper rectangle
		draw_rect([0, 95], [640, 385]); // Lower rectangle
		draw_rect(this.next_offset, this.next_dim); // Continue
		draw_upper_left_border(this.next_offset, this.next_dim);
		write_text(lang.next, [549, 473], 'white', 'black');

		this.clickareas = game.clickareas.slice();
		this.rightclickareas = game.rightclickareas.slice();

		this.clickareas.push({
			x1: this.next_offset[0],
			y1: this.next_offset[1],
			x2: this.next_offset[0] + this.next_dim[0],
			y2: this.next_offset[1] + this.next_dim[1],
			down: () => draw_rect(this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.next_offset, this.next_dim)
		});

		for (let i = 0; i < 13; i++) {
			write_text(lang.traits[i], [this.text_offset[0], this.text_offset[1] + this.deltay * i], 'white', 'black', 'left');

			// Symbol
			ctx.drawImage(this.pics,
				this.symbol_soffset[0] + this.symbol_dim[0] * i, this.symbol_soffset[1],
				this.symbol_dim[0], this.symbol_dim[1],
				this.symbol_offset[0], this.symbol_offset[1] + this.deltay * i,
				this.symbol_dim[0], this.symbol_dim[1]);

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
				blur: () => this.draw_minus(i)
			});

			this.clickareas.push({
				x1: this.bar_offset[0],
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.bar_offset[0] + this.bar_dim[0] * 0.49,
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => { },
				up: () => this.add(i, -10),
				blur: () => { }
			});

			this.clickareas.push({
				x1: this.plus_offset[0],
				y1: this.plus_offset[1] + this.deltay * i,
				x2: this.plus_offset[0] + this.plusminus_dim[0],
				y2: this.plus_offset[1] + this.plusminus_dim[1] + this.deltay * i,
				down: () => this.draw_plusdown(i),
				up: () => this.add(i, 1),
				blur: () => this.draw_plus(i)
			});

			this.clickareas.push({
				x1: this.bar_offset[0] + this.bar_dim[0] * 0.51,
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.bar_offset[0] + this.bar_dim[0],
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => { },
				up: () => this.add(i, 10),
				blur: () => { }
			});

			this.rightclickareas.push({
				x1: this.text_offset[0],
				y1: this.bar_offset[1] + this.deltay * i,
				x2: this.pie_offset[0],
				y2: this.bar_offset[1] + this.bar_dim[1] + this.deltay * i,
				down: () => this.show_info(i),
				up: () => this.redraw(),
				blur: () => this.redraw()
			});
		}
		write_text(lang.evo_score, this.evo_pts_text_offset, 'white', 'black', 'left');

		this.draw_avatar();
		this.draw_evo_score();
		for (let i = 0; i < 13; i++) {
			this.draw_bar(i);
		}

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.next(), 'reset': true },
		];
	}
	draw_plus(pos) {
		ctx.drawImage(this.pics,
			this.plus_soffset[0], this.plus_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			this.plus_offset[0], this.plus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}
	draw_plusdown(pos) {
		ctx.drawImage(this.pics,
			this.plusdown_soffset[0], this.plusdown_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			this.plus_offset[0], this.plus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}
	draw_minus(pos) {
		ctx.drawImage(this.pics,
			this.minus_soffset[0], this.minus_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			this.minus_offset[0], this.minus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}
	draw_minusdown(pos) {
		ctx.drawImage(this.pics,
			this.minusdown_soffset[0], this.minusdown_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			this.minus_offset[0], this.minus_offset[1] + this.deltay * pos,
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}
	draw_avatar() {
		const soffset = this.spec_soffsets[game.current_player.id];

		ctx.drawImage(this.bg_pic,
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1],
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1]);

		ctx.drawImage(this.spec_pics,
			soffset[0], soffset[1],
			this.spec_dim[0], this.spec_dim[1],
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1]);
	}
	draw_bar(num) {
		// Percentage
		ctx.drawImage(this.bg_pic,
			this.percent_del_offset[0], this.percent_del_offset[1] + this.deltay * num,
			this.percent_del_dim[0], this.percent_del_dim[1],
			this.percent_del_offset[0], this.percent_del_offset[1] + this.deltay * num,
			this.percent_del_dim[0], this.percent_del_dim[1]);

		write_text(this.stats[num] + '%', [this.percent_offset[0], this.percent_offset[1] + this.deltay * num], 'white', 'black', 'left');

		// Bar
		ctx.drawImage(this.pics,
			this.emptybar_soffset[0], this.emptybar_soffset[1],
			this.bar_dim[0], this.bar_dim[1],
			this.bar_offset[0], this.bar_offset[1] + this.deltay * num,
			this.bar_dim[0], this.bar_dim[1]);

		const length = this.stats[num] * 3 - this.last_bit_width;

		if (length > 0) {
			const soffset = this.bar_soffsets[Math.min(9, Math.floor(this.stats[num] / 10))];

			// Main bar
			ctx.drawImage(this.pics,
				soffset[0], soffset[1],
				length, this.bar_dim[1],
				this.bar_offset[0], this.bar_offset[1] + this.deltay * num,
				length, this.bar_dim[1]);
			// Last bit
			ctx.drawImage(this.pics,
				soffset[0] + this.bar_dim[0] - this.last_bit_width, soffset[1],
				this.last_bit_width, this.bar_dim[1],
				this.bar_offset[0] + length, this.bar_offset[1] + this.deltay * num,
				this.last_bit_width, this.bar_dim[1]);
		}

		// Pie chart
		if (options.plant_distribtion && num <= 5) {
			ctx.drawImage(this.pics,
				this.pie_soffset[0] + this.pie_dim[0] * this.plant_counts[num], this.pie_soffset[1],
				this.pie_dim[0], this.pie_dim[1],
				this.pie_offset[0], this.pie_offset[1] + this.deltay * num,
				this.pie_dim[0], this.pie_dim[1]);
		}
	}
	draw_evo_score() {
		// Number
		ctx.drawImage(this.bg_pic,
			this.evo_pts_numdel_offset[0], this.evo_pts_numdel_offset[1],
			this.evo_pts_numdel_dim[0], this.evo_pts_numdel_dim[1],
			this.evo_pts_numdel_offset[0], this.evo_pts_numdel_offset[1],
			this.evo_pts_numdel_dim[0], this.evo_pts_numdel_dim[1]);

		write_text(game.current_player.evo_score, this.evo_pts_num_offset, 'white', 'black', 'left');

		// Bar
		ctx.drawImage(this.pics,
			this.emptybar_soffset[0], this.emptybar_soffset[1],
			this.bar_dim[0], this.bar_dim[1],
			this.evobar_offset[0], this.evobar_offset[1],
			this.bar_dim[0], this.bar_dim[1]);

		const length = game.current_player.evo_score * 3 - this.last_bit_width;
		// Main bar
		if (length) {
			ctx.drawImage(this.pics,
				this.evobar_soffset[0], this.evobar_soffset[1],
				length, this.bar_dim[1],
				this.evobar_offset[0], this.evobar_offset[1],
				length, this.bar_dim[1]);
		}
		// Last bit
		if (length >= 0) {
			ctx.drawImage(this.pics,
				this.evobar_soffset[0] + this.bar_dim[0] - this.last_bit_width, this.evobar_soffset[1],
				this.last_bit_width, this.bar_dim[1],
				this.evobar_offset[0] + length, this.evobar_offset[1],
				this.last_bit_width, this.bar_dim[1]);
		}
	}
	render() {
	}
	update() {
	}
	add(attribute, value) {
		if (value === 1) {
			this.draw_plus(attribute);
		}
		else if (value === -1) {
			this.draw_minus(attribute);
		}

		if (value < 0) {
			if (game.current_player.stats[attribute] > this.stats[attribute] + value) {
				value = game.current_player.stats[attribute] - this.stats[attribute];
			}

			if (value !== 0) {
				game.current_player.evo_score -= value;
				this.stats[attribute] += value;
			}
		}
		else if (game.current_player.evo_score) {
			if (value > game.current_player.evo_score) {
				value = game.current_player.evo_score;
			}

			if (this.stats[attribute] + value > 100) {
				value = 100 - this.stats[attribute];
			}

			game.current_player.evo_score -= value;
			this.stats[attribute] += value;
		}

		this.draw_bar(attribute);
		this.draw_evo_score();
	}
	ai() {
		const choosable_plants = [];
		const choosable_nonplants = [];
		for (let i = 0; i < 6; i++) {
			if (game.current_player.stats[i] < 100) {
				choosable_plants.push(i);
			}
		}
		for (let i = 6; i < 13; i++) {
			if (game.current_player.stats[i] < 100) {
				choosable_nonplants.push(i);
			}
		}

		const own_plants = [];
		for (let x = 1; x < game.map_positions[0].length - 1; x++) {
			for (let y = 1; y < game.map_positions.length - 1; y++) {
				if (game.map_positions[y][x] === game.current_player.id &&
					choosable_plants.includes(game.world_map[y][x] - 1)) {
					own_plants.push(game.world_map[y][x] - 1);
				}
			}
		}

		for (let i = 0; i < game.current_player.evo_score; i++) {
			if (choosable_plants.length === 0 && choosable_nonplants.length === 0) {
				return; // All values are at 100 already
			}
			let choose_plants = false;
			if (choosable_plants.length > 0) {
				choose_plants = random_int(1, 10) <= 6; // 60% chance to choose a plant adaptation
			}

			if (choose_plants) {
				// Increase the adaption to a random plant on which the player is standing
				game.current_player.stats[random_element(own_plants)]++;
			}
			else if (choosable_nonplants.length === 0) {
				// If only plants are left, increase one of them
				game.current_player.stats[random_element(choosable_plants)]++;
			}
			else {
				// Increase a random non-plant property
				game.current_player.stats[random_element(choosable_nonplants)]++;
			}
		}

		game.current_player.evo_score = 0;
		this.stats = game.current_player.stats;
	}
	show_info(trait) {
		const text = multiline(lang.trait_hints[trait], this.max_text_width);

		const width = this.inner_help_text_offset[0] * 2 + this.max_text_width;
		const height = this.inner_help_text_offset[1] + this.line_height * text.length;

		let y;
		if (trait < 9) {
			y = this.symbol_offset[1] + this.deltay * (trait + 1) + this.help_text_offset[1];
		}
		else {
			y = this.symbol_offset[1] + this.deltay * trait - this.help_text_offset[1] - height;
		}

		ctx.drawImage(this.bg_pic, this.help_text_offset[0], y, width, height);

		draw_rect([this.help_text_offset[0], y], [width, height], true);

		for (let i = 0; i < text.length; i++) {
			write_text(text[i], [this.help_text_offset[0] + this.inner_help_text_offset[0], y + this.line_height * (i + 1)], 'white', 'black', 'left');
		}
	}
	next() {
		draw_rect(this.next_offset, this.next_dim);

		if (game.current_player.evo_score > 0) {
			open_popup(lang.popup_title, 'chuck_berry', lang.turn_finished, (x) => this.next_popup(x), lang.no, lang.yes);
		}
		else {
			this.next_popup(1);
		}
	}
	next_popup(answer) {
		if (answer === 1) {
			game.current_player.stats = this.stats;
			game.next_stage();
		}
	}
}
