'use strict';


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
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			break;
		case DIR.S:
			this.tiles = [[character.tile[0], character.tile[1] + 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames);
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			break;
		case DIR.E:
			this.tiles = [[character.tile[0] + 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames);
			break;
	}
}


Love.prototype.update = function() {
	this.frame++;
	console.log(this.frame);
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
	this.dir = dir;
	this.character = character;
	this.opponent = opponent;
	this.callback = callback;
	this.finished = false;
	this.frame = opponent.type === SURV_MAP.PREDATOR ? -5 : 0;  // Predators show the attack frame before attacking
	this.player_wins = player_wins;
	this.sprites = [];

	if(this.opponent.type === SURV_MAP.PREDATOR) {
		this.opponent_url = `gfx/pred${this.opponent.species+1}.png`;
		this.opponent_anim = anims_predators[this.opponent.species];
	}
	else {
		this.opponent_url = 'gfx/enemies.png';
		this.opponent_anim = anims_players[this.opponent.species];
	}

	switch(dir) {
		case DIR.N:
			this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			break;
		case DIR.S:
			this.tiles = [character.tile, [character.tile[0], character.tile[1] + 1]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			break;
		case DIR.E:
			this.tiles = [character.tile, [character.tile[0] + 1, character.tile[1]]];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			break;
	}
}


Fight.prototype.update = function() {
	this.frame++;

	switch(this.frame) {
		case -4: {
			this.sprites = [
				new Sprite(this.opponent_url, [64, 64], this.opponent_anim.attack.soffset,  this.opponent_anim.attack.frames[this.dir - 1]),
				new Sprite(this.character.url, [64, 64],  this.opponent_anim.still.soffset,  this.opponent_anim.still.frames),
			];
			if(this.dir === DIR.S || this.dir === DIR.E) {
				this.sprites.reverse();
			}
			break;
		}
		case 1:
			this.sprites = [this.cloud_sprite];
			break;
		case 10: {
			game.stage.pre_finish_fight(this.player_wins, this.opponent);
			this.sprites = [this.cloud_sprite];
			break;
		}
		case 12: {
			this.sprites = [];
			break;
		}
		case 28:
			this.finished = true;
			break;
		default:
			for(let sprite of this.sprites) {
				sprite.update();
			}
			break;
	}
};


Fight.prototype.render = function(ctx, dim, cpos) {
	for(let i = 0; i < this.sprites.length; i++) {
		this.sprites[i].render(ctx,
			[Math.round(this.tiles[i][0] * dim[0] - cpos[0]),
			Math.round(this.tiles[i][1] * dim[1] - cpos[1])]);
	}
};


function Feeding(character, level, food_type, callback) {
	this.character = character;
	this.level = level;
	this.callback = callback;
	this.food_type = food_type;
	this.frame = -1;
	this.step = 0;
	this.finished = false;

	this.tiles = [this.character.tile];

	this.sprite = new Sprite(character.url, [64, 64], anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, true);
}


Feeding.prototype.update = function() {
	this.frame += 1;
	if(this.frame <= 0) {
		return;
	}
	this.sprite.update();
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
			this.sprite = new Sprite(this.character.url, [64, 64], anims_players[this.character.species].poisoned.soffset, anims_players[this.character.species].poisoned.frames, true);
			this.step++;
		}
		// Power food
		else if(this.food_type >= 118) {
			this.sprite = new Sprite(this.character.url, [64, 64], anims_players[this.character.species].power_food.soffset, anims_players[this.character.species].power_food.frames, true);
			this.step++;
		}
	}
};


Feeding.prototype.render = function(ctx, pos) {
	this.sprite.render(ctx, pos);
};


function Quicksand(character, callback) {
	this.character = character;
	this.callback = callback;
	this.frame = -1;
	this.mov = [0, 0];
	this.finished = false;

	this.tiles = [this.character.tile];

	const qs = anims_players[this.character.species].quicksand;
	this.sprite = new Sprite(this.character.url, [64, 64], qs.soffset, qs.frames, true);
}


Quicksand.prototype.update = function() {
	this.frame += 1;
	if(this.frame <= 0) {
		return;
	}
	this.sprite.update();

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


Quicksand.prototype.render = function(ctx, pos) {
	this.sprite.render(ctx, [pos[0] + this.mov[0], pos[1] + this.mov[1]]);
};
