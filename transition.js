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

	this.current_time = 0;

	this.clickareas = [];
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

	this.clickareas = [];

	// Background panels
	ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);

	if(lang[this.lang_string]) {
		subtitle(this.subtitle_offset[0], this.subtitle_offset[1], lang[this.lang_string]);
	}
};


Transition.prototype.render = function() {
	return;
};


Transition.prototype.update = function(dt) {
	this.current_time += dt;
	if(this.current_time > options.transition_delay) {
		game.next_stage();
	}
};


Transition.prototype.handle_input = function(dt) {
	return;
};
