'use strict';

function Level() {
	this.map = null;
	this.mobmap = null;
	this.neighbourfields = 0;
	this.predators = [];
	this.individuals = game.current_player.individuals;
	this.density = 0;
	this.blocking = '000000000000000000000000000000000000111111111111111111111110011110111100000000001111111100000000000111111111111111111100001111111111111';
	this.height = 100;
	this.width = 100;

	this.character = new Character(game.current_player.id, [49, 49]);

	this.eaten = 0;
	this.bred = 0;
	this.died = 0;
	this.victories = [];

	this.generate_map();
	this.populate();
	this.bg_sprites = Array.from(Array(100), _ => Array(100).fill(null));
}


Level.prototype.listToMap = function(mainpart, border) {
	let matrix = Array(100);
	let j;

	for(let i = 0; i < 3; i++) {
		matrix[i] = border.slice(i*100, (i+1)*100);
	}

	for(let i = 0; i < 94; i++) {
		j = i+3;
		matrix[j] = [];
		matrix[j].push(...border.slice(300+i*6, 303+i*6));
		matrix[j].push(...mainpart.slice(i*94, (i+1)*94));
		matrix[j].push(...border.slice(303+i*6, 306+i*6));
	}

	for(let i = 0; i < 3; i++) {
		matrix[i+97] = border.slice(864+i*100, 864+(i+1)*100);
	}

	return matrix;
};


Level.prototype.count_wm_neighbours = function() {
	return [5, new Set([4, 5])]; // DEBUG
	/*let num_neighbours = 0;
	let enemies = new Set();
	const wm_width = game.map_positions[0].length;
	const wm_height = game.map_positions.length;
	const player = game.current_player_num;
	for(let x = 1; x < wm_width - 1; x++) {
		for(let y = 1; y < wm_height - 1; y++) {
			if(game.map_positions[y][x]	>= 0 &&
				game.map_positions[y][x] !== player)
			{
				if(game.map_positions[y][x-1] === player ||
					game.map_positions[y][x+1] === player ||
					game.map_positions[y-1][x] === player ||
					game.map_positions[y+1][x] === player)
				{
					num_neighbours++;
				}
			}
			else {
				for(let xx = x-1; x <= x+1; x++) {
					for(let yy = y-1; y <= y+1; y++) {
						if(game.map_positions[yy][xx] >= 0 &&
							game.map_positions[yy][xx] !== player)
						{
							enemies.add(game.map_positions[yy][xx]);
						}
					}
				}
			}
		}
	}

	return num_neighbours, [...enemies];*/
};


// TODO: Make maps more similar to the original maps
Level.prototype.generate_map = function() {
	// Border is based on RAM analysis. It looks like the border components are actually partly dependent on the worldmap situation.
	// As it is now, the (0-based) tiles 44, 51, 52, 53, 54, 61 make 14.3% each and 80, 84, 99 make 4.8% each
	const border = Array(1164).fill(44, 0, 166).fill(51, 166, 332).fill(52, 332, 498).fill(53, 498, 664).fill(54, 664, 830).fill(61, 830, 996).fill(80, 996, 1052).fill(84, 1052, 1108).fill(99, 1108);

	const tiles_human_base = [100, 104, 105, 106, 107, 108, 109];

	const mainpart = [];

	const plant_offsets = [0, 6, 12, 18, 24, 30]; // From tilemap

	[this.neighbourfields, this.enemies] = this.count_wm_neighbours();
	this.density = 10 * this.individuals / this.neighbourfields;
	const mod_density = 50 + 10 * this.density;
	const wfactor = 2500/this.individuals;
	const wtable = Array(6).fill(0); // TODO: wtable[n]+=wfactor for each own individual on plant n in world map
	wtable[2] = 10*wfactor; // DEBUG Should be determined by the positions on the world map

	// Add food to the map
	let factor;
	for(let i = 0; i < 5; i++) {
		if(wtable[i] > 0) {
			factor = wtable[i]/mod_density;
			mainpart.push(...Array(4*factor|0).fill(plant_offsets[i]+5));
			mainpart.push(...Array(7*factor|0).fill(plant_offsets[i]+4));
			mainpart.push(...Array(10*factor|0).fill(plant_offsets[i]+3));
			mainpart.push(...Array(15*factor|0).fill(plant_offsets[i]+2));
			mainpart.push(...Array(25*factor|0).fill(plant_offsets[i]+1));
			mainpart.push(...Array((mod_density - 61)*factor|0).fill(plant_offsets[i]));
		}
	}

	// Fill with empty fields
	for(let i = mainpart.length; i < 8836; i++) {
		mainpart.push(74); // TODO: Should be the real empty fields!
	}

	// Shuffle everything and create the actual map
	shuffle(mainpart);
	shuffle(border);
	this.map = this.listToMap(mainpart, border);

	// If humans are present, a base is created at fixed coordinates, overwriting what ever is there
	if(game.humans_present) {
		for(let x = 47; x <= 51; x++) {
			for(let y = 37; y <= 41; y++) {
				if(Math.random() <= 0.7) {
					this.map[y][x] = random_element(tiles_human_base);
				}
			}
		}
	}
};


