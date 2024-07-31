import { Game } from './game';
import { Load } from './load';
import { Popup } from './popup';
import type { ResourceManager } from './resources';
import { Tutorial } from './tutorial';
import { Dimension, Point, TechGlobal, TutorialType } from './types';
import { version } from './version';

// World
export const enum WORLD_MAP {
	WATER = 0,
	RANGONES = 1,
	BLUELEAF = 2,
	HUSHROOMS = 3,
	STINKBALLS = 4,
	SNAKEROOTS = 5,
	FIREGRASS = 6,
	DESERT = 7,
	MOUNTAIN = 8,
	CRATER = 9,
	HUMANS = 10,
}

// Attribute
export const enum ATTR {
	RANGONES = 0,
	BLUELEAF = 1,
	HUSHROOMS = 2,
	STINKBALLS = 3,
	SNAKEROOTS = 4,
	FIREGRASS = 5,
	REPRODUCTION = 6,
	ATTACK = 7,
	DEFENSE = 8,
	CAMOUFLAGE = 9,
	SPEED = 10,
	PERCEPTION = 11,
	INTELLIGENCE = 12,
}

// Directions
export const enum DIR {
	X = 0,
	N = 1,
	E = 2,
	S = 3,
	W = 4,
}

// Player types
export const enum PLAYER_TYPE {
	HUMAN = 1,
	COMPUTER = 2,
	NOBODY = 3,
}

// Predators
export const enum PRED {
	DINO = 0,
	MUSHROOM = 1,
	HUMAN = 2,
}

// Predators
export const enum SPECIES {
	PURPLUS = 0,
	KIWIOPTERYX = 1,
	PESCIODYPHUS = 2,
	ISNOBUG = 3,
	AMORPH = 4,
	CHUCKBERRY = 5,
}

// Living objects on survival map
export const enum SURV_MAP {
	PLAYER = 1,
	PREDATOR = 2,
	ENEMY = 3,
	FEMALE = 4,
	UNRESPONSIVE = 5, // For defeated entities, offspring, etc.
}

export const enum SCENE {
	LOADING = 1,
	INTRO = 2,
	INIT = 3,
	TURN_SELECTION = 4,
	TRANS_WORLD = 5,
	WORLD = 6,
	RANKING = 7,
	TRANS_MUTATION = 8,
	MUTATION = 9,
	TRANS_SURVIVAL = 10,
	SURVIVAL = 11,
	OUTRO = 12,
	POPUP = 20,
	CATASTROPHE = 21,
	TUTORIAL = 22,
	CREDITS = 30,
	OPTIONS = 31,
	LOAD_GAME = 32,
}

/**
 * Random element of `arr` or throws if array is empty
 *
 * @param arr - the array to choose from
 * @returns a random element of the given array
 */
export function random_element<T>(arr: T[]): T {
	if (arr.length) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	throw new Error('Array must not be empty!');
}

/**
 * Return and remove a random element of `arr` or throws if array is empty
 *
 * @param arr - the array to pop from
 * @returns a random element of the given array
 */
export function pop_random_element<T>(arr: T[]): T {
	// Return and remove a random element from arr
	if (arr.length === 0) {
		throw new Error('Array must not be empty!');
	}

	const idx = Math.floor(Math.random() * arr.length);
	const elem = arr[idx];
	arr.splice(idx, 1);

	return elem;
}

/**
 * Random number (float) between `min` and `max` (both inclusive)
 *
 * @param min - the minimum number
 * @param max - the maximum number
 * @returns a random number (float)
 */
export function random_int(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle array in place
 *
 * @param arr - the array to shuffle
 */
export function shuffle<T>(arr: T[]): void {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

/**
 * Creates an array with numbers from start (inclusive) to end (exclusive)
 *
 * @param start - the first number in the resulting array
 * @param end - the number before this number will be the last in the array
 * @returns an array with numbers from start (inclusive) to end (exclusive)
 */
export function range(start: number, end: number): number[] {
	return Array.from(new Array(end - start), (x, i) => i + start);
}

export function parse_bool(s: string | null): boolean {
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

	if (!s || '0fn'.includes(s[0].toLowerCase())) {
		return false;
	}

	return true;
}

/**
 * Ensure num is between min and max (both inclusive)
 *
 * @param num - the number to clamp
 * @param min - the smallest allowed value
 * @param max - the highest allowed value
 * @returns the clamped number
 */
export function clamp(num: number, min: number, max: number): number {
	return num <= min ? min : num >= max ? max : num;
}

export function download(data: ArrayBuffer, filename: string, type: string = 'application/octet-stream') {
	// https://stackoverflow.com/a/30832210

	console.log('03 Initializing download');

	const file = new Blob([data], { type: type });
	console.log('04 non-IE download');
	const a = document.createElement('a');
	a.href = URL.createObjectURL(file);
	a.download = filename;
	document.body.appendChild(a);
	console.log('05 Link created');
	a.click();
	console.log('06 Link clicked');
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(a.href);
		console.log('07 Link removed');
	}, 0);
}

