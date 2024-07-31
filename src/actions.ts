import { DIR, PRED, SPECIES, SURV_MAP } from "./helper";
import { Character, Enemy, Female, Level, Predator } from "./level";
import { ResourceManager } from "./resources";
import { ISprite, RandomSprite, Sprite } from "./sprite";
import { anim_delays, anims_clouds, anims_players, attack_frames, purplus_special_animations } from "./sprite_positions";
import { Dimension, Point } from "./types";

export interface IAction {
	finished: boolean;
	tiles: Point[];
	callback: () => void;
	offspring_sprite?: ISprite;
	final_opponent_sprite?: ISprite;
	update: () => void;
	render: (ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) => void;
}

export class Love implements IAction {
	finished = false;
	private delay = anim_delays.offspring;
	private delay_counter = 0;
	private frame = 0;
	private draw_cloud = false;
	private cloud_offset: Point = [0, 0];
	private cloud_sprite: Sprite;
	private sprites: ISprite[];
	private pre_offspring: ISprite | null = null;
	offspring_sprite: ISprite;
	tiles: Point[];

	constructor(private dir: DIR, private character: Character, private partner: Female, public callback: () => void, private resources: ResourceManager) {
		if (character.species === SPECIES.PURPLUS) {
			this.offspring_sprite = new RandomSprite(partner.pic, partner.anims.offspring.soffset, purplus_special_animations.offspring.frames, purplus_special_animations.offspring.transitions, anim_delays.offspring);
		}
		else {
			this.offspring_sprite = new Sprite(partner.pic, partner.anims.offspring.soffset, partner.anims.offspring.frames, anim_delays.offspring);
		}

		this.sprites = [
			new Sprite(partner.pic, partner.anims.female_pre_love.soffset, partner.anims.female_pre_love.frames),
			new Sprite(character.pic, character.anims.still.soffset, character.anims.still.frames),
		];

		if (dir === DIR.S || dir === DIR.E) {
			this.sprites.reverse();
		}

		const cloud_pic = resources.get_image('gfx/clouds.png');

		switch (dir) {
			case DIR.N:
				this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
				this.cloud_sprite = new Sprite(cloud_pic, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, 0, anims_clouds.love_vert.size, true);
				this.cloud_offset = [0, 14];
				break;
			case DIR.S:
				this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
				this.cloud_sprite = new Sprite(cloud_pic, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, 0, anims_clouds.love_vert.size, true);
				this.cloud_offset = [0, 14];
				break;
			case DIR.W:
				this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
				this.cloud_sprite = new Sprite(cloud_pic, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, 0, anims_clouds.love_hor.size, true);
				this.cloud_offset = [14, 0];
				break;
			default: // DIR.E
				this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
				this.cloud_sprite = new Sprite(cloud_pic, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, 0, anims_clouds.love_hor.size, true);
				this.cloud_offset = [14, 0];
				break;
		}

		this.resources.play_sound('love');
	}

	update() {
		this.delay_counter++;

		if (this.draw_cloud && this.delay_counter % anim_delays.cloud === 0) {
			this.cloud_sprite.update();
			if (this.cloud_sprite.finished) {
				this.draw_cloud = false;
			}
		}

		if (this.delay_counter % this.delay === 0) {
			this.frame++;
			for (const sprite of this.sprites) {
				sprite.update();
			}
		}
		else {
			return;
		}

		if (this.frame === 2) {
			this.sprites = [];
			this.draw_cloud = true;
		}
		else if (this.frame === 20) {
			this.sprites = [];

			if (this.character.species === SPECIES.PURPLUS) {
				this.sprites.push(new RandomSprite(this.partner.pic, this.partner.anims.offspring.soffset, purplus_special_animations.offspring.frames, purplus_special_animations.offspring.transitions));
			}
			else if (this.partner.anims.hasOwnProperty('pre_offspring')) {
				this.pre_offspring = new Sprite(this.partner.pic, this.partner.anims.pre_offspring.soffset, this.partner.anims.pre_offspring.frames, 0, [64, 64], true);
				this.sprites.push(this.pre_offspring);
			}
			else {
				this.sprites.push(new Sprite(this.partner.pic, this.partner.anims.offspring.soffset, this.partner.anims.offspring.frames));
			}

			this.sprites.push(new Sprite(this.character.pic, this.character.anims.still.soffset, this.character.anims.still.frames));

			if (this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}
		}
		else if (this.frame > 20 && this.cloud_sprite.finished && (this.pre_offspring === null || this.pre_offspring.finished)) {
			this.finished = true;
		}
	}

	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].render(ctx,
				[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
				Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
		}

		if (this.draw_cloud) {
			this.cloud_sprite.render(ctx,
				[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.cloud_offset[0]),
				Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.cloud_offset[1])]);
		}
	}
}


