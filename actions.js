'use strict';

// TODO: Test all actions ... with all species ... in low frame rate -.-
// That is: Eat normal food, power food, poison; love, fight against predator (win and lose!) and enemy; quicksand; wait; electro flower (when it's finished).


function Love(dir, character, partner, callback) {
	this.dir = dir;
	this.character = character;
	this.partner = partner;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.cloud;
	this.delay_counter = 0;
	this.frame = 0;
	this.draw_cloud = false;
	this.cloud_offset = [0, 0];
	this.sprites = [];
	this.offspring_sprite = new Sprite(partner.url, [64, 64], anim_delays.offspring, partner.anims.offspring.soffset, partner.anims.offspring.frames);

	this.sprites = [
		new Sprite(partner.url, [64, 64], 0, partner.anims.still.soffset, partner.anims.still.frame),
		new Sprite(character.url, [64, 64], 0, character.anims.still.soffset, character.anims.still.frames),
	];

	if(dir === DIR.S || dir === DIR.E) {
		this.sprites.reverse();
	}

	switch(dir) {
		case DIR.N:
			this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anim_delays.cloud, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			this.cloud_offset = [0, 14];
			break;
		case DIR.S:
			this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anim_delays.cloud, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			this.cloud_offset = [0, 14];
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anim_delays.cloud, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			this.cloud_offset = [14, 0];
			break;
		case DIR.E:
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anim_delays.cloud, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			this.cloud_offset = [14, 0];
			break;
	}
}


Love.prototype.update = function() {
	for(let sprite of this.sprites) {
		sprite.update();
	}
	if(this.draw_cloud) {
		this.cloud_sprite.update();
	}

	this.delay_counter++;
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
		case 10:
			this.sprites = [];

			if(this.partner.anims.hasOwnProperty('pre_offspring')) {
				this.sprites.push(new Sprite(this.partner.url, [64, 64], anim_delays.cloud, this.partner.anims.pre_offspring.soffset, this.partner.anims.pre_offspring.frames));
			}
			else {
				this.sprites.push(new Sprite(this.partner.url, [64, 64], anim_delays.cloud, this.partner.anims.offspring.soffset, this.partner.anims.offspring.frames));
			}

			this.sprites.push(new Sprite(this.character.url, [64, 64], 0, this.character.anims.still.soffset, this.character.anims.still.frames));

			if(this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}

			break;
		case 12:
			if(this.partner.anims.hasOwnProperty('pre_offspring')) {
				for(let sprite of this.sprites) {
					sprite.delay = anim_delays.offspring;
				}
				this.delay = anim_delays.offspring;
				this.draw_cloud = false;
			}
			else {
				this.finished = true;
			}
			break;
		case 14:
			this.finished = true;
			break;
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
	this.delay = anim_delays.cloud;
	this.delay_counter = 0;
	this.frame = opponent.type === SURV_MAP.PREDATOR ? -2 : 0;  // Predators show the attack frame before attacking
	this.player_wins = player_wins;
	this.draw_cloud = false;
	this.cloud_offset = [0, 0];
	this.sprites = [];
	this.final_opponent_sprite = null;

	if(this.opponent.type === SURV_MAP.PREDATOR) {
		this.sprites = [new Sprite(opponent.url, [64, 64], 0, opponent.anims.attack.soffset, opponent.anims.attack.frames[this.dir - 1])];
	}
	else {
		this.sprites = [new Sprite(opponent.url, [64, 64], 0, opponent.anims.enem_still.soffset, opponent.anims.enem_still.frame)];
	}

	this.sprites.push(new Sprite(character.url, [64, 64], 0, character.anims.still.soffset, character.anims.still.frames));

	if(dir === DIR.S || dir === DIR.E) {
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

	this.delay_counter++;
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
		case 10:
			this.sprites = [];

			if(this.player_wins) {
				//console.log(this.opponent.anims)
				let an = this.opponent.anims.defeated;
				if(this.opponent.type === SURV_MAP.PREDATOR) {
					an = an[random_int(0, 2)];
				}

				this.final_opponent_sprite = new Sprite(this.opponent.url, [64, 64], anim_delays.cloud, an.soffset, an.frames);

				this.sprites = [
					this.final_opponent_sprite,
					new Sprite(this.character.url, [64, 64], anim_delays.cloud, this.character.anims.winner.soffset, this.character.anims.winner.frames),
				];
			}
			else {
				this.sprites = [
					new Sprite(this.opponent.url, [64, 64], anim_delays.cloud, this.opponent.anims.winner.soffset, this.opponent.anims.winner.frames),
					null,
				];
			}

			if(this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}

			break;
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
	this.delay_counter++;
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

	this.delay_counter++;
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


// TODO RESEARCH: Details about the electro plant animation
function Electro(dir, character, callback) {
	this.dir = dir;
	this.character = character;
	this.callback = callback;
	this.finished = false;
	this.delay = anim_delays.electro;
	this.delay_counter = 0;
	this.frame = 0;

	this.sprites = [
		new Sprite('gfx/electro.png', [64, 64], anim_delays.electro, [0, 0], [[0, 0], [64, 0]], true), // TODO RESEARCH
		new Sprite(character.url, [64, 64], 0, character.anims.still.soffset, character.anims.still.frames),
	];

	if(dir === DIR.E) {
		this.sprites.reverse();
	}
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

	const sprite_pos = dir !== DIR.E;

	if(this.frame === 4) { // TODO RESEARCH: Which frame?
		this.sprites[sprite_pos] = new Sprite(this.character.url, [64, 64], anim_delays.electro, this.character.anims.zapped.soffset, this.character.anims.zapped.frames);
		return;
	}

	this.finished = this.sprites[!sprite_pos].finished;
};


Electro.prototype.render = function(ctx, dim, cpos) {
	for(let i = 0; i < this.sprites.length; i++) {
		this.sprites[i].render(ctx,
			[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
	}
};
