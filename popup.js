'use strict';

function Popup(title, image, callback, text, right_answer, left_answer) {
	this.id = SCENE.POPUP;
	this.bg = resources.get('gfx/dark_bg.png');
	this.spec_pics = resources.get('gfx/species.png');

	// CONST_START
	this.line_height = 18;
	this.max_text_width = 260;

	this.dim = [360, 150];
	this.title_dim = [361, 21];
	this.spec_dim = [64, 64];
	this.left_answer_dim = [180, 22];
	this.right_answer_dim = [181, 22];

	this.offset = [140, 165];
	this.title_offset = [0, 0];
	this.spec_offset = [21, 42];
	this.text_offset = [219, 80];
	this.left_answer_offset = [0, 128];
	this.right_answer_offset = [179, 128];
	// CONST_END

	this.title = title;
	this.text = multiline(text, this.max_text_width);
	this.right_answer = right_answer;
	this.left_answer = left_answer;
	this.callback = callback;

	this.sprite = new Sprite('gfx/species.png', this.spec_dim, anim_delays.popups, [0, 0], this.spec_positions[image]);

	this.clickareas = [];
}


Popup.prototype.spec_positions = {
	0: [[0, 0]],
	1: [[64, 0]],
	2: [[128, 0]],
	3: [[192, 0]],
	4: [[256, 0]],
	5: [[320, 0]],
	dino: [[0, 64], [64, 64]],
	chuck_berry: [[128, 64], [192, 64]],
	dino_cries: [[256, 64], [320, 64]],
};


Popup.prototype.initialize = function() {
	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	draw_black_rect([this.offset[0], this.offset[1]], [this.dim[0]-1, this.dim[1]-1]);

	this.clickareas = [];

	// Title
	draw_rect([this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
	write_text(this.title, [this.offset[0] + this.title_offset[0] + this.title_dim[0]/2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

	// Species image
	this.sprite.render(ctx, [this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1]]);

	// Text
	const line_correction = this.line_height * this.text.length / 2;
	for(let i = 0; i < this.text.length; i++) {
		write_text(this.text[i], [this.offset[0] + this.text_offset[0], this.offset[1] + this.text_offset[1] - line_correction + this.line_height * i], 'white', 'black');
	}

	// Left answer (button) if present
	if(this.left_answer !== null) {
		draw_rect([this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim);
		write_text(this.left_answer, [this.offset[0] + this.left_answer_offset[0] + this.left_answer_dim[0]/2, this.offset[1] + this.left_answer_offset[1] + 15], 'white', 'black');

		this.clickareas.push({
			x1: this.offset[0] + this.left_answer_offset[0],
			y1: this.offset[1] + this.left_answer_offset[1],
			x2: this.offset[0] + this.left_answer_offset[0] + this.left_answer_dim[0],
			y2: this.offset[1] + this.left_answer_offset[1] + this.left_answer_dim[1],
			down: () => draw_rect([this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim, true, true),
			up: () => this.clicked(1),
			blur: () => draw_rect([this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim)
		});
	}

	// Right answer (button) if present
	if(this.right_answer !== null) {
		draw_rect([this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim);
		write_text(this.right_answer, [this.offset[0] + this.right_answer_offset[0] + this.right_answer_dim[0]/2, this.offset[1] + this.right_answer_offset[1] + 15], 'white', 'black');

		this.clickareas.push({
			x1: this.offset[0] + this.right_answer_offset[0],
			y1: this.offset[1] + this.right_answer_offset[1],
			x2: this.offset[0] + this.right_answer_offset[0] + this.right_answer_dim[0],
			y2: this.offset[1] + this.right_answer_offset[1] + this.right_answer_dim[1],
			down: () => draw_rect([this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim, true, true),
			up: () => this.clicked(0),
			blur: () => draw_rect([this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim)
		});
	}
};


Popup.prototype.render = function() {
	if(this.sprite.is_new_frame()) {
		ctx.drawImage(this.bg,
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1],
			this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1]);

		this.sprite.render(ctx, [this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1]]);
	}
};


Popup.prototype.update = function() {
	this.sprite.update();
};


Popup.prototype.handle_input = function() {
	if(game.clicked_element) {
		let area = game.clicked_element;
		let pos = input.mousePos();
		if(!(pos[0] >= area.x1 && pos[0] <= area.x2 &&
			pos[1] >= area.y1 && pos[1] <= area.y2))
			{
			area.blur();
			game.clicked_element = null;
		}
	}

	if(input.isDown('MOUSE')) {
		input.reset('MOUSE');
		if(input.isDown('CLICK')) {
			input.reset('CLICK');
			let pos = input.mousePos();
			for(let area of this.clickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2)
					{
					area.down(pos[0], pos[1]);
					game.clicked_element = area;
					break;
				}
			}
		}
		else if(input.isDown('CLICKUP')) {
			input.reset('CLICKUP');
			if(game.clicked_element) {
				game.clicked_element.up();
				game.clicked_element = null;
			}
		}
		else if(input.isDown('BLUR')) {
			input.reset('BLUR');
			if(game.clicked_element) {
				game.clicked_element.blur();
				game.clicked_element = null;
			}
		}
	}

	if(input.isDown('ENTER')) {
		input.reset('ENTER');
		if(this.left_answer !== null) {
			this.clicked(1);
		}
		else {
			this.clicked(0);
		}
	}
	else if(input.isDown('ESCAPE')) {
		input.reset('ESCAPE');
		this.clicked(0);
	}
};


Popup.prototype.clicked = function(answer) {
	console.log('STAGE');
	console.log(game.stage);
	for(let i = 0; i < game.backstage.length; i++) {
		console.log('BACKSTAGE ' + i);
		console.log(game.backstage[i]);
	}

	game.stage = game.backstage.pop();
	game.stage.redraw();
	this.callback(answer);
};
