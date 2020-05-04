'use strict';

function Options() {
	this.id = SCENE.OPTIONS;
	this.gui1 = resources.get('gfx/gui.png');
	this.gui2 = resources.get('gfx/mutations.png');

	// CONST_START
	this.close_dim = [181, 22];

	this.close_offset = [459, 458];

	this.max_text_width = 600;
	this.line_height = 20;
	// CONST_END

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


	const test_text = [
		'[_] Sound',
		'<=========       >',
		'',
		'[_] Music',
		'<================>',
		'',
		'[Language: DE]',
		'',
		'[ 4] Enemy speed on world map (maybe ruler)',
		'[X]  Auto continue after enemy placement on world map',
		'[36] Transition delay',
		'[X] Show distribution on plants in mutation screen',
		'[_] Click and hold to place or remove units from world map',
		'[_] Show number of victories against predators in survival',
		'[_] Show debugging info in the browser console',
		'',
		'[Copy the original Q-Pop as closely as possible]',
	];

	for(let i = 0; i < test_text.length; i++) {
		write_text(test_text[i], [30, 50 + this.line_height * i], '#000000', '#ffffff', 'left');
	}


	this.keys = [
		{'key': 'ENTER', 'action': () => this.close(), 'reset': true},
	];
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
