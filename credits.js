'use strict';

function Credits() {
	this.id = SCENE.CREDITS;
	this.bg = resources.get('gfx/light_bg.png');
	this.github = resources.get('gfx/github.png');

	// CONST_START
	this.upper_panel_dim = [620, 130];
	this.lower_panel_dim = [305, 280];
	this.close_dim = [181, 22];
	this.github_dim = [64, 83];

	this.upper_panel_offset = [9, 29];
	this.left_panel_offset = [9, 168];
	this.right_panel_offset = [324, 168];
	this.close_offset = [459, 458];
	this.text_rel_offset = [10, 22];
	this.github_offset = [538, 50];

	this.max_text_width = 500;
	this.line_height = 20;
	// CONST_END

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Credits.prototype.initialize = function() {
	this.redraw();
};


Credits.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle
	draw_rect(this.close_offset, this.close_dim); // Close
	draw_upper_left_border(this.close_offset, this.close_dim);
	write_text(lang.close, [549, 473], 'white', 'black');

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

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
	ctx.save();
	const rep = ctx.createPattern(this.bg, 'repeat');
	ctx.fillStyle = rep;

	draw_rect(this.upper_panel_offset, this.upper_panel_dim, true, false, true);
	ctx.fillRect(this.upper_panel_offset[0]+3, this.upper_panel_offset[1]+3, this.upper_panel_dim[0]-6, this.upper_panel_dim[1]-6);

	draw_rect(this.left_panel_offset, this.lower_panel_dim, true, false, true);
	ctx.fillRect(this.left_panel_offset[0]+3, this.left_panel_offset[1]+3, this.lower_panel_dim[0]-6, this.lower_panel_dim[1]-6);

	draw_rect(this.right_panel_offset, this.lower_panel_dim, true, false, true);
	ctx.fillRect(this.right_panel_offset[0]+3, this.right_panel_offset[1]+3, this.lower_panel_dim[0]-6, this.lower_panel_dim[1]-6);


	ctx.restore();

	// Info text
	const text = multiline(lang.information, this.max_text_width);
	for(let i = 0; i < text.length; i++) {
		write_text(text[i], [this.text_rel_offset[0] + this.upper_panel_offset[0], this.text_rel_offset[1] + this.upper_panel_offset[1] + this.line_height * i], '#000000', '#ffffff', 'left');
	}

	// Github logo
	ctx.drawImage(this.github, this.github_offset[0], this.github_offset[1]);
	this.clickareas.push({
		x1: this.github_offset[0],
		y1: this.github_offset[1],
		x2: this.github_offset[0] + this.github_dim[0],
		y2: this.github_offset[1] + this.github_dim[1],
		down: () => {},
		up: () => window.open('https://www.github.com/Frunit/qpop.js', '_blank'),
		blur: () => {}
	});

	// Credits for original game
	let line = 0;
	for(let i = 0; i < lang.credits_original.length; i++) {
		write_text(lang.credits_original[i][0], [this.text_rel_offset[0] + this.left_panel_offset[0], this.text_rel_offset[1] + this.left_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
		line++;
		for(let j = 0; j < lang.credits_original[i][1].length; j++) {
			write_text(lang.credits_original[i][1][j], [this.text_rel_offset[0] + this.left_panel_offset[0] + 30, this.text_rel_offset[1] + this.left_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
			line++;
		}
	}

	// Credits for remake
	line = 0;
	for(let i = 0; i < lang.credits_remake.length; i++) {
		write_text(lang.credits_remake[i][0], [this.text_rel_offset[0] + this.right_panel_offset[0], this.text_rel_offset[1] + this.right_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
		line++;
		for(let j = 0; j < lang.credits_remake[i][1].length; j++) {
			write_text(lang.credits_remake[i][1][j], [this.text_rel_offset[0] + this.right_panel_offset[0] + 30, this.text_rel_offset[1] + this.right_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
			line++;
		}
	}

	this.keys = [
		{'key': 'ENTER', 'action': () => this.close(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.close(), 'reset': true},
	];
};


Credits.prototype.render = function() {

};


Credits.prototype.update = function() {

};


Credits.prototype.close = function() {
	draw_rect(this.close_offset, this.close_dim);
	game.stage = game.backstage.pop();
	game.stage.redraw();
};
