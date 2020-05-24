'use strict';


// TODO: LocalStorage save games must be clickable (and, hence, loadable)
// TODO: A save game file must be uploadable


function Load() {
	this.id = SCENE.LOAD_GAME;
	this.bg = resources.get('gfx/dark_bg.png');

	// CONST_START
	this.dim = [460, 350];
	this.title_dim = [460, 21];
	this.abort_dim = [181, 22];
	this.button_dim = [250, 22];

	this.offset = [90, 75];
	this.title_offset = [0, 0];
	this.abort_offset = [279, 328];
	this.saves_offset = [8, 37];
	// CONST_END

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Load.prototype.initialize = function() {
	this.redraw();
};


Load.prototype.redraw = function() {
	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	draw_rect([this.offset[0], this.offset[1] + this.title_dim[1] - 1], [this.dim[0], this.dim[1] - this.title_dim[1] + 1], true);

	this.clickareas = [];

	// Title
	draw_rect([this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
	write_text(lang.load_game, [this.offset[0] + this.title_offset[0] + this.title_dim[0]/2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

	// Browser save game list
	let save_array = localStorage.getItem('save');
	if(save_array === null) {
		save_array = [];
		const lines = multiline(lang.no_local_saves, this.button_dim[0]);
		for(let i = 0; i < lines.length; i++) {
			write_text(lines[i], [this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_dim[1] * i], 'white', 'black', 'left');
		}
	}
	else {
		save_array = JSON.parse(save_array);

		for(let i = 0; i < save_array.length; i++) {
			if(save_array[i] === null) {
				break;
			}
			draw_rect([this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + (this.button_dim[1] + 3)*i], this.button_dim);
			write_text((new Date(save_array[i].datetime)).toLocaleString(), [this.offset[0] + this.saves_offset[0] + this.button_dim[0]/2, this.offset[1] + this.saves_offset[1] + (this.button_dim[1] + 3) * i + 15], 'white', 'black');
		}
	}

	// Abort button
	draw_rect([this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim);
	write_text(lang.close, [this.offset[0] + this.abort_offset[0] + this.abort_dim[0]/2, this.offset[1] + this.abort_offset[1] + 15], 'white', 'black');

	this.clickareas.push({
		x1: this.offset[0] + this.abort_offset[0],
		y1: this.offset[1] + this.abort_offset[1],
		x2: this.offset[0] + this.abort_offset[0] + this.abort_dim[0],
		y2: this.offset[1] + this.abort_offset[1] + this.abort_dim[1],
		down: () => draw_rect([this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim, true, true),
		up: () => this.close(),
		blur: () => draw_rect([this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim)
	});

	// Grey border
	draw_upper_left_border([this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim);


	this.keys = [
		{'key': 'ENTER', 'action': () => this.close(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.close(), 'reset': true},
	];
};


Load.prototype.render = function() {

};


Load.prototype.update = function() {

};


Load.prototype.close = function() {
	game.stage = game.backstage.pop();
	game.stage.redraw();
};
