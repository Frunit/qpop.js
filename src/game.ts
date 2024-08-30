import { worldmap_size } from './consts';
import { Credits } from './credits';
import {
	ATTR,
	PLAYER_TYPE,
	SCENE,
	defaultOptions,
	determineBestLanguage,
	download,
	draw_checkbox,
	draw_rect,
	local_load,
	local_save,
	open_popup,
	open_tutorial,
	shouldDisableAudio,
} from './helper';
import { i18n, languageKeys } from './i18n';
import { Init } from './init';
import { InputManager } from './input';
import { Intro } from './intro';
import { ResourceLoader } from './loader';
import { Mutations } from './mutations';
import { Options } from './options';
import { Outro } from './outro';
import { Player } from './player';
import { Ranking } from './ranking';
import { ResourceManager } from './resources';
import { Survival } from './survival';
import { Transition } from './transition';
import { Turnselection } from './turnselection';
import { ClickArea, GameOptions, SixNumbers, Stage, TechGlobal, Tuple, WorldGlobal } from './types';
import { version } from './version';
import { World, create_height_map, create_world_map } from './world';

export class Game {
	private last_time = 0;
	private time = 0;
	private paused = false;
	private clicked_element: ClickArea | null = null;
	private right_clicked_element: ClickArea | null = null;
	stage: Stage;
	backstage: Stage[] = [];
	evo_points: SixNumbers = [0, 0, 0, 0, 0, 0];
	seen_tutorials = new Set();
	glob: TechGlobal;
	world: WorldGlobal;

	constructor() {
		// GET parameter handling
		const search_params = new URL(document.location.href.toLowerCase()).searchParams;
		const disable_audio = shouldDisableAudio(search_params);
		this.glob = this.initialize(structuredClone(defaultOptions), search_params, disable_audio);
		if (disable_audio) {
			this.disable_audio();
		}
		this.world = this.reset();
		this.init_clickareas();
		this.stage = new ResourceLoader(this, this.glob);
		this.stage.initialize();
	}

	// The main game loop
	private main() {
		const now = Date.now();

		this.handle_input();

		if (!this.paused) {
			this.time += (now - this.last_time) / 1000;
			if (this.time > this.glob.options.update_freq) {
				this.time %= this.glob.options.update_freq;
				this.stage.update();
				this.stage.render();
			}

			this.last_time = now;
		}

		requestAnimationFrame(() => this.main());
	}

	reset(): WorldGlobal {
		const players = [];
		for (let i = 0; i < 6; i++) {
			players.push(new Player(i));
		}

		const height_map = create_height_map();
		const humid = 50;
		const temp = 50;
		const water_level = 20;
		const mountain_level = 80;

		return {
			players,
			max_turns: 5,
			turn: 0,
			humid,
			temp,
			water_level,
			mountain_level,
			humans_present: false,
			infinite_game: false,
			current_player: players[0],
			height_map,
			world_map: create_world_map(null, height_map, water_level, mountain_level, temp, humid),
			map_positions: Array.from(Array(worldmap_size[1]), () => Array(worldmap_size[0]).fill(-1)),
		};
	}

	start() {
		this.last_time = Date.now();
		this.main();
	}

