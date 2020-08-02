'use strict';


const debug1 = document.getElementById('debug1');

const options = {
	language: 'EN', // Language of the game. Currently one of ['DE', 'EN']
	wm_ai_delay_idx: 3, // Internal index of wm_ai_delay
	wm_ai_delay: 4, // How many frames between two moves of the AI
	wm_ai_auto_continue: false, // After the AI finished, shall the "continue" button be pressed automatically?
	wm_click_and_hold: true, // Enable click and hold to place/remove units from world map
	plant_distribtion: true, // Show plant distribution on mutation screen
	show_predators: true, // Show vanquished predators in survival
	tutorial: true, // Show the tutorial
	transition_delay: 36, // How many frames to show the transition screens
	music_on: true,
	music: 100, // Music volume (0 - 100)
	sound_on: true,
	sound: 100, // Sound volume (0 - 100)
	audio_enabled: true,
	update_freq: 1/18, // Screen update frequency
};


function Game() {
	this.last_time = 0;
	this.last_fps = 0;
	this.frames = 0;
	this.time = 0;
	this.paused = false;
	this.clicked_element = null;
	this.right_clicked_element = null;
	this.stage = null;
	this.backstage = [];
	this.players = [];
	this.evo_points = [0, 0, 0, 0, 0, 0];
	this.clickareas = [];
	this.rightclickareas = [];
	this.seen_tutorials = new Set();
	this.max_turns = 5;
	this.turn = 0;
	this.humid = 50;
	this.temp = 50;
	this.water_level = 20;
	this.mountain_level = 80;
	this.humans_present = false;
	this.infinite_game = false;
	this.current_player = null;
	this.height_map = null;
	this.world_map = null;
	this.map_positions = null;
}


// The main game loop
Game.prototype.main = function() {
	const now = Date.now();

	this.handle_input();

	if(!this.paused) {
		this.time += (now - this.last_time) / 1000;
		if(this.time > options.update_freq) {
			this.time %= options.update_freq;
			this.stage.update();
			this.stage.render();
		}

		this.update_fps(now);

		this.last_time = now;
	}

	requestAnimationFrame(() => this.main());
};


Game.prototype.update_fps = function(now) {
	// FPS will be shown as 1/s
	this.frames++;
	if(now - this.last_fps > 1000) {
		if(debug1 !== null) {
			debug1.value = 'FPS: ' + this.frames;
		}
		this.frames = 0;
		this.last_fps = now;
	}
};


Game.prototype.reset = function() {
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
};


Game.prototype.start = function() {
	ctx.font = 'bold 12px sans-serif';
	this.stage = new Loader();
	this.stage.initialize();
	this.last_time = Date.now();

	this.clickareas.push({ // Info/credits
		x1: 1, y1: 1,
		x2: 21, y2: 20,
		down: () => {draw_rect([0, 0], [22, 21], true, true);},
		up: () => this.toggle_credits(),
		blur: () => {draw_rect([0, 0], [22, 21]);}
	});

	this.clickareas.push({ // Language
		x1: 546, y1: 1,
		x2: 576, y2: 20,
		down: () => {draw_rect([545, 0], [32, 21], true, true);},
		up: () => this.next_language(1),
		blur: () => {draw_rect([545, 0], [32, 21]);}
	});

	this.rightclickareas.push({ // Language
		x1: 546, y1: 1,
		x2: 576, y2: 20,
		down: () => {draw_rect([545, 0], [32, 21], true, true);},
		up: () => this.next_language(-1),
		blur: () => {draw_rect([545, 0], [32, 21]);}
	});

	this.clickareas.push({ // Sound
		x1: 577, y1: 1,
		x2: 597, y2: 20,
		down: () => {draw_rect([576, 0], [22, 21], true, true);},
		up: () => this.toggle_sound(),
		blur: () => {draw_rect([576, 0], [22, 21]);}
	});

	this.clickareas.push({ // Music
		x1: 598, y1: 1,
		x2: 618, y2: 20,
		down: () => {draw_rect([597, 0], [22, 21], true, true);},
		up: () => this.toggle_music(),
		blur: () => {draw_rect([597, 0], [22, 21]);}
	});

	this.clickareas.push({ // Options
		x1: 619, y1: 1,
		x2: 639, y2: 20,
		down: () => {draw_rect([618, 0], [22, 21], true, true);},
		up: () => this.toggle_options(),
		blur: () => {draw_rect([618, 0], [22, 21]);}
	});

	this.main();
};


