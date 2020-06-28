'use strict';


function Love(dir, character, partner, callback) {
	this.dir = dir;
	this.character = character;
	this.partner = partner;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.offspring;
	this.delay_counter = 0;
	this.frame = 0;
	this.draw_cloud = false;
	this.cloud_offset = [0, 0];
	this.sprites = [];
	this.offspring_sprite = new Sprite(partner.url, partner.anims.offspring.soffset, partner.anims.offspring.frames, anim_delays.offspring);
	this.pre_offspring = null;

	this.sprites = [
		new Sprite(partner.url, partner.anims.female_pre_love.soffset, partner.anims.female_pre_love.frames),
		new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames),
	];

	if(dir === DIR.S || dir === DIR.E) {
		this.sprites.reverse();
	}

	switch(dir) {
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
		case DIR.E:
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, 0, anims_clouds.love_hor.frames, true);
			this.cloud_offset = [14, 0];
			break;
	}

	audio.play_sound('love');
}


Love.prototype.update = function() {
	this.delay_counter++;

	if(this.draw_cloud && this.delay_counter % anim_delays.cloud === 0) {
		this.cloud_sprite.update();
		if(this.cloud_sprite.finished) {
			this.draw_cloud = false;
		}
	}

	if(this.delay_counter % this.delay === 0) {
		this.frame++;
		for(let sprite of this.sprites) {
			sprite.update();
		}
	}
	else {
		return;
	}

	if(this.frame === 2) {
		this.sprites = [];
		this.draw_cloud = true;
	}
	else if(this.frame === 20) {
		this.sprites = [];

		if(this.partner.anims.hasOwnProperty('pre_offspring')) {
			this.pre_offspring = new Sprite(this.partner.url, this.partner.anims.pre_offspring.soffset, this.partner.anims.pre_offspring.frames, 0, [64, 64], true);
			this.sprites.push(this.pre_offspring);
		}
		else {
			this.sprites.push(new Sprite(this.partner.url, this.partner.anims.offspring.soffset, this.partner.anims.offspring.frames));
		}

		this.sprites.push(new Sprite(this.character.url, this.character.anims.still.soffset, this.character.anims.still.frames));

		if(this.dir === DIR.S || this.dir === DIR.E) {
			this.sprites.reverse();
		}
	}
	else if(this.frame > 20 && this.cloud_sprite.finished && (this.pre_offspring === null || this.pre_offspring.finished)) {
		this.finished = true;
	}
};


Love.prototype.render = function(ctx, dim, cpos) {
	for(let i = 0; i < this.sprites.length; i++) {
		this.sprites[i].render(ctx,
			[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
	}

	if(this.draw_cloud) {
		this.cloud_sprite.render(ctx,
			[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.cloud_offset[0]),
			Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.cloud_offset[1])]);
	}
};


function Fight(dir, character, opponent, player_wins, callback) {
	this.dir = dir;
	this.character = character;
	this.opponent = opponent;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.winner;
	this.delay_counter = 0;
	this.frame = opponent.type === SURV_MAP.PREDATOR ? -2 : 0;  // Predators show the attack frame before attacking
	this.player_wins = player_wins;
	this.draw_cloud = false;
	this.cloud_offset = [0, 0];
	this.sprites = [];
	this.final_opponent_sprite = null;

	if(this.opponent.type === SURV_MAP.PREDATOR) {
		this.sprites = [new Sprite(opponent.url, opponent.anims.attack.soffset, opponent.anims.attack.frames[this.dir - 1])];
	}
	else {
		this.sprites = [new Sprite(opponent.url, opponent.anims.enem_still.soffset, opponent.anims.enem_still.frame)];
	}

	this.sprites.push(new Sprite(character.url, character.anims.still.soffset, character.anims.still.frames));

	if(dir === DIR.S || dir === DIR.E) {
		this.sprites.reverse();
	}

	switch(dir) {
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
		case DIR.E:
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, 0, anims_clouds.fight_hor.size);
			this.cloud_offset = [14, 0];
			break;
	}
}


