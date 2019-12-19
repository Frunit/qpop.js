'use strict';


function Credits() {
	this.id = -1;
	this.bg = resources.get('gfx/light_bg.png');

	// CONST_START
	this.upper_panel_dim = [620, 211];
	this.lower_panel_dim = [150, 211]; // Actual dimension is twice as wide!
	this.close_dim = [181, 22];

	this.upper_panel_offset = [9, 7];
	this.close_offset = [459, 458];
	this.info_text_offset = [20, 20];
	this.original_text_offset = [20, 20];
	this.remake_text_offset = [20, 20];

	this.panel_left_soffset = [150, 211];
	this.panel_right_soffset = [470, 211];

	this.max_text_width = 600;
	this.line_height = 20;
	// CONST_END

	this.lower_panel_offsets = [[9, 230], [330, 230]];

	this.text = multiline(lang.information, this.max_text_width);

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Credits.prototype.initialize = function() {
	this.redraw();
};


Credits.prototype.redraw = function() {
	draw_base();

	// TODO: Make credits button in header red

	draw_rect([0, 20], [640, 439]); // Main rectangle
	draw_rect(this.close_offset, this.close_dim); // Close
	write_text(lang.close, [549, 473], 'white', 'black');

	this.clickareas = [];

	this.clickareas.push({
		x1: this.close_offset[0],
		y1: this.close_offset[1],
		x2: this.close_offset[0] + this.close_dim[0],
		y2: this.close_offset[1] + this.close_dim[1],
		down: () => draw_rect(this.close_offset, this.close_dim, true, true),
		up: () => this.close(),
		blur: () => draw_rect(this.close_offset, this.close_dim)
	});

	// Background panels
	ctx.drawImage(this.bg, this.upper_panel_offset[0], this.upper_panel_offset[1]);

	for(let i = 0; i < 2; i++) {
		ctx.drawImage(this.bg,
			this.panel_left_soffset[0], this.panel_left_soffset[1],
			this.lower_panel_dim[0], this.lower_panel_dim[1],
			this.lower_panel_offsets[i][0], this.lower_panel_offsets[i][1],
			this.lower_panel_dim[0], this.lower_panel_dim[1]);

		ctx.drawImage(this.bg,
			this.panel_right_soffset[0], this.panel_right_soffset[1],
			this.lower_panel_dim[0], this.lower_panel_dim[1],
			this.lower_panel_offsets[i][0] + this.lower_panel_dim[0], this.lower_panel_offsets[i][1],
			this.lower_panel_dim[0], this.lower_panel_dim[1]);
	}

	// Info text
	for(let i = 0; i < this.text.length; i++) {
		write_text(this.text[i], [this.info_text_offset[0], this.info_text_offset[1] + this.line_height * i], fg='#000000', bg='#ffffff', align='left');
	}

	// Credits for original game
	for(let i = 0; i < lang.credits_original.length; i++) {
		for(let j = 0; j < 2; j++) {
			write_text(lang.credits_original[i][j], [this.original_text_offset[0] + j * 20, this.original_text_offset[1] + this.line_height * (i*2 + j) - j*3], fg='#000000', bg='#ffffff', align='left');
		}
	}

	// Credits for remake
	for(let i = 0; i < lang.credits_remake.length; i++) {
		for(let j = 0; j < 2; j++) {
			write_text(lang.credits_remake[i][j], [this.remake_text_offset[0] + j * 20, this.remake_text_offset[1] + this.line_height * (i*2 + j) - j*3], fg='#000000', bg='#ffffff', align='left');
		}
	}

	this.keys = [
		{'key': 'ENTER', 'action': () => this.close(), 'reset': true},
	];
};


Credits.prototype.render = function() {

};


Credits.prototype.update = function() {

};


Credits.prototype.close = function() {
	draw_rect(this.next_offset, this.next_dim);
	game.stage = game.backstage.pop();
	game.stage.redraw();
};