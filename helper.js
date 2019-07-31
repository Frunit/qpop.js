'use strict';


// World
const WORLD_MAP = Object.freeze({
	WATER:      0,
	DESERT:     1,
	RANGONES:   2,
	BLUELEAF:   3,
	HUSHROOMS:  4,
	STINKBALLS: 5,
	SNAKEROOTS: 6,
	FIREGRASS:  7,
	MOUNTAIN:   8,
	CRATER:     9,
	HUMANS:    10,
});

// Attribute
const ATTR = Object.freeze({
	RANGONES:      0,
	BLUELEAF:      1,
	HUSHROOMS:     2,
	STINKBALLS:    3,
	SNAKEROOTS:    4,
	FIREGRASS:     5,
	REPRODUCTION:  6,
	ATTACK:        7,
	DEFENSE:       8,
	CAMOUFLAGE:    9,
	SPEED:        10,
	PERCEPTION:   11,
	INTELLIGENCE: 12,
});

// Directions
const DIR = Object.freeze({
	N: 1,
	E: 2,
	S: 3,
	W: 4,
});

// Player types
const PLAYER_TYPE = Object.freeze({
	HUMAN:    1,
	COMPUTER: 2,
	NOBODY:   3,
});

// Predators
const PRED = Object.freeze({
	DINO:     0,
	MUSHROOM: 1,
	HUMAN:    2,
});

// Living objects on survival map
const SURV_MAP = Object.freeze({
	PLACEHOLDER:  0,
	PLAYER:       1,
	PREDATOR:     2,
	ENEMY:        3,
	FEMALE:       4,
	UNRESPONSIVE: 5, // For defeated entities, offspring, etc.
});


const SCENE = Object.freeze({
	LOADING:         1,
	INTRO:           2,
	INIT:            3,
	TURN_SELECTION:  4,
	TRANS_WORLD:     5,
	WORLD:           6,
	CATASTROPHE:     7,
	RANKING:         8,
	TRANS_MUTATION:  9,
	MUTATION:       10,
	TRANS_SURVIVAL: 11,
	SURVIVAL:       12,
	OUTRO:          13,
	POPUP:          -1,
});

const placeholder = Object.freeze({
	type: SURV_MAP.PLACEHOLDER
});

const correct_world_tile = Object.freeze([0, 30, 2, 30, 29, 38, 29, 38, 1, 21, 8, 21, 29, 38, 29, 38, 28, 41, 17, 41, 37, 45, 37, 45, 28, 41, 17, 41, 37, 45, 37, 45, 4, 20, 5, 20, 18, 34, 18, 34, 7, 26, 14, 26, 18, 34, 18, 34, 28, 41, 17, 41, 37, 45, 37, 45, 28, 41, 17, 41, 37, 45, 37, 45, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 3, 30, 9, 30, 23, 38, 23, 38, 6, 21, 13, 21, 23, 38, 23, 38, 16, 41, 24, 41, 33, 45, 33, 45, 16, 41, 24, 41, 33, 45, 33, 45, 10, 20, 11, 20, 25, 34, 25, 34, 12, 26, 15, 26, 25, 34, 25, 34, 16, 41, 24, 41, 33, 45, 33, 45, 16, 41, 24, 41, 33, 45, 33, 45, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47, 31, 39, 22, 39, 42, 46, 42, 46, 19, 35, 27, 35, 42, 46, 42, 46, 36, 43, 32, 43, 44, 47, 44, 47, 36, 43, 32, 43, 44, 47, 44, 47]);


function random_element(arr) {
	// Random element of array or null if array is empty

	if(arr.length) {
		return arr[Math.floor(Math.random()*arr.length)];
	}

	return null;
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
	const idx = arr.indexOf(element);
	if(idx !== -1) {
		arr.splice(idx, 1);
	}
}


function download(data, filename, type) {
	// https://stackoverflow.com/a/30832210

	const file = new Blob([data], {type: type});
	if(window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Other browsers
		const a = document.createElement('a');
		a.href = URL.createObjectURL(file);
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(file);
		}, 0);
	}
}


function upload_dialog() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.qpp';

	input.addEventListener('change', (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.addEventListener('load', readerEvent => {
			game.load_game(readerEvent.target.result);
		});
	});

	input.click();
}


function multiline(text, maxwidth) {
	// Split a given text at spaces to limit it to maxwidth pixels
	// Returns a list where each element is one line
	const words = text.split(' ');
	const lines = [];
	let line = words[0];

	for(let n = 1; n < words.length; n++) {
		const test_line = line + ' ' + words[n];
		const width = ctx.measureText(test_line).width;
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
	}

	return lines;
}


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
	const bg = resources.get('gfx/dark_bg.png');
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
