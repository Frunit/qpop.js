'use strict';


function Load() {
	this.id = SCENE.LOAD_GAME;
	this.bg = resources.get('gfx/dark_bg.png');

	// CONST_START
	this.dim = [400, 386];
	this.title_dim = [400, 21];
	this.abort_dim = [181, 22];
	this.button_dim = [90, 22];
	this.upload_dim = [90, 66];
	this.upload_area_dim = [400, 82];
	this.upload_text_dim = [290, 66];
	this.browser_area_dim = [400, 286];

	this.offset = [120, 65];
	this.title_offset = [0, 0];
	this.abort_offset = [219, 365];
	this.saves_offset = [8, 109];
	this.upload_area_offset = [0, 20];
	this.upload_offset = [8, 28];
	this.upload_text_offset = [105, 65];
	this.browser_area_offset = [0, 101];
	this.browser_text_offset = [105, 109];

	this.button_y_dist = 25;
	this.line_height = 18;
	// CONST_END

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Load.prototype.initialize = function() {
	this.redraw();

	canvas.addEventListener('mouseup', init_upload);
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

	// Upload area
	draw_rect([this.offset[0] + this.upload_area_offset[0], this.offset[1] + this.upload_area_offset[1]], this.upload_area_dim);

	// Upload button
	draw_rect([this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim);
	let lines = multiline(lang.upload, this.upload_dim[0] - 10);
	let line_correction = this.line_height * (lines.length - 1) / 2;
	for(let i = 0; i < lines.length; i++) {
		write_text(lines[i], [this.offset[0] + this.upload_offset[0] + this.upload_dim[0]/2, this.offset[1] + this.upload_text_offset[1] - line_correction + this.line_height * i], 'white', 'black');
	}

	// Upload description text
	lines = multiline(lang.upload_description, this.upload_text_dim[0]);
	line_correction = this.line_height * (lines.length - 1) / 2;
	for(let i = 0; i < lines.length; i++) {
		write_text(lines[i], [this.offset[0] + this.upload_text_offset[0], this.offset[1] + this.upload_text_offset[1] - line_correction + this.line_height * i], 'white', 'black', 'left');
	}

	this.clickareas.push({
		x1: this.offset[0] + this.upload_offset[0],
		y1: this.offset[1] + this.upload_offset[1],
		x2: this.offset[0] + this.upload_offset[0] + this.upload_dim[0],
		y2: this.offset[1] + this.upload_offset[1] + this.upload_dim[1],
		down: () => draw_rect([this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim, true, true),
		up: () => draw_rect([this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim),
		blur: () => draw_rect([this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim)
	});

	// Browser save game list
	draw_rect([this.offset[0] + this.browser_area_offset[0], this.offset[1] + this.browser_area_offset[1]], this.browser_area_dim);
	const save_array = local_load('save');
	if(!Array.isArray(save_array) || save_array[0] === null) {
		const lines = multiline(lang.no_local_saves, this.upload_text_dim[0]);
		const line_correction = this.line_height * (lines.length - 1) / 2;
		for(let i = 0; i < lines.length; i++) {
			write_text(lines[i], [this.offset[0] + this.dim[0]/2, this.offset[1] + this.browser_area_offset[1] + this.browser_area_dim[1]/2 - line_correction + this.button_dim[1] * i], 'white', 'black');
		}
	}
	else {
		for(let i = 0; i < save_array.length; i++) {
			if(save_array[i] === null) {
				break;
			}
			// Button
			draw_rect([this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist*i], this.button_dim);
			write_text(lang.load, [this.offset[0] + this.saves_offset[0] + this.button_dim[0]/2, this.offset[1] + this.saves_offset[1] + this.button_y_dist*i + 15], 'white', 'black');

			// Description
			write_text((new Date(save_array[i].datetime)).toLocaleString() + ' - ' + lang.turn + ' ' + save_array[i].turn, [this.offset[0] + this.browser_text_offset[0], this.offset[1] + this.browser_text_offset[1] + this.button_y_dist * i + 15], 'white', 'black', 'left');

			this.clickareas.push({
				x1: this.offset[0] + this.saves_offset[0],
				y1: this.offset[1] + this.saves_offset[1] + this.button_y_dist*i,
				x2: this.offset[0] + this.saves_offset[0] + this.button_dim[0],
				y2: this.offset[1] + this.saves_offset[1] + this.button_dim[1] + this.button_y_dist*i,
				down: () => draw_rect([this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist*i], this.button_dim, true, true),
				up: () => this.load(i),
				blur: () => draw_rect([this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist*i], this.button_dim)
			});
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


Load.prototype.load = function(num) {
	canvas.removeEventListener('mouseup', init_upload);
	game.backstage = [];
	game.load_locally(num);
};


Load.prototype.close = function() {
	canvas.removeEventListener('mouseup', init_upload);
	game.stage = game.backstage.pop();
	game.stage.redraw();
};
