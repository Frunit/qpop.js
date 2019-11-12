'use strict';

const debug1 = document.getElementById('debug1');
const debug2 = document.getElementById('debug2');
const debug3 = document.getElementById('debug3');
const debug4 = document.getElementById('debug4');
const debug5 = document.getElementById('debug5');
const debug6 = document.getElementById('debug6');
const debug7 = document.getElementById('debug7');
const debug8 = document.getElementById('debug8');

// Master-TODO:
/* - All sounds
 * - Background music
 * - *All* animations (Intro, Catastrophes, Outro)
 * - All options
 */

let options = {
	language: 'DE', // Language of the game. Currently one of ['DE', 'EN']
	wm_ai_delay: 4, // How many frames between two moves of the AI
	wm_ai_auto_continue: false, // After the AI finished, shall the "continue" button be pressed automatically?
	transition_delay: 18, // How many frames to show the transition screens
	surv_move_speed: 8, // Speed of the player figure in survival in pixel per updated frame
	music_on: true,
	music: 255, // Music volume (0 - 255)
	sound_on: true,
	sound: 255, // Sound volume (0 - 255)
	update_freq: 1/18, // Screen update frequency DEBUG: 1/18
};


function Game() {
	this.last_time = 0;
	this.last_fps = 0;
	this.frames = 0;
	this.time = 0;
	this.clicked_element = null;
	this.right_clicked_element = null;
	this.stage = null;
	this.backstage = [];
	this.players = [];
}


// The main game loop
Game.prototype.main = function() {
	const now = Date.now();

	this.stage.handle_input();

	this.time += (now - this.last_time) / 1000;
	if(this.time > options.update_freq) {
		this.time %= options.update_freq;
		this.stage.update();
		this.stage.render();
	}

	this.update_fps(now);

	this.last_time = now;

	requestAnimationFrame(() => this.main());
};


Game.prototype.update_fps = function(now) {
	// FPS will be shown as 1/s
	this.frames++;
	if(now - this.last_fps > 1000) {
		debug4.value = 'FPS: ' + this.frames;
		this.frames = 0;
		this.last_fps = now;
	}
};


Game.prototype.start = function() {
	ctx.font = 'bold 12px sans-serif';
	this.players = [];
	for(let i = 0; i < 6; i++) {
		this.players.push(new Player(i));
	}
	this.max_turns = 5;
	this.turn = 0;
	this.humid = 50;
	this.temp = 50;
	this.water_level = 20;
	this.mountain_level = 80;
	this.humans_present = false;
	this.infinite_game = false;
	this.current_player = this.players[0];
	this.height_map = null;
	this.world_map = null;
	this.map_positions = null;
	//this.stage = new Intro(); // DEBUG
	this.stage = new Survival(); // DEBUG
	this.stage.initialize();
	this.last_time = Date.now();
	this.main();
};


Game.prototype.next_player = function() {
	for(let i = this.current_player.id + 1; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== PLAYER_TYPE.NOBODY) {
			this.current_player.id = i;
			this.current_player = this.players[i];
			console.log('There is another player.');
			return true;
		}
	}

	for(let i = 0; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== PLAYER_TYPE.NOBODY) {
			this.current_player.id = i;
			this.current_player = this.players[i];
			console.log('This was the last player.');
			return false;
		}
	}

	console.warn('All players are dead or inactive!!!');
	return false;
};


// Returns false, if the game goes on, -1 if the game was lost, null if the player still has to be asked, and a number [0-5] if the player with the number won.
Game.prototype.is_game_finished = function() {
	const humans_alive = [];
	const pcs_alive = [];
	for(let i = 0; i < 6; i++) {
		if(players[i].type === PLAYER_TYPE.HUMAN && !players[i].is_dead) {
			humans_alive.push(i);
		}
		else if(players[i].type === PLAYER_TYPE.COMPUTER && !players[i].is_dead) {
			pcs_alive.push(i);
		}
	}

	// all human players are dead -> game is lost
	if(humans_alive.length === 0) {
		if(pcs_alive.length === 0) {
			return -1;
		}

		if (pcs_alive.length === 1) {
			return pcs_alive[0];
		}

		return this.get_ranking(pcs_alive)[0][0];
	}
	// only one player left and no infinite game
	else if(this.infinite_game !== true && humans_alive.length === 1 && pcs_alive.length === 0) {
		// not asked, yet; indecisive
		if(this.infinite_game === false) {
			this.infinite_game = humans_alive[0];
			// TODO RESEARCH: Which image?
			open_popup(lang.popup_title, 'chuck_berry', lang.continue_alone,
						(x) => game.game_finished_popup(x), lang.no, lang.yes);
			return null;
		}
		// asked and infinite game is a player number, so the player won
		else {
			return this.infinite_game;
		}
	}
	// more than one player (human or PC) still alive or single player chose to start an infinite game -> game continues
	return false;
};


