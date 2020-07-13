'use strict';


function Tutorial(tut) {
	this.id = SCENE.TUTORIAL;
	this.bg = resources.get('gfx/dark_bg.png');
	this.gfx = resources.get('gfx/tutorial.png');

	// CONST_START
	this.line_height = 18;
	this.max_text_width = 260;

	this.title_dim = [360, 21];
	this.spec_dim = [34, 79];
	this.abort_dim = [180, 22];
	this.continue_dim = [181, 22];

	this.title_offset = [0, 0];
	this.spec_offset = [35, 45];
	this.text_offset = [89, 50];
	this.abort_offset = [0, 128];
	this.continue_offset = [179, 128];

	this.spec_soffset = [0, 0];
	// CONST_END

	this.textname = tut.name;
	this.offset = tut.pos;
	this.arrows = tut.arrows;
	this.low_anchor = !!tut.low_anchor;

	this.dim = [360, 250]; // Can be changed depending on number of lines
	this.arrow_soffsets = [[34, 0], [34, 30], [34, 47], [34, 77]];
	this.arrow_dims = [[17, 30], [30, 17], [17, 30], [30, 17]];

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Tutorial.prototype.initialize = function() {
	this.redraw();
};


Tutorial.prototype.redraw = function() {
	const text = multiline(lang.tutorial[this.textname], this.max_text_width);
	this.dim[1] = 2*this.title_dim[1] + 2*this.continue_dim[1] + Math.max(text.length * this.line_height, this.spec_dim[1]);

	if(this.low_anchor) {
		this.offset[1] -= this.dim[1];
		this.low_anchor = false; // Otherwise, the operation is rerun when redrawing
	}

	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	draw_rect([this.offset[0], this.offset[1] + this.title_dim[1] - 1], [this.dim[0], this.dim[1] - this.title_dim[1] - this.continue_dim[1] + 2], true);

	this.clickareas = [];

	// Title
	draw_rect([this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
	write_text(lang.tutorial_title, [this.offset[0] + this.title_offset[0] + this.title_dim[0]/2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

	// Text
	for(let i = 0; i < text.length; i++) {
		write_text(text[i], [this.offset[0] + this.text_offset[0], this.offset[1] + this.text_offset[1] + this.line_height * i], 'white', 'black', 'left');
	}

	// Species image
	ctx.drawImage(this.gfx,
		this.spec_soffset[0], this.spec_soffset[1],
		this.spec_dim[0], this.spec_dim[1],
		this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1],
		this.spec_dim[0], this.spec_dim[1]);

	// Abort
	draw_rect([this.offset[0] + this.abort_offset[0], this.offset[1] + this.dim[1] - this.abort_dim[1]], this.abort_dim);
	write_text(lang.tutorial_abort, [this.offset[0] + this.abort_offset[0] + this.abort_dim[0]/2, this.offset[1] + this.dim[1] - this.abort_dim[1] + 15], 'white', 'black');

	this.clickareas.push({
		x1: this.offset[0] + this.abort_offset[0],
		y1: this.offset[1] + this.dim[1] - this.abort_dim[1],
		x2: this.offset[0] + this.abort_offset[0] + this.abort_dim[0],
		y2: this.offset[1] + this.dim[1],
		down: () => draw_rect([this.offset[0] + this.abort_offset[0], this.offset[1] + this.dim[1] - this.abort_dim[1]], this.abort_dim, true, true),
		up: () => this.next(true),
		blur: () => this.redraw()
	});

	// Continue
	draw_rect([this.offset[0] + this.continue_offset[0], this.offset[1] + this.dim[1] - this.continue_dim[1]], this.continue_dim);
	write_text(lang.next, [this.offset[0] + this.continue_offset[0] + this.continue_dim[0]/2, this.offset[1] + this.dim[1] - this.continue_dim[1] + 15], 'white', 'black');

	this.clickareas.push({
		x1: this.offset[0] + this.continue_offset[0],
		y1: this.offset[1] + this.dim[1] - this.continue_dim[1],
		x2: this.offset[0] + this.continue_offset[0] + this.continue_dim[0],
		y2: this.offset[1] + this.dim[1],
		down: () => draw_rect([this.offset[0] + this.continue_offset[0], this.offset[1] + this.dim[1] - this.continue_dim[1]], this.continue_dim, true, true),
		up: () => this.next(),
		blur: () => this.redraw()
	});

	// Arrows
	for(let arrow of this.arrows) {
		switch(arrow.dir) {
			case DIR.N:
				ctx.drawImage(this.gfx,
					this.arrow_soffsets[0][0], this.arrow_soffsets[0][1],
					this.arrow_dims[0][0], this.arrow_dims[0][1],
					this.offset[0] + arrow.offset, this.offset[1] - this.arrow_dims[0][1] + 3,
					this.arrow_dims[0][0], this.arrow_dims[0][1]);
				break;
			case DIR.E:
				ctx.drawImage(this.gfx,
					this.arrow_soffsets[1][0], this.arrow_soffsets[1][1],
					this.arrow_dims[1][0], this.arrow_dims[1][1],
					this.offset[0] + this.dim[0] - 3, this.offset[1] + arrow.offset,
					this.arrow_dims[1][0], this.arrow_dims[1][1]);
				break;
			case DIR.S:
				ctx.drawImage(this.gfx,
					this.arrow_soffsets[2][0], this.arrow_soffsets[2][1],
					this.arrow_dims[2][0], this.arrow_dims[2][1],
					this.offset[0] + arrow.offset, this.offset[1] + this.dim[1] - 3,
					this.arrow_dims[2][0], this.arrow_dims[2][1]);
				break;
			case DIR.W:
				ctx.drawImage(this.gfx,
					this.arrow_soffsets[3][0], this.arrow_soffsets[3][1],
					this.arrow_dims[3][0], this.arrow_dims[3][1],
					this.offset[0] - this.arrow_dims[3][0] + 3, this.offset[1] + arrow.offset,
					this.arrow_dims[3][0], this.arrow_dims[3][1]);
				break;
		}
	}

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.next(true), 'reset': true},
	];
};


Tutorial.prototype.render = function() {

};


Tutorial.prototype.update = function() {

};


Tutorial.prototype.next = function(abort=false) {
	if(abort) {
		options.tutorial = false;
		local_save('tutorial', false);
	}
	game.stage = game.backstage.pop();
	game.stage.redraw();
	game.tutorial();
};
