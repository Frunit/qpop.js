import { Catastrophe } from "./catastrophe";
import { worldmap_size } from "./consts";
import { ATTR, DIR, PLAYER_TYPE, SCENE, WORLD_MAP, clamp, correct_world_tile, draw_base, draw_black_rect, draw_rect, open_popup, pop_random_element, random_element, random_int, shuffle, write_text } from "./helper";
import { Player } from "./player";
import { Sprite } from "./sprite";
import { anim_delays } from "./sprite_positions";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal, Tuple, TutorialType, WorldGlobal } from "./types";

// MAYBE: After a catastrophe, a symbol of the catastrophe could be shown in the lower right area. What to do with the avatar?

export class World implements Stage{
	id = SCENE.WORLD;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials: TutorialType[];
	glob: TechGlobal;
	world: WorldGlobal;

	private bg_pic: HTMLImageElement;
	private map_pics: HTMLImageElement;
	private spec_pics: HTMLImageElement;
	private gui_pics: HTMLImageElement;

	private ai_active = false;
	private ai_frame = 0;
	private ai_own_individuals: Point[] = [];
	private ai_fights: number[][] = Array.from(Array(worldmap_size[1]), () => Array(worldmap_size[0]).fill(0));

	private animation: Sprite | null = null;
	private animation_pos: Point[] = [[0, 0]];

	private wm_clickpos: Point | null = null;
	private wm_rightclickpos: Point | null = null;
	private wm_set_mode = 0; // 0 = no mode; 1 = set; 2 = remove TODO

	private catastrophe_status = 0; // 0 = no cata yet; 1 = cata called back; 2 = cata executing; 3 = cata finished TODO
	private catastrophe_type = -1;

	readonly map_dim: Dimension = [448, 448];
	readonly tile_dim: Dimension = [16, 16];
	readonly left_rect_dim: Dimension = [460, 460];
	readonly right_rect_dim: Dimension = [181, 439];
	readonly next_dim: Dimension = [181, 22];
	readonly calendar_dim: Dimension = [60, 44];
	readonly hygro_dim: Dimension = [40, 100];
	readonly temp_dim: Dimension = [40, 100];
	readonly spec_dim: Dimension = [64, 64];
	readonly bar_dim: Dimension = [100, 8];

	readonly map_offset: Point = [6, 26];
	readonly left_rect_offset: Point = [0, 20];
	readonly right_rect_offset: Point = [459, 20];
	readonly next_offset: Point = [459, 458];
	readonly calendar_offset: Point = [465, 26];
	readonly hygro_offset: Point = [545, 26];
	readonly temp_offset: Point = [585, 26];
	readonly spec_offset: Point = [465, 70];
	readonly calendar_text_offset: Point = [492, 55];
	readonly bar_icon_offset: Point = [465, 146];
	readonly bar_offset: Point = [485, 150];
	readonly toplace_offset: Point = [465, 286];
	readonly tomove_offset: Point = [465, 336];

	readonly bar_dy = 20;
	readonly minispec_delta: Point = [16, 25];

	readonly hygro_bar_offset: Point = [552, 118];
	readonly hygro_bar_dim: Dimension = [24, 82];
	readonly temp_bar_offset: Point = [604, 112];
	readonly temp_bar_dim: Dimension = [2, 76];
	readonly minispec_soffset: Point = [320, 16];

