import { DIR, PRED, SPECIES, SURV_MAP } from "./helper";
import { Character, Enemy, Female, Level, Predator } from "./level";
import { ISprite, RandomSprite, Sprite } from "./sprite";
import { anim_delays, anims_clouds, anims_players } from "./sprite_positions";
import { Dimension, Point } from "./types";

export interface IAction {
	finished: boolean;
	callback: Function; // TODO
	update: () => void;
	render: (ctx: CanvasRenderingContext2D, dim: Dimension, cpos: Point) => void;
}

export class Love implements IAction {
	private dir: DIR;
	private character: Character;
	private partner: Female;
	callback: Function; // TODO
	finished = false;
	private delay = anim_delays.offspring;
	private delay_counter = 0;
	private frame = 0;
	private draw_cloud = false;
	private cloud_offset: Point = [0, 0];
	private sprites: ISprite[];
	private pre_offspring: ISprite | null = null;
	offspring_sprite: ISprite;
	private tiles;
	private cloud_sprite;

	constructor(dir: DIR, character: Character, partner: Female, callback: Function) {
		this.dir = dir;
		this.character = character;
		this.partner = partner;
		this.callback = callback;

		if (character.species === SPECIES.PURPLUS) {
			this.offspring_sprite = new RandomSprite(partner.pic, partner.anims.offspring.soffset, partner.anims.offspring.frames, partner.anims.offspring.transitions, anim_delays.offspring);
		}
		else {
			this.offspring_sprite = new Sprite(partner.pic, partner.anims.offspring.soffset, partner.anims.offspring.frames, anim_delays.offspring);
		}

		this.sprites = [
			new Sprite(partner.url, partner.anims.female_pre_love.soffset, partner.anims.female_pre_love.frames),
			new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames),
		];

		if (dir === DIR.S || dir === DIR.E) {
			this.sprites.reverse();
		}