Game.prototype.initialize = function() {
	// GET parameter handling
	const search_params = new URL(document.location.href.toLowerCase()).searchParams;

	// If "audio" is defined and falseish, disable audio and prevent loading of audio files.
	//   Also disable audio, if "noaudio" is defined (no matter what it is set to).
	if(search_params.has('noaudio') || (search_params.get('audio') !== null && !parse_bool(search_params.get('audio')))) {
		game.disable_audio();
	}

	// Save version in case I need to account for different versions later
	if(local_load('version') !== version) {
		local_save('version', version);
	}

	// If "lang[uage]" is defined and set to a supported language, use that language.
	//   Otherwise try to determine the browser language. Otherwise default to English.
	options.language = search_params.get('lang') || search_params.get('language') || local_load('language') || navigator.language || navigator.userLanguage;
	options.language = options.language.substring(0, 2).toUpperCase();

	if(i18n.hasOwnProperty(options.language)) {
		lang = i18n[options.language];
	}
	else {
		lang = i18n.EN;
		options.language = 'EN';
	}

	for(let option of Object.keys(options)) {
		if(local_load(option) === null) {
			local_save(option, options[option]);
		}
		// language and seen_tutorials are handled above and below, respectively
		else if(option !== 'language' && option !== 'seen_tutorials') {
			options[option] = local_load(option);
		}
	}

	const seen_tutorials = local_load('seen_tutorials');
	if(seen_tutorials !== null) {
		this.seen_tutorials = new Set(seen_tutorials);
	}
	else {
		this.seen_tutorials = new Set();
	}

	if(options.music_on) {
		audio.set_music_volume(options.music / 100);
	}
	else {
		audio.set_music_volume(0);
	}

	if(options.sound_on) {
		audio.set_sound_volume(options.sound / 100);
	}
	else {
		audio.set_sound_volume(0);
	}
};


Game.prototype.handle_input = function() {
	if(window.input === undefined) {
		// Input may be uninitialized because it might still be loading
		return;
	}

	if(input.isDown('MOVE')) {
		const pos = input.mousePos();
		if(game.clicked_element || game.right_clicked_element) {
			const area = game.clicked_element || game.right_clicked_element;
			if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
				pos[1] >= area.y1 && pos[1] <= area.y2)
			{
				if(area.move) {
					area.move(pos[0], pos[1]);
				}
			}
			else
				{
				area.blur();
				game.clicked_element = null;
				game.right_clicked_element = null;
			}
		}
		else {
			let found = false;
			for(let area of game.stage.clickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
						pos[1] >= area.y1 && pos[1] <= area.y2)
				{
					if(!area.default_pointer) {
						canvas.style.cursor = 'pointer';
						found = true;
					}
					break;
				}
			}

			if(!found) {
				canvas.style.cursor = 'default';
			}
		}
	}

	if(input.isDown('MOUSE')) {
		input.reset('MOUSE');
		if(input.isDown('CLICK')) {
			input.reset('CLICK');
			const pos = input.mousePos();
			for(let area of game.stage.clickareas) {
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
		else if(input.isDown('RCLICK')) {
			input.reset('RCLICK');
			const pos = input.mousePos();
			for(let area of game.stage.rightclickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2)
					{
					area.down(pos[0], pos[1]);
					game.right_clicked_element = area;
					break;
				}
			}
		}
		else if(input.isDown('RCLICKUP')) {
			input.reset('RCLICKUP');
			if(game.right_clicked_element) {
				game.right_clicked_element.up();
				game.right_clicked_element = null;
			}
		}
		else if(input.isDown('BLUR')) {
			input.reset('BLUR');
			if(game.clicked_element) {
				game.clicked_element.blur();
				game.clicked_element = null;
			}
			if(game.right_clicked_element) {
				game.right_clicked_element.blur();
				game.right_clicked_element = null;
			}
		}
	}

	if(input.isDown('PAUSE')) {
		input.reset('PAUSE');
		this.toggle_pause();
	}

	for(let key of game.stage.keys) {
		if(input.isDown(key.key)) {
			if(key.reset) {
				input.reset(key.key);
			}
			key.action();
		}
	}
};


Game.prototype.is_last_player = function() {
	for(let i = this.current_player.id + 1; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== PLAYER_TYPE.NOBODY) {
			return false;
		}
	}

	return true;
};


Game.prototype.set_to_next_player = function() {
	for(let i = this.current_player.id + 1; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== PLAYER_TYPE.NOBODY) {
			this.current_player = this.players[i];
			return true;
		}
	}

	return false;
};


