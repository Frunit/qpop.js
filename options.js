'use strict';

// MAYBE: Add a little gimmick that a predator walks along the right-hand side of the screen after some time :)
// MAYBE: Use different bar colors depending on value, similar to mutation screen

function Options() {
	this.id = SCENE.OPTIONS;
	this.bg = resources.get('gfx/dark_bg.png');
	this.symbols = resources.get('gfx/gui.png');
	this.bar = resources.get('gfx/mutations.png');

	// CONST_START
	this.close_dim = [181, 22];
	this.x_dim = [12, 12];
	this.plusminus_dim = [16, 16];
	this.bar_dim = [300, 16];
	this.lang_dim = [200, 22];

	this.close_offset = [459, 458];

	this.x_soffset = [72, 0];
	this.plus_soffset = [312, 96];
	this.plusdown_soffset = [328, 96];
	this.minus_soffset = [344, 96];
	this.minusdown_soffset = [360, 96];
	this.bar_soffset = [0, 64];
	this.emptybar_soffset = [300, 80];

	this.max_text_width = 600;
	this.line_height = 20;
	this.last_bit_width = 3;
	this.checkbox_x = 30;
	this.text_x = 50;
	this.text_y_offset = 12;
	this.secondary_x_offset = 175;
	// CONST_END

	this.ys = Object.freeze({
		lang: 48,
		music: 80,
		sound: 105,
		ai_speed: 140,
		auto_continue: 190,
		click_hold: 215,
		plants: 240,
		predators: 265,
		debug: 290,
		tutorial: 315,
		transition: 340,
	});

	this.wm_ai_delays = [36, 18, 9, 4, 0];

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Options.prototype.initialize = function() {
	this.redraw();
};


Options.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle
	draw_rect(this.close_offset, this.close_dim); // Close
	draw_upper_left_border(this.close_offset, this.close_dim);
	write_text(lang.close, [549, 473], 'white', 'black');

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

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
	write_text(lang.options_lang, [this.text_x, this.ys.lang + this.text_y_offset + 3], '#000000', '#ffffff', 'left');
	draw_rect([this.secondary_x_offset, this.ys.lang], this.lang_dim);
	write_text(lang.options_this_lang, [this.secondary_x_offset + this.lang_dim[0]/2, this.ys.lang + this.text_y_offset + 3], 'white', 'black');
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
	this.draw_checkbox([this.checkbox_x, this.ys.music], options.music_on);
	write_text(lang.options_music, [this.text_x, this.ys.music + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.music], options.music);
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.music,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.music + this.x_dim[1] + 2,
		down: () => {},
		up: () => game.toggle_music(),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_music_volume(-10),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_music_volume(10),
		blur: () => {}
	});

	// Sound
	this.draw_checkbox([this.checkbox_x, this.ys.sound], options.sound_on);
	write_text(lang.options_sound, [this.text_x, this.ys.sound + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.sound], options.sound);
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.sound,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.sound + this.x_dim[1] + 2,
		down: () => {},
		up: () => game.toggle_sound(),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_sound_volume(-10),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_sound_volume(10),
		blur: () => {}
	});

	// AI speed
	write_text(lang.options_ai_speed, [this.text_x, this.ys.ai_speed + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.ai_speed + this.line_height], Math.ceil(100 * options.wm_ai_delay_idx / (this.wm_ai_delays.length - 1)));
	write_text(lang.options_ai_speeds[options.wm_ai_delay_idx], [this.text_x, this.ys.ai_speed + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
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
		down: () => {},
		up: () => this.change_ai_speed(-1),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_ai_speed(1),
		blur: () => {}
	});

	// Auto continue
	this.draw_checkbox([this.checkbox_x, this.ys.auto_continue], options.wm_ai_auto_continue);
	write_text(lang.options_auto_continue, [this.text_x, this.ys.auto_continue + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.auto_continue,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.auto_continue + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_auto_continue(),
		blur: () => {}
	});

	// Click and hold
	this.draw_checkbox([this.checkbox_x, this.ys.click_hold], options.wm_click_and_hold);
	write_text(lang.options_click_hold, [this.text_x, this.ys.click_hold + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.click_hold,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.click_hold + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_click_and_hold(),
		blur: () => {}
	});

	// Plant distribution
	this.draw_checkbox([this.checkbox_x, this.ys.plants], options.plant_distribtion);
	write_text(lang.options_plants, [this.text_x, this.ys.plants + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.plants,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.plants + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_plant_distribtion(),
		blur: () => {}
	});

	// Show vanquished predators
	this.draw_checkbox([this.checkbox_x, this.ys.predators], options.show_predators);
	write_text(lang.options_predators, [this.text_x, this.ys.predators + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.predators,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.predators + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_show_predators(),
		blur: () => {}
	});

	// Show debug info
	this.draw_checkbox([this.checkbox_x, this.ys.debug], options.debug);
	write_text(lang.options_debug, [this.text_x, this.ys.debug + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.debug,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.debug + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_debug(),
		blur: () => {}
	});

	// Show tutorial
	this.draw_checkbox([this.checkbox_x, this.ys.tutorial], options.tutorial);
	write_text(lang.options_tutorial, [this.text_x, this.ys.tutorial + this.text_y_offset], '#000000', '#ffffff', 'left');
	this.clickareas.push({
		x1: this.checkbox_x,
		y1: this.ys.tutorial,
		x2: this.checkbox_x + this.x_dim[0] + 2,
		y2: this.ys.tutorial + this.x_dim[1] + 2,
		down: () => {},
		up: () => this.toggle_tutorial(),
		blur: () => {}
	});

	// Transition delay
	write_text(lang.options_transition, [this.text_x, this.ys.transition + this.text_y_offset], '#000000', '#ffffff', 'left');
	write_text((options.update_freq * options.transition_delay).toFixed(2) + ' s', [this.text_x, this.ys.transition + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.transition + this.line_height], options.transition_delay * 10 / 9);
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
		down: () => {},
		up: () => this.change_transition_delay(-18),
		blur: () => {}
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
		down: () => {},
		up: () => this.change_transition_delay(18),
		blur: () => {}
	});

	this.keys = [
		{'key': 'ENTER', 'action': () => this.close(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.close(), 'reset': true},
	];
};


