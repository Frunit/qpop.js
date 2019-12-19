'use strict';

function Transition(pic, id) {
	this.id = id;
	this.pic = resources.get(pic);

	// CONST_START
	this.pic_dim = [595, 415];
	this.pic_offset = [23, 42];
	this.subtitle_offset = [70, 420];
	// CONST_END

	this.lang_string = pic.split('/').pop().replace('.png', '');

	this.frame = 0;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Transition.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.redraw();
};


Transition.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.pic_offset[0] - 1, this.pic_offset[1] - 1], [this.pic_dim[0] + 2, this.pic_dim[1] + 2]);

	// Background panels
	ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);

	if(lang[this.lang_string]) {
		subtitle(this.subtitle_offset[0], this.subtitle_offset[1], lang[this.lang_string]);
	}

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

	this.clickareas.push({
		x1: this.pic_offset[0],
		y1: this.pic_offset[1],
		x2: this.pic_offset[0] + this.pic_dim[0],
		y2: this.pic_offset[1] + this.pic_dim[1],
		down: () => {},
		up: () => game.next_stage(),
		blur: () => {}
	});

	this.keys = [
		{'key': 'ENTER', 'action': () => game.next_stage(), 'reset': true},
	];
};


Transition.prototype.render = function() {

};


Transition.prototype.update = function() {
	this.frame++;
	if(this.frame > options.transition_delay) {
		game.next_stage();
	}
};