export function multiline(ctx: CanvasRenderingContext2D, text: string, maxwidth: number): string[] {
	// Split a given text at spaces to limit it to maxwidth pixels
	// Returns a list where each element is one line
	const words = text.split(' ');
	const lines = [];
	let line = words[0];

	for (let n = 1; n < words.length; n++) {
		const test_line = `${line} ${words[n]}`;
		const width = ctx.measureText(test_line).width;
		if (width > maxwidth) {
			lines.push(line);
			line = words[n];
		} else {
			line = test_line;
		}
	}

	if (line) {
		lines.push(line);
	}

	return lines;
}

export function write_text(
	ctx: CanvasRenderingContext2D,
	text: string,
	pos: Point,
	fg = '#000000',
	bg = '#ffffff',
	align: CanvasTextAlign = 'center',
) {
	ctx.save();
	ctx.textAlign = align;
	if (bg) {
		ctx.fillStyle = bg;
		ctx.fillText(text, pos[0] + 1, pos[1] + 1);
	}
	ctx.fillStyle = fg;
	ctx.fillText(text, pos[0], pos[1]);
	ctx.restore();
}

export function draw_base(glob: TechGlobal, stage_id: SCENE) {
	const bg = glob.resources.get_image('gfx/dark_bg.png');
	const gui = glob.resources.get_image('gfx/gui.png');
	glob.ctx.drawImage(bg, 0, 0);
	glob.ctx.save();
	glob.ctx.beginPath();
	glob.ctx.rect(0.5, 0.5, glob.canvas.width - 1, glob.canvas.height - 1);
	glob.ctx.strokeStyle = '#000000';
	glob.ctx.stroke();
	glob.ctx.restore();

	// Info/Credits
	draw_rect(glob.ctx, [0, 0], [22, 21]);
	if (stage_id === SCENE.CREDITS) {
		glob.ctx.drawImage(gui, 12, 0, 12, 12, 5, 4, 12, 12);
	} else {
		glob.ctx.drawImage(gui, 0, 0, 12, 12, 5, 4, 12, 12);
	}

	// Middle
	draw_rect(glob.ctx, [21, 0], [525, 21]);
	write_text(glob.ctx, `${glob.lang.title} v${version.join('.')}`, [320, 14], 'white', 'black');

	// Language
	draw_rect(glob.ctx, [545, 0], [32, 21]);
	write_text(glob.ctx, glob.options.language, [561, 14], 'white', 'black');

	// Sound
	draw_rect(glob.ctx, [576, 0], [22, 21]);
	glob.ctx.drawImage(gui, 24, 0, 12, 12, 581, 4, 12, 12);
	if (!glob.options.sound_on) {
		glob.ctx.drawImage(gui, 72, 0, 12, 12, 581, 4, 12, 12);
	}

	// Music
	draw_rect(glob.ctx, [597, 0], [22, 21]);
	glob.ctx.drawImage(gui, 36, 0, 12, 12, 602, 4, 12, 12);
	if (!glob.options.music_on) {
		glob.ctx.drawImage(gui, 72, 0, 12, 12, 602, 4, 12, 12);
	}

	// Settings
	draw_rect(glob.ctx, [618, 0], [22, 21]);
	if (stage_id === SCENE.OPTIONS) {
		glob.ctx.drawImage(gui, 60, 0, 12, 12, 623, 4, 12, 12);
	} else {
		glob.ctx.drawImage(gui, 48, 0, 12, 12, 623, 4, 12, 12);
	}
}

export function draw_black_rect(ctx: CanvasRenderingContext2D, pos: Point, dim: Dimension, fill = '') {
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.rect(pos[0], pos[1], dim[0], dim[1]);
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	ctx.restore();
}