Game.prototype.set_to_first_player = function() {
	for(let i = 0; i < 6; i++) {
		if(!this.players[i].is_dead && this.players[i].type !== PLAYER_TYPE.NOBODY) {
			this.current_player = this.players[i];
			return;
		}
	}
};


// Returns false, if the game goes on, -1 if the game was lost, null if the player still has to be asked, and a number [0-5] if the player with the number won.
Game.prototype.is_game_finished = function() {
	const humans_alive = [];
	const pcs_alive = [];
	for(let i = 0; i < 6; i++) {
		if(this.players[i].type === PLAYER_TYPE.HUMAN && !this.players[i].is_dead) {
			humans_alive.push(i);
		}
		else if(this.players[i].type === PLAYER_TYPE.COMPUTER && !this.players[i].is_dead) {
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
	else if(this.infinite_game !== true && humans_alive.length === 1 && pcs_alive.length === 0 && this.max_turns > 100) {
		// not asked, yet; indecisive
		if(this.infinite_game === false) {
			this.infinite_game = humans_alive[0];
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
			return obj2[2] - obj1[2];
		}

		return obj2[1] - obj1[1];
	}

	const scores = [];
	for(let i of selection) {
		scores.push([i, game.players[i].total_score, game.players[i].individuals]);
	}

	scores.sort(sortme);

	return scores;
};


Game.prototype.count_plants = function() {
	const wm_width = game.map_positions[0].length;
	const wm_height = game.map_positions.length;
	const counts = [0, 0, 0, 0, 0, 0];

	for(let x = 1; x < wm_width - 1; x++) {
		for(let y = 1; y < wm_height - 1; y++) {
			if(game.map_positions[y][x] === this.current_player.id)
			{
				counts[game.world_map[y][x] - WORLD_MAP.RANGONES]++;
			}
		}
	}

	return counts;
};


Game.prototype.select_evo_points = function() {
	if(this.max_turns <= 5) {
		this.evo_points = [60, 50, 40, 30, 20, 10];
	}
	else if(this.max_turns <= 10) {
		this.evo_points = [42, 35, 28, 21, 14, 7];
	}
	else {
		this.evo_points = [30, 25, 20, 15, 10, 5];
	}
};


Game.prototype.save_locally = function() {
	const save = {
		'players': game.players,
		'world_map': game.world_map,
		'height_map': game.height_map,
		'map_positions': game.map_positions,
		'turn': game.turn,
		'max_turns': game.max_turns,
		'humans_present': game.humans_present,
		'water_level': game.water_level,
		'humid': game.humid,
		'temp': game.temp,
		'infinite_game': game.infinite_game,
		'datetime': (new Date()).toISOString(),
	};

	let save_array = local_load('save');
	if(save_array === null) {
		save_array = new Array(10).fill(null);
	}

	save_array.unshift(save);
	save_array.pop(); // remove oldest save

	return local_save('save', save_array);
};


Game.prototype.load_locally = function(num) {
	let save_array = local_load('save');
	if(save_array === null) {
		return;
	}

	if(num >= save_array.length) {
		return;
	}

	const save = save_array[num];

	game.players = save.players;
	game.world_map = save.world_map;
	game.height_map = save.height_map;
	game.map_positions = save.map_positions;
	game.turn = save.turn;
	game.max_turns = save.max_turns;
	game.humans_present = save.humans_present;
	game.water_level = save.water_level;
	game.humid = save.humid;
	game.temp = save.temp;
	game.infinite_game = save.infinite_game;

	game.stage = new Ranking();  // MAYBE: In the original, Ranking opens after loading, but it might be better to open World with mode "after catastrophe", so players can't do anything but see how the map looks.
	game.stage.initialize(false);
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
		// In original Q-Pop: iq 1 = best;  iq 4 = worst
		// This remake:       iq 1 = worst; iq 4 = best
		content.setUint8(0x15 + 2*i, 5 - p.iq);

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
		content.setUint8(0x36 + offset, p.is_dead);
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
	let mp = 0;

	if(save_file.byteLength === 4172 &&
			new TextDecoder().decode(new Uint8Array(save_file, 0, 14)) === 'Q-POP Savegame') {
		mp = 0;
	}
	else if(save_file.byteLength === 4174 &&
			new TextDecoder().decode(new Uint8Array(save_file, 0, 24)) === 'Magnetic Planet Savegame') {
		mp = 10;
	}
	else {
		open_popup(lang.popup_title, 'dino_cries', lang.not_a_savegame, () => {}, lang.next);
		return;
	}

	// This version deliberatly does not load the audio settings from the save file

	for(let i = 0; i < game.players.length; i++) {
		const p = game.players[i];
		p.type = content.getUint8(0x14 + 2*i + mp);
		// In original Q-Pop: iq 1 = best;  iq 4 = worst
		// This remake:       iq 1 = worst; iq 4 = best
		p.iq = 5 - content.getUint8(0x15 + 2*i + mp);

		const offset = 0x17 * i + mp;
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
		p.is_dead = !!content.getUint8(0x36 + offset);

		p.individuals = 0;
	}

	game.turn = content.getUint16(0xaa + mp, true);
	if(mp) {
		// Magnetic Planet has always “infinite” turns and no humans
		game.max_turns = 255;
		game.humans_present = false;
		mp = 8;
	}
	else {
		game.max_turns = content.getUint8(0xac);
		game.humans_present = !!content.getUint8(0xad);
	}
	game.water_level = content.getUint16(0xb1 + mp, true);
	game.humid = content.getUint16(0xb3 + mp, true);
	game.temp = content.getUint16(0xb5 + mp, true);

	this.select_evo_points();

	const size = 28;

	game.world_map = Array.from(Array(size), () => Array(size).fill(0));
	game.height_map = Array.from(Array(size), () => Array(size).fill(0));
	game.map_positions = Array.from(Array(size), () => Array(size).fill(0));

	for(let y = 0; y < size; y++) {
		for(let x = 0; x < size; x++) {
			const i = x + y*size;
			const j = y + x*size; // x and y are exchanged in the heightmap for some reason

			game.world_map[y][x] = content.getUint8(0xb7 + i + mp);
			game.height_map[y][x] = content.getUint8(0x3c7 + j + mp);

			const map_pos = content.getUint8(0x6d7 + i + mp) - 1;
			game.map_positions[y][x] = map_pos;
			if(map_pos >= 0) {
				game.players[map_pos].individuals++;
			}
		}
	}

	if(mp) {
		mp = 4;
	}

	game.infinite_game = content.getUint8(0x1049 + mp) || content.getUint8(0x104a + mp);

	game.stage = new Ranking();  // MAYBE: In the original, Ranking opens after loading, but it might be better to open World with mode "after catastrophe", so players can't do anything but see how the map looks.
	game.stage.initialize(false);
};


Game.prototype.next_stage = function() {
	if(this.stage.id > SCENE.TURN_SELECTION && this.stage.id !== SCENE.OUTRO) {
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
	case SCENE.LOADING: // Loader
		this.stage = new Intro();
		this.stage.initialize();
		break;
	case SCENE.INTRO: // Intro
	case SCENE.OUTRO: // Outro (restart game without reloading)
		this.stage = new Init();
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
		this.set_to_first_player();
		this.stage = new World();
		this.stage.initialize();
		break;
	case SCENE.WORLD: // World map
		if(this.stage.catastrophe_status === 3) {
			this.stage = new Ranking();
			this.stage.initialize();
		}
		else if(this.set_to_next_player()) {
			this.stage.next_player();
		}
		else {
			if(this.turn === 0) {
				this.stage = new Transition('gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
				this.stage.initialize();
			}
			else {
				this.stage.catastrophe_start();
			}
		}
		break;
	case SCENE.RANKING: // Ranking
		if(this.turn === this.max_turns) {
			this.stage = new Outro(this.stage.winners[0]);
		}
		else {
			this.stage = new Transition('gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
		}
		this.stage.initialize();
		break;
	case SCENE.TRANS_MUTATION: // Transition screen
		this.turn++;
		this.set_to_first_player();
		this.stage = new Mutations();
		this.stage.initialize();
		break;
	case SCENE.MUTATION: // Mutations
		if(this.set_to_next_player()) {
			this.stage.next_player();
		} else {
			this.stage = new Transition('gfx/transition_survival.png', SCENE.TRANS_SURVIVAL);
			this.stage.initialize();
		}
		break;
	case SCENE.TRANS_SURVIVAL: // Transition screen
		this.set_to_first_player();
		this.stage = new Survival();
		this.stage.initialize();
		break;
	case SCENE.SURVIVAL: // Survival
		if(this.set_to_next_player()) {
			this.stage.initialize();
		} else {
			this.stage = new Transition('gfx/transition_world.png', SCENE.TRANS_WORLD);
			this.stage.initialize();
		}
		break;
	default:
		// This should never happen
		console.warn(this.stage);
		open_popup(lang.popup_title, 'dino_cries', 'Wrong scene code: ' + this.stage.id + '. This should never ever happen!', () => {}, 'Oh no!');
	}
};


Game.prototype.tutorial = function() {
	if(options.tutorial) {
		for(let tut of this.stage.tutorials) {
			if(!this.seen_tutorials.has(tut.name)) {
				this.seen_tutorials.add(tut.name);
				local_save('seen_tutorials', [...this.seen_tutorials]);
				open_tutorial(tut);
				break;
			}
		}
	}
};


Game.prototype.toggle_pause = function(force_pause=null) {
	if(force_pause === null) {
		game.paused = !game.paused;
	}

	if(game.paused || force_pause === true) {
		audio.pause();
	}
	else if(!game.paused) {
		audio.unpause();
	}
};


Game.prototype.toggle_credits = function() {
	draw_rect([0, 0], [22, 21]);
	if(game.stage.id === SCENE.CREDITS) {
		game.stage = game.backstage.pop();
		game.stage.redraw();
	}
	else {
		if(game.stage.id !== SCENE.OPTIONS) {
			game.backstage.push(game.stage);
		}
		game.stage = new Credits();
		game.stage.initialize();
	}
};


Game.prototype.toggle_options = function() {
	draw_rect([618, 0], [22, 21]);
	if(game.stage.id === SCENE.OPTIONS) {
		game.stage = game.backstage.pop();
		game.stage.redraw();
	}
	else {
		if(game.stage.id !== SCENE.CREDITS) {
			game.backstage.push(game.stage);
		}
		game.stage = new Options();
		game.stage.initialize();
	}
};


Game.prototype.toggle_sound = function() {
	if(options.audio_enabled) {
		options.sound_on = !options.sound_on;
		if(options.sound_on) {
			audio.set_sound_volume(options.sound / 100);
		}
		else {
			audio.set_sound_volume(0);
		}

		local_save('sound_on', options.sound_on);

		game.stage.redraw();
	}
	else {
		game.stage.redraw();
		open_popup(lang.popup_title, 'dino', lang.sound_disabled, () => {}, lang.close);
	}

};


Game.prototype.toggle_music = function() {
	if(options.audio_enabled) {
		options.music_on = !options.music_on;
		if(options.music_on) {
			audio.set_music_volume(options.music / 100);
		}
		else {
			audio.set_music_volume(0);
		}

		local_save('music_on', options.music_on);

		game.stage.redraw();
	}
	else {
		game.stage.redraw();
		open_popup(lang.popup_title, 'dino', lang.sound_disabled, () => {}, lang.close);
	}
};


Game.prototype.disable_audio = function() {
	// This does purposefully not change localStorage!
	options.music_on = false;
	options.sound_on = false;
	audio.set_music_volume(0);
	audio.set_sound_volume(0);

	audio.disable_audio();
	options.audio_enabled = false;

	if(game.stage) {
		game.stage.redraw();
	}
};


Game.prototype.next_language = function(direction) {
	// direction is either 1 or -1
	draw_rect([545, 0], [32, 21]);
	const lang_list = Object.keys(i18n);
	const current_lang = lang_list.indexOf(options.language);

	options.language = lang_list[(current_lang + direction + lang_list.length) % lang_list.length];
	local_save('language', options.language);
	lang = i18n[options.language];
	game.stage.redraw();
};


Game.prototype.toggle_tutorial = function(checkbox_pos = null) {
	options.tutorial = !options.tutorial;
	if(checkbox_pos !== null) {
		draw_checkbox(checkbox_pos, options.tutorial);
	}

	local_save('tutorial', options.tutorial);

	// Reset seen tutorials when tutorials are switched on again
	if(options.tutorial) {
		game.seen_tutorials = new Set();
		local_save('seen_tutorials', []);
	}
};


function Player(num) {
	this.id = num;
	this.iq = 2;
	this.type = (num === SPECIES.PURPLUS) ? PLAYER_TYPE.HUMAN : PLAYER_TYPE.COMPUTER;
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
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;
document.getElementById('qpop').appendChild(canvas);
const canvas_pos = canvas.getBoundingClientRect();

// Disable the right-click context menu in the game
canvas.addEventListener('contextmenu', function(e) {
	e.preventDefault();
	return false;
});

document.addEventListener('visibilitychange', handle_visibility_change);

let lang = null;

const version = [0, 9, 7];
const game = new Game();
game.initialize();
game.start();
