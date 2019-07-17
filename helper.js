'use strict';


// World
const WM_WATER = 0;
const WM_DESERT = 1;
const WM_RANGONES = 2;
const WM_BLUELEAF = 3;
const WM_HUSHROOMS = 4;
const WM_STINKBALLS = 5;
const WM_SNAKEROOTS = 6;
const WM_FIREGRASS = 7;
const WM_MOUNTAIN = 8;
const WM_CRATER = 9;
const WM_HUMANS = 10;

// Attribute
const ATT_RANGONES = 0;
const ATT_BLUELEAF = 1;
const ATT_HUSHROOMS = 2;
const ATT_STINKBALLS = 3;
const ATT_SNAKEROOTS = 4;
const ATT_FIREGRASS = 5;
const ATT_REPRODUCTION = 6;
const ATT_ATTACK = 7;
const ATT_DEFENSE = 8;
const ATT_CAMOUFLAGE = 9;
const ATT_SPEED = 10;
const ATT_PERCEPTION = 11;
const ATT_INTELLIGENCE = 12;

// Richtungen
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

// Spielertypen
const HUMAN = 1;
const COMPUTER = 2;
const NOBODY = 3;

// Predators
const PRED_DINO = 0;
const PRED_MUSHROOM = 1;
const PRED_HUMAN = 2;

const correct_world_tile = [0, 30, 2, 30, 29, 38, 29, 38, 1, 21, 8, 21, 29, 38, 29, 38, 28, 41, 17, 41, 37, 45, 37, 45, 28, 41, 17, 41, 37, 45, 37, 45, 4, 20, 5, 20, 18, 34, 18, 34, 7, 26, 14, 26, 18, 34, 18, 34, 28, 41, 17, 41, 37, 45, 37, 45, 28, 41, 17, 41, 37, 45, 37, 45, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 3, 30, 9, 30, 23, 38, 23, 38, 6, 21, 13, 21, 23, 38, 23, 38, 16, 41, 24, 41, 33, 45, 33, 45, 16, 41, 24, 41, 33, 45, 33, 45, 10, 20, 11, 20, 25, 34, 25, 34, 12, 26, 15, 26, 25, 34, 25, 34, 16, 41, 24, 41, 33, 45, 33, 45, 16, 41, 24, 41, 33, 45, 33, 45, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47];


function random_element(list) {
	// Random element of list
	return list[Math.floor(Math.random()*list.length)];
}