Game.prototype.game_finished_popup = function(answer) {
	if(answer === 1) {
		this.infinite_game = true;
	}

	this.next_stage();
};


Game.prototype.get_ranking = function(selection=[0,1,2,3,4,5]) {

	// Sort by total_score and individuals
	function sortme(obj1, obj2) {
		if(obj1[1] === obj2[1]) {
			return obj1[2] - obj2[2];
		}

		return obj1[1] - obj2[1];
	}

	const scores = [];
	for(let i of selection) {
		scores.push([i, game.players[i].total_score, game.players[i].individuals]);
	}

	scores.sort(sortme);

	return scores;
};


Game.prototype.save_game = function() {
	const save_file = new ArrayBuffer(4172);
	const content = new DataView(save_file);

	const qpopstring = 'Q-POP Savegame';
	for(let i = 0; i < qpopstring.length; i++) {
		content.setUint8(i, qpopstring.charCodeAt(i));
	}

	content.setUint8(0x10, options.music_on);
	content.setUint8(0x11, options.music);
	content.setUint8(0x12, options.sound_on);
	content.setUint8(0x13, options.sound);

	for(let i = 0; i < game.players.length; i++) {
		const p = game.players[i];
		content.setUint8(0x14 + 2*i, p.type);
		content.setUint8(0x15 + 2*i, p.iq);

		const offset = 0x17 * i;
		content.setUint8(0x20 + offset, p.stats[ATTR.ATTACK]);
		content.setUint8(0x21 + offset, p.stats[ATTR.DEFENSE]);
		content.setUint8(0x22 + offset, p.stats[ATTR.REPRODUCTION]);
		content.setUint8(0x23 + offset, p.stats[ATTR.CAMOUFLAGE]);
		content.setUint8(0x24 + offset, p.stats[ATTR.SPEED]);
		content.setUint8(0x25 + offset, p.stats[ATTR.PERCEPTION]);
		content.setUint8(0x26 + offset, p.stats[ATTR.INTELLIGENCE]);

		content.setUint8(0x27 + offset, p.deaths);  // Unused
		content.setUint8(0x28 + offset, p.experience);  // Unused
		content.setUint8(0x29 + offset, Math.floor(p.eaten / 37));  // Unused
		content.setUint8(0x2a + offset, p.individuals);  // Unused (counted on map)
		content.setUint8(0x2b + offset, p.evo_score);
		content.setUint8(0x2c + offset, p.tomove);
		content.setUint8(0x2d + offset, p.toplace);
		content.setUint16(0x2e + offset, p.total_score, true);

		content.setUint8(0x30 + offset, p.stats[ATTR.RANGONES]);
		content.setUint8(0x31 + offset, p.stats[ATTR.BLUELEAF]);
		content.setUint8(0x32 + offset, p.stats[ATTR.HUSHROOMS]);
		content.setUint8(0x33 + offset, p.stats[ATTR.STINKBALLS]);
		content.setUint8(0x34 + offset, p.stats[ATTR.SNAKEROOTS]);
		content.setUint8(0x35 + offset, p.stats[ATTR.FIREGRASS]);
		content.setUint8(0x36 + offset, !p.is_dead);
		content.setUint8(0x1042 + i, p.is_dead);
	}

	content.setUint16(0xaa, game.turn, true);
	content.setUint8(0xac, game.max_turns);
	content.setUint8(0xad, game.humans_present);
	content.setUint16(0xb1, game.water_level, true);
	content.setUint16(0xb3, game.humid, true);
	content.setUint16(0xb5, game.temp, true);

	const size = 28;

	for(let y = 0; y < size; y++) {
		for(let x = 0; x < size; x++) {
			const i = x + y*size;
			const j = y + x*size; // x and y are exchanged in the heightmap for some reason

			content.setUint8(0xb7 + i, game.world_map[y][x]);
			content.setUint8(0x3c7 + j, game.height_map[y][x]);
			content.setUint8(0x6d7 + i, game.map_positions[y][x] + 1);
		}
	}

	content.setUint8(0x1049, game.infinite_game & 1);

	// Determination whether only a single human player without any others is playing
	let single = 0;
	if(game.infinite_game) {
		single = 1;
	}
	else {
		for(let i = 0; i < 6; i++) {
			if(game.players[i].type === PLAYER_TYPE.HUMAN) {
				single += 1;
			}
			else if(game.players[i].type === PLAYER_TYPE.COMPUTER) {
				single = 0;
				break;
			}
		}
		if(single > 1) {
			single = 1;
		}
	}
	content.setUint8(0x104a, single);

	content.setUint8(0x104b, 1); // scrolling option is always on

	download(save_file, 'qpop_save.qpp', 'application/octet-stream');
};