export function draw_rect(ctx: CanvasRenderingContext2D, pos: Point, dim: Dimension, black_line = true, clicked = false, light = false) {
	dim = [dim[0] - 1, dim[1] - 1];
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	if (black_line) {
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(pos[0], pos[1], dim[0], dim[1]);
		ctx.beginPath();
		pos = [pos[0] + 1, pos[1] + 1];
		dim = [dim[0] - 2, dim[1] - 2];
	}

	ctx.strokeStyle = light ? '#ffffff' : clicked ? '#828282' : '#c3c3c3';
	ctx.beginPath();
	ctx.moveTo(pos[0] + dim[0] - 1, pos[1]);
	ctx.lineTo(pos[0], pos[1]);
	ctx.lineTo(pos[0], pos[1] + dim[1] - 2);
	ctx.lineTo(pos[0] + 1, pos[1] + dim[1] - 2);
	ctx.lineTo(pos[0] + 1, pos[1] + 1);
	ctx.lineTo(pos[0] + dim[0] - 2, pos[1] + 1);
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

export function draw_upper_left_border(ctx: CanvasRenderingContext2D, pos: Point, dim: Dimension) {
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

export function draw_inv_rect(ctx: CanvasRenderingContext2D, pos: Point, dim: Dimension, black_line = true) {
	dim = [dim[0] - 1, dim[1] - 1];
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.lineWidth = 1;
	if (black_line) {
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

export function draw_checkbox(ctx: CanvasRenderingContext2D, resources: ResourceManager, pos: Point, checked: boolean) {
	draw_inv_rect(ctx, pos, [14, 14], true);
	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(pos[0] + 1, pos[1] + 1, 12, 12);
	ctx.restore();
	if (checked) {
		ctx.drawImage(resources.get_image('gfx/gui.png'), 72, 0, 12, 12, pos[0] + 1, pos[1] + 1, 12, 12);
	}
}

export function subtitle(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
	const radius = 5;
	const height = 30;

	ctx.save();
	ctx.font = `${height - 10}px sans-serif`;
	ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
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

	ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'bottom';
	ctx.fillText(text, x + 5, y + height - 5);

	ctx.restore();
}

export function open_popup(
	game: Game,
	image: string,
	text: string,
	callback: ((x: number) => void) | null,
	right_answer: string,
	left_answer?: string,
) {
	// The callback export function will be invoked with 1 when the *left* button was clicked and with 0 when the *right* button was clicked.
	game.backstage.push(game.stage);
	game.stage = new Popup(game, image, callback, text, right_answer, left_answer);
	game.stage.initialize();
}

export function open_tutorial(game: Game, ctx: CanvasRenderingContext2D, tutorial: TutorialType) {
	// Highlight
	ctx.save();
	ctx.translate(0.5, 0.5);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	if (tutorial.highlight && tutorial.highlight[0] !== 0) {
		ctx.fillRect(0, tutorial.highlight[1], tutorial.highlight[0], tutorial.highlight[3] - tutorial.highlight[1]);
	}
	if (tutorial.highlight && tutorial.highlight[1] !== 0) {
		ctx.fillRect(0, 0, 640, tutorial.highlight[1]);
	}
	if (tutorial.highlight && tutorial.highlight[2] !== 640) {
		ctx.fillRect(tutorial.highlight[2], tutorial.highlight[1], 640 - tutorial.highlight[2], tutorial.highlight[3] - tutorial.highlight[1]);
	}
	if (tutorial.highlight && tutorial.highlight[3] !== 480) {
		ctx.fillRect(0, tutorial.highlight[3], 640, 480 - tutorial.highlight[3]);
	}
	ctx.restore();

	game.backstage.push(game.stage);
	game.stage = new Tutorial(game, game.glob, tutorial);
	game.stage.initialize();
}

export function open_load_dialog(game: Game) {
	game.backstage.push(game.stage);
	game.stage = new Load(game, game.glob);
	game.stage.initialize();
}

export function local_save(key: string, value: unknown): boolean {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		return false;
	}

	return true;
}

export function local_load(key: string): unknown {
	try {
		const item = localStorage.getItem(key);
		if (item !== null) {
			return JSON.parse(item);
		}
	} catch (error) {
		console.warn(`Got error ${error} while retrieving ${key}.`);
	}
	return null;
}
