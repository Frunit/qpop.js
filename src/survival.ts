import { Electro, Feeding, Fight, IAction, Love, Quicksand, Waiting } from "./actions";
import { Camera } from "./camera";
import { survivalmap_size } from "./consts";
import { ATTR, DIR, PLAYER_TYPE, SCENE, SURV_MAP, clamp, draw_base, draw_black_rect, draw_rect, open_popup, random_element, random_int, write_text } from "./helper";
import { Enemy, Female, ISurvivalCharacter, Level, Predator } from "./level";
import { Sprite } from "./sprite";
import { anim_delays } from "./sprite_positions";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal, TutorialType, WorldGlobal } from "./types";

export class Survival implements Stage {
	id = SCENE.SURVIVAL;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];
	glob: TechGlobal;
	world: WorldGlobal;

	private bg_pic: HTMLImageElement;
	private gui_pics: HTMLImageElement;

	private level: Level;
	private camera: Camera;
	private action: IAction | null = null;
	private movement_active = false;
	private movement_just_finished = false;
	private player_started = false;
	private moving_predators: Predator[] = [];

	private delay = anim_delays.movement;
	private delay_counter = 0;
	private time: number;
	private steps = 10;
	private max_steps = 10;

	private active_sounds: Set<string> = new Set();

	private clickdir = -1;

	readonly camera_dim: Dimension = [448, 448];
	readonly tile_dim: Dimension = [64, 64];
	readonly left_rect_dim: Dimension = [460, 460];
	readonly right_rect_dim: Dimension = [181, 439];
	readonly next_dim: Dimension = [181, 22];
	readonly time_dim: Dimension = [122, 25];
	readonly steps_dim: Dimension = [122, 25];
	readonly icon_dim: Dimension = [20, 20];
	readonly sym_dim: Dimension = [16, 16];
	readonly minimap_dim: Dimension = [168, 168];
	readonly minimap_sym_dim: Dimension = [8, 8];

	readonly camera_offset: Point = [6, 26];
	readonly left_rect_offset: Point = [0, 20];
	readonly right_rect_offset: Point = [459, 20];
	readonly next_offset: Point = [459, 458];
	readonly steps_offset: Point = [508, 205];
	readonly time_offset: Point = [508, 240];
	readonly icon_steps_offset: Point = [470, 243];
	readonly icon_time_offset: Point = [470, 208];
	readonly sym_food_offset: Point = [465, 286];
	readonly sym_love_offset: Point = [465, 347];
	readonly sym_dead_offset: Point = [465, 381];
	readonly sym_won_offset: Point = [465, 416];
	readonly minimap_offset: Point = [465, 26];
	readonly minimap_sym_soffset: Point = [0, 16];

	readonly sym_food_soffset: Point = [0, 0];
	readonly sym_love_soffset: Point = [16, 0];
	readonly sym_dead_soffset: Point = [32, 0];
	readonly sym_won_soffset: Point = [0, 24];
	readonly icon_steps_soffset: Point = [48, 0];
	readonly icon_time_soffset: Point = [68, 0];

	readonly sym_food_delta: Point = [8, 25];
	readonly sym_dx = 17;

	readonly minimap_center = 10;
	readonly eating_div = 37;
	readonly max_time = 54;
	readonly speed = 8;

	constructor(glob: TechGlobal, world: WorldGlobal) {
		this.glob = glob;
		this.world = world;
		this.bg_pic = glob.resources.get_image('gfx/dark_bg.png');
		this.gui_pics = glob.resources.get_image('gfx/survival_gui.png');
		this.time = this.max_time;

		this.level = new Level(world);
		this.camera = new Camera(glob.ctx, this.level, this, this.tile_dim, this.camera_dim, this.camera_offset);

		this.tutorials = [
			{
				'name': 'survival_start',
				'pos': [275, 100],
				'arrows': [{ dir: DIR.W, offset: 140 }],
				'highlight': [this.camera_offset[0], this.camera_offset[1], this.camera_offset[0] + this.camera_dim[0], this.camera_offset[1] + this.camera_dim[1]],
			},
			{
				'name': 'survival_goals',
				'pos': [275, 100],
				'arrows': [],
				'highlight': [this.camera_offset[0], this.camera_offset[1], this.camera_offset[0] + this.camera_dim[0], this.camera_offset[1] + this.camera_dim[1]],
			},
			{
				'name': 'survival_time',
				'pos': [85, 140],
				'arrows': [{ dir: DIR.E, offset: 68 }, { dir: DIR.E, offset: 106 }],
				'highlight': [this.right_rect_offset[0], this.steps_offset[1] - 3, 640, this.time_offset[1] + this.time_dim[1] + 3],
			},
			{
				'name': 'survival_radar',
				'pos': [85, 30],
				'arrows': [{ dir: DIR.E, offset: 70 }],
				'highlight': [this.minimap_offset[0], this.minimap_offset[1], this.minimap_offset[0] + this.minimap_dim[0], this.minimap_offset[1] + this.minimap_dim[1]],
			},
		];
	}

	initialize() {
		this.world.current_player.loved = 0;
		this.world.current_player.eaten = 0;
		this.world.current_player.experience = 0;
		this.world.current_player.deaths = 0;

		if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
			this.ai();
			return;
		}

		this.glob.resources.play_music(`spec${this.world.current_player.id}`);


		this.player_started = false;
		this.time = this.max_time;

		// Higher difficulty (iq) means less steps
		this.steps = 40 + (5 - this.world.current_player.iq) * 10;
		this.max_steps = this.steps;

		this.redraw();
		game.tutorial();
		this.update_environment_sound();
	}

	redraw() {
		if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
			return;
		}
		draw_base();
		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		draw_rect(this.left_rect_offset, this.left_rect_dim); // Main rectangle
		draw_rect(this.right_rect_offset, this.right_rect_dim); // Right rectangle
		draw_rect(this.next_offset, this.next_dim); // Continue rectangle
		write_text(this.glob.lang.next, [549, 473], 'white', 'black');
		this.clickareas.push({
			x1: this.next_offset[0],
			y1: this.next_offset[1],
			x2: this.next_offset[0] + this.next_dim[0],
			y2: this.next_offset[1] + this.next_dim[1],
			down: () => draw_rect(this.next_offset, this.next_dim, true, true),
			up: () => this.next(),
			blur: () => draw_rect(this.next_offset, this.next_dim)
		});

		// Black border around camera
		draw_black_rect([this.camera_offset[0] - 1, this.camera_offset[1] - 1], [this.camera_dim[0] + 1, this.camera_dim[1] + 1]);

		// Click on camera:
		// Arrows override click
		// On click on character, feed/wait
		// On click around the character, move into that direction (if possible)
		// On rightclick *up* on character: suicide
		// Rightclicks on other regions don't do anything
		this.clickareas.push({
			x1: this.camera_offset[0],
			y1: this.camera_offset[1],
			x2: this.camera_offset[0] + this.camera_dim[0],
			y2: this.camera_offset[1] + this.camera_dim[1],
			down: (x: number, y: number) => this.cam_click(x, y),
			up: () => this.cam_click(-1, -1),
			blur: () => this.cam_click(-1, -1),
			move: (x: number, y: number) => this.cam_click(x, y),
			default_pointer: true
		});

		this.rightclickareas.push({
			x1: this.camera_offset[0],
			y1: this.camera_offset[1],
			x2: this.camera_offset[0] + this.camera_dim[0],
			y2: this.camera_offset[1] + this.camera_dim[1],
			down: (x: number, y: number) => this.cam_rightclickup(x, y),
			up: (x: number, y: number) => this.cam_rightclickup(x, y),
			blur: () => { },
			move: () => { }
		});

		// Minimap
		this.draw_minimap();

		// Steps
		this.glob.ctx.drawImage(this.gui_pics,
			this.icon_steps_soffset[0], this.icon_steps_soffset[1],
			this.icon_dim[0], this.icon_dim[1],
			this.icon_steps_offset[0], this.icon_steps_offset[1],
			this.icon_dim[0], this.icon_dim[1]);
		this.draw_steps();

		// Time
		this.glob.ctx.drawImage(this.gui_pics,
			this.icon_time_soffset[0], this.icon_time_soffset[1],
			this.icon_dim[0], this.icon_dim[1],
			this.icon_time_offset[0], this.icon_time_offset[1],
			this.icon_dim[0], this.icon_dim[1]);
		this.draw_time();

		// Symbols
		this.draw_symbols();

		// Main area
		this.camera.render(true);

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.next(), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => this.suicide(), 'reset': true },
		];
	}

	draw_minimap() {
		draw_black_rect(this.minimap_offset, this.minimap_dim, '#000000');

		const MM_PLAYER = 0;
		const MM_FOOD = 1;
		const MM_LOVE = 2;
		const MM_PREDATOR = 3;
		const MM_ENEMY = 4;

		const radar_range = (this.world.current_player.stats[ATTR.PERCEPTION] * 7 + this.world.current_player.stats[ATTR.INTELLIGENCE]) / 10;

		for (let y = -10; y < 10; y++) {
			const real_y = clamp(this.level.character.tile[1] + y, 0, survivalmap_size[1] - 1);
			for (let x = -10; x < 10; x++) {

				// If the range is too low, don't show anything here
				if (radar_range <= Math.sqrt(y ** 2 + x ** 2) * 10 - 30) {
					continue;
				}

				const real_x = clamp(this.level.character.tile[0] + x, 0, survivalmap_size[0] - 1);
				let sym = -1;

				if (x === 0 && y === 0) {
					sym = MM_PLAYER;
				}
				else if (this.level.mobmap[real_y][real_x] !== null) {
					switch ((this.level.mobmap[real_y][real_x] as ISurvivalCharacter).type) {
						case SURV_MAP.PREDATOR:
							sym = MM_PREDATOR;
							break;
						case SURV_MAP.ENEMY:
							sym = MM_ENEMY;
							break;
						case SURV_MAP.FEMALE:
							sym = MM_LOVE;
							break;
					}
				}
				else if (this.level.map[real_y][real_x] < 36) {
					let threshold;
					switch (this.level.map[real_y][real_x] % 6) {
						case 3:
							threshold = 75;
							break;
						case 4:
							threshold = 50;
							break;
						case 5:
							threshold = 25;
							break;
						default:
							threshold = 110;
					}

					// Mapping from survival food to stats food.
					const food_type = [0, 2, 5, 1, 3, 4][Math.floor(this.level.map[real_y][real_x] / 6)];
					if (this.world.current_player.stats[food_type] > threshold) {
						sym = MM_FOOD;
					}
				}

				if (sym >= 0) {
					this.glob.ctx.drawImage(this.gui_pics,
						this.minimap_sym_soffset[0] + sym * this.minimap_sym_dim[0],
						this.minimap_sym_soffset[1],
						this.minimap_sym_dim[0], this.minimap_sym_dim[1],
						this.minimap_offset[0] + (this.minimap_center + x) * this.minimap_sym_dim[0],
						this.minimap_offset[1] + (this.minimap_center + y) * this.minimap_sym_dim[1],
						this.minimap_sym_dim[0], this.minimap_sym_dim[1]);
				}
			}
		}
	}

	draw_steps() {
		const width = Math.ceil((this.steps_dim[0] - 1) * this.steps / this.max_steps);

		this.glob.ctx.save();
		this.glob.ctx.fillStyle = '#c3c3c3';
		this.glob.ctx.fillRect(this.steps_offset[0], this.steps_offset[1], this.steps_dim[0], this.steps_dim[1]);
		this.glob.ctx.fillStyle = '#0000ff';
		this.glob.ctx.fillRect(this.steps_offset[0] + 1, this.steps_offset[1] + 1, width, this.steps_dim[1] - 1);
		this.glob.ctx.restore();

		draw_black_rect(this.steps_offset, this.steps_dim);
	}

	draw_time() {
		const width = Math.ceil((this.time_dim[0] - 1) * this.time / this.max_time);

		this.glob.ctx.save();
		this.glob.ctx.fillStyle = '#c3c3c3';
		this.glob.ctx.fillRect(this.time_offset[0], this.time_offset[1], this.time_dim[0], this.time_dim[1]);
		this.glob.ctx.fillStyle = '#ff0000';
		this.glob.ctx.fillRect(this.time_offset[0] + 1, this.time_offset[1] + 1, width, this.time_dim[1] - 1);
		this.glob.ctx.restore();

		draw_black_rect(this.time_offset, this.time_dim);
	}

	draw_symbols() {
		// Delete earlier drawings
		const w = this.sym_dx * 10;
		const h = this.sym_won_offset[1] - this.sym_food_offset[1] + this.sym_dim[1];
		this.glob.ctx.drawImage(this.bg_pic,
			this.sym_food_offset[0], this.sym_food_offset[1],
			w, h,
			this.sym_food_offset[0], this.sym_food_offset[1],
			w, h);

		// Food
		for (let i = 0; i < Math.floor(this.world.current_player.eaten / this.eating_div); i++) {
			this.glob.ctx.drawImage(this.gui_pics,
				this.sym_food_soffset[0], this.sym_food_soffset[1],
				this.sym_dim[0], this.sym_dim[1],
				this.sym_food_offset[0] + this.sym_food_delta[0] * (i % 20), this.sym_food_offset[1] + this.sym_food_delta[1] * Math.floor(i / 20),
				this.sym_dim[0], this.sym_dim[1]);
		}

		// Love
		for (let i = 0; i < this.world.current_player.loved; i++) {
			this.glob.ctx.drawImage(this.gui_pics,
				this.sym_love_soffset[0], this.sym_love_soffset[1],
				this.sym_dim[0], this.sym_dim[1],
				this.sym_love_offset[0] + this.sym_dx * i, this.sym_love_offset[1],
				this.sym_dim[0], this.sym_dim[1]);
		}

		// Deaths
		for (let i = 0; i < this.world.current_player.deaths; i++) {
			this.glob.ctx.drawImage(this.gui_pics,
				this.sym_dead_soffset[0], this.sym_dead_soffset[1],
				this.sym_dim[0], this.sym_dim[1],
				this.sym_dead_offset[0] + this.sym_dx * i, this.sym_dead_offset[1],
				this.sym_dim[0], this.sym_dim[1]);
		}

		// Wins
		for (let i = 0; i < this.level.character.victories.length; i++) {
			this.glob.ctx.drawImage(this.gui_pics,
				this.sym_won_soffset[0] + this.sym_dim[0] * this.level.character.victories[i], this.sym_won_soffset[1],
				this.sym_dim[0], this.sym_dim[1],
				this.sym_won_offset[0] + this.sym_dx * i, this.sym_won_offset[1],
				this.sym_dim[0], this.sym_dim[1]);
		}
	}

	render() {
		this.camera.render(true || this.movement_just_finished); // DEBUG
		this.draw_time();

		if (this.movement_just_finished) {
			this.movement_just_finished = false;
			this.draw_minimap();
		}
	}

	ai() {
		const iq = this.world.current_player.iq;
		this.world.current_player.experience = random_int(0, iq);

		// MAYBE correct: This does not include the density that affects human players. For human players: Higher density -> less food
		let food = 0;

		for (let x = 1; x <= 26; x++) {
			for (let y = 1; y <= 26; y++) {
				if (this.world.map_positions[y][x] === this.world.current_player.id) {
					food += (20 + iq * 20 + this.world.current_player.stats[ATTR.PERCEPTION] / 5 + this.world.current_player.stats[ATTR.INTELLIGENCE] / 10) * this.world.current_player.stats[this.world.world_map[y][x] - 1] / 3;
				}
			}
		}

		food = Math.floor(food / this.world.current_player.individuals);

		if (food > 1480) {
			food = 1480;
		}
		this.world.current_player.eaten = food;

		let deaths = Math.floor(random_int(0, this.world.current_player.individuals - 1) / 10) + 5;
		let saved = 0;
		for (let i = 0; i < deaths; i++) {
			if (random_int(0, 600) < this.world.current_player.stats[ATTR.SPEED] ||
				random_int(0, 300) < this.world.current_player.stats[ATTR.CAMOUFLAGE] ||
				random_int(0, 1000) < this.world.current_player.stats[ATTR.INTELLIGENCE] ||
				random_int(0, 600) < this.world.current_player.stats[ATTR.DEFENSE] ||
				random_int(0, 6) < iq) {
				saved++;
			}
		}
		this.world.current_player.deaths = deaths - saved;

		// MAYBE correct: This does not take into account density. For a human player: Higher density > more females
		this.world.current_player.loved = random_int(0, iq * 2 + 2);

		this.next_popup(1);
	}

	finish_movement() {
		this.movement_just_finished = true;
		const char = this.level.character;
		this.delay_counter = 0;
		char.hidden = false;
		this.action = null;
		this.movement_active = false;
		this.time = this.max_time;

		this.update_environment_sound();

		for (const predator of this.moving_predators) {
			this.resolve_movement(predator, true);
		}
		this.moving_predators = [];

		if (this.steps <= 0) {
			this.next_popup(1);
			return;
		}

		this.draw_steps();

		// Enemy or Female found
		const [dir, adjacent] = this.get_adjacent();
		if (dir) {
			if (adjacent !== null && adjacent.type === SURV_MAP.FEMALE) {
				this.action = new Love(dir, char, (adjacent as Female), () => this.finish_love(adjacent as Female));
			}
			else {
				const player_wins = this.does_player_win(adjacent);
				this.action = new Fight(dir, char, adjacent, player_wins, () => this.finish_fight(player_wins, adjacent));
			}

			this.level.mobmap[char.tile[1]][char.tile[0]].hidden = true;
			this.level.mobmap[adjacent.tile[1]][adjacent.tile[0]].hidden = true;

			adjacent.env_sound = null;
			this.update_environment_sound();

			return;
		}

		if (this.test_movement_input()) {
			return;
		}

		// Nothing happened, end movement
		char.sprite = new Sprite(char.url, char.anims.still.soffset, char.anims.still.frames);
	}

	update_environment_sound() {
		const current_sounds = this.level.get_sounds();
		const to_start = [...current_sounds].filter(x => !this.active_sounds.has(x));
		const to_stop = [...this.active_sounds].filter(x => !current_sounds.has(x));

		for (const sound of to_stop) {
			this.glob.resources.stop_sound(sound);
		}

		for (const sound of to_start) {
			this.glob.resources.play_sound(sound, true);
		}

		this.active_sounds = current_sounds;
	}

	does_player_win(opponent: Enemy | Predator) {
		// The player wins if the character is invincible, fights against an enemy, or has a high defense.
		return this.level.character.invincible ||
			opponent.type === SURV_MAP.ENEMY ||
			random_int(0, (opponent as Predator).attack) <= this.world.current_player.stats[ATTR.DEFENSE];
	}

	finish_feeding(food: number) {
		// Power food
		if (food >= 118) {
			this.level.character.invincible = true;
		}

		// Normal food
		else if (food < 36) {
			// Mapping from survival food to stats food.
			const food_type = [0, 2, 5, 1, 3, 4][Math.floor(food / 6)];
			this.world.current_player.eaten += this.world.current_player.stats[food_type];
			if (this.world.current_player.eaten > 1480) {
				this.world.current_player.eaten = 1480;
			}
			this.draw_symbols();
		}

		// Nothing happens with poison (it just steals your time by the lengthy animation)
		this.finish_movement();
	}

	finish_love(partner: Female) {
		partner.hidden = false;
		this.level.character.hidden = false;
		partner.type = SURV_MAP.UNRESPONSIVE;
		partner.sprite = this.action.offspring_sprite;
		if (partner.hasOwnProperty('env_sound')) {
			partner.env_sound = `offspring_${['purplus', 'kiwi', 'pesci', '_', 'amorph', 'chuck'][partner.species]}`;
		}
		this.world.current_player.loved++;
		if (this.world.current_player.loved > 10) {
			this.world.current_player.loved = 10;
		}
		this.steps--;
		this.draw_symbols();
		this.finish_movement();
	}

	finish_fight(player_wins: boolean, opponent: Enemy | Predator) {
		opponent.hidden = false;
		if (player_wins) {
			if (this.level.character.victories.length < 10) {
				if (opponent.type === SURV_MAP.ENEMY) {
					this.level.character.victories.push(opponent.species);
				}
				else if (this.glob.options.show_predators) { // Predator
					this.level.character.victories.push(opponent.species + 6);
				}
			}
			this.world.current_player.experience++;

			this.level.character.hidden = false;
			opponent.type = SURV_MAP.UNRESPONSIVE;
			opponent.sprite = this.action.final_opponent_sprite;
			// Mega dirty hack to enable crying sound *only* for crying dino
			if (opponent.species === PRED.DINO && opponent.sprite.offset[0] === 320) {
				opponent.env_sound = 'dino_cry';
			}
			this.draw_symbols();
			this.finish_movement();
		}
		else {
			opponent.sprite = new Sprite(opponent.url, opponent.anims.still.soffset, opponent.anims.still.frames);
			this.player_death();
		}
	}

	get_adjacent(): [DIR, ISurvivalCharacter | null] {
		const x = this.level.character.tile[0];
		const y = this.level.character.tile[1];

		if (this.level.mobmap[y - 1][x] !== null && (this.level.mobmap[y - 1][x] as ISurvivalCharacter).type !== SURV_MAP.UNRESPONSIVE) {
			return [DIR.N, this.level.mobmap[y - 1][x]];
		}

		if (this.level.mobmap[y][x + 1] !== null && (this.level.mobmap[y][x + 1] as ISurvivalCharacter).type !== SURV_MAP.UNRESPONSIVE) {
			return [DIR.E, this.level.mobmap[y][x + 1]];
		}

		if (this.level.mobmap[y + 1][x] !== null && (this.level.mobmap[y + 1][x] as ISurvivalCharacter).type !== SURV_MAP.UNRESPONSIVE) {
			return [DIR.S, this.level.mobmap[y + 1][x]];
		}

		if (this.level.mobmap[y][x - 1] !== null && (this.level.mobmap[y][x - 1] as ISurvivalCharacter).type !== SURV_MAP.UNRESPONSIVE) {
			return [DIR.W, this.level.mobmap[y][x - 1]];
		}

		return [DIR.X, null];
	}

	start_movement(dir: DIR) {
		const char = this.level.character;
		char.movement = dir;
		this.delay = anim_delays.movement;
		this.player_started = true;
		this.steps--;

		if (dir !== DIR.X) {
			this.level.mobmap[char.tile[1]][char.tile[0]] = null;
		}

		switch (dir) {
			case DIR.S:
				char.sprite = new Sprite(char.url, char.anims.south.soffset, char.anims.south.frames);
				char.tile[1]++;
				char.rel_pos = [0, -this.tile_dim[1]];
				break;
			case DIR.N:
				char.sprite = new Sprite(char.url, char.anims.north.soffset, char.anims.north.frames);
				char.tile[1]--;
				char.rel_pos = [0, this.tile_dim[1]];
				break;
			case DIR.E:
				char.sprite = new Sprite(char.url, char.anims.east.soffset, char.anims.east.frames);
				char.tile[0]++;
				char.rel_pos = [-this.tile_dim[0], 0];
				break;
			case DIR.W:
				char.sprite = new Sprite(char.url, char.anims.west.soffset, char.anims.west.frames);
				char.tile[0]--;
				char.rel_pos = [this.tile_dim[0], 0];
				break;
			case DIR.X: { // Feeding/waiting
				const ground_type = this.level.map[char.tile[1]][char.tile[0]];
				if (this.level.edible[ground_type] === '1') {
					this.action = new Feeding(char, this.level, ground_type, () => this.finish_feeding(ground_type));
					this.delay = anim_delays.feeding;
				}
				else {
					this.action = new Waiting(char, () => this.finish_feeding(100));
				}
				char.hidden = true;
				break;
			}
		}

		if (dir !== DIR.X) {
			this.level.mobmap[char.tile[1]][char.tile[0]] = char;
		}

		this.start_predator_movement();
		this.movement_active = true;
		this.draw_minimap();
	}

	resolve_movement(obj: ISurvivalCharacter, force = false) {
		if (!obj.movement) {
			return;
		}

		let finished_move = false;

		obj.sprite.update();

		switch (obj.movement) {
			case DIR.S:
				obj.rel_pos[1] += this.speed;
				finished_move = obj.rel_pos[1] >= 0;
				break;
			case DIR.N:
				obj.rel_pos[1] -= this.speed;
				finished_move = obj.rel_pos[1] <= 0;
				break;
			case DIR.W:
				obj.rel_pos[0] -= this.speed;
				finished_move = obj.rel_pos[0] <= 0;
				break;
			case DIR.E:
				obj.rel_pos[0] += this.speed;
				finished_move = obj.rel_pos[0] >= 0;
				break;
		}

		if (finished_move || force) {
			obj.rel_pos = [0, 0];
			obj.last_movement = obj.movement;
			obj.movement = 0;

			if (obj.type === SURV_MAP.PLAYER) {
				this.finish_movement();
			}
			else {
				obj.sprite = new Sprite(obj.url, obj.anims.still.soffset, obj.anims.still.frames);
			}
		}
	}

	start_predator_movement() {
		const player_pos = this.level.character.tile;
		const anim_delay = 0;
		const evasion = this.world.current_player.stats[ATTR.CAMOUFLAGE] * 4 + this.world.current_player.stats[ATTR.SPEED] * 2 + this.world.current_player.stats[ATTR.INTELLIGENCE];

		this.moving_predators = [];

		for (const predator of this.level.predators) {
			if (predator.type === SURV_MAP.UNRESPONSIVE) {
				continue;
			}
			const pos = predator.tile;

			const dx = Math.abs(pos[0] - player_pos[0]);
			const dy = Math.abs(pos[1] - player_pos[1]);
			const dist = Math.max(dx, dy);

			let scent_chance;

			switch (dist) {
				case 1: scent_chance = -1; break;
				case 2: scent_chance = 10; break;
				case 3: scent_chance = 5; break;
				default: scent_chance = 0;
			}
			scent_chance *= predator.scent;

			// Open directions. Note, that a predator may not go backwards!
			const dirs = this.level.get_dirs(predator.tile, predator.last_movement);
			const target_dirs = [0, 0];

			// If the player is right next to the predator, don't move.
			if (dx + dy === 1) {
				predator.movement = DIR.X;
				predator.last_movement = DIR.X;
			}

			// If the predator scents the player, try to get closer or don't move at all:
			// If possible, move closer on the axis where the predator is further away.
			// If not, move close on the other axis.
			// If both axes are equally close, prefer DIR.N/DIR.S over DIR.E/DIR.W.
			// If a move would put the predator further away from the player, don't move (that's not necessarily very smart, but the original behaviour).
			else if (scent_chance < 0 || (scent_chance > 0 && random_int(0, scent_chance - 1) > evasion)) {
				if (pos[1] - player_pos[1] > 0) {
					target_dirs[0] = DIR.N;
				}
				else {
					target_dirs[0] = DIR.S;
				}

				if (pos[0] - player_pos[0] > 0) {
					target_dirs[1] = DIR.W;
				}
				else {
					target_dirs[1] = DIR.E;
				}

				if (dx > dy) {
					target_dirs.reverse();
				}

				if (dirs.includes(target_dirs[0])) {
					predator.movement = target_dirs[0];
				}
				else if (dirs.includes(target_dirs[1])) {
					predator.movement = target_dirs[1];
				}
				else {
					predator.movement = DIR.X;
					predator.last_movement = DIR.X;
				}
			}

			// Otherwise move to a random position, if possible.
			else {
				if (dirs.length) {
					predator.movement = random_element(dirs);
				}
				else {
					predator.movement = DIR.X;
					predator.last_movement = DIR.X;
					continue;
				}
			}

			this.level.mobmap[pos[1]][pos[0]] = null;

			switch (predator.movement) {
				case DIR.N:
					pos[1]--;
					if (dist <= 5) {
						predator.sprite = new Sprite(predator.url, predator.anims.north.soffset, predator.anims.north.frames, anim_delay);
						predator.rel_pos = [0, this.tile_dim[1]];
					}
					break;
				case DIR.S:
					pos[1]++;
					if (dist <= 5) {
						predator.sprite = new Sprite(predator.url, predator.anims.south.soffset, predator.anims.south.frames, anim_delay);
						predator.rel_pos = [0, -this.tile_dim[1]];
					}
					break;
				case DIR.W:
					pos[0]--;
					if (dist <= 5) {
						predator.sprite = new Sprite(predator.url, predator.anims.west.soffset, predator.anims.west.frames, anim_delay);
						predator.rel_pos = [this.tile_dim[0], 0];
					}
					break;
				case DIR.E:
					pos[0]++;
					if (dist <= 5) {
						predator.sprite = new Sprite(predator.url, predator.anims.east.soffset, predator.anims.east.frames, anim_delay);
						predator.rel_pos = [-this.tile_dim[0], 0];
					}
					break;
			}

			this.level.mobmap[pos[1]][pos[0]] = predator;

			// If the predator is too far away, immediately set it to the new spot.
			// Otherwise, initiate visible movement.
			if (dist > 5) {
				predator.last_movement = predator.movement;
				predator.movement = 0;
			}
			else {
				this.moving_predators.push(predator);
			}
		}
	}

	suicide() {
		if (this.movement_active || this.action !== null) {
			return;
		}

		open_popup(this.glob.lang.popup_title, 'chuck_berry', this.glob.lang.suicide, (x: number) => { if (x === 1) { this.player_death(true); } }, this.glob.lang.no, this.glob.lang.yes);
	}

	player_death(delete_sprite = false) {
		this.world.current_player.deaths++;
		if (this.world.current_player.deaths > 10) {
			this.world.current_player.deaths = 10;
		}
		this.draw_symbols();

		const char = this.level.character;

		if (delete_sprite) {
			this.level.mobmap[char.tile[1]][char.tile[0]] = null;
		}
		this.level.place_player([random_int(20, 80), random_int(20, 80)]);
		char.sprite = new Sprite(char.url, char.anims.still.soffset, char.anims.still.frames);
		this.level.mobmap[char.tile[1]][char.tile[0]] = char;
		char.hidden = false;
		this.action = null;
		this.movement_active = false;
		this.movement_just_finished = true;
		this.delay_counter = 0;
		this.time = this.max_time;
		this.update_environment_sound();
		this.camera.move_to(char);
	}

	update() {
		this.test_movement_input();

		if (!this.movement_active && this.action === null) {
			const char = this.level.character;

			// Test for Quicksand
			// The player must stand on one of the empty tiles
			if (Math.random() <= 0.000055 &&
				[0, 12, 18, 65, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 119, 121].includes(this.level.map[char.tile[1]][char.tile[0]])) {
				this.level.mobmap[char.tile[1]][char.tile[0]] = null;
				this.action = new Quicksand(char, () => this.player_death(true));
			}

			// Test for Electro flower
			// The field left or right must be empty (tile 65) and no unit may be on it
			else if (Math.random() <= 0.000055 &&
				((this.level.map[char.tile[1]][char.tile[0] - 1] === 65 &&
					this.level.mobmap[char.tile[1]][char.tile[0] - 1] === null) ||
					(this.level.map[char.tile[1]][char.tile[0] + 1] === 65 &&
						this.level.mobmap[char.tile[1]][char.tile[0] + 1] === null))) {
				this.level.mobmap[char.tile[1]][char.tile[0]] = null;

				// If the left (western) field is empty, use that. Otherwise use the right field.
				if (this.level.map[char.tile[1]][char.tile[0] - 1] === 65 &&
					this.level.mobmap[char.tile[1]][char.tile[0] - 1] === null) {
					this.action = new Electro(DIR.E, char, () => this.player_death(true));
				}
				else {
					this.action = new Electro(DIR.W, char, () => this.player_death(true));
				}
			}

			else if (this.player_started) {
				this.time--;

				if (this.time <= 0) {
					this.time = this.max_time;
					this.start_movement(DIR.X);
				}
			}
		}

		if (this.movement_active) {
			this.delay_counter++;

			if (this.delay_counter >= this.delay) {
				this.delay_counter = 0;

				for (const predator of this.moving_predators) {
					this.resolve_movement(predator);
				}

				this.resolve_movement(this.level.character);
				this.camera.move_to(this.level.character);
			}
		}

		if (this.action !== null) {
			if (this.action.finished) {
				this.action.callback();
			}
			else {
				this.action.update();
			}
		}

		this.camera.update_visible_level();
	}

	cam_click(x: number, y: number) {
		x -= this.camera_offset[0];
		y -= this.camera_offset[1];

		if (x < 0 || y < 0) {
			this.clickdir = -1;
			return;
		}

		if (x >= this.tile_dim[0] * 3 && x < this.tile_dim[0] * 4 &&
			y >= this.tile_dim[1] * 3 && y < this.tile_dim[1] * 4) {
			this.clickdir = DIR.X;
			return;
		}

		// Center around 0 to make calculations easier
		x -= this.tile_dim[0] * 3.5;
		y -= this.tile_dim[1] * 3.5;

		if (y < 0 && Math.abs(y) >= Math.abs(x)) {
			this.clickdir = DIR.N;
		}
		else if (y > 0 && Math.abs(y) >= Math.abs(x)) {
			this.clickdir = DIR.S;
		}
		else if (x < 0 && Math.abs(x) > Math.abs(y)) {
			this.clickdir = DIR.W;
		}
		else if (x > 0 && Math.abs(x) > Math.abs(y)) {
			this.clickdir = DIR.E;
		}

	}

	cam_rightclickup(x: number, y: number) {
		x -= this.camera_offset[0];
		y -= this.camera_offset[1];

		if (x >= this.tile_dim[0] * 3 && x < this.tile_dim[0] * 4 &&
			y >= this.tile_dim[1] * 3 && y < this.tile_dim[1] * 4) {
			this.suicide();
		}
	}

	test_movement_input() {
		if (this.movement_active || this.action !== null) {
			return false;
		}

		if (input.isDown('DOWN') && this.level.is_unblocked(this.level.character.tile, DIR.S)) {
			this.start_movement(DIR.S);
		}

		else if (input.isDown('UP') && this.level.is_unblocked(this.level.character.tile, DIR.N)) {
			this.start_movement(DIR.N);
		}

		else if (input.isDown('LEFT') && this.level.is_unblocked(this.level.character.tile, DIR.W)) {
			this.start_movement(DIR.W);
		}

		else if (input.isDown('RIGHT') && this.level.is_unblocked(this.level.character.tile, DIR.E)) {
			this.start_movement(DIR.E);
		}

		else if (input.isDown('SPACE')) {
			this.start_movement(DIR.X);
		}

		else if (this.clickdir === 0 || (this.clickdir > 0 && this.level.is_unblocked(this.level.character.tile, this.clickdir))) {
			this.start_movement(this.clickdir);
		}

		else {
			return false;
		}

		return true;
	}

	calc_outcome() {
		let death_prob = this.world.current_player.deaths * 0.05;
		if (this.world.current_player.eaten < 20 * this.eating_div) {
			death_prob += (20 * this.eating_div - this.world.current_player.eaten) * 0.05 / this.eating_div;
		}
		if (death_prob > 0.9) {
			death_prob = 0.9;
		}

		for (let x = 1; x <= 26; x++) {
			for (let y = 1; y <= 26; y++) {
				if (this.world.map_positions[y][x] === this.world.current_player.id && Math.random() < death_prob) {
					this.world.map_positions[y][x] = -1;
					this.world.current_player.individuals--;
				}
			}
		}

		let loved = this.world.current_player.loved;
		// A little bonus if you have eaten alot. It's a bit more than in the original game, so you actually get a bonus when you fill the second row.
		if (this.world.current_player.eaten >= 20 * this.eating_div) {
			loved += Math.floor((this.world.current_player.eaten - 20 * this.eating_div) / (this.eating_div * 10));
		}

		this.world.current_player.toplace = Math.floor(loved * this.world.current_player.stats[ATTR.REPRODUCTION] / 20);
		this.world.current_player.toplace = clamp(this.world.current_player.toplace, loved, 20);

		this.world.current_player.tomove = Math.floor(this.world.current_player.stats[ATTR.SPEED] / 5);
	}

	next() {
		draw_rect(this.next_offset, this.next_dim);

		if (this.movement_active || this.action !== null) {
			return;
		}

		if (this.steps > 0) {
			open_popup(this.glob.lang.popup_title, 'chuck_berry', this.glob.lang.turn_finished, (x) => this.next_popup(x), this.glob.lang.no, this.glob.lang.yes);
		}
		else {
			this.next_popup(1);
		}
	}

	next_popup(answer: number) {
		if (answer === 1) {
			this.calc_outcome();
			if (this.world.current_player.individuals === 0 && !this.world.current_player.is_dead) {
				this.world.current_player.is_dead = true;
				open_popup(this.glob.lang.popup_title, this.world.current_player.id, this.glob.lang.dead, () => game.next_stage(), this.glob.lang.next);
			}
			else {
				this.glob.resources.stop_sound();
				game.next_stage();
			}
		}
	}
}
