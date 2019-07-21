'use strict';

const debug1 = document.getElementById('debug1');
const debug2 = document.getElementById('debug2');
const debug3 = document.getElementById('debug3');
const debug4 = document.getElementById('debug4');

// Master-TODO:
/* - All sounds
 * - Background music
 * - Survival (mostly)
 * - *All* animations (Intro, Catastrophes, Outro)
 * - All options
 */

let options = {
	language: 'DE', // Language of the game. Currently one of ['DE', 'EN']
	wm_ai_delay: 0.05, // How many ms between two moves of the AI
	wm_ai_auto_continue: false, // After the AI finished, shall the "continue" button be pressed automatically?
	transition_delay: 0.5, // How many seconds to show the transition screens
	surv_move_speed: 80, // Speed of the player figure in survival (TODO: what unit?? Pixel per second?)
};


function Game() {
	this.last_time = 0;
	this.last_fps = 0;
	this.frames = 0;
	this.clicked_element = null;
	this.right_clicked_element = null;
	this.stage = null;
	this.backstage = [];
	this.players = [];
}


// The main game loop
Game.prototype.main = function() {
	let now = Date.now();
	let dt = (now - this.last_time) / 1000;

	this.update_fps(now);

	this.stage.update(dt);
	this.stage.render();

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
	this.current_player_num = 0;
	this.current_player = this.players[this.current_player_num];
	this.height_map = null;
	this.world_map = null;
	this.map_positions = null;
	//this.stage = new Intro(); // DEBUG
	this.stage = new Survival(); // DEBUG
	this.stagemanager = new Stagemanager();
	this.stage.initialize();
	this.last_time = Date.now();
	this.main();
};


Game.prototype.next_stage = function() {
	this.stagemanager.next();
};


Game.prototype.next_player = function() {
	for(let i = this.current_player_num + 1; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== NOBODY) {
			this.current_player_num = i;
			this.current_player = this.players[i];
			console.log('There is another player.');
			return true;
		}
	}

	for(let i = 0; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== NOBODY) {
			this.current_player_num = i;
			this.current_player = this.players[i];
			console.log('This was the last player.');
			return false;
		}
	}

	console.warn('All players are dead or inactive!!!');
	return false;
};


// TODO: Is this ever used?
Game.prototype.is_last_player = function() {
	for(let i = this.current_player_num + 1; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== NOBODY) {
			return false;
		}
	}
	return true;
};


// TODO: This should ask if the single human player wants to continue alone
// TODO: Should also give some feedback, whether the game has finished.
// TODO: Does it really directly jump to the outro? Maybe rather set some variable to true and let the stagemanager handle it!
Game.prototype.test_finished = function() {
	let humans_alive = 0;
	let pcs_alive = 0;
	for(let player of this.players) {
		if(player.type === MENSCH) {
			humans_alive++;
		}
		else if(player.type === COMPUTER) {
			pcs_alive++;
		}
	}

	this.stage = new Outro();
}


function Player(num) {
	this.id = num;
	this.iq = 2;
	this.type = (num === 1) ? HUMAN : NOBODY;  // DEBUG
	//this.type = (num === 0) ? HUMAN : COMPUTER;
	this.individuals = 0;
	this.toplace = 10;
	this.tomove = 0;
	this.is_dead = false;
	this.eaten = 0;
	this.experience = 0;
	this.gestorben = 0;
	this.evolutionspunkte = 100;
	this.total_punkte = 230;
	this.stats = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
	this.survival = { // TODO!!!
		sprite_still: new Sprite('gfx/spriteanim.png', [64, 64], [0, 0]),
		sprite_north: new Sprite('gfx/spriteanim.png', [64, 64], [512, 0], 10, [0, 1, 2, 1]),
		sprite_east: new Sprite('gfx/spriteanim.png', [64, 64], [704, 0], 10, [0, 1, 2, 3]),
		sprite_south: new Sprite('gfx/spriteanim.png', [64, 64], [320, 0], 10, [0, 1, 2, 1]),
		sprite_west: new Sprite('gfx/spriteanim.png', [64, 64], [64, 0], 10, [0, 1, 2, 3]),
		sprite: null
	};
	this.survival.sprite = this.survival.sprite_still;
};


function Stagemanager(stage) {
	this.stage = stage ? stage : 0;
};

// #####################################################################
// TODO: If the next scene is not available, the current one will update for the
// first player after game.next_player() is called.
// #####################################################################
Stagemanager.prototype.next = function() {
	switch(this.stage) {
	case 0: // Intro
		this.stage = 1;
		game.stage = new Init(game.players);
		game.stage.initialize();
		break;
	case 1: // Init screen (choose players)
		this.stage = 2;
		game.stage = new Turnselection();
		game.stage.initialize();
		break;
	case 2: // Choose game length
		this.stage = 3;
		game.stage = new Transition('gfx/transition_world.png', lang.transition_world);
		game.stage.initialize();
		break;
	case 3: // Transition screen
		this.stage = 4;
		game.stage = new World();
		game.stage.initialize();
		break;
	case 4: // World map
		if(game.next_player()) {
			game.stage.next_player();
		} else {
			if(game.turn === 0) {
				this.stage = 7;
				game.stage = new Transition('gfx/transition_mutations.png', lang.transition_world);
				game.stage.initialize();
			}
			else {
				this.stage = 5;
				game.backstage.push(game.stage);
				game.stage = new Catastrophe();
				game.stage.initialize();
			}
		}
		break;
	case 5: // Catastrophe
		this.stage = 6;
		game.stage = new Ranking();
		game.stage.initialize();
		break;
	case 6: // Ranking
		if(game.turn === game.max_turns) {
			this.stage = 11;
			game.stage = new Outro();
		}
		else {
			this.stage = 7;
			game.stage = new Transition('gfx/transition_mutations.png', lang.transition_world);
		}
		game.stage.initialize();
		break;
	case 7: // Transition screen
		this.stage = 8;
		game.turn++;
		game.stage = new Mutations();
		game.stage.initialize();
		break;
	case 8: // Mutations
		if(game.next_player()) {
			game.stage.next_player();
		} else {
			this.stage = 9;
			game.stage = new Transition('gfx/transition_survival.png', lang.transition_survival);
			game.stage.initialize();
		}
		break;
	case 9: // Transition screen
		this.stage = 10;
		game.stage = new Survival();
		game.stage.initialize();
		break;
	case 10: // Survival
		if(game.next_player()) {
			game.stage.next_player();
		} else {
			this.stage = 3;
			game.stage = new Transition('gfx/transition_world.png', lang.transition_survival);
			game.stage.initialize();
		}
		break;
	case 11: // Outro
		// This should never happen
	default:
		open_popup(lang.popup_title, 'dino_cries', 'This should never ever happen!', () => {}, 'Oh no!');
	}
};


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
	case 'DE': lang = de; break
	default: lang = en;
}

const version = 'pre-alpha';
let game = new Game();

resources.load([
	'gfx/dummy_intro.png',
	'gfx/init.png',
	'gfx/spec1.png',
	'gfx/pred1.png',
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


/*
// DEBUG: Next frame event listener
nf.addEventListener('click', function(e) {
	game.main();
});
*/
