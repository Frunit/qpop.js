'use strict';

// TODO: Test all actions ... with alle species ... in low frame rate -.-
// That is: Eat normal food, power food, poison; love, fight against predator (win and lose!) and enemy; quicksand; wait; electro flower (when it's finished).

// TODO: Love does not work at all
function Love(dir, character, partner, callback) {
	this.dir = dir;
	this.character = character;
	this.partner = partner;
	this.callback = callback;
	this.finished = false;
	this.frame = 0;
	this.sprites = [];

	switch(dir) {
		case DIR.N:
			this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anim_delays.cloud, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			break;
		case DIR.S:
			this.tiles = [[character.tile[0], character.tile[1] + 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anim_delays.cloud, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anim_delays.cloud, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			break;
		case DIR.E:
			this.tiles = [[character.tile[0] + 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anim_delays.cloud, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			break;
	}
}


Love.prototype.update = function() {
	for(let sprite of this.sprites) {
		sprite.update();
	}

	this.delay_counter++
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	// TODO RESEARCH: The time values are examples; correct them!
	if(this.frame < 2) {} // Do nothing
	else if(this.frame < 9) {} // Remove partner and character and show cloud
	else if(this.frame < 10) {} // Show offspring and character and the last two frames of the cloud
	else if(this.frame < 11) {} // Show Heart symbol
	else {this.finished = true;}
};


Love.prototype.render = function(ctx, pos) {
	for(let sprite of this.sprites) {
		sprite.render(ctx, pos);
	}
};


function Fight(dir, character, opponent, player_wins, callback) {
	// this.opponent_anim is probably not needed and can be replaced by this.opponent.anims
	this.dir = dir;
	this.character = character;
	this.opponent = opponent;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.cloud;
	this.delay_counter = 0;
	this.frame = opponent.type === SURV_MAP.PREDATOR ? -2 : 0;  // Predators show the attack frame before attacking
	this.player_wins = player_wins;
	this.draw_cloud = false;
	this.cloud_offset = [0, 0];
	this.sprites = [];
	this.final_opponent_sprite = null;

	if(this.opponent.type === SURV_MAP.PREDATOR) {
		this.opponent_url = `gfx/pred${this.opponent.species+1}.png`;
		this.opponent_anim = anims_predators[this.opponent.species];

		this.sprites = [new Sprite(this.opponent_url, [64, 64], 0, this.opponent_anim.attack.soffset,  this.opponent_anim.attack.frames[this.dir - 1])];
	}
	else {
		this.opponent_url = 'gfx/enemies.png';
		this.opponent_anim = anims_players[this.opponent.species];

		this.sprites = [new Sprite(this.opponent_url, [64, 64], 0, this.opponent_anim.still.soffset,  this.opponent_anim.still.frame)];
	}

	this.sprites.push(new Sprite(this.character.url, [64, 64], 0, character.anims.still.soffset,  character.anims.still.frames));

	if(this.dir === DIR.S || this.dir === DIR.E) {
		this.sprites.reverse();
	}

	switch(dir) {
		case DIR.N:
			this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anim_delays.cloud, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			this.cloud_offset = [0, 14];
			break;
		case DIR.S:
			this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anim_delays.cloud, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			this.cloud_offset = [0, 14];
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anim_delays.cloud, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			this.cloud_offset = [14, 0];
			break;
		case DIR.E:
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anim_delays.cloud, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			this.cloud_offset = [14, 0];
			break;
	}
}


Fight.prototype.update = function() {
	for(let sprite of this.sprites) {
		sprite.update();
	}
	if(this.draw_cloud) {
		this.cloud_sprite.update();
	}

	this.delay_counter++
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	switch(this.frame) {
		case 1:
			this.sprites = [];
			this.draw_cloud = true;
			break;
		case 10: {
			//game.stage.pre_finish_fight(this.player_wins, this.opponent);
			this.sprites = [];

			if(this.player_wins) {
				if(this.opponent.type === SURV_MAP.PREDATOR) {
					const def = random_int(0, 2);
					this.final_opponent_sprite = new Sprite(this.opponent.url, [64, 64], anim_delays.defeated, this.opponent_anim.defeated[def].soffset, this.opponent_anim.defeated[def].frames);
					this.sprites.push(this.final_opponent_sprite);
				}
				else {
					this.final_opponent_sprite = new Sprite(this.opponent.url, [64, 64], anim_delays.defeated, this.opponent_anim.enem_defeated.soffset, this.opponent_anim.enem_defeated.frames);
					this.sprites.push(this.final_opponent_sprite);
				}

				this.sprites.push(new Sprite(this.character.url, [64, 64], anim_delays.winner, this.character.anims.winner.soffset, this.character.anims.winner.frames));
			}
			else {
				this.sprites.push(null);
				this.sprites.push(new Sprite(this.opponent.url, [64, 64], anim_delays.winner, this.opponent.anims.winner.soffset, this.opponent.anims.winner.frames));
			}

			if(this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}

			break;
		}
		case 12:
			for(let sprite of this.sprites) {
				if(sprite !== null) {
					sprite.delay = anim_delays.winner;
				}
			}
			this.delay = anim_delays.winner;
			this.draw_cloud = false;
			break;
		case 28:
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

	this.sprite = new Sprite(character.url, [64, 64], anim_delays.feeding, anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, true);
}


Feeding.prototype.update = function() {
	this.sprite.update();
	this.delay_counter++
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	if(this.frame <= 0) {
		return;
	}

	const tile = this.character.tile;

	if(this.frame === 2) {
		this.level.eat_tile(tile);
	}

	// This is depended on the species, so no fixed frame
	else if(this.sprite.finished) {
		// Special animation done or normal food -> We are finished
		if(this.step === 1 || this.food_type < 36) {
			this.finished = true;
		}
		// Poison
		else if(this.food_type >= 88 && this.food_type <= 93) {
			this.sprite = new Sprite(this.character.url, [64, 64], anim_delays.poison, anims_players[this.character.species].poisoned.soffset, anims_players[this.character.species].poisoned.frames, true);
			this.step++;
		}
		// Power food
		else if(this.food_type >= 118) {
			this.sprite = new Sprite(this.character.url, [64, 64], anim_delays.power_food, anims_players[this.character.species].power_food.soffset, anims_players[this.character.species].power_food.frames, true);
			this.step++;
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
	this.delay = anim_delays.quicksand;
	this.delay_counter = 0;
	this.frame = -1;
	this.mov = [0, 0];
	this.finished = false;

	this.tiles = [this.character.tile];

	const qs = anims_players[this.character.species].quicksand;
	this.sprite = new Sprite(this.character.url, [64, 64], anim_delays.quicksand, qs.soffset, qs.frames, true);
}


Quicksand.prototype.update = function() {
	this.sprite.update();

	this.delay_counter++
	if(this.delay_counter >= this.delay) {
		this.delay_counter = 0;
		this.frame++;
	}
	else {
		return;
	}

	if(this.frame <= 0) {
		return;
	}

	// Super special stuff for Pesciodyphus
	// TODO: This has to be tested!!!
	if(this.character.species === 2) {
		if(this.frame >= 6 && this.frame <= 12) {
			this.mov[0] += 3;
		}
		else if(this.frame >= 12 && this.frame <= 18) {
			this.mov[1] -= 3;
		}
		else if(this.frame >= 18 && this.frame <= 24) {
			this.mov[0] -= 3;
		}
		else if(this.frame >= 24 && this.frame <= 30) {
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

	this.sprite = new Sprite(character.url, [64, 64], 0, anims_players[character.species].still.soffset, anims_players[character.species].still.frames);
}


Waiting.prototype.update = function() {
	this.delay_counter++
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