Options.prototype.draw_checkbox = function(pos, checked) {
	draw_inv_rect(pos, [this.x_dim[0] + 2, this.x_dim[1] + 2], true);
	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(pos[0] + 1, pos[1] + 1, this.x_dim[0], this.x_dim[1]);
	ctx.restore();
	if(checked) {
		ctx.drawImage(this.symbols,
			this.x_soffset[0], this.x_soffset[1],
			this.x_dim[0], this.x_dim[1],
			pos[0] + 1, pos[1] + 1,
			this.x_dim[0], this.x_dim[1]);
	}
};


Options.prototype.draw_bar = function(pos, percent) {
	// Bar
	ctx.drawImage(this.bar,
		this.emptybar_soffset[0], this.emptybar_soffset[1],
		this.bar_dim[0], this.bar_dim[1],
		pos[0] + this.plusminus_dim[0] - 1, pos[1],
		this.bar_dim[0], this.bar_dim[1]);

	const length = percent * 3 - this.last_bit_width;

	if(length > 0) {
		// Main bar
		ctx.drawImage(this.bar,
			this.bar_soffset[0], this.bar_soffset[1],
			length, this.bar_dim[1],
			pos[0] + this.plusminus_dim[0] - 1, pos[1],
			length, this.bar_dim[1]);
		// Last bit
		ctx.drawImage(this.bar,
			this.bar_soffset[0] + this.bar_dim[0] - this.last_bit_width, this.bar_soffset[1],
			this.last_bit_width, this.bar_dim[1],
			pos[0] + this.plusminus_dim[0] + length - 1, pos[1],
			this.last_bit_width, this.bar_dim[1]);
	}

	this.draw_plus(pos);
	this.draw_minus(pos);
};

Options.prototype.draw_plus = function(pos) {
	ctx.drawImage(this.bar,
		this.plus_soffset[0], this.plus_soffset[1],
		this.plusminus_dim[0], this.plusminus_dim[1],
		pos[0] + this.plusminus_dim[0] + this.bar_dim[0] - 2, pos[1],
		this.plusminus_dim[0], this.plusminus_dim[1]);
};


Options.prototype.draw_plusdown = function(pos) {
	ctx.drawImage(this.bar,
		this.plusdown_soffset[0], this.plusdown_soffset[1],
		this.plusminus_dim[0], this.plusminus_dim[1],
		pos[0] + this.plusminus_dim[0] + this.bar_dim[0] - 2, pos[1],
		this.plusminus_dim[0], this.plusminus_dim[1]);
};


Options.prototype.draw_minus = function(pos) {
	ctx.drawImage(this.bar,
		this.minus_soffset[0], this.minus_soffset[1],
		this.plusminus_dim[0], this.plusminus_dim[1],
		pos[0], pos[1],
		this.plusminus_dim[0], this.plusminus_dim[1]);
};


Options.prototype.draw_minusdown = function(pos) {
	ctx.drawImage(this.bar,
		this.minusdown_soffset[0], this.minusdown_soffset[1],
		this.plusminus_dim[0], this.plusminus_dim[1],
		pos[0], pos[1],
		this.plusminus_dim[0], this.plusminus_dim[1]);
};