Fight.prototype.update = function() {
	this.delay_counter++;

	if(this.draw_cloud && this.delay_counter % anim_delays.cloud === 0) {
		this.cloud_sprite.update();
	}

	if(this.delay_counter % this.delay === 0) {
		this.frame++;
		for(let sprite of this.sprites) {
			if(sprite !== null) {
				sprite.update();
			}
		}
	}
	else {
		return;
	}

	switch(this.frame) {
		case 2:
			audio.play_sound('survival_fight');
			this.sprites = [];
			this.draw_cloud = true;
			break;
		case 20:
			this.sprites = [];

			if(this.player_wins) {
				const an = this.opponent.defeated;

				this.final_opponent_sprite = new Sprite(this.opponent.url, an.soffset, an.frames);

				this.sprites = [
					this.final_opponent_sprite,
					new Sprite(this.character.url, this.character.anims.winner.soffset, this.character.anims.winner.frames),
				];
			}
			else {
				this.sprites = [
					new Sprite(this.opponent.url, this.opponent.anims.winner.soffset, this.opponent.anims.winner.frames),
					null,
				];
			}

			if(this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}

			break;
		case 24:
			this.delay = anim_delays.winner;
			this.draw_cloud = false;

			if(this.player_wins) {
				switch(this.character.species) {
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
				switch(this.opponent.species) {
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
			this.finished = true;
			break;
	}
};


Fight.prototype.render = function(ctx, dim, cpos) {
	for(let i = 0; i < this.sprites.length; i++) {
		if(this.sprites[i] !== null) {
			this.sprites[i].render(ctx,
				[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
				Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
		}
	}

	if(this.draw_cloud) {
		this.cloud_sprite.render(ctx,
			[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.cloud_offset[0]),
			Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.cloud_offset[1])]);
	}
};


function Feeding(character, level, food_type, callback) {
	this.character = character;
	this.level = level;
	this.food_type = food_type;
	this.callback = callback;
	this.delay = anim_delays.feeding;
	this.delay_counter = 0;
	this.frame = -1;
	this.step = 0;
	this.finished = false;

	this.tiles = [this.character.tile];

	this.sprite = new Sprite(character.url, anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, 0, [64, 64], true);

	switch(character.species) {
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


Feeding.prototype.update = function() {
	this.delay_counter++;
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
		this.sprite.update();
	}
	else {
		return;
	}

	if(this.frame <= 0) {
		return;
	}

	const tile = this.character.tile;

	if(this.frame === 1) {
		this.level.eat_tile(tile);
	}

	// This is depended on the species, so no fixed frame
	else if(this.sprite.finished) {
		// Special animation done or normal food -> We are finished
		if(this.step === 1 || this.food_type < 36) {
			this.finished = true;
		}
		// Poison
		else if(this.food_type < 118) {
			this.delay = anim_delays.poison;
			this.sprite = new Sprite(this.character.url, anims_players[this.character.species].poisoned.soffset, anims_players[this.character.species].poisoned.frames, 0, [64, 64], true);
			this.step++;
			if(this.character.species === SPECIES.CHUCKBERRY) {
				audio.play_sound('poison_chuck');
			}
			else {
				audio.play_sound('poison');
			}
		}
		// Power food
		else {
			this.delay = anim_delays.power_food;
			this.sprite = new Sprite(this.character.url, anims_players[this.character.species].power_food.soffset, anims_players[this.character.species].power_food.frames, 0, [64, 64], true);
			this.step++;
			audio.play_sound('power_food');
		}
	}
};


Feeding.prototype.render = function(ctx, dim, cpos) {
	this.sprite.render(ctx,
		[Math.round(this.tiles[0][0] * dim[0] - cpos[0]),
		Math.round(this.tiles[0][1] * dim[1] - cpos[1])]);
};


function Quicksand(character, callback) {
	this.character = character;
	this.callback = callback;
	if(this.character.species === SPECIES.PESCIODYPHUS) {
		this.delay = anim_delays.feeding;
	}
	else {
		this.delay = anim_delays.quicksand;
	}
	this.delay_counter = 0;
	this.frame = -1;
	this.mov = [0, 0];
	this.finished = false;

	this.tiles = [this.character.tile];

	const qs = anims_players[this.character.species].quicksand;
	this.sprite = new Sprite(this.character.url, qs.soffset, qs.frames, 0, [64, 64], true);

	audio.play_sound('quicksand');
}


Quicksand.prototype.update = function() {
	this.delay_counter++;
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
		this.sprite.update();
	}
	else {
		return;
	}

	if(this.frame <= 5) {
		return;
	}

	// Super special stuff for Pesciodyphus
	if(this.character.species === SPECIES.PESCIODYPHUS) {

		if(this.frame === 17) {
			this.mov = [0, 0];
		}
		else if(this.frame === 25) {
			this.mov = [6, -30];
		}
		else if(this.frame === 33) {
			this.mov = [0, -22];
		}

		if(this.frame <= 9) {
			this.mov = [0, 0];
		}
		else if(this.frame <= 17) {
			this.mov[0] += 3;
		}
		else if(this.frame <= 25) {
			this.mov[1] -= 3;
		}
		else if(this.frame <= 27) {
			this.mov[0] -= 4;
		}
		else if(this.frame <= 33) {
			this.mov[0] -= 5;
		}
		else if(this.frame <= 41) {
			this.mov[1] += 3;
		}
		else {
			this.mov = [0, 0];
		}
	}

	this.finished = this.sprite.finished;
};


Quicksand.prototype.render = function(ctx, dim, cpos) {
	this.sprite.render(ctx,
		[Math.round(this.tiles[0][0] * dim[0] - cpos[0] + this.mov[0]),
		Math.round(this.tiles[0][1] * dim[1] - cpos[1] + this.mov[1])]);
};


function Waiting(character, callback) {
	this.callback = callback;
	this.delay = anim_delays.movement;
	this.delay_counter = 0;
	this.frame = 0;
	this.finished = false;

	this.tiles = [character.tile];

	this.sprite = new Sprite(character.url, anims_players[character.species].still.soffset, anims_players[character.species].still.frames);
}


Waiting.prototype.update = function() {
	this.delay_counter++;
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	if(this.frame >= 8) {
		this.finished = true;
	}
};


Waiting.prototype.render = function(ctx, dim, cpos) {
	this.sprite.render(ctx,
		[Math.round(this.tiles[0][0] * dim[0] - cpos[0]),
		Math.round(this.tiles[0][1] * dim[1] - cpos[1])]);
};


function Electro(dir, character, callback) {
	this.dir = dir;
	this.character = character;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.electro;
	this.delay_counter = 0;
	this.frame = 0;

	if(dir === DIR.E) {
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

	audio.play_sound('electro');
}


Electro.prototype.update = function() {
	for(let sprite of this.sprites) {
		sprite.update();
	}

	this.delay_counter++;
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	const sprite_pos = 1*(this.dir === DIR.E);

	if(this.frame === 15) {
		this.sprites[sprite_pos] = new Sprite(this.character.url, this.character.anims.zapped.soffset, this.character.anims.zapped.frame, anim_delays.electros, [64, 64], true);
	}

	this.finished = this.sprites[1*!sprite_pos].finished;
};


Electro.prototype.render = function(ctx, dim, cpos) {
	for(let i = 0; i < this.sprites.length; i++) {
		this.sprites[i].render(ctx,
			[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
	}
};