export class Fight implements IAction {
	private dir: DIR;
	private character: Character;
	private opponent: Enemy | Predator;
	callback: () => void;
	finished = false;
	private delay = anim_delays.winner;
	private delay_counter = 0;
	// Predators show the attack frame before attacking
	private frame: number;
	private player_wins: boolean;
	private draw_cloud = false;
	private cloud_offset: Point = [0, 0];
	private sprites: (Sprite | null)[] = [];
	final_opponent_sprite?: Sprite;
	tiles: Point[];
	private cloud_sprite: Sprite;

	constructor(dir: DIR, character: Character, opponent: Enemy | Predator, player_wins: boolean, callback: () => void, private resources: ResourceManager) {
		this.dir = dir;
		this.character = character;
		this.opponent = opponent;
		this.callback = callback;
		this.player_wins = player_wins;
		this.frame = opponent.type === SURV_MAP.PREDATOR ? -2 : 0

		if (this.opponent.type === SURV_MAP.PREDATOR) {
			this.sprites = [new Sprite(opponent.pic, opponent.anims.attack.soffset, attack_frames[opponent.species][this.dir - 1])];
		}
		else {
			this.sprites = [new Sprite(opponent.pic, opponent.anims.enem_still.soffset, opponent.anims.enem_still.frames)];
		}

		this.sprites.push(new Sprite(character.pic, character.anims.still.soffset, character.anims.still.frames));

		if (dir === DIR.S || dir === DIR.E) {
			this.sprites.reverse();
		}

		const cloud_pics = resources.get_image('gfx/clouds.png');

		switch (dir) {
			case DIR.N:
				this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
				this.cloud_sprite = new Sprite(cloud_pics, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, 0, anims_clouds.fight_vert.size);
				this.cloud_offset = [0, 14];
				break;
			case DIR.S:
				this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
				this.cloud_sprite = new Sprite(cloud_pics, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, 0, anims_clouds.fight_vert.size);
				this.cloud_offset = [0, 14];
				break;
			case DIR.W:
				this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
				this.cloud_sprite = new Sprite(cloud_pics, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, 0, anims_clouds.fight_hor.size);
				this.cloud_offset = [14, 0];
				break;
			default: // DIR.E
				this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
				this.cloud_sprite = new Sprite(cloud_pics, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, 0, anims_clouds.fight_hor.size);
				this.cloud_offset = [14, 0];
				break;
		}
	}

	update() {
		this.delay_counter++;

		if (this.draw_cloud && this.delay_counter % anim_delays.cloud === 0) {
			this.cloud_sprite.update();
		}

		if (this.delay_counter % this.delay === 0) {
			this.frame++;
			for (const sprite of this.sprites) {
				if (sprite !== null) {
					sprite.update();
				}
			}
		}
		else {
			return;
		}

		switch (this.frame) {
			case 2:
				this.resources.play_sound('survival_fight');
				this.sprites = [];
				this.draw_cloud = true;
				break;
			case 20:
				this.sprites = [];

				if (this.player_wins) {
					const an = this.opponent.defeated;

					this.final_opponent_sprite = new Sprite(this.opponent.pic, an.soffset, an.frames);

					this.sprites = [
						this.final_opponent_sprite,
						new Sprite(this.character.pic, this.character.anims.winner.soffset, this.character.anims.winner.frames),
					];
				}
				else {
					this.sprites = [
						null,
						new Sprite(this.opponent.pic, this.opponent.anims.winner.soffset, this.opponent.anims.winner.frames),
					];
				}

				if (this.dir === DIR.S || this.dir === DIR.E) {
					this.sprites.reverse();
				}

				break;
			case 24:
				this.delay = anim_delays.winner;
				this.draw_cloud = false;

				if (this.player_wins) {
					switch (this.character.species) {
						case SPECIES.KIWIOPTERYX:
							this.resources.play_sound('win_kiwi');
							break;
						case SPECIES.PESCIODYPHUS:
							this.resources.play_sound('win_pesci');
							break;
						default:
							this.resources.play_sound('win');
							break;
					}
				}
				else {
					switch (this.opponent.species) {
						case PRED.DINO:
							this.resources.play_sound('dino_win');
							break;
						case PRED.MUSHROOM:
							this.resources.play_sound('mushroom_win');
							break;
						case PRED.HUMAN:
							this.resources.play_sound('human_win');
							break;
					}
				}
				break;
			case 40:
				if (this.final_opponent_sprite) {
					this.final_opponent_sprite.delay = anim_delays.defeated;
				}
				this.finished = true;
				break;
		}
	}
	
	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		for (let i = 0; i < this.sprites.length; i++) {
			const sprite = this.sprites[i];
			if (sprite !== null) {
				sprite.render(ctx,
					[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
					Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
			}
		}

		if (this.draw_cloud) {
			this.cloud_sprite.render(ctx,
				[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.cloud_offset[0]),
				Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.cloud_offset[1])]);
		}
	}
}


