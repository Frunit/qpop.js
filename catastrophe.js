'use strict';


function Catastrophe(callback) {
	this.id = SCENE.CATASTROPHE;
	this.bg = resources.get('gfx/dark_bg.png');

	this.callback = callback;

	// CONST_START
	this.dim = [360, 300];
	this.title_dim = [360, 21];
	this.anim_dim = [320, 240];

	this.offset = [140, 90];
	this.title_offset = [140, 90];
	this.anim_offset = [160, 130];

	this.anim_soffset = [0, 0];
	// CONST_END

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
	this.animation = null;

	this.type = random_int(0, 8);
}


Catastrophe.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.animation = new Animation(catastrophe_frames[this.type], this.anim_offset);
	this.redraw();
};


Catastrophe.prototype.redraw = function() {
	// Background
	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	// Black rect around whole catastrophe window
	draw_black_rect([this.offset[0], this.offset[1]], [this.dim[0]-1, this.dim[1]-1]);

	// Title
	draw_rect([this.title_offset[0], this.title_offset[1]], this.title_dim);
	write_text(lang.catastrophe,
				[this.title_offset[0] + this.title_dim[0]/2,
				this.title_offset[1] + 15],
				'white', 'black');

	// Rect around animation
	draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

	this.clickareas = [];

	this.clickareas.push({
		x1: this.anim_offset[0],
		y1: this.anim_offset[1],
		x2: this.anim_offset[0] + this.anim_dim[0],
		y2: this.anim_offset[1] + this.anim_dim[1],
		down: () => {},
		up: () => this.end(),
		blur: () => {}
	});

	this.keys = [
		{'key': 'ENTER', 'action': () => this.end(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.end(), 'reset': true},
	];
};


Catastrophe.prototype.render = function() {
	this.animation.render();
};


Catastrophe.prototype.update = function() {
	if(this.animation.has_stopped) {
		this.end();
	}
	else {
		this.animation.step();
	}
};


Catastrophe.prototype.end = function() {
	this.callback(this.type); // also redraws
};
