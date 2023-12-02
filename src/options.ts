import { SCENE, clamp, draw_base, draw_checkbox, draw_rect, draw_upper_left_border, local_save, open_popup, write_text } from "./helper";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal } from "./types";

// MAYBE: Add a little gimmick that a predator walks along the right-hand side of the screen after some time :)
// MAYBE: Use different bar colors depending on value, similar to mutation screen

export class Options implements Stage {
	id = SCENE.OPTIONS;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	glob: TechGlobal;

	private bg: HTMLImageElement;
	private symbols: HTMLImageElement;
	private bar: HTMLImageElement;

	readonly close_dim: Dimension = [181, 22];
	readonly x_dim: Dimension = [12, 12];
	readonly plusminus_dim: Dimension = [16, 16];
	readonly bar_dim: Dimension = [300, 16];
	readonly lang_dim: Dimension = [200, 22];

	readonly close_offset: Point = [459, 458];
	readonly x_soffset: Point = [72, 0];
	readonly plus_soffset: Point = [312, 96];
	readonly plusdown_soffset: Point = [328, 96];
	readonly minus_soffset: Point = [344, 96];
	readonly minusdown_soffset: Point = [360, 96];
	readonly bar_soffset: Point = [0, 64];
	readonly emptybar_soffset: Point = [300, 80];

	readonly line_height = 20;
	readonly last_bit_width = 3;
	readonly checkbox_x = 30;
	readonly text_x = 50;
	readonly text_y_offset = 12;
	readonly secondary_x_offset = 175;

	readonly ys = {
		lang: 48,
		music: 80,
		sound: 105,
		ai_speed: 140,
		auto_continue: 190,
		click_hold: 215,
		plants: 240,
		predators: 265,
		tutorial: 290,
		transition: 315,
		restart: 400,
	};
	
	readonly wm_ai_delays = [36, 18, 9, 4, 0];

	constructor(glob: TechGlobal) {
		this.glob = glob;
		this.bg = glob.resources.get_image('gfx/dark_bg.png');
		this.symbols = glob.resources.get_image('gfx/gui.png');
		this.bar = glob.resources.get_image('gfx/mutations.png');
	}

	initialize() {
		this.redraw();
	}