export class Feeding implements IAction {
	private character: Character;
	private level: Level;
	callback: () => void;
	finished = false;
	private food_type: number;
	private delay = anim_delays.feeding;
	private delay_counter = 0;
	// Predators show the attack frame before attacking
	private frame = -1;
	private step = 0;
	private awaiting_power_food_sound = false;
	tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, level: Level, food_type: number, callback: () => void, private resources: ResourceManager) {
		this.character = character;
		this.level = level;
		this.food_type = food_type;
		this.callback = callback;
		this.tiles = [this.character.tile];

		this.sprite = new Sprite(character.pic, anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, 0, [64, 64], true);

		switch (character.species) {
			case SPECIES.KIWIOPTERYX:
				this.resources.play_sound('feeding_kiwi');
				break;
			case SPECIES.CHUCKBERRY:
				this.resources.play_sound('feeding_chuck');
				break;
			default:
				this.resources.play_sound('feeding');
				break;
		}
	}

	update() {
		this.delay_counter++;
		if (this.delay_counter >= this.delay) {
			this.delay_counter = 0;
			this.frame++;
			this.sprite.update();
		}
		else {
			return;
		}

		if (this.frame <= 0) {
			return;
		}

		const tile = this.character.tile;

		if (this.frame === 1) {
			this.level.eat_tile(tile);
		}


		// Power food as a delayed sound effect
		else if (this.awaiting_power_food_sound && this.frame === 17) {
			this.awaiting_power_food_sound = false;
			this.resources.play_sound('power_food');
		}


		// This is depended on the species, so no fixed frame
		else if (this.sprite.finished) {
			// Special animation done or normal food -> We are finished
			if (this.step === 1 || this.food_type < 36) {
				this.finished = true;
			}

			// Poison
			else if (this.food_type < 118) {
				this.sprite = new Sprite(this.character.pic, anims_players[this.character.species].poisoned.soffset, anims_players[this.character.species].poisoned.frames, 0, [64, 64], true);
				this.step++;
				if (this.character.species === SPECIES.CHUCKBERRY) {
					this.resources.play_sound('poison_chuck');
				}
				else {
					this.resources.play_sound('poison');
				}
			}

			// Power food
			else {
				this.sprite = new Sprite(this.character.pic, anims_players[this.character.species].power_food.soffset, anims_players[this.character.species].power_food.frames, 0, [64, 64], true);
				this.step++;
				this.awaiting_power_food_sound = true;
			}
		}
	}

	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		this.sprite.render(ctx,
			[Math.round(this.tiles[0][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[0][1] * dim[1] - cpos[1])]);
	}
}


