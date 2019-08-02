'use strict';

// TODO!
// TODO: This must also know, which player won and whether it was a human player.

function Outro() {
	this.id = SCENE.OUTRO;
	this.pic = resources.get('gfx/dummy_outro.png');

	// CONST_START
	this.pic_dim = [595, 415];
	this.pic_offset = [23, 42];
	// CONST_END

	this.frame = 0;

	this.clickareas = [];
}


Outro.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.redraw();
};


Outro.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.pic_offset[0] - 1, this.pic_offset[1] - 1], [this.pic_dim[0] + 2, this.pic_dim[1] + 2]);

	this.clickareas = [];

	// Background panels
	ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);
};


Outro.prototype.render = function() {

};


Outro.prototype.update = function() {

};


Outro.prototype.handle_input = function() {

};