	readonly bar_colors = ['#ff00ff', '#00ff7f', '#000082', '#ffffff', '#00ff00', '#820000'];
	readonly calendar_soffsets: Point[] = [[0, 100], [60, 100]];
	readonly hygro_soffsets: Point[] = [[0, 0], [40, 0]];
	readonly temp_soffsets: Point[] = [[80, 0], [120, 0]];
	readonly spec_soffsets: Point[] = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];

	constructor(glob: TechGlobal, world: WorldGlobal) {
		this.glob = glob;
		this.world = world;

		this.bg_pic = glob.resources.get_image('gfx/dark_bg.png');
		this.map_pics = glob.resources.get_image('gfx/world.png');
		this.spec_pics = glob.resources.get_image('gfx/species.png');
		this.gui_pics = glob.resources.get_image('gfx/world_gui.png');

		this.tutorials = [
			{
				'name': 'wm_units',
				'pos': [75, 155],
				'arrows': [{ dir: DIR.E, offset: 130 }],
				'highlight': [0, 0, 640, 480],
			},
		];
	}

	initialize() {
		this.glob.resources.play_music(`spec${this.world.current_player.id}`);

		this.redraw();

		if (this.world.turn === 1) {
			this.tutorials.push({
				'name': 'wm_shadows',
				'pos': [80, 205],
				'arrows': [{ dir: DIR.E, offset: 130 }],
				'highlight': [this.right_rect_offset[0], this.tomove_offset[1] - 3, 640, this.tomove_offset[1] + this.tile_dim[1] + 3],
			});
			this.tutorials.push({
				'name': 'wm_rightclick',
				'pos': [80, 50],
				'arrows': [{ dir: DIR.E, offset: 50 }],
				'highlight': [this.spec_offset[0], this.spec_offset[1], this.spec_offset[0] + this.spec_dim[0], this.spec_offset[1] + this.spec_dim[1]],
			});
		}

		game.tutorial();

		if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
			this.ai();
		}

		this.catastrophe_status = 0;
	}

	next_player() {
		this.glob.resources.play_music(`spec${this.world.current_player.id}`);
		this.draw_avatar();
		this.draw_minispec();

		if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
			this.ai();
		}
	}

	redraw() {
		draw_base();
		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		draw_rect(this.left_rect_offset, this.left_rect_dim); // World rectangle
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

		// Black border around world
		draw_black_rect([this.map_offset[0] - 1, this.map_offset[1] - 1], [this.map_dim[0] + 1, this.map_dim[1] + 1]);

		// World
		this.draw_worldmap();
		this.clickareas.push({
			x1: this.map_offset[0],
			y1: this.map_offset[1],
			x2: this.map_offset[0] + this.map_dim[0],
			y2: this.map_offset[1] + this.map_dim[1],
			down: (x: number, y: number) => this.wm_click(x, y),
			up: () => this.wm_clickup(),
			blur: () => this.wm_clickup(),
			move: (x: number, y: number) => this.wm_move(x, y),
			default_pointer: true
		});

		this.rightclickareas.push({
			x1: this.map_offset[0],
			y1: this.map_offset[1],
			x2: this.map_offset[0] + this.map_dim[0],
			y2: this.map_offset[1] + this.map_dim[1],
			down: (x: number, y: number) => this.wm_rightclick(x, y),
			up: () => this.wm_rightclickup(),
			blur: () => this.wm_rightclickup(),
			move: (x: number, y: number) => this.wm_rightmove(x, y)
		});

		// Calendar
		const soffset = (this.world.turn === 0) ? this.calendar_soffsets[1] : this.calendar_soffsets[0];
		this.glob.ctx.drawImage(this.gui_pics,
			soffset[0], soffset[1],
			this.calendar_dim[0], this.calendar_dim[1],
			this.calendar_offset[0], this.calendar_offset[1],
			this.calendar_dim[0], this.calendar_dim[1]);

		if (this.world.turn > 0) {
			this.glob.ctx.save();
			this.glob.ctx.font = '15px serif';
			this.glob.ctx.textAlign = 'center';
			if (this.world.turn !== this.world.max_turns) {
				this.glob.ctx.fillStyle = '#000000';
			}
			else {
				this.glob.ctx.fillStyle = '#ff0000';
			}
			this.glob.ctx.fillText(this.world.turn.toString(), this.calendar_text_offset[0], this.calendar_text_offset[1]);
			this.glob.ctx.restore();
		}

		// Humidity
		this.glob.ctx.drawImage(this.gui_pics,
			this.hygro_soffsets[0][0], this.hygro_soffsets[0][1],
			this.hygro_dim[0], this.hygro_dim[1],
			this.hygro_offset[0], this.hygro_offset[1],
			this.hygro_dim[0], this.hygro_dim[1]);

		this.glob.ctx.save();
		this.glob.ctx.fillStyle = '#0000ff';
		let height = Math.floor((this.hygro_bar_dim[1] * this.world.humid) / 100) + 2;
		this.glob.ctx.beginPath();
		this.glob.ctx.fillRect(this.hygro_bar_offset[0], this.hygro_bar_offset[1] - height, this.hygro_bar_dim[0], height);
		this.glob.ctx.restore();

		this.glob.ctx.drawImage(this.gui_pics,
			this.hygro_soffsets[1][0], this.hygro_soffsets[1][1],
			this.hygro_dim[0], this.hygro_dim[1],
			this.hygro_offset[0], this.hygro_offset[1],
			this.hygro_dim[0], this.hygro_dim[1]);

		// Temperature
		this.glob.ctx.drawImage(this.gui_pics,
			this.temp_soffsets[0][0], this.temp_soffsets[0][1],
			this.temp_dim[0], this.temp_dim[1],
			this.temp_offset[0], this.temp_offset[1],
			this.temp_dim[0], this.temp_dim[1]);

		this.glob.ctx.save();
		this.glob.ctx.fillStyle = '#ff0000';
		height = Math.floor((this.temp_bar_dim[1] * this.world.temp) / 100);
		this.glob.ctx.beginPath();
		this.glob.ctx.fillRect(this.temp_bar_offset[0], this.temp_bar_offset[1] - height, this.temp_bar_dim[0], height);
		this.glob.ctx.restore();

		this.glob.ctx.drawImage(this.gui_pics,
			this.temp_soffsets[1][0], this.temp_soffsets[1][1],
			this.temp_dim[0], this.temp_dim[1],
			this.temp_offset[0], this.temp_offset[1],
			this.temp_dim[0], this.temp_dim[1]);

		// Picture of current species
		this.draw_avatar();
		this.clickareas.push({
			x1: this.spec_offset[0],
			y1: this.spec_offset[1],
			x2: this.spec_offset[0] + this.spec_dim[0],
			y2: this.spec_offset[1] + this.spec_dim[1],
			down: () => this.avatar_click(),
			up: () => this.avatar_clickup(),
			blur: () => this.avatar_clickup(),
		});

		// Bar with number of individuals
		this.draw_bar();

		// Individuals to place and move
		this.draw_minispec();

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.next(), 'reset': true },
		];
	}

	render() {
		if (this.animation) {
			for (const pos of this.animation_pos) {
				this.draw_wm_part(pos[0], pos[1], false);
			}
			this.animation.render(this.glob.ctx, [this.map_offset[0] + this.animation_pos[0][0] * this.tile_dim[0], this.map_offset[1] + this.animation_pos[0][1] * this.tile_dim[1]]);
		}
	}

	update() {
		if (this.animation) {
			this.animation.update();
			if (this.animation.finished && this.animation.callback !== null) {
				this.animation.callback();
			}
		}

		else if (this.ai_active) {
			this.ai_step();
		}

		else if (this.catastrophe_status === 1) {
			this.catastrophe_exec();
		}
	}

	next() {
		draw_rect(this.next_offset, this.next_dim);

		if (this.ai_active || this.animation !== null) {
			return;
		}

		if (this.catastrophe_status === 3 || this.world.current_player.toplace === 0) {
			this.next_popup(1);
		}
		else if (this.world.current_player.individuals === 0) {
			open_popup(this.glob.lang.popup_title, 'dino', this.glob.lang.where_to_live, () => { }, this.glob.lang.next);
		}
		else {
			open_popup(this.glob.lang.popup_title, 'chuck_berry', this.glob.lang.turn_finished, (x: number) => this.next_popup(x), this.glob.lang.no, this.glob.lang.yes);
		}
	}

	next_popup(answer: number) {
		if (answer === 1) {
			if (this.world.current_player.individuals === 0 && !this.world.current_player.is_dead) {
				this.world.current_player.is_dead = true;
				open_popup(this.glob.lang.popup_title, this.world.current_player.id, this.glob.lang.dead, () => this.next_popup(1), this.glob.lang.next);
				return;
			}

			if (this.catastrophe_status === 3) {
				// The catastrophe is finished, distribute evolution points.
				// The first turn has no catastrophe, but the evolution points are fixed to 100, so no special condition here
				const scores = [];
				for (let i = 0; i < 6; i++) {
					scores.push([i, this.world.players[i].individuals]);
				}

				scores.sort((a, b) => b[1] - a[1]);

				this.world.players[scores[0][0]].evo_score = game.evo_points[0];
				for (let i = 1; i < 6; i++) {
					const p = this.world.players[scores[i][0]];
					if (p.is_dead || p.type === PLAYER_TYPE.NOBODY) {
						p.evo_score = 0;
					}
					else if (scores[i - 1][1] === scores[i][1]) {
						p.evo_score = this.world.players[scores[i - 1][0]].evo_score;
					}
					else {
						p.evo_score = game.evo_points[i];
					}
				}
			}

			game.next_stage();
		}
	}

	catastrophe_start() {
		const self = this; // TODO: Muss das wirklich sein mit self??
		game.backstage.push(game.stage);
		game.stage = new Catastrophe(this.glob, self.catastrophe_callback);
		game.stage.initialize();
	}

	catastrophe_callback(type) {
		game.stage = game.backstage.pop();
		game.stage.catastrophe_type = type;
		game.stage.catastrophe_status = 1;
	}

	catastrophe_exec() {
		this.catastrophe_status = 2;
		this.redraw();
		switch (this.catastrophe_type) {
			case 0: // Warming
				this.world.temp += 10;
				this.world.humid -= 10;
				this.world.water_level -= 2;
				this.catastrophe_finish();
				break;
			case 1: // Cooling
				this.world.temp -= 10;
				this.world.humid += 10;
				this.catastrophe_finish();
				break;
			case 2: { // Comet
				this.world.temp -= 10;
				this.world.water_level -= 3;

				const impactable: Point[] = [];
				for (let x = 10; x <= 18; x++) {
					for (let y = 10; y <= 18; y++) {
						if (this.world.world_map[y][x] !== WORLD_MAP.WATER) {
							impactable.push([x, y]);
						}
					}
				}

				// TODO: safeguard against empty impactable!
				const [x, y] = random_element(impactable);

				this.animation_pos = [];

				for (let xx = x - 1; xx <= x + 1; xx++) {
					for (let yy = y - 1; yy <= y + 1; yy++) {
						this.animation_pos.push([xx, yy]);
					}
				}

				// Big Explosion
				this.animation = new Sprite(this.map_pics, [0, 32],
					[[0, 0], [48, 0], [96, 0], [144, 0], [192, 0], [240, 0], [288, 0], [336, 0], [384, 0], [432, 0], [480, 0], [528, 0]], anim_delays.world, [48, 48],
					true, () => this.comet_finish());
				break;
			}
			case 3: { // Plague
				const creatures = [];
				for (let x = 3; x <= 24; x++) {
					for (let y = 3; y <= 24; y++) {
						if (this.world.map_positions[y][x] >= 0) {
							creatures.push([x, y]);
						}
					}
				}

				// TODO: safeguard against empty creatures
				const [x, y] = random_element(creatures);

				// MAYBE: This could be animated such that not all creatures disappear simultaneously but one after the other
				for (let xx = x - 3; xx <= x + 3; xx++) {
					for (let yy = y - 3; yy <= y + 3; yy++) {
						if (this.world.map_positions[yy][xx] >= 0 && random_int(0, 1)) {
							this.kill_individual(xx, yy);
						}
					}
				}
				this.catastrophe_finish();
				break;
			}
			case 4: { // Volcano
				const volcanos: Point[] = [];
				for (let x = 3; x <= 24; x++) {
					for (let y = 3; y <= 24; y++) {
						if (this.world.world_map[y][x] === WORLD_MAP.MOUNTAIN) {
							volcanos.push([x, y]);
						}
					}
				}
				this.volcano_step(5, volcanos);
				break;
			}
			case 5: // Flood
				this.world.temp += 10;
				this.world.water_level += 5;
				this.catastrophe_finish();
				break;
			case 6: // Earthquake
				this.world.height_map = create_height_map();
				this.catastrophe_finish();
				break;
			case 7: { // Humans
				const land: Point[] = [];
				for (let x = 10; x <= 18; x++) {
					for (let y = 10; y <= 18; y++) {
						if (this.world.world_map[y][x] !== WORLD_MAP.WATER) {
							land.push([x, y]);
						}
					}
				}

				// TODO: safeguard against empty land
				const [x, y] = random_element(land);
				this.animation_pos = [[x, y]];

				this.animation = new Sprite(this.map_pics, [512, 16],
					[[0, 0], [16, 0], [32, 0], [48, 0], [0, 0], [16, 0], [32, 0], [48, 0]], anim_delays.world, [16, 16],
					true, () => this.humans_finish());
				break;
			}
			case 8: { // Cosmic rays
				for (const player of this.world.players) {
					if (player.type !== PLAYER_TYPE.NOBODY && !player.is_dead) {
						const stats: Tuple<number, 13> = [...player.stats];
						shuffle(stats);
						player.stats = [...stats];
					}
				}
				this.catastrophe_finish();
				break;
			}
			default:
				console.warn(this.catastrophe_type);
				open_popup(this.glob.lang.popup_title, 'dino_cries', 'Wrong catastrophe code. This should never ever happen!',
					() => { }, 'Oh no!');
		}
	}

	catastrophe_finish() {
		if (this.catastrophe_status !== 3) {
			this.world.temp = clamp(this.world.temp, 0, 100);
			this.world.humid = clamp(this.world.humid, 0, 100);
			this.world.water_level = clamp(this.world.water_level, 0, 100);

			this.animation = null;
			this.world.world_map = create_world_map(this.catastrophe_type === 6 ? null : this.world.world_map, this.world.height_map, this.world.water_level, this.world.mountain_level, this.world.temp, this.world.humid);

			for (let y = 1; y < worldmap_size[1] - 1; y++) {
				for (let x = 1; x < worldmap_size[0] - 1; x++) {
					if (this.world.map_positions[y][x] >= 0 && (this.world.world_map[y][x] === WORLD_MAP.WATER || this.world.world_map[y][x] >= WORLD_MAP.MOUNTAIN)) {
						this.kill_individual(x, y);
					}
				}
			}
		}

		this.redraw();
		this.catastrophe_status = 3;

		for (const player of this.world.players) {
			if (player.type !== PLAYER_TYPE.NOBODY && !player.is_dead && player.individuals === 0) {
				player.is_dead = true;
				open_popup(this.glob.lang.popup_title, player.id, this.glob.lang.dead, () => this.catastrophe_finish(), this.glob.lang.next);
				return;
			}
		}

		if (!game.seen_tutorials.has('catastrophe')) {
			this.tutorials.push({
				name: 'catastrophe',
				pos: [140, 150],
				arrows: [],
				highlight: [0, 0, 640, 480],
			});
		}

		if (!game.seen_tutorials.has(`catastrophe${this.catastrophe_type}`)) {
			this.tutorials.push({
				name: `catastrophe${this.catastrophe_type}`,
				pos: [140, 110],
				arrows: [],
				highlight: [0, 0, 640, 480],
			});
		}

		game.tutorial();
	}

	comet_finish() {
		const [x, y] = this.animation_pos[0];
		for (let xx = x; xx <= x + 2; xx++) {
			for (let yy = y; yy <= y + 2; yy++) {
				this.world.height_map[yy][xx] = 100;
				this.world.world_map[yy][xx] = WORLD_MAP.MOUNTAIN;
			}
		}
		this.world.world_map[y + 1][x + 1] = WORLD_MAP.CRATER;

		this.catastrophe_finish();
	}

	humans_finish() {
		const [x, y] = this.animation_pos[0];
		this.world.world_map[y][x] = WORLD_MAP.HUMANS;
		this.world.humans_present = true;
		this.catastrophe_finish();
	}

	volcano_step(volcanos_left: number, positions: Point[]) {
		if (volcanos_left === 0) {
			this.catastrophe_finish();
			return;
		}

		this.draw_worldmap();

		// TODO: safeguard against empty positions
		const [x, y] = random_element(positions);

		for (let xx = x - 1; xx <= x + 1; xx++) {
			for (let yy = y - 1; yy <= y + 1; yy++) {
				this.kill_individual(xx, yy);
			}
		}

		this.animation = new Sprite(this.map_pics, [512, 16],
			[[0, 0], [16, 0], [32, 0], [48, 0], [0, 0], [16, 0], [32, 0], [48, 0]], anim_delays.world, [16, 16],
			true, () => this.volcano_step(volcanos_left - 1, positions));
		this.animation_pos = [[x, y]];
	}

	kill_individual(x: number, y: number) {
		const player_num = this.world.map_positions[y][x];
		if (player_num >= 0) {
			this.world.map_positions[y][x] = -1;
			this.world.players[player_num].individuals--;
		}
	}

	take_individual(x: number, y: number) {
		this.world.map_positions[y][x] = -1;
		this.world.current_player.toplace++;
		this.world.current_player.tomove--;
		this.world.current_player.individuals--;
		this.draw_bar();
		this.draw_minispec();
		this.draw_wm_part(x, y);
	}

	fight(x: number, y: number) {
		const attack = this.world.current_player.stats[ATTR.ATTACK] + this.world.current_player.stats[ATTR.INTELLIGENCE] / 2 + this.world.current_player.experience * 10 + this.world.current_player.stats[this.world.world_map[y][x] - WORLD_MAP.RANGONES];

		const enemy = this.world.players[this.world.map_positions[y][x]];
		const defense = enemy.stats[ATTR.DEFENSE] + enemy.stats[ATTR.INTELLIGENCE] / 2 + enemy.experience * 10 + enemy.stats[this.world.world_map[y][x] - WORLD_MAP.RANGONES];

		const winner = (attack + random_int(0, attack) > defense + random_int(0, defense)) ? this.world.current_player.id : enemy.id;

		this.animation = new Sprite(this.map_pics, [512, 16],
			[[0, 0], [16, 0], [32, 0], [48, 0], [0, 0], [16, 0], [32, 0], [48, 0]], anim_delays.world, [16, 16],
			true, () => this.fight_end(winner, enemy, x, y));

		this.animation_pos = [[x, y]];

		this.glob.resources.play_sound('world_fight');
	}

	fight_end(winner: number, enemy: Player, x: number, y: number) {
		if (winner === this.world.current_player.id) {
			enemy.individuals--;
			this.world.map_positions[y][x] = this.world.current_player.id;
			this.world.current_player.individuals++;
			if (this.world.current_player.type === PLAYER_TYPE.COMPUTER) {
				this.ai_own_individuals.push([x, y]);
			}
		}
		this.world.current_player.toplace--;
		this.draw_wm_part(x, y);
		this.draw_bar();
		this.draw_minispec();

		this.animation = null;

		if (enemy.individuals === 0) {
			enemy.is_dead = true;
			open_popup(this.glob.lang.popup_title, enemy.id, this.glob.lang.dead, () => { }, this.glob.lang.next);
		}
	}

	set_individual(x: number, y: number) {
		// Fight against another player
		if (this.world.map_positions[y][x] >= 0) {
			if (this.world.turn !== 0) {
				// No one may attack during the first turn
				this.fight(x, y);
			}
			return false;
		}

		// Normal click in the neighborhood
		this.world.map_positions[y][x] = this.world.current_player.id;
		this.world.current_player.toplace--;
		this.world.current_player.individuals++;
		this.draw_bar();
		this.draw_minispec();
		this.draw_wm_part(x, y);

		return true;
	}

	wm_rightclick(x: number, y: number, raw = true) {
		if (this.ai_active || this.animation !== null) {
			return;
		}

		if (raw) {
			x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
			y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);
		}

		this.wm_rightclickpos = [x, y];

		// Clicked on individual -> hide it
		if (this.world.map_positions[y][x] >= 0) {
			this.draw_wm_part(x, y, false);
		}
	}

	wm_rightclickup() {
		if (this.wm_rightclickpos !== null) {
			const [x, y] = this.wm_rightclickpos;
			this.wm_rightclickpos = null;

			// Show the individual again
			this.draw_wm_part(x, y, true);
		}
	}

	wm_rightmove(x: number, y: number) {
		if (this.wm_rightclickpos !== null) {
			x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
			y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

			if (x !== this.wm_rightclickpos[0] || y !== this.wm_rightclickpos[1]) {
				this.wm_rightclickup();
				this.wm_rightclick(x, y, false);
			}
		}
	}

	wm_click(x: number, y: number, raw = true) {
		if (this.ai_active || this.animation !== null || this.catastrophe_status > 0) {
			return;
		}

		if (raw) {
			x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
			y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);
		}

		// This can happen when the mouse is moved too fast
		if (x < 0 || x >= worldmap_size[0] || y < 0 || y >= worldmap_size[1]) {
			return;
		}

		this.wm_clickpos = [x, y];

		// Clicked on own individual -> take it
		if (this.world.map_positions[y][x] === this.world.current_player.id) {
			// But only, if you still can move individuals
			if (this.world.current_player.tomove && this.world.current_player.toplace < 20 && this.world.current_player.individuals > 1 && this.wm_set_mode !== 1) {
				this.take_individual(x, y);
				this.wm_set_mode = 2;
			}
		}
		else if (this.world.current_player.toplace &&
			this.world.world_map[y][x] >= WORLD_MAP.RANGONES &&
			this.world.world_map[y][x] <= WORLD_MAP.DESERT &&
			this.is_neighbour(this.world.current_player.id, x, y) &&
			this.wm_set_mode !== 2) {
			this.set_individual(x, y);
			this.wm_set_mode = 1;
		}
	}

	wm_clickup() {
		this.wm_set_mode = 0;
		this.wm_clickpos = null;
	}

	wm_move(x: number, y: number) {
		if (this.wm_clickpos !== null && this.glob.options.wm_click_and_hold) {
			x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
			y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

			if (x !== this.wm_clickpos[0] || y !== this.wm_clickpos[1]) {
				this.wm_click(x, y, false);
			}
		}
	}

	avatar_click() {
		this.draw_worldmap(true);
	}

	avatar_clickup() {
		this.draw_worldmap(false);
	}

	is_neighbour(num: number, x: number, y: number) {
		// If the player does not have any individuals (first turn), all fields are
		// neighbored.
		// This function is only called for land and the world border consists of
		// water, so I don't need the check if x or y +/-1 exist
		return (this.world.current_player.individuals === 0 ||
			this.world.map_positions[y][x - 1] === num ||
			this.world.map_positions[y][x + 1] === num ||
			this.world.map_positions[y - 1][x] === num ||
			this.world.map_positions[y + 1][x] === num);
	}

	ai() {
		this.glob.canvas.style.cursor = 'wait';
		this.ai_active = true;
		this.ai_frame = 0;

		this.ai_own_individuals = [];
		for (let x = 1; x < worldmap_size[0] - 1; x++) {
			for (let y = 1; y < worldmap_size[1] - 1; y++) {
				if (this.world.map_positions[y][x] === this.world.current_player.id) {
					this.ai_own_individuals.push([x, y]);
				}
			}
		}

		this.ai_fights = Array.from(Array(worldmap_size[1]), () => Array(worldmap_size[0]).fill(0));

		// In the first turn, give AI a high score for a random plant to force it to
		// stick to that plant. The high score is removed at the end of AI movement.
		if (this.world.turn === 0) {
			this.world.current_player.stats[random_int(0, 5)] = 100;
		}
	}

	ai_step() {
		this.ai_frame++;
		if (this.ai_frame < this.glob.options.wm_ai_delay) {
			return;
		}
		this.ai_frame = 0;

		if (this.world.current_player.toplace === 0) {
			// No more units to place (but may to move)
			if (this.world.current_player.tomove === 0 || this.world.current_player.individuals < 2) {
				// No more shadows or only one individual on map (that cannot be removed)
				this.ai_end();
				return;
			}

			// Only use shadows (movements) if no individuals for placement are left
			if(this.ai_own_individuals.length) {
				const to_remove = pop_random_element(this.ai_own_individuals);
				this.take_individual(to_remove[0], to_remove[1]);
			}
			return;
		}

		let depth = this.world.current_player.iq;
		if (this.world.turn === 0) {
			depth = 4; // Make the AI smarter in the first turn to avoid islands etc.
		}
		let best_value = -99999;
		let best_move: Point | null = null;

		for (const move of this.ai_possible_moves(this.ai_own_individuals)) {
			const value = this.ai_rate_move(move[0], move[1], depth);
			if (value > best_value) {
				best_value = value;
				best_move = move;
			}
		}

		if (best_move === null) {
			// The AI cannot physically move anymore
			this.ai_end();
			return;
		}

		const was_set = this.set_individual(best_move[0], best_move[1]);
		if (was_set) {
			this.ai_own_individuals.push(best_move);
		}
		else {
			this.ai_fights[best_move[1]][best_move[0]]++;
		}
	}

	ai_end() {
		// The AI gets a high score for one random plant to force it to select one
		// plant. This is reset here.
		if (this.world.turn === 0) {
			for (let i = 0; i <= 5; i++) {
				this.world.current_player.stats[i] = 10;
			}
		}
		this.world.current_player.toplace = 0;
		this.world.current_player.tomove = 0;
		this.ai_active = false;
		this.draw_minispec();
		this.glob.canvas.style.cursor = 'default';
		if (this.glob.options.wm_ai_auto_continue && !game.is_last_player()) {
			this.next();
		}
	}

	ai_rate_move(x: number, y: number, depth: number): number {
		let value = 0;

		if (this.world.turn === 0 && this.world.map_positions[y][x] !== -1) {
			return -100000;
		}

		for (let xx = Math.max(1, x - depth); xx < Math.min(worldmap_size[0] - 1, x + depth); xx++) {
			for (let yy = Math.max(1, y - depth); yy < Math.min(worldmap_size[1] - 1, y + depth); yy++) {
				// Closer fields are more important
				const weight = depth + 1 - Math.max(Math.abs(xx - x), Math.abs(yy - y));

				// Not too close to water to protect from catastrophes
				if (this.world.world_map[yy][xx] === WORLD_MAP.WATER) {
					value -= 20 * weight;
				}
				else if (this.world.map_positions[yy][xx] >= 0 && this.world.map_positions[yy][xx] !== this.world.current_player.id) {
					// In the first turn, the players should be placed with some distance to each other
					if (this.world.turn === 0) {
						value -= 100 * weight;
					}
					else {
						const player = this.world.current_player;
						const enemy = this.world.players[this.world.map_positions[yy][xx]];
						const winning_chance = player.stats[this.world.world_map[yy][xx] - WORLD_MAP.RANGONES] +
							player.stats[ATTR.ATTACK] + player.stats[ATTR.INTELLIGENCE] / 4 -
							enemy.stats[this.world.world_map[yy][xx] - WORLD_MAP.RANGONES] -
							enemy.stats[ATTR.DEFENSE] - enemy.stats[ATTR.INTELLIGENCE] / 4;
						value += winning_chance * weight;
						// Discourage fights that were fought before
						value -= this.ai_fights[yy][xx] * 100 * weight;
					}
				}
				else if (this.world.world_map[yy][xx] >= WORLD_MAP.RANGONES && this.world.world_map[yy][xx] <= WORLD_MAP.FIREGRASS) {
					value += this.world.players[this.world.current_player.id].stats[this.world.world_map[yy][xx] - WORLD_MAP.RANGONES] * weight;
				}
			}
		}

		return value;
	}

	ai_possible_moves(individuals: Point[]): Point[] {
		const possible_moves: Point[] = [];
		if (individuals.length === 0) {
			for (let x = 1; x < worldmap_size[0] - 1; x++) {
				for (let y = 1; y < worldmap_size[1] - 1; y++) {
					if (this.world.map_positions[y][x] === -1 && this.world.world_map[y][x] >= WORLD_MAP.RANGONES && this.world.world_map[y][x] <= WORLD_MAP.DESERT) {
						possible_moves.push([x, y]);
					}
				}
			}
		}
		else {
			for (const ind of individuals) {
				const x = ind[0];
				const y = ind[1];
				const four_moves: Point[] = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
				for (const pos of four_moves) {
					const xx = pos[0];
					const yy = pos[1];
					if (possible_moves.indexOf(pos) === -1 && this.world.map_positions[yy][xx] !== this.world.current_player.id && this.world.world_map[yy][xx] >= WORLD_MAP.RANGONES && this.world.world_map[yy][xx] <= WORLD_MAP.DESERT) {
						possible_moves.push(pos);
					}
				}
			}
		}

		return possible_moves;
	}

	draw_avatar() {
		const soffset = this.spec_soffsets[this.world.current_player.id];

		this.glob.ctx.drawImage(this.bg_pic,
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1],
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1]);

		this.glob.ctx.drawImage(this.spec_pics,
			soffset[0], soffset[1],
			this.spec_dim[0], this.spec_dim[1],
			this.spec_offset[0], this.spec_offset[1],
			this.spec_dim[0], this.spec_dim[1]);
	}

	draw_bar() {
		const w = this.bar_offset[0] - this.bar_icon_offset[0] + this.bar_dim[0];
		const h = this.bar_dy * this.world.players.length;
		this.glob.ctx.drawImage(this.bg_pic,
			this.bar_icon_offset[0], this.bar_icon_offset[1],
			w, h,
			this.bar_icon_offset[0], this.bar_icon_offset[1],
			w, h);

		let max_individuals = 0;
		for (const player of this.world.players) {
			if (player.individuals > max_individuals) {
				max_individuals = player.individuals;
			}
		}

		for (let i = 0; i < this.world.players.length; i++) {
			this.glob.ctx.drawImage(this.map_pics,
				this.minispec_soffset[0] + 16 * i, this.minispec_soffset[1],
				this.tile_dim[0], this.tile_dim[1],
				this.bar_icon_offset[0], this.bar_icon_offset[1] + this.bar_dy * i,
				this.tile_dim[0], this.tile_dim[1]);

			if (max_individuals) {
				this.glob.ctx.save();
				this.glob.ctx.beginPath();
				this.glob.ctx.fillStyle = this.bar_colors[i];
				this.glob.ctx.fillRect(this.bar_offset[0], this.bar_offset[1] + this.bar_dy * i, this.bar_dim[0] * this.world.players[i].individuals / max_individuals, this.bar_dim[1]);
				this.glob.ctx.restore();
			}
		}
	}

	draw_minispec() {
		const w = this.minispec_delta[0] * 10;
		const h = this.tomove_offset[1] - this.toplace_offset[1] + this.minispec_delta[1] * 3;
		this.glob.ctx.drawImage(this.bg_pic,
			this.toplace_offset[0], this.toplace_offset[1],
			w, h,
			this.toplace_offset[0], this.toplace_offset[1],
			w, h);

		for (let i = 0; i < this.world.current_player.toplace; i++) {
			this.glob.ctx.drawImage(this.map_pics,
				this.minispec_soffset[0] + this.tile_dim[0] * this.world.current_player.id, this.minispec_soffset[1],
				this.tile_dim[0], this.tile_dim[1],
				this.toplace_offset[0] + this.minispec_delta[0] * (i % 10), this.toplace_offset[1] + this.minispec_delta[1] * Math.floor(i / 10),
				this.tile_dim[0], this.tile_dim[1]);
		}

		for (let i = 0; i < this.world.current_player.tomove; i++) {
			this.glob.ctx.drawImage(this.map_pics,
				this.minispec_soffset[0] + this.tile_dim[0] * (this.world.current_player.id + 6), this.minispec_soffset[1],
				this.tile_dim[0], this.tile_dim[1],
				this.tomove_offset[0] + this.minispec_delta[0] * (i % 10), this.tomove_offset[1] + this.minispec_delta[1] * Math.floor(i / 10),
				this.tile_dim[0], this.tile_dim[1]);
		}
	}

	draw_worldmap(shadow = false) {
		for (let y = 0; y < worldmap_size[1]; y++) {
			for (let x = 0; x < worldmap_size[0]; x++) {
				this.draw_wm_part(x, y, true, shadow);
			}
		}
	}

	draw_wm_part(x: number, y: number, show_spec = true, shadow = false) {
		let tile = 0;
		if (this.world.world_map[y][x] === WORLD_MAP.WATER) {
			tile = this.coast_tile(x, y);
		}
		else {
			tile = this.world.world_map[y][x] + 46;
		}

		const soffset = [(tile % 37) * this.tile_dim[0], Math.floor(tile / 37) * this.tile_dim[0]];

		this.glob.ctx.drawImage(this.map_pics,
			soffset[0], soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.map_offset[0] + x * this.tile_dim[0], this.map_offset[1] + y * this.tile_dim[1],
			this.tile_dim[0], this.tile_dim[1]);

		if (show_spec && this.world.map_positions[y][x] >= 0) {
			const shadow_offset = shadow ? 6 : 0;

			this.glob.ctx.save();
			this.glob.ctx.globalAlpha = shadow ? 0.3 : 1;

			this.glob.ctx.drawImage(this.map_pics,
				this.minispec_soffset[0] + this.tile_dim[0] * (this.world.map_positions[y][x] + shadow_offset), this.minispec_soffset[1],
				this.tile_dim[0], this.tile_dim[1],
				this.map_offset[0] + x * this.tile_dim[0], this.map_offset[1] + y * this.tile_dim[1],
				this.tile_dim[0], this.tile_dim[1]);

			this.glob.ctx.restore();
		}
	}

	coast_tile(x: number, y: number) {
		let idx = 0;

		if (y > 0 && this.world.world_map[y - 1][x] > 0) {
			idx += 1;
		}
		if (y > 0 && x < worldmap_size[0] - 1 && this.world.world_map[y - 1][x + 1] > 0) {
			idx += 2;
		}
		if (x < worldmap_size[0] - 1 && this.world.world_map[y][x + 1] > 0) {
			idx += 4;
		}
		if (y < worldmap_size[1] - 1 && x < worldmap_size[0] - 1 && this.world.world_map[y + 1][x + 1] > 0) {
			idx += 8;
		}
		if (y < worldmap_size[1] - 1 && this.world.world_map[y + 1][x] > 0) {
			idx += 16;
		}
		if (y < worldmap_size[1] - 1 && x > 0 && this.world.world_map[y + 1][x - 1] > 0) {
			idx += 32;
		}
		if (x > 0 && this.world.world_map[y][x - 1] > 0) {
			idx += 64;
		}
		if (y > 0 && x > 0 && this.world.world_map[y - 1][x - 1] > 0) {
			idx += 128;
		}

		return correct_world_tile[idx];
	}
}