	private initialize(options: GameOptions, search_params: URLSearchParams, disable_audio: boolean): TechGlobal {
		const resources = new ResourceManager();

		// Save version in case I need to account for different versions later
		if (JSON.stringify(local_load('version')) !== JSON.stringify(version)) {
			local_save('version', version);
		}

		options.language = determineBestLanguage(search_params);

		const lang = i18n[options.language];

		for (const option of Object.keys(options)) {
			if (local_load(option) === null) {
				local_save(option, options[option as keyof GameOptions]);
			}

			// language and seen_tutorials are handled above and below, respectively
			else if (option !== 'language' && option !== 'seen_tutorials') {
				// Weird type casting necessary?!?
				(options[option as keyof GameOptions] as any) = local_load(option) as any;
			}
		}

		const seen_tutorials = local_load('seen_tutorials') as string[];
		if (seen_tutorials !== null) {
			this.seen_tutorials = new Set(seen_tutorials);
		} else {
			this.seen_tutorials = new Set();
		}

		if (options.music_on && !disable_audio) {
			resources.set_music_volume(options.music / 100);
		} else {
			resources.set_music_volume(0);
		}

		if (options.sound_on && !disable_audio) {
			resources.set_sound_volume(options.sound / 100);
		} else {
			resources.set_sound_volume(0);
		}

		// Create the canvas
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (ctx === null) {
			const message = 'Could not get context from canvas.';
			alert(message);
			throw new Error(message);
		}
		canvas.width = 640;
		canvas.height = 480;
		ctx.font = 'bold 12px sans-serif';
		const div = document.getElementById('qpop');
		if (div === null) {
			const message = 'Could not find a div with id qpop.';
			alert(message);
			throw new Error(message);
		}
		div.appendChild(canvas);
		const canvas_pos = canvas.getBoundingClientRect();

		// Disable the right-click context menu in the game
		canvas.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			return false;
		});

		document.addEventListener('visibilitychange', () => {
			this.toggle_pause(document.hidden);
		});
		const [clickareas, rightclickareas] = this.init_clickareas();

		const input = new InputManager(canvas, canvas_pos);

		const glob: TechGlobal = {
			canvas,
			ctx,
			canvas_pos,
			lang,
			clickareas,
			rightclickareas,
			options,
			resources,
			input,
		};

		return glob;
	}

	private init_clickareas(): [ClickArea[], ClickArea[]] {
		const clickareas = [];
		const rightclickareas = [];

		clickareas.push({
			x1: 1,
			y1: 1,
			x2: 21,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [0, 0], [22, 21], true, true);
			},
			up: () => this.toggle_credits(),
			blur: () => {
				draw_rect(this.glob.ctx, [0, 0], [22, 21]);
			},
		});

		clickareas.push({
			x1: 546,
			y1: 1,
			x2: 576,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [545, 0], [32, 21], true, true);
			},
			up: () => this.next_language(1),
			blur: () => {
				draw_rect(this.glob.ctx, [545, 0], [32, 21]);
			},
		});

		rightclickareas.push({
			x1: 546,
			y1: 1,
			x2: 576,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [545, 0], [32, 21], true, true);
			},
			up: () => this.next_language(-1),
			blur: () => {
				draw_rect(this.glob.ctx, [545, 0], [32, 21]);
			},
		});

		clickareas.push({
			x1: 577,
			y1: 1,
			x2: 597,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [576, 0], [22, 21], true, true);
			},
			up: () => this.toggle_sound(),
			blur: () => {
				draw_rect(this.glob.ctx, [576, 0], [22, 21]);
			},
		});

		clickareas.push({
			x1: 598,
			y1: 1,
			x2: 618,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [597, 0], [22, 21], true, true);
			},
			up: () => this.toggle_music(),
			blur: () => {
				draw_rect(this.glob.ctx, [597, 0], [22, 21]);
			},
		});

		clickareas.push({
			x1: 619,
			y1: 1,
			x2: 639,
			y2: 20,
			down: () => {
				draw_rect(this.glob.ctx, [618, 0], [22, 21], true, true);
			},
			up: () => this.toggle_options(),
			blur: () => {
				draw_rect(this.glob.ctx, [618, 0], [22, 21]);
			},
		});

		return [clickareas, rightclickareas];
	}

	private handle_input() {
		if (this.glob.input.isDown('MOVE')) {
			const pos = this.glob.input.getMousePos();
			if (this.clicked_element || this.right_clicked_element) {
				const area = this.clicked_element || (this.right_clicked_element as ClickArea);
				if (pos[0] >= area.x1 && pos[0] <= area.x2 && pos[1] >= area.y1 && pos[1] <= area.y2) {
					if (area.move) {
						area.move(pos[0], pos[1]);
					}
				} else {
					area.blur();
					this.clicked_element = null;
					this.right_clicked_element = null;
				}
			} else {
				let found = false;
				for (const area of this.stage.clickareas) {
					if (pos[0] >= area.x1 && pos[0] <= area.x2 && pos[1] >= area.y1 && pos[1] <= area.y2) {
						if (!area.default_pointer) {
							this.glob.canvas.style.cursor = 'pointer';
							found = true;
						}
						break;
					}
				}

				if (!found) {
					this.glob.canvas.style.cursor = 'default';
				}
			}
		}

		if (this.glob.input.isDown('MOUSE')) {
			this.glob.input.reset('MOUSE');
			if (this.glob.input.getClickPos()) {
				this.glob.input.resetClickPos();
				const pos = this.glob.input.getMousePos();
				for (const area of this.stage.clickareas) {
					if (pos[0] >= area.x1 && pos[0] <= area.x2 && pos[1] >= area.y1 && pos[1] <= area.y2) {
						area.down(pos[0], pos[1]);
						this.clicked_element = area;
						break;
					}
				}
			} else if (this.glob.input.isDown('CLICKUP')) {
				this.glob.input.reset('CLICKUP');
				if (this.clicked_element) {
					this.clicked_element.up(NaN, NaN);
					this.clicked_element = null;
				}
			} else if (this.glob.input.getRightClickPos()) {
				this.glob.input.resetRightClickPos();
				const pos = this.glob.input.getMousePos();
				for (const area of this.stage.rightclickareas) {
					if (pos[0] >= area.x1 && pos[0] <= area.x2 && pos[1] >= area.y1 && pos[1] <= area.y2) {
						area.down(pos[0], pos[1]);
						this.right_clicked_element = area;
						break;
					}
				}
			} else if (this.glob.input.isDown('RCLICKUP')) {
				this.glob.input.reset('RCLICKUP');
				if (this.right_clicked_element) {
					this.right_clicked_element.up(NaN, NaN);
					this.right_clicked_element = null;
				}
			} else if (this.glob.input.isDown('BLUR')) {
				this.glob.input.reset('BLUR');
				if (this.clicked_element) {
					this.clicked_element.blur();
					this.clicked_element = null;
				}
				if (this.right_clicked_element) {
					this.right_clicked_element.blur();
					this.right_clicked_element = null;
				}
			}
		}

		if (this.glob.input.isDown('PAUSE')) {
			this.glob.input.reset('PAUSE');
			this.toggle_pause();
		}

		for (const key of this.stage.keys) {
			if (this.glob.input.isDown(key.key)) {
				if (key.reset) {
					this.glob.input.reset(key.key);
				}
				key.action();
			}
		}
	}

	is_last_player() {
		for (let i = this.world.current_player.id + 1; i < 6; i++) {
			if (!this.world.players[i].is_dead && this.world.players[i].type !== PLAYER_TYPE.NOBODY) {
				return false;
			}
		}

		return true;
	}

	private set_to_next_player() {
		for (let i = this.world.current_player.id + 1; i < 6; i++) {
			if (!this.world.players[i].is_dead && this.world.players[i].type !== PLAYER_TYPE.NOBODY) {
				this.world.current_player = this.world.players[i];
				return true;
			}
		}

		return false;
	}

	private set_to_first_player() {
		for (let i = 0; i < 6; i++) {
			if (!this.world.players[i].is_dead && this.world.players[i].type !== PLAYER_TYPE.NOBODY) {
				this.world.current_player = this.world.players[i];
				return;
			}
		}
	}

	// Returns false, if the game goes on, -1 if the game was lost, null if the player still has to be asked, and a number [0-5] if the player with the number won.
	private is_game_finished() {
		const humans_alive = [];
		const pcs_alive = [];
		for (let i = 0; i < 6; i++) {
			if (this.world.players[i].type === PLAYER_TYPE.HUMAN && !this.world.players[i].is_dead) {
				humans_alive.push(i);
			} else if (this.world.players[i].type === PLAYER_TYPE.COMPUTER && !this.world.players[i].is_dead) {
				pcs_alive.push(i);
			}
		}

		// all human players are dead -> game is lost
		if (humans_alive.length === 0) {
			if (pcs_alive.length === 0) {
				return -1;
			}

			if (pcs_alive.length === 1) {
				return pcs_alive[0];
			}

			return this.get_ranking(pcs_alive as SixNumbers)[0][0];
		}

		// only one player left and no infinite game
		else if (this.world.infinite_game !== true && humans_alive.length === 1 && pcs_alive.length === 0) {
			// not asked, yet; indecisive
			if (this.world.infinite_game === false) {
				this.world.infinite_game = !!humans_alive[0];
				open_popup(
					this,
					'chuck_berry',
					this.glob.lang.continue_alone,
					(x: number) => this.game_finished_popup(x),
					this.glob.lang.no,
					this.glob.lang.yes,
				);
				return null;
			}

			// asked and infinite game is a player number, so the player won
			else {
				return this.world.infinite_game;
			}
		}
		// more than one player (human or PC) still alive or single player chose to start an infinite game -> game continues
		return false;
	}

	private game_finished_popup(answer: number) {
		if (answer === 1) {
			this.world.infinite_game = true;
		}

		this.next_stage();
	}

	get_ranking(selection: SixNumbers = [0, 1, 2, 3, 4, 5]): Tuple<[number, number, number], 6> {
		// Sort by total_score and individuals
		function sortme(obj1: number[], obj2: number[]): number {
			if (obj1[1] === obj2[1]) {
				return obj2[2] - obj1[2];
			}

			return obj2[1] - obj1[1];
		}

		const scores = [];
		for (const i of selection) {
			scores.push([i, this.world.players[i].total_score, this.world.players[i].individuals]);
		}

		scores.sort(sortme);

		return scores as Tuple<[number, number, number], 6>;
	}

	select_evo_points() {
		if (this.world.max_turns <= 5) {
			this.evo_points = [60, 50, 40, 30, 20, 10];
		} else if (this.world.max_turns <= 10) {
			this.evo_points = [42, 35, 28, 21, 14, 7];
		} else {
			this.evo_points = [30, 25, 20, 15, 10, 5];
		}
	}

	save_locally() {
		const save = {
			players: this.world.players,
			world_map: this.world.world_map,
			height_map: this.world.height_map,
			map_positions: this.world.map_positions,
			turn: this.world.turn,
			max_turns: this.world.max_turns,
			humans_present: this.world.humans_present,
			water_level: this.world.water_level,
			humid: this.world.humid,
			temp: this.world.temp,
			infinite_game: this.world.infinite_game,
			datetime: new Date().toISOString(),
		};

		let save_array = local_load('save') as any[] | null; // TODO
		if (save_array === null) {
			save_array = new Array(10).fill(null);
		}

		save_array.unshift(save);
		save_array.pop(); // remove oldest save

		return local_save('save', save_array);
	}

	load_locally(num: number) {
		const save_array = local_load('save') as any[] | null; // TODO
		if (save_array === null) {
			return;
		}

		if (num >= save_array.length) {
			return;
		}

		const save = save_array[num];

		this.world.players = save.players;
		this.world.world_map = save.world_map;
		this.world.height_map = save.height_map;
		this.world.map_positions = save.map_positions;
		this.world.turn = save.turn;
		this.world.max_turns = save.max_turns;
		this.world.humans_present = save.humans_present;
		this.world.water_level = save.water_level;
		this.world.humid = save.humid;
		this.world.temp = save.temp;
		this.world.infinite_game = save.infinite_game;

		this.select_evo_points();

		this.stage = new Ranking(this, this.glob, this.world); // MAYBE: In the original, Ranking opens after loading, but it might be better to open World with mode "after catastrophe", so players can't do anything but see how the map looks.
		this.stage.initialize(false);
	}

	save_game() {
		console.log('01 Starting to save game');
		const save_file = new ArrayBuffer(4172);
		const content = new DataView(save_file);

		const qpopstring = 'Q-POP Savegame';
		for (let i = 0; i < qpopstring.length; i++) {
			content.setUint8(i, qpopstring.charCodeAt(i));
		}

		content.setUint8(0x10, this.glob.options.music_on ? 1 : 0);
		content.setUint8(0x11, this.glob.options.music);
		content.setUint8(0x12, this.glob.options.sound_on ? 1 : 0);
		content.setUint8(0x13, this.glob.options.sound);

		for (let i = 0; i < this.world.players.length; i++) {
			const p = this.world.players[i];
			content.setUint8(0x14 + 2 * i, p.type);
			// In original Q-Pop: iq 1 = best;  iq 4 = worst
			// This remake:       iq 1 = worst; iq 4 = best
			content.setUint8(0x15 + 2 * i, 5 - p.iq);

			const offset = 0x17 * i;
			content.setUint8(0x20 + offset, p.stats[ATTR.ATTACK]);
			content.setUint8(0x21 + offset, p.stats[ATTR.DEFENSE]);
			content.setUint8(0x22 + offset, p.stats[ATTR.REPRODUCTION]);
			content.setUint8(0x23 + offset, p.stats[ATTR.CAMOUFLAGE]);
			content.setUint8(0x24 + offset, p.stats[ATTR.SPEED]);
			content.setUint8(0x25 + offset, p.stats[ATTR.PERCEPTION]);
			content.setUint8(0x26 + offset, p.stats[ATTR.INTELLIGENCE]);

			content.setUint8(0x27 + offset, p.deaths); // Unused
			content.setUint8(0x28 + offset, p.experience); // Unused
			content.setUint8(0x29 + offset, Math.floor(p.eaten / 37)); // Unused
			content.setUint8(0x2a + offset, p.individuals); // Unused (counted on map)
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
			content.setUint8(0x36 + offset, p.is_dead ? 1 : 0);
			content.setUint8(0x1042 + i, p.is_dead ? 1 : 0);
		}

		content.setUint16(0xaa, this.world.turn, true);
		content.setUint8(0xac, this.world.max_turns);
		content.setUint8(0xad, this.world.humans_present ? 1 : 0);
		content.setUint16(0xb1, this.world.water_level, true);
		content.setUint16(0xb3, this.world.humid, true);
		content.setUint16(0xb5, this.world.temp, true);

		for (let y = 0; y < worldmap_size[0]; y++) {
			for (let x = 0; x < worldmap_size[1]; x++) {
				const i = x + y * worldmap_size[0];
				const j = y + x * worldmap_size[1]; // x and y are exchanged in the heightmap for some reason

				content.setUint8(0xb7 + i, this.world.world_map[y][x]);
				content.setUint8(0x3c7 + j, this.world.height_map[y][x]);
				content.setUint8(0x6d7 + i, this.world.map_positions[y][x] + 1);
			}
		}

		content.setUint8(0x1049, this.world.infinite_game ? 1 : 0);

		// Determination whether only a single human player without any others is playing
		let single = 0;
		if (this.world.infinite_game) {
			single = 1;
		} else {
			for (let i = 0; i < 6; i++) {
				if (this.world.players[i].type === PLAYER_TYPE.HUMAN) {
					single += 1;
				} else if (this.world.players[i].type === PLAYER_TYPE.COMPUTER) {
					single = 0;
					break;
				}
			}
			if (single > 1) {
				single = 1;
			}
		}
		content.setUint8(0x104a, single);

		content.setUint8(0x104b, 1); // scrolling option is always on

		console.log('02 Save game content created');

		download(save_file, 'qpop_save.qpp');
	}

	load_game(save_file: ArrayBuffer) {
		// NB! Except for a simple test for the right file type, I do not do any sanity checks. The file will only be processed on the client side with data provided by the client, so at worst, the game will freeze when using a manipulated file.
		const content = new DataView(save_file);
		let mp = 0;

		if (save_file.byteLength === 4172 && new TextDecoder().decode(new Uint8Array(save_file, 0, 14)) === 'Q-POP Savegame') {
			mp = 0;
		} else if (save_file.byteLength === 4174 && new TextDecoder().decode(new Uint8Array(save_file, 0, 24)) === 'Magnetic Planet Savegame') {
			mp = 10;
		} else {
			open_popup(this, 'dino_cries', this.glob.lang.not_a_savegame, null, this.glob.lang.next);
			return;
		}

		// This version deliberatly does not load the audio settings from the save file
		for (let i = 0; i < this.world.players.length; i++) {
			const p = this.world.players[i];
			p.type = content.getUint8(0x14 + 2 * i + mp);
			// In original Q-Pop: iq 1 = best;  iq 4 = worst
			// This remake:       iq 1 = worst; iq 4 = best
			p.iq = 5 - content.getUint8(0x15 + 2 * i + mp);

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

		this.world.turn = content.getUint16(0xaa + mp, true);
		if (mp) {
			// Magnetic Planet has always “infinite” turns and no humans
			this.world.max_turns = 255;
			this.world.humans_present = false;
			mp = 8;
		} else {
			this.world.max_turns = content.getUint8(0xac);
			this.world.humans_present = !!content.getUint8(0xad);
		}
		this.world.water_level = content.getUint16(0xb1 + mp, true);
		this.world.humid = content.getUint16(0xb3 + mp, true);
		this.world.temp = content.getUint16(0xb5 + mp, true);

		this.select_evo_points();

		this.world.world_map = Array.from(Array(worldmap_size[0]), () => Array(worldmap_size[1]).fill(0));
		this.world.height_map = Array.from(Array(worldmap_size[0]), () => Array(worldmap_size[1]).fill(0));
		this.world.map_positions = Array.from(Array(worldmap_size[0]), () => Array(worldmap_size[1]).fill(-1));

		for (let y = 0; y < worldmap_size[0]; y++) {
			for (let x = 0; x < worldmap_size[1]; x++) {
				const i = x + y * worldmap_size[0];
				const j = y + x * worldmap_size[1]; // x and y are exchanged in the heightmap for some reason

				this.world.world_map[y][x] = content.getUint8(0xb7 + i + mp);
				this.world.height_map[y][x] = content.getUint8(0x3c7 + j + mp);

				const map_pos = content.getUint8(0x6d7 + i + mp) - 1;
				this.world.map_positions[y][x] = map_pos;
				if (map_pos >= 0) {
					this.world.players[map_pos].individuals++;
				}
			}
		}

		if (mp) {
			mp = 4;
		}

		this.world.infinite_game = !!(content.getUint8(0x1049 + mp) || content.getUint8(0x104a + mp));

		this.stage = new Ranking(this, this.glob, this.world); // MAYBE: In the original, Ranking opens after loading, but it might be better to open World with mode "after catastrophe", so players can't do anything but see how the map looks.
		this.stage.initialize(false);
	}

	next_stage() {
		if (this.stage.id > SCENE.TURN_SELECTION && this.stage.id !== SCENE.OUTRO) {
			const finished = this.is_game_finished();
			if (finished === null) {
				return; // indecisive; wait for player to choose
			}

			if (finished !== false) {
				this.stage = new Outro(this, this.glob, finished);
				this.stage.initialize();
				return;
			}
		}

		switch (this.stage.id) {
			case SCENE.LOADING: // Loader
				this.stage = new Intro(this, this.glob);
				this.stage.initialize();
				break;
			case SCENE.INTRO: // Intro
			case SCENE.OUTRO: // Outro (restart game without reloading)
				this.stage = new Init(this, this.glob, this.world);
				this.stage.initialize();
				break;
			case SCENE.INIT: // Init screen (choose players)
				this.stage = new Turnselection(this, this.glob, this.world);
				this.stage.initialize();
				break;
			case SCENE.TURN_SELECTION: // Choose game length
				this.stage = new Transition(this, this.glob, 'gfx/transition_world.png', SCENE.TRANS_WORLD);
				this.stage.initialize();
				break;
			case SCENE.TRANS_WORLD: // Transition screen
				this.set_to_first_player();
				this.stage = new World(this, this.glob, this.world);
				this.stage.initialize();
				break;
			case SCENE.WORLD: // World map
				assertStageIsWorld(this.stage);
				if (this.stage.catastrophe_status === 3) {
					this.stage = new Ranking(this, this.glob, this.world);
					this.stage.initialize();
				} else if (this.set_to_next_player()) {
					this.stage.next_player();
				} else {
					if (this.world.turn === 0) {
						this.stage = new Transition(this, this.glob, 'gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
						this.stage.initialize();
					} else {
						this.stage.catastrophe_start();
					}
				}
				break;
			case SCENE.RANKING: // Ranking
				if (this.world.turn === this.world.max_turns) {
					this.stage = new Outro(this, this.glob, this.get_ranking()[0][0]);
				} else {
					this.stage = new Transition(this, this.glob, 'gfx/transition_mutations.png', SCENE.TRANS_MUTATION);
				}
				this.stage.initialize();
				break;
			case SCENE.TRANS_MUTATION: // Transition screen
				this.world.turn++;
				this.set_to_first_player();
				this.stage = new Mutations(this, this.glob, this.world);
				this.stage.initialize();
				break;
			case SCENE.MUTATION: // Mutations
				if (this.set_to_next_player() && this.stage.next_player) {
					this.stage.next_player();
				} else {
					this.stage = new Transition(this, this.glob, 'gfx/transition_survival.png', SCENE.TRANS_SURVIVAL);
					this.stage.initialize();
				}
				break;
			case SCENE.TRANS_SURVIVAL: // Transition screen
				this.set_to_first_player();
				this.stage = new Survival(this, this.glob, this.world);
				this.stage.initialize();
				break;
			case SCENE.SURVIVAL: // Survival
				if (this.set_to_next_player()) {
					this.stage.initialize();
				} else {
					this.stage = new Transition(this, this.glob, 'gfx/transition_world.png', SCENE.TRANS_WORLD);
					this.stage.initialize();
				}
				break;
			default:
				// This should never happen
				console.warn(this.stage);
				open_popup(this, 'dino_cries', `Wrong scene code: ${this.stage.id}. This should never ever happen!`, null, 'Oh no!');
		}
	}

	get_last_stage() {
		const old_stage = this.backstage.pop();
		if (old_stage !== undefined) {
			this.stage = old_stage;
			this.stage.redraw();
		}
	}

	tutorial() {
		if (this.glob.options.tutorial && this.stage.tutorials) {
			for (const tut of this.stage.tutorials) {
				if (!this.seen_tutorials.has(tut.name)) {
					this.seen_tutorials.add(tut.name);
					local_save('seen_tutorials', [...this.seen_tutorials]);
					open_tutorial(this, this.glob.ctx, tut);
					break;
				}
			}
		}
	}

	private toggle_pause(force_pause?: boolean) {
		if (force_pause === undefined) {
			this.paused = !this.paused;
		}

		if (this.paused || force_pause === true) {
			this.glob.resources.pause();
		} else if (!this.paused) {
			this.glob.resources.unpause();
		}
	}

	private toggle_credits() {
		draw_rect(this.glob.ctx, [0, 0], [22, 21]);
		if (this.stage.id === SCENE.CREDITS) {
			this.get_last_stage();
		} else {
			if (this.stage.id !== SCENE.OPTIONS) {
				this.backstage.push(this.stage);
			}
			this.stage = new Credits(this, this.glob);
			this.stage.initialize();
		}
	}

	private toggle_options() {
		draw_rect(this.glob.ctx, [618, 0], [22, 21]);
		if (this.stage.id === SCENE.OPTIONS) {
			this.get_last_stage();
		} else {
			if (this.stage.id !== SCENE.CREDITS) {
				this.backstage.push(this.stage);
			}
			this.stage = new Options(this, this.glob);
			this.stage.initialize();
		}
	}

	toggle_sound() {
		if (this.glob.options.audio_enabled) {
			this.glob.options.sound_on = !this.glob.options.sound_on;
			if (this.glob.options.sound_on) {
				this.glob.resources.set_sound_volume(this.glob.options.sound / 100);
			} else {
				this.glob.resources.set_sound_volume(0);
			}

			local_save('sound_on', this.glob.options.sound_on);

			this.stage.redraw();
		} else {
			this.stage.redraw();
			open_popup(this, 'dino', this.glob.lang.sound_disabled, null, this.glob.lang.close);
		}
	}

	toggle_music() {
		if (this.glob.options.audio_enabled) {
			this.glob.options.music_on = !this.glob.options.music_on;
			if (this.glob.options.music_on) {
				this.glob.resources.set_music_volume(this.glob.options.music / 100);
			} else {
				this.glob.resources.set_music_volume(0);
			}

			local_save('music_on', this.glob.options.music_on);

			this.stage.redraw();
		} else {
			this.stage.redraw();
			open_popup(this, 'dino', this.glob.lang.sound_disabled, null, this.glob.lang.close);
		}
	}

	disable_audio() {
		// This does purposefully not change localStorage!
		this.glob.options.music_on = false;
		this.glob.options.sound_on = false;
		this.glob.resources.set_music_volume(0);
		this.glob.resources.set_sound_volume(0);

		this.glob.resources.disable_audio();
		this.glob.options.audio_enabled = false;

		if (this.stage) {
			this.stage.redraw();
		}
	}

	next_language(direction: 1 | -1) {
		draw_rect(this.glob.ctx, [545, 0], [32, 21]);
		const current_lang = languageKeys.indexOf(this.glob.options.language);

		this.glob.options.language = languageKeys[(current_lang + direction + languageKeys.length) % languageKeys.length];
		local_save('language', this.glob.options.language);
		this.glob.lang = i18n[this.glob.options.language as keyof typeof i18n];
		this.stage.redraw();
	}

	toggle_tutorial(checkbox_pos?: [number, number]) {
		this.glob.options.tutorial = !this.glob.options.tutorial;
		if (checkbox_pos !== undefined) {
			draw_checkbox(this.glob.ctx, this.glob.resources, checkbox_pos, this.glob.options.tutorial);
		}

		local_save('tutorial', this.glob.options.tutorial);

		// Reset seen tutorials when tutorials are switched on again
		if (this.glob.options.tutorial) {
			this.seen_tutorials = new Set();
			local_save('seen_tutorials', []);
		}
	}
}

function assertStageIsWorld(stage: Stage): asserts stage is World {
	if (stage.id !== SCENE.WORLD) {
		throw new Error('Expected World Scene, but another scene was given.');
	}
}

const game = new Game();
game.start();