	redraw() {
		draw_base();

		draw_rect([0, 20], [640, 460]); // Main rectangle
		draw_rect(this.close_offset, this.close_dim); // Close
		draw_upper_left_border(this.close_offset, this.close_dim);
		write_text(this.glob.lang.close, [549, 473], 'white', 'black');

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		// Close
		this.clickareas.push({
			x1: this.close_offset[0],
			y1: this.close_offset[1],
			x2: this.close_offset[0] + this.close_dim[0],
			y2: this.close_offset[1] + this.close_dim[1],
			down: () => draw_rect(this.close_offset, this.close_dim, true, true),
			up: () => this.close(),
			blur: () => draw_rect(this.close_offset, this.close_dim)
		});

		// Language
		write_text(this.glob.lang.options_lang, [this.text_x, this.ys.lang + this.text_y_offset + 3], '#000000', '#ffffff', 'left');
		draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim);
		write_text(this.glob.lang.options_this_lang, [this.secondary_x_offset + this.lang_dim[0] / 2, this.ys.lang + this.text_y_offset + 3], 'white', 'black');
		this.clickareas.push({
			x1: this.secondary_x_offset,
			y1: this.ys.lang,
			x2: this.secondary_x_offset + this.lang_dim[0],
			y2: this.ys.lang + this.lang_dim[1],
			down: () => draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim, true, true),
			up: () => game.next_language(1),
			blur: () => draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim)
		});
		this.rightclickareas.push({
			x1: this.secondary_x_offset,
			y1: this.ys.lang,
			x2: this.secondary_x_offset + this.lang_dim[0],
			y2: this.ys.lang + this.lang_dim[1],
			down: () => draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim, true, true),
			up: () => game.next_language(-1),
			blur: () => draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim)
		});

		// Music
		draw_checkbox([this.checkbox_x, this.ys.music], this.glob.options.music_on);
		write_text(this.glob.lang.options_music, [this.text_x, this.ys.music + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.music], this.glob.options.music);
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.music,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.music + this.x_dim[1] + 2,
			down: () => { },
			up: () => game.toggle_music(),
			blur: () => { }
		});
		this.clickareas.push({
			x1: this.secondary_x_offset + 1,
			y1: this.ys.music + 1,
			x2: this.secondary_x_offset + this.plusminus_dim[0] - 1,
			y2: this.ys.music + this.plusminus_dim[1] - 1,
			down: () => this.draw_minusdown([this.secondary_x_offset, this.ys.music]),
			up: () => this.change_music_volume(-10),
			blur: () => this.draw_minus([this.secondary_x_offset, this.ys.music])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0],
			y1: this.ys.music,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.49,
			y2: this.ys.music + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_music_volume(-10),
			blur: () => { }
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 1,
			y1: this.ys.music + 1,
			x2: this.secondary_x_offset + 2 * this.plusminus_dim[0] + this.bar_dim[0] - 3,
			y2: this.ys.music + this.plusminus_dim[1] - 1,
			down: () => this.draw_plusdown([this.secondary_x_offset, this.ys.music]),
			up: () => this.change_music_volume(10),
			blur: () => this.draw_plus([this.secondary_x_offset, this.ys.music])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.51,
			y1: this.ys.music,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 2,
			y2: this.ys.music + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_music_volume(10),
			blur: () => { }
		});

		// Sound
		draw_checkbox([this.checkbox_x, this.ys.sound], this.glob.options.sound_on);
		write_text(this.glob.lang.options_sound, [this.text_x, this.ys.sound + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.sound], this.glob.options.sound);
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.sound,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.sound + this.x_dim[1] + 2,
			down: () => { },
			up: () => game.toggle_sound(),
			blur: () => { }
		});
		this.clickareas.push({
			x1: this.secondary_x_offset + 1,
			y1: this.ys.sound + 1,
			x2: this.secondary_x_offset + this.plusminus_dim[0] - 1,
			y2: this.ys.sound + this.plusminus_dim[1] - 1,
			down: () => this.draw_minusdown([this.secondary_x_offset, this.ys.sound]),
			up: () => this.change_sound_volume(-10),
			blur: () => this.draw_minus([this.secondary_x_offset, this.ys.sound])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0],
			y1: this.ys.sound,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.49,
			y2: this.ys.sound + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_sound_volume(-10),
			blur: () => { }
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 1,
			y1: this.ys.sound + 1,
			x2: this.secondary_x_offset + 2 * this.plusminus_dim[0] + this.bar_dim[0] - 3,
			y2: this.ys.sound + this.plusminus_dim[1] - 1,
			down: () => this.draw_plusdown([this.secondary_x_offset, this.ys.sound]),
			up: () => this.change_sound_volume(10),
			blur: () => this.draw_plus([this.secondary_x_offset, this.ys.sound])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.51,
			y1: this.ys.sound,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 2,
			y2: this.ys.sound + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_sound_volume(10),
			blur: () => { }
		});

		// AI speed
		write_text(this.glob.lang.options_ai_speed, [this.text_x, this.ys.ai_speed + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.ai_speed + this.line_height], Math.ceil(100 * this.glob.options.wm_ai_delay_idx / (this.wm_ai_delays.length - 1)));
		write_text(this.glob.lang.options_ai_speeds[this.glob.options.wm_ai_delay_idx], [this.text_x, this.ys.ai_speed + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.secondary_x_offset + 1,
			y1: this.ys.ai_speed + this.line_height + 1,
			x2: this.secondary_x_offset + this.plusminus_dim[0] - 1,
			y2: this.ys.ai_speed + this.plusminus_dim[1] + this.line_height - 1,
			down: () => this.draw_minusdown([this.secondary_x_offset, this.ys.ai_speed + this.line_height]),
			up: () => this.change_ai_speed(-1),
			blur: () => this.draw_minus([this.secondary_x_offset, this.ys.ai_speed + this.line_height])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0],
			y1: this.ys.ai_speed + this.line_height,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.49,
			y2: this.ys.ai_speed + this.plusminus_dim[1] + this.line_height,
			down: () => { },
			up: () => this.change_ai_speed(-1),
			blur: () => { }
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 1,
			y1: this.ys.ai_speed + this.line_height + 1,
			x2: this.secondary_x_offset + 2 * this.plusminus_dim[0] + this.bar_dim[0] - 3,
			y2: this.ys.ai_speed + this.plusminus_dim[1] + this.line_height - 1,
			down: () => this.draw_plusdown([this.secondary_x_offset, this.ys.ai_speed + this.line_height]),
			up: () => this.change_ai_speed(1),
			blur: () => this.draw_plus([this.secondary_x_offset, this.ys.ai_speed + this.line_height])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.51,
			y1: this.ys.ai_speed + this.line_height,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 2,
			y2: this.ys.ai_speed + this.plusminus_dim[1] + this.line_height,
			down: () => { },
			up: () => this.change_ai_speed(1),
			blur: () => { }
		});

		// Auto continue
		draw_checkbox([this.checkbox_x, this.ys.auto_continue], this.glob.options.wm_ai_auto_continue);
		write_text(this.glob.lang.options_auto_continue, [this.text_x, this.ys.auto_continue + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.auto_continue,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.auto_continue + this.x_dim[1] + 2,
			down: () => { },
			up: () => this.toggle_auto_continue(),
			blur: () => { }
		});

		// Click and hold
		draw_checkbox([this.checkbox_x, this.ys.click_hold], this.glob.options.wm_click_and_hold);
		write_text(this.glob.lang.options_click_hold, [this.text_x, this.ys.click_hold + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.click_hold,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.click_hold + this.x_dim[1] + 2,
			down: () => { },
			up: () => this.toggle_click_and_hold(),
			blur: () => { }
		});

		// Plant distribution
		draw_checkbox([this.checkbox_x, this.ys.plants], this.glob.options.plant_distribtion);
		write_text(this.glob.lang.options_plants, [this.text_x, this.ys.plants + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.plants,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.plants + this.x_dim[1] + 2,
			down: () => { },
			up: () => this.toggle_plant_distribtion(),
			blur: () => { }
		});

		// Show vanquished predators
		draw_checkbox([this.checkbox_x, this.ys.predators], this.glob.options.show_predators);
		write_text(this.glob.lang.options_predators, [this.text_x, this.ys.predators + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.predators,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.predators + this.x_dim[1] + 2,
			down: () => { },
			up: () => this.toggle_show_predators(),
			blur: () => { }
		});

		// Show tutorial
		draw_checkbox([this.checkbox_x, this.ys.tutorial], this.glob.options.tutorial);
		write_text(this.glob.lang.options_tutorial, [this.text_x, this.ys.tutorial + this.text_y_offset], '#000000', '#ffffff', 'left');
		this.clickareas.push({
			x1: this.checkbox_x,
			y1: this.ys.tutorial,
			x2: this.checkbox_x + this.x_dim[0] + 2,
			y2: this.ys.tutorial + this.x_dim[1] + 2,
			down: () => { },
			up: () => game.toggle_tutorial([this.checkbox_x, this.ys.tutorial]),
			blur: () => { }
		});

		// Transition delay
		write_text(this.glob.lang.options_transition, [this.text_x, this.ys.transition + this.text_y_offset], '#000000', '#ffffff', 'left');
		write_text(`${(this.glob.options.update_freq * this.glob.options.transition_delay).toFixed(2)} s`, [this.text_x, this.ys.transition + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.transition + this.line_height], this.glob.options.transition_delay * 10 / 9);
		this.clickareas.push({
			x1: this.secondary_x_offset + 1,
			y1: this.ys.transition + this.line_height + 1,
			x2: this.secondary_x_offset + this.plusminus_dim[0] - 1,
			y2: this.ys.transition + this.line_height + this.plusminus_dim[1] - 1,
			down: () => this.draw_minusdown([this.secondary_x_offset, this.ys.transition + this.line_height]),
			up: () => this.change_transition_delay(-9),
			blur: () => this.draw_minus([this.secondary_x_offset, this.ys.transition + this.line_height])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0],
			y1: this.ys.transition + this.line_height,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.49,
			y2: this.ys.transition + this.line_height + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_transition_delay(-18),
			blur: () => { }
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 1,
			y1: this.ys.transition + this.line_height + 1,
			x2: this.secondary_x_offset + 2 * this.plusminus_dim[0] + this.bar_dim[0] - 3,
			y2: this.ys.transition + this.line_height + this.plusminus_dim[1] - 1,
			down: () => this.draw_plusdown([this.secondary_x_offset, this.ys.transition + this.line_height]),
			up: () => this.change_transition_delay(9),
			blur: () => this.draw_plus([this.secondary_x_offset, this.ys.transition + this.line_height])
		});

		this.clickareas.push({
			x1: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] * 0.51,
			y1: this.ys.transition + this.line_height,
			x2: this.secondary_x_offset + this.plusminus_dim[0] + this.bar_dim[0] - 2,
			y2: this.ys.transition + this.line_height + this.plusminus_dim[1],
			down: () => { },
			up: () => this.change_transition_delay(18),
			blur: () => { }
		});

		// Restart game
		write_text(this.glob.lang.options_restart, [this.text_x + this.lang_dim[0] / 2, this.ys.restart + this.text_y_offset + 3], '#ffffff', '#000000', 'center');
		draw_rect([this.text_x, this.ys.restart], this.lang_dim);
		this.clickareas.push({
			x1: this.text_x,
			y1: this.ys.restart,
			x2: this.text_x + this.lang_dim[0],
			y2: this.ys.restart + this.lang_dim[1],
			down: () => draw_rect([this.text_x, this.ys.restart], this.lang_dim, true, true),
			up: () => open_popup(this.glob.lang.popup_title, 'chuck_berry', this.glob.lang.really_restart, (x) => this.restart_game(x), this.glob.lang.no, this.glob.lang.yes),
			blur: () => draw_rect([this.text_x, this.ys.restart], this.lang_dim)
		});

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.close(), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => this.close(), 'reset': true },
		];
	}

	draw_bar(pos: Point, percent: number) {
		// Bar
		this.glob.ctx.drawImage(this.bar,
			this.emptybar_soffset[0], this.emptybar_soffset[1],
			this.bar_dim[0], this.bar_dim[1],
			pos[0] + this.plusminus_dim[0] - 1, pos[1],
			this.bar_dim[0], this.bar_dim[1]);

		const length = percent * 3 - this.last_bit_width;

		if (length > 0) {
			// Main bar
			this.glob.ctx.drawImage(this.bar,
				this.bar_soffset[0], this.bar_soffset[1],
				length, this.bar_dim[1],
				pos[0] + this.plusminus_dim[0] - 1, pos[1],
				length, this.bar_dim[1]);
			// Last bit
			this.glob.ctx.drawImage(this.bar,
				this.bar_soffset[0] + this.bar_dim[0] - this.last_bit_width, this.bar_soffset[1],
				this.last_bit_width, this.bar_dim[1],
				pos[0] + this.plusminus_dim[0] + length - 1, pos[1],
				this.last_bit_width, this.bar_dim[1]);
		}

		this.draw_plus(pos);
		this.draw_minus(pos);
	}

	draw_plus(pos: Point) {
		this.glob.ctx.drawImage(this.bar,
			this.plus_soffset[0], this.plus_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			pos[0] + this.plusminus_dim[0] + this.bar_dim[0] - 2, pos[1],
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}

	draw_plusdown(pos: Point) {
		this.glob.ctx.drawImage(this.bar,
			this.plusdown_soffset[0], this.plusdown_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			pos[0] + this.plusminus_dim[0] + this.bar_dim[0] - 2, pos[1],
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}

	draw_minus(pos: Point) {
		this.glob.ctx.drawImage(this.bar,
			this.minus_soffset[0], this.minus_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			pos[0], pos[1],
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}

	draw_minusdown(pos: Point) {
		this.glob.ctx.drawImage(this.bar,
			this.minusdown_soffset[0], this.minusdown_soffset[1],
			this.plusminus_dim[0], this.plusminus_dim[1],
			pos[0], pos[1],
			this.plusminus_dim[0], this.plusminus_dim[1]);
	}

	change_transition_delay(value: number) {
		this.glob.options.transition_delay = clamp(this.glob.options.transition_delay + value, 0, 90);
		// Overwrite old number with background
		this.glob.ctx.drawImage(this.bg,
			this.text_x - 1, this.ys.transition + this.line_height - 1,
			this.secondary_x_offset, this.text_y_offset + 2,
			this.text_x - 1, this.ys.transition + this.line_height - 1,
			this.secondary_x_offset, this.text_y_offset + 2);
		write_text(`${(this.glob.options.update_freq * this.glob.options.transition_delay).toFixed(2)} s`, [this.text_x, this.ys.transition + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.transition + this.line_height], this.glob.options.transition_delay * 10 / 9);

		local_save('transition_delay', this.glob.options.transition_delay);
	}

	change_music_volume(value: number) {
		this.glob.options.music = clamp(this.glob.options.music + value, 0, 100);
		this.draw_bar([this.secondary_x_offset, this.ys.music], this.glob.options.music);

		if (this.glob.options.music_on) {
			this.glob.resources.set_music_volume(this.glob.options.music / 100);
		}

		local_save('music', this.glob.options.music);
	}

	change_sound_volume(value: number) {
		this.glob.options.sound = clamp(this.glob.options.sound + value, 0, 100);
		this.draw_bar([this.secondary_x_offset, this.ys.sound], this.glob.options.sound);

		if (this.glob.options.sound_on) {
			this.glob.resources.set_music_volume(this.glob.options.sound / 100);
		}

		local_save('sound', this.glob.options.sound);
	}

	change_ai_speed(value: number) {
		this.glob.options.wm_ai_delay_idx = clamp(this.glob.options.wm_ai_delay_idx + value, 0, 4);
		this.glob.options.wm_ai_delay = this.wm_ai_delays[this.glob.options.wm_ai_delay_idx];
		// Overwrite old value with background
		this.glob.ctx.drawImage(this.bg,
			this.text_x - 1, this.ys.ai_speed + this.line_height - 1,
			this.secondary_x_offset, this.text_y_offset + 6,
			this.text_x - 1, this.ys.ai_speed + this.line_height - 1,
			this.secondary_x_offset, this.text_y_offset + 6);
		write_text(this.glob.lang.options_ai_speeds[this.glob.options.wm_ai_delay_idx], [this.text_x, this.ys.ai_speed + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
		this.draw_bar([this.secondary_x_offset, this.ys.ai_speed + this.line_height], Math.ceil(100 * this.glob.options.wm_ai_delay_idx / (this.wm_ai_delays.length - 1)));

		local_save('wm_ai_delay_idx', this.glob.options.wm_ai_delay_idx);
		local_save('wm_ai_delay', this.glob.options.wm_ai_delay);
	}

	toggle_auto_continue() {
		this.glob.options.wm_ai_auto_continue = !this.glob.options.wm_ai_auto_continue;
		draw_checkbox([this.checkbox_x, this.ys.auto_continue], this.glob.options.wm_ai_auto_continue);

		local_save('wm_ai_auto_continue', this.glob.options.wm_ai_auto_continue);
	}

	toggle_click_and_hold() {
		this.glob.options.wm_click_and_hold = !this.glob.options.wm_click_and_hold;
		draw_checkbox([this.checkbox_x, this.ys.click_hold], this.glob.options.wm_click_and_hold);

		local_save('wm_click_and_hold', this.glob.options.wm_click_and_hold);
	}

	toggle_plant_distribtion() {
		this.glob.options.plant_distribtion = !this.glob.options.plant_distribtion;
		draw_checkbox([this.checkbox_x, this.ys.plants], this.glob.options.plant_distribtion);

		local_save('plant_distribtion', this.glob.options.plant_distribtion);
	}

	toggle_show_predators() {
		this.glob.options.show_predators = !this.glob.options.show_predators;
		draw_checkbox([this.checkbox_x, this.ys.predators], this.glob.options.show_predators);

		local_save('show_predators', this.glob.options.show_predators);
	}

	restart_game(x) {
		if (x === 1) {
			game.stage = new Init();
			game.stage.initialize();
		}
	}

	render() {
	}

	update() {
	}

	close() {
		draw_rect(this.close_offset, this.close_dim);
		game.stage = game.backstage.pop();
		game.stage.redraw();
	}
}
