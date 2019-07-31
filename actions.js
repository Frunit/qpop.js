'use strict';


function Love(dir, character, partner, callback) {
	this.dir = dir;
	this.character = character;
	this.partner = partner;
	this.callback = callback;
	this.finished = false;
	this.time = 0;
	this.offset = [0, 0];
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


Love.prototype.update = function(dt) {
	this.time += dt;
	// TODO RESEARCH: The time values are examples; correct them!
	if(this.time < 200) {} // Do nothing
	else if(this.time < 900) {} // Remove partner and character and show cloud
	else if(this.time < 1000) {} // Show offspring and character and the last two frames of the cloud
	else if(this.time < 1100) {} // Show Heart symbol
	else {this.finished = true;}
};


Love.prototype.render = function(ctx, pos) {
	for(sprite of this.sprites) {
		sprite.render(ctx, pos);
	}
};


function Fight(dir, character, opponent, player_wins, callback) {
	this.dir = dir;
	this.character = character;
	this.opponent = opponent;
	this.callback = callback;
	this.finished = false;
	this.time = 0;
	this.offset = [0, 0];
	this.player_wins = player_wins;
	this.sprites = [];

	switch(dir) {
		case DIR.N:
			this.tiles = [[character.tile[0], character.tile[1] - 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			break;
		case DIR.S:
			this.tiles = [[character.tile[0], character.tile[1] + 1], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames);
			break;
		case DIR.W:
			this.tiles = [[character.tile[0] - 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			break;
		case DIR.E:
			this.tiles = [[character.tile[0] + 1, character.tile[1]], character.tile];
			this.cloud_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames);
			break;
	}
}


Fight.prototype.update = function(dt) {
	this.time += dt;
	// TODO RESEARCH: The time values are examples; correct them!
	if(this.time < 200) {} // Do nothing
	else if(this.time < 800) {} // Show attack face if predator
	else if(this.time < 900) {} // Remove opponent and character and show cloud
	else if(this.time < 1000) {} // Show opponent and character and the last two frames of the cloud
	else if(this.time < 1100) {} // Depending on the winner, show cheering and moaning
	else if(this.time < 1200) {} // If the player died, reset the character, otherwise return to normal; Show the death/victory symbol
	else {this.finished = true;}
};


Fight.prototype.render = function(ctx, pos) {
	for(sprite of this.sprites) {
		sprite.render(ctx, pos);
	}
};


function Feeding(character, map, callback) {
	this.character = character;
	this.map = map;
	this.callback = callback;
	this.frame = -1;
	this.step = 0;
	this.finished = false;

	this.tiles = [[this.character.tile]];

	this.sprite = new Sprite(character.url, [64, 64], anims_players[character.species].feeding.soffset, anims_players[character.species].feeding.frames, true);
}


Feeding.prototype.update = function(dt) {
	this.frame += 1;
	if(this.frame <= 0) {
		return;
	}
	this.sprite.update();
	const tile = this.character.tile;
	const food_type = this.map[tile[1]][tile[0]];
	if(this.frame === 2) {
		// Normal food gets one less
		if(food_type < 36) {
			this.map[tile[1]][tile[0]] -= 1;
		}
		// Power food has its corresponding empty space at +1
		else if(food_type >= 118) {
			this.map[tile[1]][tile[0]] += 1;
		}
		// Poison is never diminshed or changed
	}

	// This is depended on the species, so no fixed frame
	else if(this.sprite.finished) {
		// Special animation done or normal food -> We are finished
		if(this.step === 1 || food_type < 36) {
			this.finished = true;
		}
		// Poison
		else if(food_type >= 88 && food_type <= 93) {
			this.sprite = new Sprite(character.url, [64, 64], anims_players[character.species].poisoned, soffset, anims_players[character.species].poisoned.frames, true);
			this.step++;
		}
		// Power food
		else if(food_type >= 118) {
			this.sprite = new Sprite(character.url, [64, 64], anims_players[character.species].power_food, soffset, anims_players[character.species].power_food.frames, true);
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

	this.tiles = [[this.character.tile]];

	this.sprite = new Sprite(character.url, [64, 64], anims_players[character.species].quicksand, soffset, anims_players[character.species].quicksand.frames, true);
}


Quicksand.prototype.update = function(dt) {
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