function random_int(min, max) {
	// Random number between min and max (both inclusive)
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function shuffle(arr) {
	// Shuffle array in place
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}


function range(start, end) {
	// Array with numbers from start (inclusive) to end (exclusive)
	return Array.from(new Array(end - start), (x,i) => i + start)
}


function remove_from_array(arr, element) {
	// Remove element from arr
	let idx = arr.indexOf(element);
	if(idx !== -1) {
		arr.splice(idx, 1);
	}
}


function multiline(text, maxwidth) {
	// Split a given text at spaces to limit it to maxwidth pixels
	// Returns a list where each element is one line
	let words = text.split(' ');
	let line = words[0];
	let lines = [];

	for(let n = 1; n < words.length; n++) {
		let test_line = line + ' ' + words[n];
		let width = ctx.measureText(test_line).width;
		if(width > maxwidth) {
			lines.push(line);
			line = words[n];
		}
		else {
			line = test_line;
		}

	}

	if(line) {
		lines.push(line);
	};

	return lines;
};


function write_text(text, pos, fg='#000000', bg='#ffffff', align='center') {
	ctx.save();
	ctx.textAlign = align;
	if(bg) {
		ctx.fillStyle = bg;
		ctx.fillText(text, pos[0]+1, pos[1]+1);
	}
	ctx.fillStyle = fg;
	ctx.fillText(text, pos[0], pos[1]);
	ctx.restore();
}

function draw_base() {
	let bg = resources.get('gfx/dark_bg.png');
	ctx.drawImage(bg, 0, 0);
	ctx.save();
	ctx.beginPath();
	ctx.rect(0.5, 0.5, canvas.width-1, canvas.height-1);
    ctx.strokeStyle = '#000000';
    ctx.stroke();
	ctx.restore();

	draw_rect([0, 0], [22, 21]);
	draw_rect([21, 0], [619, 21]);

	write_text(lang.title + ' ' + version, [320, 15], 'white', 'black');
}

function draw_black_rect(pos, dim, fill=false) {
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.rect(pos[0], pos[1], dim[0], dim[1]);
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	if(fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	ctx.restore();
}

function draw_rect(pos, dim, black_line=true, clicked=false) {
	dim = [dim[0] - 1, dim[1] - 1];
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	if(black_line) {
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(pos[0], pos[1], dim[0], dim[1]);
		ctx.beginPath();
		pos = [pos[0] + 1, pos[1] + 1];
		dim = [dim[0] - 2, dim[1] - 2];
	}

	ctx.strokeStyle = clicked ? '#828282' : '#c3c3c3';
	ctx.beginPath();
	ctx.moveTo(pos[0] + dim[0] - 1, pos[1]);
	ctx.lineTo(pos[0], pos[1]);
	ctx.lineTo(pos[0], pos[1] + dim[1] - 2);
	ctx.lineTo(pos[0]+1, pos[1] + dim[1] - 2);
	ctx.lineTo(pos[0]+1, pos[1]+1);
	ctx.lineTo(pos[0] + dim[0] - 2, pos[1]+1);
	ctx.stroke();

	ctx.strokeStyle = clicked ? '#c3c3c3' : '#828282';
	ctx.beginPath();
	ctx.moveTo(pos[0] + dim[0], pos[1]);
	ctx.lineTo(pos[0] + dim[0], pos[1] + dim[1]);
	ctx.lineTo(pos[0], pos[1] + dim[1]);
	ctx.lineTo(pos[0], pos[1] + dim[1] - 1);
	ctx.lineTo(pos[0] + dim[0] - 1, pos[1] + dim[1] - 1);
	ctx.lineTo(pos[0] + dim[0] - 1, pos[1] + 1);
	ctx.stroke();

	ctx.restore();
}

function draw_inv_rect(pos, dim, black_line=true) {
	dim = [dim[0] - 1, dim[1] - 1];
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	if(black_line) {
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(pos[0], pos[1], dim[0], dim[1]);
		pos = [pos[0] - 1, pos[1] - 1];
		dim = [dim[0] + 2, dim[1] + 2];
	}

	ctx.strokeStyle = '#828282';
	ctx.beginPath();
	ctx.moveTo(pos[0] + dim[0], pos[1]);
	ctx.lineTo(pos[0], pos[1]);
	ctx.lineTo(pos[0], pos[1] + dim[1] - 1);
	ctx.lineTo(pos[0] - 1, pos[1] + dim[1] - 1);
	ctx.lineTo(pos[0] - 1, pos[1] - 1);
	ctx.lineTo(pos[0] + dim[0] + 1, pos[1] - 1);
	ctx.stroke();

	ctx.strokeStyle = '#ffffff';
	ctx.beginPath();
	ctx.moveTo(pos[0] + dim[0], pos[1]);
	ctx.lineTo(pos[0] + dim[0], pos[1] + dim[1]);
	ctx.lineTo(pos[0] - 1, pos[1] + dim[1]);
	ctx.lineTo(pos[0] - 1, pos[1] + dim[1] + 1);
	ctx.lineTo(pos[0] + dim[0] + 1, pos[1] + dim[1] + 1);
	ctx.lineTo(pos[0] + dim[0] + 1, pos[1] - 1);
	ctx.stroke();

	ctx.restore();
}

function subtitle(x, y, text) {
	const radius = 5;
	const height = 30;

	ctx.save();
	ctx.font = (height - 10) + 'px sans-serif';
	ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
	ctx.translate(0.5, 0.5);
	ctx.beginPath();

	const width = ctx.measureText(text).width + 10;

	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	//ctx.closePath();
	ctx.fill();

	ctx.fillStyle = "#ffffff";
	ctx.textBaseline = "bottom";
	ctx.fillText(text, x + 5, y + height - 5)

	ctx.restore();
}


function open_popup(title, image, text, callback, right_answer, left_answer=null) {
	// The callback function will be invoked with 1 when the *left* button was clicked and with 0 when the *right* button was clicked.
	game.backstage.push(game.stage);
	game.stage = new Popup(title, image, callback, text, right_answer, left_answer);
	game.stage.initialize();
}


function Popup(title, image, callback, text, right_answer, left_answer) {
	this.line_height = 18;
	this.max_text_width = 260;

	this.title = title;
	this.text = multiline(text, this.max_text_width);
	this.right_answer = right_answer;
	this.left_answer = left_answer;
	this.callback = callback;
	this.bg = resources.get('gfx/dark_bg.png');
	this.spec_pics = resources.get('gfx/species.png');
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

	this.sprite = new Sprite('gfx/species.png', this.spec_dim, [0, 0], 2, this.spec_positions[image]);

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
	let line_correction = this.line_height * this.text.length / 2;
	for(let i = 0; i < this.text.length; i++){
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
	};
};


Popup.prototype.update = function(dt) {
	this.sprite.update(dt);
	this.handle_input(dt);
};


Popup.prototype.handle_input = function(dt) {
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
		input.reset('MOUSE')
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
			input.reset('BLUR')
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
