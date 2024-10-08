'use strict';


// World
const WORLD_MAP = Object.freeze({
	WATER:      0,
	RANGONES:   1,
	BLUELEAF:   2,
	HUSHROOMS:  3,
	STINKBALLS: 4,
	SNAKEROOTS: 5,
	FIREGRASS:  6,
	DESERT:     7,
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
	X: 0,
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

// Predators
const SPECIES = Object.freeze({
	PURPLUS:      0,
	KIWIOPTERYX:  1,
	PESCIODYPHUS: 2,
	ISNOBUG:      3,
	AMORPH:       4,
	CHUCKBERRY:   5,
});

// Living objects on survival map
const SURV_MAP = Object.freeze({
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
	RANKING:         7,
	TRANS_MUTATION:  8,
	MUTATION:        9,
	TRANS_SURVIVAL: 10,
	SURVIVAL:       11,
	OUTRO:          12,
	POPUP:          20,
	CATASTROPHE:    21,
	TUTORIAL:       22,
	CREDITS:        30,
	OPTIONS:        31,
	LOAD_GAME:      32,
});

const correct_world_tile = Object.freeze([0, 30, 2, 30, 29, 38, 29, 38, 1, 21, 8, 21, 29, 38, 29, 38, 28, 40, 17, 40, 37, 44, 37, 44, 28, 40, 17, 40, 37, 44, 37, 44, 4, 20, 5, 20, 18, 34, 18, 34, 7, 26, 14, 26, 18, 34, 18, 34, 28, 40, 17, 40, 37, 44, 37, 44, 28, 40, 17, 40, 37, 44, 37, 44, 31, 39, 22, 39, 41, 45, 41, 45, 19, 35, 27, 35, 41, 45, 41, 45, 36, 42, 32, 42, 43, 46, 43, 46, 36, 42, 32, 42, 43, 46, 43, 46, 31, 39, 22, 39, 41, 45, 41, 45, 19, 35, 27, 35, 41, 45, 41, 45, 36, 42, 32, 42, 43, 46, 43, 46, 36, 42, 32, 42, 43, 46, 43, 46, 3, 30, 9, 30, 23, 38, 23, 38, 6, 21, 13, 21, 23, 38, 23, 38, 16, 40, 24, 40, 33, 44, 33, 44, 16, 40, 24, 40, 33, 44, 33, 44, 10, 20, 11, 20, 25, 34, 25, 34, 12, 26, 15, 26, 25, 34, 25, 34, 16, 40, 24, 40, 33, 44, 33, 44, 16, 40, 24, 40, 33, 44, 33, 44, 31, 39, 22, 39, 41, 45, 41, 45, 19, 35, 27, 35, 41, 45, 41, 45, 36, 42, 32, 42, 43, 46, 43, 46, 36, 42, 32, 42, 43, 46, 43, 46, 31, 39, 22, 39, 41, 45, 41, 45, 19, 35, 27, 35, 41, 45, 41, 45, 36, 42, 32, 42, 43, 46, 43, 46, 36, 42, 32, 42, 43, 46, 43, 46]);


function random_element(arr) {
	// Random element of array or null if array is empty

	if(arr.length) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	return null;
}


function pop_random_element(arr) {
	// Return and remove a random element from arr
	if(arr.length === 0) {
		return null;
	}

	const idx = Math.floor(Math.random() * arr.length);
	const elem = arr[idx];
	arr.splice(idx, 1);

	return elem;
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
	return Array.from(new Array(end - start), (x,i) => i + start);
}


function parse_bool(s) {
	// Try to parse a string for boolean-like values.
	// Following reasoning:
	// Language | trueish | falseish
	// num      |       1 | 0
	// geek ;)  |    true | false
	// Czech    |     ano | ne
	// German   |      ja | nein
	// English  |     yes | no
	// Spanish  |      sí | non
	// French   |     oui | non
	// Italian  |      sì | non
	// Russian  |      da | nyet
	// So if the string starts with a 0, f, or n, it is negative. Any other start
	// is supposed to be positive. Sorry for Greek users, where "nai" is "yes"!

	if(!s || '0fn'.includes(s[0].toLowerCase())) {
		return false;
	}

	return true;
}


function clamp(num, min, max) {
	// Ensure num is between min and max (both inclusive)
	return num <= min ? min : (num >= max ? max : num);
}


function download(data, filename, type) {
	// https://stackoverflow.com/a/30832210

	const file = new Blob([data], {type: type});
	if(window.navigator.msSaveOrOpenBlob) { // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	}
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


function multiline(text, maxwidth) {
	// Split a given text at spaces to limit it to maxwidth pixels
	// Returns a list where each element is one line
	const words = text.split(' ');
	const lines = [];
	let line = words[0];

	// Japanese does not use spaces
	const space = options.language === 'JA' ? '' : ' ';

	for(let n = 1; n < words.length; n++) {
		const test_line = line + space + words[n];
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
	if (options.language === 'JA') {
		// Special rule for Japanese, that doesn't really use spaces, but I added
		// spaces to have some clear indicators for where a line break would be possible
		text = text.replaceAll(' ', '');
	}
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
	const gui = resources.get('gfx/gui.png');
	ctx.drawImage(bg, 0, 0);
	ctx.save();
	ctx.beginPath();
	ctx.rect(0.5, 0.5, canvas.width-1, canvas.height-1);
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.restore();

	// Info
	draw_rect([0, 0], [22, 21]);
	if(game.stage.id === SCENE.CREDITS) {
		ctx.drawImage(gui, 12, 0, 12, 12, 5, 4, 12, 12);
	}
	else {
		ctx.drawImage(gui, 0, 0, 12, 12, 5, 4, 12, 12);
	}

	// Middle
	draw_rect([21, 0], [525, 21]);
	write_text(lang.title + ' v' + version.join('.'), [320, 14], 'white', 'black');

	// Language
	draw_rect([545, 0], [32, 21]);
	write_text(options.language, [561, 14], 'white', 'black');

	// Sound
	draw_rect([576, 0], [22, 21]);
	ctx.drawImage(gui, 24, 0, 12, 12, 581, 4, 12, 12);
	if(!options.sound_on) {
		ctx.drawImage(gui, 72, 0, 12, 12, 581, 4, 12, 12);
	}

	// Music
	draw_rect([597, 0], [22, 21]);
	ctx.drawImage(gui, 36, 0, 12, 12, 602, 4, 12, 12);
	if(!options.music_on) {
		ctx.drawImage(gui, 72, 0, 12, 12, 602, 4, 12, 12);
	}

	// Settings
	draw_rect([618, 0], [22, 21]);
	if(game.stage.id === SCENE.OPTIONS) {
		ctx.drawImage(gui, 60, 0, 12, 12, 623, 4, 12, 12);
	}
	else {
		ctx.drawImage(gui, 48, 0, 12, 12, 623, 4, 12, 12);
	}
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


function draw_rect(pos, dim, black_line=true, clicked=false, light=false) {
	dim = [dim[0] - 1, dim[1] - 1];
	ctx.save();
	ctx.translate(1, 1);
	ctx.lineWidth = 1;
	if(black_line) {
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(pos[0], pos[1], dim[0], dim[1]);
		ctx.beginPath();
		pos = [pos[0] + 1, pos[1] + 1];
		dim = [dim[0] - 2, dim[1] - 2];
	}

	ctx.strokeStyle = light ? '#ffffff' : (clicked ? '#828282' : '#c3c3c3');
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


function draw_upper_left_border(pos, dim) {
	ctx.save();
	ctx.translate(-1, -1);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#828282';
	ctx.beginPath();
	ctx.moveTo(pos[0], pos[1] + dim[1]);
	ctx.lineTo(pos[0], pos[1]);
	ctx.lineTo(pos[0] + dim[0], pos[1]);
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


function draw_checkbox(pos, checked) {
	draw_inv_rect(pos, [14, 14], true);
	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(pos[0] + 1, pos[1] + 1, 12, 12);
	ctx.restore();
	if(checked) {
		ctx.drawImage(resources.get('gfx/gui.png'),
			72, 0,
			12, 12,
			pos[0] + 1, pos[1] + 1,
			12, 12);
	}
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
	ctx.fillText(text, x + 5, y + height - 5);

	ctx.restore();
}


function open_popup(title, image, text, callback, right_answer, left_answer=null) {
	// The callback function will be invoked with 1 when the *left* button was clicked and with 0 when the *right* button was clicked.
	game.backstage.push(game.stage);
	game.stage = new Popup(title, image, callback, text, right_answer, left_answer);
	game.stage.initialize();
}


function open_tutorial(tutorial) {
	// Highlight
	ctx.save();
	ctx.translate(0.5, 0,5);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	if(tutorial.highlight[0] !== 0) {
		ctx.fillRect(0, tutorial.highlight[1], tutorial.highlight[0], tutorial.highlight[3] - tutorial.highlight[1]);
	}
	if(tutorial.highlight[1] !== 0) {
		ctx.fillRect(0, 0, 640, tutorial.highlight[1]);
	}
	if(tutorial.highlight[2] !== 640) {
		ctx.fillRect(tutorial.highlight[2], tutorial.highlight[1], 640 - tutorial.highlight[2], tutorial.highlight[3] - tutorial.highlight[1]);
	}
	if(tutorial.highlight[3] !== 480) {
		ctx.fillRect(0, tutorial.highlight[3], 640, 480 - tutorial.highlight[3]);
	}
	ctx.restore();

	game.backstage.push(game.stage);
	game.stage = new Tutorial(tutorial);
	game.stage.initialize();
}


function open_load_dialog() {
	game.backstage.push(game.stage);
	game.stage = new Load();
	game.stage.initialize();
}


function init_upload(e) {
	const pos_x = e.x - canvas_pos.left;
	const pos_y = e.y - canvas_pos.top;

	// Remember to update the values here when they change in Load
	if(pos_x >= 120 + 8 &&
		pos_x <= 120 + 8 + 90 &&
		pos_y >= 65 + 28 &&
		pos_y <= 65 + 28 + 66)
	{
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.qpp';

		input.addEventListener('change', (event) => {
			canvas.removeEventListener('mouseup', init_upload);
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.addEventListener('load', readerEvent => {
				game.load_game(readerEvent.target.result);
			});
		});

		input.click();
	}
}


function local_save(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	}
	catch (e) {
		return false;
	}

	return true;
}


function local_load(key) {
	try {
		return JSON.parse(localStorage.getItem(key));
	}
	catch (e) {
		return null;
	}
}


function handle_visibility_change() {
	if(game === undefined) {
		return;
	}

	game.toggle_pause(document.hidden);

}


/**
 * If "lang[uage]" is defined and set to a supported language, use that language.
 * Otherwise try to determine the browser language. Otherwise default to English.
 */
function determineBestLanguage(search_params) {
	const preferredManual = search_params.get('lang') || search_params.get('language') || local_load('language');
	const preferred = preferredManual ? [preferredManual] : navigator.languages;

	const available = new Set(Object.keys(i18n));

	for (const candidate of preferred) {
		const upperCandidate = candidate.toUpperCase();
		if (available.has(upperCandidate)) {
			return upperCandidate;
		}
		if (available.has(upperCandidate.substring(0, 2))) {
			return upperCandidate.substring(0, 2);
		}
	}

	return 'EN';
}