export class Quicksand implements IAction {
	private character: Character;
	callback: () => void;
	finished = false;
	private delay: number;
	private delay_counter = 0;
	private frame = -1;
	private mov: Point = [0, 0];
	tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, callback: () => void, resources: ResourceManager) {
		this.character = character;
		this.callback = callback;
		this.delay = this.character.species === SPECIES.PESCIODYPHUS ?
			anim_delays.feeding :
			this.delay = anim_delays.quicksand;

		this.tiles = [this.character.tile];

		const qs = anims_players[this.character.species].quicksand;
		this.sprite = new Sprite(this.character.pic, qs.soffset, qs.frames, 0, [64, 64], true);

		resources.play_sound('quicksand');
	}

	update() {
		this.delay_counter++;
		if (this.delay_counter >= this.delay) {
			this.delay_counter = 0;
			this.frame++;
			this.sprite.update();
		}
		else {
			return;
		}

		if (this.frame <= 5) {
			return;
		}

		// Super special stuff for Pesciodyphus
		if (this.character.species === SPECIES.PESCIODYPHUS) {

			if (this.frame === 17) {
				this.mov = [0, 0];
			}
			else if (this.frame === 25) {
				this.mov = [6, -30];
			}
			else if (this.frame === 33) {
				this.mov = [0, -22];
			}

			if (this.frame <= 9) {
				this.mov = [0, 0];
			}
			else if (this.frame <= 17) {
				this.mov[0] += 3;
			}
			else if (this.frame <= 25) {
				this.mov[1] -= 3;
			}
			else if (this.frame <= 27) {
				this.mov[0] -= 4;
			}
			else if (this.frame <= 33) {
				this.mov[0] -= 5;
			}
			else if (this.frame <= 41) {
				this.mov[1] += 3;
			}
			else {
				this.mov = [0, 0];
			}
		}

		this.finished = this.sprite.finished;
	}

	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		this.sprite.render(ctx,
			[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.mov[0]),
			Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.mov[1])]);
	}
}


export class Waiting implements IAction {
	callback: () => void;
	finished = false;
	private delay = anim_delays.movement;
	private delay_counter = 0;
	private frame = 0;
	tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, callback: () => void) {
		this.callback = callback;
		this.tiles = [character.tile];

		this.sprite = new Sprite(character.pic, anims_players[character.species].still.soffset, anims_players[character.species].still.frames);
	}

	update() {
		this.delay_counter++;
		if (this.delay_counter >= this.delay) {
			this.delay_counter = 0;
			this.frame++;
		}
		else {
			return;
		}

		if (this.frame >= 8) {
			this.finished = true;
		}
	}

	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		this.sprite.render(ctx,
			[Math.round(this.tiles[0][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[0][1] * dim[1] - cpos[1])]);
	}
}


export class Electro implements IAction {
	private dir: DIR;
	private character: Character;
	callback: () => void;
	finished = false;
	private delay = anim_delays.electro;
	private delay_counter = 0;
	private frame = 0;
	tiles: Point[];
	private sprites: Sprite[];

	constructor(dir: DIR, character: Character, callback: () => void, private resources: ResourceManager) {
		this.dir = dir;
		this.character = character;
		this.callback = callback;

		const electro_pic = resources.get_image('gfx/electro.png');

		if (dir === DIR.E) {
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.sprites = [
				new Sprite(electro_pic, [0, 0], [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 64], [64, 64], [128, 64], [192, 64], [0, 128], [0, 128], [256, 64], [256, 64], [0, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 64], [128, 64], [64, 64], [0, 64], [256, 0], [192, 0], [128, 0], [64, 0], [0, 0]], anim_delays.electro, [64, 64], true),
				new Sprite(character.pic, character.anims.still.soffset, character.anims.still.frames),
			];
		}
		else {
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.sprites = [
				new Sprite(character.pic, character.anims.still.soffset, character.anims.still.frames),
				new Sprite(electro_pic, [0, 0], [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 64], [64, 64], [128, 64], [192, 64], [256, 64], [256, 64], [0, 128], [0, 128], [256, 64], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 64], [128, 64], [64, 64], [0, 64], [256, 0], [192, 0], [128, 0], [64, 0], [0, 0]], anim_delays.electro, [64, 64], true),
			];
		}
	}

	update() {
		for (const sprite of this.sprites) {
			sprite.update();
		}

		this.delay_counter++;
		if (this.delay_counter >= this.delay) {
			this.delay_counter = 0;
			this.frame++;
		}
		else {
			return;
		}

		const sprite_pos = 1 * (this.dir === DIR.E ? 1 : 0);

		if (this.frame === 15) {
			this.sprites[sprite_pos] = new Sprite(this.character.pic, this.character.anims.zapped.soffset, this.character.anims.zapped.frames, anim_delays.electro, [64, 64], true);
			this.resources.play_sound('electro');
		}

		this.finished = this.sprites[1 * (!sprite_pos ? 1 : 0)].finished;
	}

	render(ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) {
		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].render(ctx,
				[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
				Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
		}
	}
}
