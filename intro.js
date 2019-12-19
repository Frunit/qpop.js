'use strict';


function Intro() {
	this.id = SCENE.INTRO;

	// CONST_START
	this.anim_dim = [600, 420];
	this.anim_offset = [19, 39];
	// CONST_END

	this.num = 0;
	this.animation = null;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Intro.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.animation = new Animation(intro_frames[this.num], this.anim_offset);
	this.redraw();
};


Intro.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

	this.clickareas = [];

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
	];
};


Intro.prototype.render = function() {
	this.animation.render();
};


Intro.prototype.update = function() {
	if(this.animation.has_stopped) {
		this.num++;
		if(this.num < 4) {
			this.animation = new Animation(intro_frames[this.num], this.anim_offset);
		}
		else {
			game.next_stage();
		}
	}
	else {
		this.animation.step();
	}
};
