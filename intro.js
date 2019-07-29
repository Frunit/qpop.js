'use strict';

// TODO RESEARCH: Check values. The pic is too big for the window.

function Intro() {
	this.id = 0;
	this.pic = resources.get('gfx/dummy_intro.png');

	// CONST_START
	this.pic_dim = [595, 415];
	this.pic_offset = [23, 42];
	// CONST_END

	this.current_time = 0;

	this.clickareas = [];
}


Intro.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.redraw();
};


Intro.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.pic_offset[0] - 1, this.pic_offset[1] - 1], [this.pic_dim[0] + 2, this.pic_dim[1] + 2]);

	this.clickareas = [];

	// Background panels
	ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);
};


Intro.prototype.render = function() {

};


Intro.prototype.update = function(dt) {
	this.current_time += dt;
	if(this.current_time > options.transition_delay) {
		game.next_stage();
	}
};


Intro.prototype.handle_input = function(dt) {

};