		switch (dir) {
			case DIR.N:
				this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, 0, anims_clouds.love_vert.size, true);
				this.cloud_offset = [0, 14];
				break;
			case DIR.S:
				this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, 0, anims_clouds.love_vert.size, true);
				this.cloud_offset = [0, 14];
				break;
			case DIR.W:
				this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, 0, anims_clouds.love_hor.size, true);
				this.cloud_offset = [14, 0];
				break;
			default: // DIR.E
				this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, 0, anims_clouds.love_hor.size, true);
				this.cloud_offset = [14, 0];
				break;
		}

		audio.play_sound('love');
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
				this.sprites.push(new RandomSprite(this.partner.url, this.partner.anims.offspring.soffset, this.partner.anims.offspring.frames, this.partner.anims.offspring.transitions));
			}
			else if (this.partner.anims.hasOwnProperty('pre_offspring')) {
				this.pre_offspring = new Sprite(this.partner.url, this.partner.anims.pre_offspring.soffset, this.partner.anims.pre_offspring.frames, 0, [64, 64], true);
				this.sprites.push(this.pre_offspring);
			}
			else {
				this.sprites.push(new Sprite(this.partner.url, this.partner.anims.offspring.soffset, this.partner.anims.offspring.frames));
			}

			this.sprites.push(new Sprite(this.character.url, this.character.anims.still.soffset, this.character.anims.still.frames));

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
	callback: Function; // TODO
	finished = false;
	private delay = anim_delays.winner;
	private delay_counter = 0;
	// Predators show the attack frame before attacking
	private frame: number;
	private player_wins: boolean;
	private draw_cloud = false;
	private cloud_offset: Point = [0, 0];
	private sprites: (Sprite | null)[] = [];
	private final_opponent_sprite: Sprite | null = null;
	private tiles: [Point, Point];
	private cloud_sprite: Sprite;

	constructor(dir: DIR, character: Character, opponent: Enemy | Predator, player_wins: boolean, callback: Function) {
		this.dir = dir;
		this.character = character;
		this.opponent = opponent;
		this.callback = callback;
		this.player_wins = player_wins;
		this.frame = opponent.type === SURV_MAP.PREDATOR ? -2 : 0

		if (this.opponent.type === SURV_MAP.PREDATOR) {
			this.sprites = [new Sprite(opponent.url, opponent.anims.attack.soffset, opponent.anims.attack.frames[this.dir - 1])];
		}
		else {
			this.sprites = [new Sprite(opponent.url, opponent.anims.enem_still.soffset, opponent.anims.enem_still.frame)];
		}

		this.sprites.push(new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames));

		if (dir === DIR.S || dir === DIR.E) {
			this.sprites.reverse();
		}

		switch (dir) {
			case DIR.N:
				this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, 0, anims_clouds.fight_vert.size);
				this.cloud_offset = [0, 14];
				break;
			case DIR.S:
				this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, 0, anims_clouds.fight_vert.size);
				this.cloud_offset = [0, 14];
				break;
			case DIR.W:
				this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, 0, anims_clouds.fight_hor.size);
				this.cloud_offset = [14, 0];
				break;
			default: // DIR.E
				this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
				this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, 0, anims_clouds.fight_hor.size);
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
				audio.play_sound('survival_fight');
				this.sprites = [];
				this.draw_cloud = true;
				break;
			case 20:
				this.sprites = [];

				if (this.player_wins) {
					const an = this.opponent.defeated;

					this.final_opponent_sprite = new Sprite(this.opponent.url, an.soffset, an.frames);

					this.sprites = [
						this.final_opponent_sprite,
						new Sprite(this.character.url, this.character.anims.winner.soffset, this.character.anims.winner.frames),
					];
				}
				else {
					this.sprites = [
						null,
						new Sprite(this.opponent.url, this.opponent.anims.winner.soffset, this.opponent.anims.winner.frames),
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
							audio.play_sound('win_kiwi');
							break;
						case SPECIES.PESCIODYPHUS:
							audio.play_sound('win_pesci');
							break;
						default:
							audio.play_sound('win');
							break;
					}
				}
				else {
					switch (this.opponent.species) {
						case PRED.DINO:
							audio.play_sound('dino_win');
							break;
						case PRED.MUSHROOM:
							audio.play_sound('mushroom_win');
							break;
						case PRED.HUMAN:
							audio.play_sound('human_win');
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
	callback: Function; // TODO
	finished = false;
	private food_type: number;
	private delay = anim_delays.feeding;
	private delay_counter = 0;
	// Predators show the attack frame before attacking
	private frame = -1;
	private step = 0;
	private awaiting_power_food_sound = false;
	private tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, level: Level, food_type: number, callback: Function) {
		this.character = character;
		this.level = level;
		this.food_type = food_type;
		this.callback = callback;
		this.tiles = [this.character.tile];

		this.sprite = new Sprite(character.url, anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, 0, [64, 64], true);

		switch (character.species) {
			case SPECIES.KIWIOPTERYX:
				audio.play_sound('feeding_kiwi');
				break;
			case SPECIES.CHUCKBERRY:
				audio.play_sound('feeding_chuck');
				break;
			default:
				audio.play_sound('feeding');
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
			audio.play_sound('power_food');
		}


		// This is depended on the species, so no fixed frame
		else if (this.sprite.finished) {
			// Special animation done or normal food -> We are finished
			if (this.step === 1 || this.food_type < 36) {
				this.finished = true;
			}

			// Poison
			else if (this.food_type < 118) {
				this.sprite = new Sprite(this.character.url, anims_players[this.character.species].poisoned.soffset, anims_players[this.character.species].poisoned.frames, 0, [64, 64], true);
				this.step++;
				if (this.character.species === SPECIES.CHUCKBERRY) {
					audio.play_sound('poison_chuck');
				}
				else {
					audio.play_sound('poison');
				}
			}

			// Power food
			else {
				this.sprite = new Sprite(this.character.url, anims_players[this.character.species].power_food.soffset, anims_players[this.character.species].power_food.frames, 0, [64, 64], true);
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
	callback: Function;
	finished = false;
	private delay: number;
	private delay_counter = 0;
	private frame = -1;
	private mov: Point = [0, 0];
	private tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, callback: Function) {
		this.character = character;
		this.callback = callback;
		this.delay = this.character.species === SPECIES.PESCIODYPHUS ?
			anim_delays.feeding :
			this.delay = anim_delays.quicksand;

		this.tiles = [this.character.tile];

		const qs = anims_players[this.character.species].quicksand;
		this.sprite = new Sprite(this.character.url, qs.soffset, qs.frames, 0, [64, 64], true);

		audio.play_sound('quicksand');
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
	callback: Function;
	finished = false;
	private delay = anim_delays.movement;
	private delay_counter = 0;
	private frame = 0;
	private tiles: Point[];
	private sprite: Sprite;

	constructor(character: Character, callback: Function) {
		this.callback = callback;
		this.tiles = [character.tile];

		this.sprite = new Sprite(character.url, anims_players[character.species].still.soffset, anims_players[character.species].still.frames);
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
	callback: Function;
	finished = false;
	private delay = anim_delays.electro;
	private delay_counter = 0;
	private frame = 0;
	private tiles: Point[];
	private sprites: Sprite[];

	constructor(dir: DIR, character: Character, callback: Function) {
		this.dir = dir;
		this.character = character;
		this.callback = callback;

		if (dir === DIR.E) {
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.sprites = [
				new Sprite('gfx/electro.png', [0, 0], [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 64], [64, 64], [128, 64], [192, 64], [0, 128], [0, 128], [256, 64], [256, 64], [0, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [128, 128], [0, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 64], [128, 64], [64, 64], [0, 64], [256, 0], [192, 0], [128, 0], [64, 0], [0, 0]], anim_delays.electro, [64, 64], true),
				new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames),
			];
		}
		else {
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.sprites = [
				new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames),
				new Sprite('gfx/electro.png', [0, 0], [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 64], [64, 64], [128, 64], [192, 64], [256, 64], [256, 64], [0, 128], [0, 128], [256, 64], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [64, 128], [256, 64], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 128], [192, 128], [256, 128], [256, 128], [192, 64], [128, 64], [64, 64], [0, 64], [256, 0], [192, 0], [128, 0], [64, 0], [0, 0]], anim_delays.electro, [64, 64], true),
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
			this.sprites[sprite_pos] = new Sprite(this.character.url, this.character.anims.zapped.soffset, this.character.anims.zapped.frames, anim_delays.electro, [64, 64], true);
			audio.play_sound('electro');
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