Level.prototype.populate = function() {
	// More predators for higher difficulty and more individuals on world map.
	// (More individuals attract more predators.)
	let num_predators = 30 + (5 - game.current_player.iq) * this.individuals;
	if(num_predators > 240) {
		num_predators = 240;
	}

	// More females at a higher population density.
	let num_females = 20 + 10 * this.density
	if(num_females > 200) {
		num_females = 200;
	}

	// Fixed number of enemies, iff enemies are in neighbourhood on world map.
	// If more enemies are in the neighbourhood, they have to share the 100 spots.
	let num_enemies = 0;
	if(this.enemies.length > 0) {
		num_enemies = 100;
	}

	this.mobmap = Array.from(Array(100), _ => Array(100).fill(null));
	let pos, species;

	// Place the player somewhere around the center. If no empty space is there, it will be made empty.
	pos = random_element(this.find_free_player_tiles([44, 44], 3, 11));
	if(pos === null) {
		this.force_place_player([49, 49]);
	}
	else {
		this.mobmap[pos[1]][pos[0]] = this.character;
		this.character.tile = pos;
	}

	let free_tiles = this.find_free_tiles();

	for(let i = 0; i < num_predators; i++) {
		// Predators may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 2 && Math.abs(pos[1] - this.character.tile[1]) <= 2);
		species = random_int(0, 1 + game.humans_present);
		this.mobmap[pos[1]][pos[0]] = new Predator(species, pos);
		this.predators.push(this.mobmap[pos[1]][pos[0]]);
	};

	for(let i = 0; i < num_females; i++) {
		// Females may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
		pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		this.mobmap[pos[1]][pos[0]] = new Female(1);
	};

	for(let i = 0; i < num_enemies; i++) {
		// Enemies may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
		pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		type = random_element(this.enemies);
		this.mobmap[pos[1]][pos[0]] = new Enemy(type);
	};
};


Level.prototype.force_place_player = function(pos) {
	this.mobmap[pos[1]][pos[0]] = this.character;
	this.character.tile = pos;

	for(let y = pos[1] -1; y <= pos[1] + 1; y++) {
		for(let x = pos[0] -1; x <= pos[0] + 1; x++) {
			this.mobmap[y][x] = null;
			this.map[y][x] = 74;  // TODO: Should probably use some random empty tiles
		}
	}
};


Level.prototype.find_free_tiles = function() {
	let free_tiles = [];
	// Go through all fields in the map (disregarding the border) and check if
	// it is non-blocking.
	for(let y = 3; y < 97; y++) {
		for(let x = 3; x < 97; x++) {
			if(this.blocking[this.map[y][x]] === '0' && this.mobmap[y][x] === null)
			{
				free_tiles.push([x, y]);
			}
		}
	}

	return free_tiles;
};


Level.prototype.find_free_player_tiles = function(pos, min_size, search_size) {
	let left_counts = Array.from(Array(search_size), _ => Array(search_size).fill(0));
	let good_positions = [];
	let count, x, y;

	for(y = 0; y < search_size; y++) {
		for(x = 0; x < search_size; x++) {
			if(this.blocking[this.map[y + pos[1]][x + pos[0]]] === '0' && this.mobmap[y + pos[1]][x + pos[0]] === null)
			{
				if(x > 0) {
					count = left_counts[y][x-1] + 1;
				}
				else {
					count = 1;
				}
				left_counts[y][x] = count;
			}
			else {
				left_counts[y][x] = 0;
			}
		}
	}

	for(y = min_size-1; y < search_size; y++) {
		for(x = min_size-1; x < search_size; x++) {
			if(left_counts[y][x] >= min_size && left_counts[y-1][x] >= min_size && left_counts[y-2][x] >= min_size) {
				good_positions.push([x-1, y-1]); // I want to have the center of the square
			}
		}
	}

	return good_positions;
};


Level.prototype.request_sprite = function(x, y) {
	let type = this.map[y][x];
	let xx = Math.floor(type % 10);
	let yy = Math.floor(type / 10);
	this.bg_sprites[y][x] = new Sprite('gfx/background.png', [64, 64], [xx*64, yy*64]);
};


Level.prototype.get_dirs = function(pos, last_movement=0) {
	const x = pos[0];
	const y = pos[1];

	let dirs = [];
	if(last_movement != EAST && this.blocking[this.map[y][x+1]] === '0' && this.mobmap[y][x+1] === null) {
		dirs.push(EAST);
	}
	if(last_movement != WEST && this.blocking[this.map[y][x-1]] === '0' && this.mobmap[y][x-1] === null) {
		dirs.push(WEST);
	}
	if(last_movement != SOUTH && this.blocking[this.map[y+1][x]] === '0' && this.mobmap[y+1][x] === null) {
		dirs.push(SOUTH);
	}
	if(last_movement != NORTH && this.blocking[this.map[y-1][x]] === '0' && this.mobmap[y-1][x] === null) {
		dirs.push(NORTH);
	}

	return dirs;
};