export function create_height_map(): number[][] {
	const map: number[][] = Array.from(Array(worldmap_size[1]), () => Array(worldmap_size[0]).fill(0));

	// Mountains
	for (let i = 0; i < 20; i++) {
		const x = random_int(4, 23);
		const y = random_int(4, 23);

		for (let xx = x - 2; xx <= x + 2; xx++) {
			for (let yy = y - 2; yy <= y + 2; yy++) {
				map[yy][xx] += random_int(2, 20);
			}
		}

		for (let xx = x - 1; xx <= x + 1; xx++) {
			for (let yy = y - 1; yy <= y + 1; yy++) {
				map[yy][xx] += random_int(2, 20);
			}
		}

		map[y][x] += random_int(2, 20);
	}

	// Basemap
	const half = Math.floor(worldmap_size[0] / 2);
	for (let y = 1; y < worldmap_size[1] - 1; y++) {
		for (let x = 1; x < worldmap_size[0] - 1; x++) {
			const dx = Math.abs(half - x);
			const dy = Math.abs(half - y);
			map[y][x] += random_int(0, Math.floor(((half - Math.max(dx, dy)) * 100) / half));
			if (map[y][x] > 100) {
				map[y][x] = 100;
			}
		}
	}

	return map;
}

export function create_world_map(world_map: number[][] | null, height_map: number[][], water_level: number, mountain_level: number, temp: number, humid: number): number[][] {
	const map: number[][] = Array.from(Array(worldmap_size[1]), () => Array(worldmap_size[0]).fill(0));

	for (let y = 0; y < worldmap_size[1]; y++) {
		for (let x = 0; x < worldmap_size[0]; x++) {
			if (world_map === null || world_map[y][x] <= WORLD_MAP.MOUNTAIN) {
				map[y][x] = find_tile(height_map[y][x], y, water_level, mountain_level, temp, humid);
			}
			else {
				map[y][x] = world_map[y][x];
			}
		}
	}

	return map;
}

function find_tile(height: number, y: number, water_level: number, mountain_level: number, temp: number, humid: number): number {
	// [Ideal_Humid, Ideal_Temp] for Rangones, Blueleaf, ...
	// TODO: Should be a Map or an object
	const ideal: [number, number][] = [[65, 60], [72, 50], [85, 90], [50, 30], [70, 75], [40, 40]];

	if (height <= water_level) {
		return WORLD_MAP.WATER;
	}

	if (height >= mountain_level) {
		return WORLD_MAP.MOUNTAIN;
	}

	const safe_temp = clamp(temp + y * 3 - height + 11, 0, 100);
	const safe_humid = clamp(humid - height + 50, 0, 100);

	let delta = Infinity;
	let tile = 0;
	for (let i = 0; i < ideal.length; i++) {
		const d = Math.max(Math.abs(ideal[i][0] - safe_humid), Math.abs(ideal[i][1] - safe_temp));
		if (d < delta) {
			delta = d;
			tile = i;
		}
	}

	return tile + WORLD_MAP.RANGONES;
}