Game.prototype.load_game = function(save_file) {
	// NB! Except for a simple test for the right file type, I do not do any sanity checks. The file will only be processed on the client side with data provided by the client, so at worst, the game will freeze when using a manipulated file.

	const content = new DataView(save_file);

	if(save_file.byteLength !== 4172 ||
			new TextDecoder().decode(new Uint8Array(save_file, 0, 14)) !== 'Q-POP Savegame') {
		open_popup(lang.popup_title, 'dino_cries', lang.not_a_savegame, () => {}, lang.next);
		return;
	}

	options.music_on = !!content.getUint8(0x10);
	options.music = content.getUint8(0x11);
	options.sound_on = !!content.getUint8(0x12);
	options.sound = content.getUint8(0x13);

	for(let i = 0; i < game.players.length; i++) {
		const p = game.players[i];
		p.type = content.getUint8(0x14 + 2*i);
		p.iq = content.getUint8(0x15 + 2*i);

		const offset = 0x17 * i;
		p.stats[ATTR.ATTACK] = content.getUint8(0x20 + offset);
		p.stats[ATTR.DEFENSE] = content.getUint8(0x21 + offset);
		p.stats[ATTR.REPRODUCTION] = content.getUint8(0x22 + offset);
		p.stats[ATTR.CAMOUFLAGE] = content.getUint8(0x23 + offset);
		p.stats[ATTR.SPEED] = content.getUint8(0x24 + offset);
		p.stats[ATTR.PERCEPTION] = content.getUint8(0x25 + offset);
		p.stats[ATTR.INTELLIGENCE] = content.getUint8(0x26 + offset);

		p.evo_score = content.getUint8(0x2b + offset);
		p.tomove = content.getUint8(0x2c + offset);
		p.toplace = content.getUint8(0x2d + offset);
		p.total_score = content.getUint16(0x2e + offset, true);

		p.stats[ATTR.RANGONES] = content.getUint8(0x30 + offset);
		p.stats[ATTR.BLUELEAF] = content.getUint8(0x31 + offset);
		p.stats[ATTR.HUSHROOMS] = content.getUint8(0x32 + offset);
		p.stats[ATTR.STINKBALLS] = content.getUint8(0x33 + offset);
		p.stats[ATTR.SNAKEROOTS] = content.getUint8(0x34 + offset);
		p.stats[ATTR.FIREGRASS] = content.getUint8(0x35 + offset);
		p.is_dead = !content.getUint8(0x36 + offset);

		p.individuals = 0;
	}

	game.turn = content.getUint16(0xaa, true);
	game.max_turns = content.getUint8(0xac);
	game.humans_present = content.getUint8(0xad);
	game.water_level = content.getUint16(0xb1, true);
	game.humid = content.getUint16(0xb3, true);
	game.temp = content.getUint16(0xb5, true);

	const size = 28;

	game.world_map = Array.from(Array(size), () => Array(size).fill(0));
	game.height_map = Array.from(Array(size), () => Array(size).fill(0));
	game.map_positions = Array.from(Array(size), () => Array(size).fill(0));

	for(let y = 0; y < size; y++) {
		for(let x = 0; x < size; x++) {
			const i = x + y*size;
			const j = y + x*size; // x and y are exchanged in the heightmap for some reason

			game.world_map[y][x] = content.getUint8(0xb7 + i);
			game.height_map[y][x] = content.getUint8(0x3c7 + j);

			const map_pos = content.getUint8(0x6d7 + i) - 1;
			game.map_positions[y][x] = map_pos;
			if(map_pos > 0) {
				game.players[map_pos].individuals++;
			}
		}
	}

	game.infinite_game = content.getUint8(0x1049) || content.getUint8(0x104a);

	game.stage = new World();
	game.stage.initialize();
};