Options.prototype.change_transition_delay = function(value) {
	options.transition_delay = clamp(options.transition_delay + value, 0, 90);
	// Overwrite old number with background
	ctx.drawImage(this.bg,
		this.text_x - 1, this.ys.transition + this.line_height - 1,
		this.secondary_x_offset, this.text_y_offset + 2,
		this.text_x - 1, this.ys.transition + this.line_height - 1,
		this.secondary_x_offset, this.text_y_offset + 2);
	write_text((options.update_freq * options.transition_delay).toFixed(2) + ' s', [this.text_x, this.ys.transition + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.transition + this.line_height], options.transition_delay * 10 / 9);

	localStorage.setItem('transition_delay', options.transition_delay);
};


Options.prototype.change_music_volume = function(value) {
	options.music = clamp(options.music + value, 0, 100);
	this.draw_bar([this.secondary_x_offset, this.ys.music], options.music);

	if(options.music_on) {
		audio.set_music_volume(options.music / 100);
	}

	localStorage.setItem('music', options.music);
};


Options.prototype.change_sound_volume = function(value) {
	options.sound = clamp(options.sound + value, 0, 100);
	this.draw_bar([this.secondary_x_offset, this.ys.sound], options.sound);

	if(options.sound_on) {
		audio.set_music_volume(options.sound / 100);
	}

	localStorage.setItem('sound', options.sound);
};


Options.prototype.change_ai_speed = function(value) {
	options.wm_ai_delay_idx = clamp(options.wm_ai_delay_idx + value, 0, 4);
	options.wm_ai_delay = this.wm_ai_delays[options.wm_ai_delay_idx];
	// Overwrite old value with background
	ctx.drawImage(this.bg,
		this.text_x - 1, this.ys.ai_speed + this.line_height - 1,
		this.secondary_x_offset, this.text_y_offset + 6,
		this.text_x - 1, this.ys.ai_speed + this.line_height - 1,
		this.secondary_x_offset, this.text_y_offset + 6);
	write_text(lang.options_ai_speeds[options.wm_ai_delay_idx], [this.text_x, this.ys.ai_speed + this.text_y_offset + this.line_height], '#000000', '#ffffff', 'left');
	this.draw_bar([this.secondary_x_offset, this.ys.ai_speed + this.line_height], Math.ceil(100 * options.wm_ai_delay_idx / (this.wm_ai_delays.length - 1)));

	localStorage.setItem('wm_ai_delay_idx', options.wm_ai_delay_idx);
	localStorage.setItem('wm_ai_delay', options.wm_ai_delay);
};


Options.prototype.toggle_auto_continue = function() {
	options.wm_ai_auto_continue = !options.wm_ai_auto_continue;
	this.draw_checkbox([this.checkbox_x, this.ys.auto_continue], options.wm_ai_auto_continue);

	localStorage.setItem('wm_ai_auto_continue', options.wm_ai_auto_continue);
};


Options.prototype.toggle_click_and_hold = function() {
	options.wm_click_and_hold = !options.wm_click_and_hold;
	this.draw_checkbox([this.checkbox_x, this.ys.click_hold], options.wm_click_and_hold);

	localStorage.setItem('wm_click_and_hold', options.wm_click_and_hold);
};


Options.prototype.toggle_plant_distribtion = function() {
	options.plant_distribtion = !options.plant_distribtion;
	this.draw_checkbox([this.checkbox_x, this.ys.plants], options.plant_distribtion);

	localStorage.setItem('plant_distribtion', options.plant_distribtion);
};


Options.prototype.toggle_show_predators = function() {
	options.show_predators = !options.show_predators;
	this.draw_checkbox([this.checkbox_x, this.ys.predators], options.show_predators);

	localStorage.setItem('show_predators', options.show_predators);
};


Options.prototype.toggle_debug = function() {
	options.debug = !options.debug;
	this.draw_checkbox([this.checkbox_x, this.ys.debug], options.debug);

	localStorage.setItem('debug', options.debug);
};


Options.prototype.toggle_tutorial = function() {
	options.tutorial = !options.tutorial;
	this.draw_checkbox([this.checkbox_x, this.ys.tutorial], options.tutorial);

	localStorage.setItem('tutorial', options.tutorial);

	// Reset seen tutorials when tutorials are switched on again
	if(options.tutorial) {
		game.seen_tutorials = new Set();
		localStorage.setItem('seen_tutorials', '[]');
	}
};


Options.prototype.render = function() {

};


Options.prototype.update = function() {

};


Options.prototype.close = function() {
	draw_rect(this.close_offset, this.close_dim);
	game.stage = game.backstage.pop();
	game.stage.redraw();
};
