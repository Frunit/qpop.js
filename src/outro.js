'use strict';


// MAYBE: Add me/Frunit to the credits in the outro


function Outro(winner) {
	this.id = SCENE.OUTRO;
	this.winner = winner; // negative -> game is lost

	// CONST_START
	this.anim_dim = [600, 420];
	this.anim_offset = [19, 39];
	// CONST_END

	this.animation = null;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Outro.prototype.initialize = function() {
	audio.play_music('outro');
	canvas.style.cursor = 'default';
	const num = (this.winner >= 0) ? this.winner : 6;
	this.animation = new Animation(outro_frames[num], this.anim_offset);
	this.redraw();
};


Outro.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

	this.clickareas.push({
		x1: this.anim_offset[0],
		y1: this.anim_offset[1],
		x2: this.anim_offset[0] + this.anim_dim[0],
		y2: this.anim_offset[1] + this.anim_dim[1],
		down: () => {},
		up: () => game.next_stage(),
		blur: () => {}
	});

	this.keys = [
		{'key': 'ENTER', 'action': () => game.next_stage(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => game.next_stage(), 'reset': true},
	];

	this.render();
};


Outro.prototype.render = function() {
	this.animation.render();
};


Outro.prototype.update = function() {
	if(this.animation.has_stopped) {
		game.next_stage();
	}
	else {
		this.animation.step();
	}
};