Game.prototype.next_stage = function() {
	if(this.stage.id > SCENE.TURN_SELECTION) {
		const finished = this.is_game_finished();
		if(finished === null) {
			return; // indecisive; wait for player to choose
		}

		if(finished !== false) {
			this.stage = new Outro(finished);
			this.stage.initialize();
			return;
		}
	}

	switch(this.stage.id) {
	case SCENE.INTRO: // Intro
		this.stage = new Init(this.players);
		this.stage.initialize();
		break;
	case SCENE.INIT: // Init screen (choose players)
		this.stage = new Turnselection();
		this.stage.initialize();
		break;
	case SCENE.TURN_SELECTION: // Choose game length
		this.stage = new Transition('gfx/transition_world.png', SCENE.TRANS_WORLD);
		this.stage.initialize();
		break;
	case SCENE.TRANS_WORLD: // Transition screen
		this.stage = new World();
		this.stage.initialize();
		break;
	case SCENE.WORLD: // World map
		if(this.next_player()) {
			this.stage.next_player();
		} else {
			if(this.turn === 0) {
				this.stage = new Transition('gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
				this.stage.initialize();
			}
			else {
				this.backstage.push(this.stage);
				this.stage = new Catastrophe();
				this.stage.initialize();
			}
		}
		break;
	case SCENE.CATASTROPHE: // Catastrophe
		this.stage = new Ranking();
		this.stage.initialize();
		break;
	case SCENE.RANKING: // Ranking
		if(this.turn === this.max_turns) {
			this.stage = new Outro();
		}
		else {
			this.stage = new Transition('gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
		}
		this.stage.initialize();
		break;
	case SCENE.TRANS_MUTATION: // Transition screen
		this.turn++;
		this.stage = new Mutations();
		this.stage.initialize();
		break;
	case SCENE.MUTATION: // Mutations
		if(this.next_player()) {
			this.stage.next_player();
		} else {
			this.stage = new Transition('gfx/transition_survival.png', SCENE.TRANS_SURVIVAL);
			this.stage.initialize();
		}
		break;
	case SCENE.TRANS_SURVIVAL: // Transition screen
		this.stage = new Survival();
		this.stage.initialize();
		break;
	case SCENE.SURVIVAL: // Survival
		if(this.next_player()) {
			this.stage.initialize();
		} else {
			this.stage = new Transition('gfx/transition_world.png', SCENE.TRANS_WORLD);
			this.stage.initialize();
		}
		break;
	case SCENE.OUTRO: // Outro
		// This should never happen
	default:
		console.log(this.stage);
		open_popup(lang.popup_title, 'dino_cries', 'This should never ever happen!',
					() => {}, 'Oh no!');
	}
};


function Player(num) {
	this.id = num;
	this.iq = 2;
	this.type = (num === 1) ? PLAYER_TYPE.HUMAN : PLAYER_TYPE.NOBODY;  // DEBUG
	//this.type = (num === 0) ? PLAYER_TYPE.HUMAN : PLAYER_TYPE.COMPUTER;
	this.individuals = 0;
	this.toplace = 10;
	this.tomove = 0;
	this.is_dead = false;
	this.loved = 0;
	this.eaten = 0;
	this.experience = 0;
	this.deaths = 0;
	this.evo_score = 100;
	this.total_score = 230;
	this.stats = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
}


// Create the canvas
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);
let canvas_pos = canvas.getBoundingClientRect();

// Disable the right-click context menu in the game
canvas.addEventListener('contextmenu', function(e) {
	e.preventDefault();
	return false;
});

let lang = null;
switch(options.language) {
	case 'DE': lang = de; break;
	default: lang = en;
}

const version = 'pre-alpha';
let game = new Game();

resources.load([
	'gfx/dummy_intro.png',
	'gfx/init.png',
	'gfx/clouds.png',
	'gfx/enemies.png',
	'gfx/spec1.png',
	'gfx/spec2.png',
	'gfx/spec3.png',
	'gfx/spec4.png',
	'gfx/spec5.png',
	'gfx/spec6.png',
	'gfx/pred1.png',
	'gfx/pred2.png',
	'gfx/pred3.png',
	'gfx/dark_bg.png',
	'gfx/light_bg.png',
	'gfx/species.png',
	'gfx/turns.png',
	'gfx/transition_survival.png',
	'gfx/transition_world.png',
	'gfx/transition_mutations.png',
	'gfx/world.png',
	'gfx/world_gui.png',
	'gfx/background.png',
	'gfx/mutations.png',
	'gfx/survival_gui.png',
	'gfx/ranking.png',
	'gfx/wreath.png',
	'gfx/dummy_cata.png',
	'gfx/dummy_outro.png'
]);
resources.onReady(() => game.start());


canvas.addEventListener('dragover', function(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});


canvas.addEventListener('drop', function(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer.files[0];
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);

	reader.addEventListener('load', readerEvent => {
		game.load_game(readerEvent.target.result);
	});
});


/*
// DEBUG: Next frame event listener
nf.addEventListener('click', function(e) {
	game.main();
});
*/