Level.prototype.is_unblocked = function(pos, dir=0) {
	const x = pos[0];
	const y = pos[1];

	switch(dir) {
		case SOUTH: return this.blocking[this.map[y+1][x]] === '0' && this.mobmap[y+1][x] === null;
		case NORTH: return this.blocking[this.map[y-1][x]] === '0' && this.mobmap[y-1][x] === null;
		case EAST: return this.blocking[this.map[y][x+1]] === '0' && this.mobmap[y][x+1] === null;
		case WEST: return this.blocking[this.map[y][x-1]] === '0' && this.mobmap[y][x-1] === null;
		default: return this.blocking[this.map[y][x]] === '0' && this.mobmap[y][x] === null;
	}
};


Level.prototype.start_movement = function(dir) {
	this.character.movement = dir;
	const pos = this.character.tile;

	switch(dir) {
		case SOUTH:
			this.character.rel_pos[1] += speed;
			this.character.sprite = this.character.sprite_south;
			this.mobmap[pos[1] + 1][pos[0]] = placeholder; // Block the position, the player wants to go, so no other predator will go there in the same moment
			break;
		case NORTH:
			this.character.rel_pos[1] -= speed;
			this.character.sprite = this.character.sprite_north;
			this.mobmap[pos[1] - 1][pos[0]] = placeholder;
			break;
		case EAST:
			this.character.rel_pos[0] += speed;
			this.character.sprite = this.character.sprite_east;
			this.mobmap[pos[1]][pos[0] + 1] = placeholder;
			break;
		case WEST:
			this.character.rel_pos[0] -= speed;
			this.character.sprite = this.character.sprite_west;
			this.mobmap[pos[1]][pos[0] - 1] = placeholder;
			break;
	}
};


function Character(species, tile) {
	this.type = SM_PLAYER;
	this.tile = tile;
	this.rel_pos = [0, 0];
	this.movement = 0;
	this.steps = 40 + game.current_player.iq * 10;
	this.time = 0; // TODO: How much time do you have for one turn?

	// TODO: sprites must be defined by species
	this.sprite_still = new Sprite('gfx/spec1.png', [64, 64]);
	this.sprite_north = new Sprite('gfx/spec1.png', [64, 64], [128, 64], [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_east = new Sprite('gfx/spec1.png', [64, 64], [0, 0], [[512, 0], [576, 0], [0, 64], [64, 64]]);
	this.sprite_south = new Sprite('gfx/spec1.png', [64, 64], [64, 0], [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_west = new Sprite('gfx/spec1.png', [64, 64], [256, 0], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_still;
}


function Predator(species, tile) {
	this.type = SM_PREDATOR;
	this.tile = tile;
	this.rel_pos = [0, 0];
	this.movement = 0;       // current movement direction
	this.last_movement = 0;  // last movement direction

	// TODO: sprites must be defined by species
	this.sprite_still = new Sprite('gfx/pred1.png', [64, 64]);
	this.sprite_north = new Sprite('gfx/pred1.png', [64, 64], [0, 0], [[576, 0], [0, 64], [64, 64], [128, 64]]);
	this.sprite_east = new Sprite('gfx/pred1.png', [64, 64], [64, 0], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite_south = new Sprite('gfx/pred1.png', [64, 64], [192, 64], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite_west = new Sprite('gfx/pred1.png', [64, 64], [320, 0], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_still;

	switch(species) {
		case PRED_DINO:
			this.attack = 250;
			this.scent = 100;
			break;
		case PRED_MUSHROOM:
			this.attack = 350;
			this.scent = 70;
			break;
		case PRED_HUMAN:
			this.attack = 150;
			this.scent = 150;
			break;
	}
}


function Female(species) {
	this.type = SM_FEMALE;
	this.has_offspring = false;

	// TODO: Need the right coords
	// TODO: sprites must be defined by species
	this.sprite_before = new Sprite('gfx/spec1.png', [64, 64], [128, 64], [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_during = new Sprite('gfx/spec1.png', [64, 64], [64, 0], [[0, 0], [64, 0], [128, 0], [192, 0]], true);
	this.sprite_after = new Sprite('gfx/spec1.png', [256, 0], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_before;
}


function Enemy(species) {
	this.type = SM_ENEMY;
	this.lost = false;

	// TODO: Need the right coords
	// TODO: sprites must be defined by species
	this.sprite_before = new Sprite('gfx/spec1.png', [64, 64], [128, 64], [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_boasting = new Sprite('gfx/spec1.png', [64, 64], [64, 0], [[0, 0], [64, 0], [128, 0], [192, 0]], true);
	this.sprite_after = new Sprite('gfx/spec1.png', [256, 0], [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_before;
}
