'use strict';

function Level() {
	this.map = null;
	this.mobmap = null;
	this.neighbourfields = 0;
	this.predators = [];
	this.individuals = game.current_player.individuals;
	this.density = 0;
	this.blocking = '000000000000000000000000000000000000111111111111111111111110011110111100000000001111111100000000000111111111111111111100001111111111111';
	this.edible = '011111011111011111011111011111011111000000000000000000000000000000000000000000000000000011111100000000000000000000000010100000000000000';
	this.height = 100;
	this.width = 100;

	this.character = new Character(game.current_player.id, [49, 49]);

	this.generate_map();
	this.populate();
	this.bg_sprites = Array.from(Array(100), () => Array(100).fill(null));
}


Level.prototype.listToMap = function(mainpart, border) {
	const matrix = Array(100);

	for(let i = 0; i < 3; i++) {
		matrix[i] = border.slice(i*100, (i+1)*100);
	}

	for(let i = 0; i < 94; i++) {
		const j = i+3;
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
	const enemies = new Set();
	const wm_width = game.map_positions[0].length;
	const wm_height = game.map_positions.length;
	const player = game.current_player.id;
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


// TODO RESEARCH: Make maps more similar to the original maps
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
	for(let i = 0; i < 5; i++) {
		if(wtable[i] > 0) {
			const factor = wtable[i]/mod_density;
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
		mainpart.push(74); // TODO RESEARCH: Should be the real empty fields!
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
	if(true || num_predators > 240) { // DEBUG
		num_predators = 240;
	}

	// More females at a higher population density.
	let num_females = 20 + 10 * this.density
	if(true || num_females > 200) { // DEBUG
		num_females = 200;
	}

	// Fixed number of enemies, iff enemies are in neighbourhood on world map.
	// If more enemies are in the neighbourhood, they have to share the 100 spots.
	let num_enemies = 0;
	if(this.enemies.length > 0) {
		num_enemies = 100;
	}

	console.log('Creating ' + num_predators + ' predators, ' + num_females + ' females, and ' + num_enemies + ' enemies');

	this.mobmap = Array.from(Array(100), () => Array(100).fill(null));
	let pos;

	// Place the player somewhere around the center
	this.place_player([49, 49]);

	let free_tiles = this.find_free_tiles();

	for(let i = 0; i < num_predators; i++) {
		// Predators may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 2 && Math.abs(pos[1] - this.character.tile[1]) <= 2);
		const species = random_int(0, 1 + game.humans_present);
		this.mobmap[pos[1]][pos[0]] = new Predator(species, pos);
		this.predators.push(this.mobmap[pos[1]][pos[0]]);
	}

	for(let i = 0; i < num_females; i++) {
		// Females may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
		pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		this.mobmap[pos[1]][pos[0]] = new Female(1, pos);
	}

	for(let i = 0; i < num_enemies; i++) {
		// Enemies may not be placed with 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
		pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		const species = random_element(this.enemies);
		this.mobmap[pos[1]][pos[0]] = new Enemy(species, pos);
	}
};


Level.prototype.place_player = function(ideal_pos) {
	// Place the player somewhere around the ideal position. If there is no empty space, it will be made empty.

	const pos = random_element(this.find_free_player_tiles([ideal_pos[0] - 5, ideal_pos[1] - 5], 3, 11));
	if(pos === null) {
		this.mobmap[ideal_pos[1]][ideal_pos[0]] = this.character;
		this.character.tile = ideal_pos;

		for(let y = ideal_pos[1] -1; y <= ideal_pos[1] + 1; y++) {
			for(let x = ideal_pos[0] -1; x <= ideal_pos[0] + 1; x++) {
				this.mobmap[y][x] = null;
				this.map[y][x] = 74;  // TODO RESEARCH: Should use some random empty tiles
			}
		}
	}
	else {
		this.mobmap[pos[1]][pos[0]] = this.character;
		this.character.tile = pos;
	}
};


Level.prototype.find_free_tiles = function() {
	const free_tiles = [];
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
	const left_counts = Array.from(Array(search_size), () => Array(search_size).fill(0));
	const good_positions = [];

	for(let y = 0; y < search_size; y++) {
		for(let x = 0; x < search_size; x++) {
			let count;
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

	for(let y = min_size-1; y < search_size; y++) {
		for(let x = min_size-1; x < search_size; x++) {
			if(left_counts[y][x] >= min_size && left_counts[y-1][x] >= min_size && left_counts[y-2][x] >= min_size) {
				good_positions.push([x + pos[0] - 1, y + pos[1] - 1]); // I want to have the center of the square
			}
		}
	}

	return good_positions;
};


Level.prototype.request_sprite = function(x, y) {
	const type = this.map[y][x];
	const xx = Math.floor(type % 10);
	const yy = Math.floor(type / 10);
	this.bg_sprites[y][x] = new Sprite('gfx/background.png', [64, 64], [xx*64, yy*64]);
};


Level.prototype.get_dirs = function(pos, last_movement=0) {
	const x = pos[0];
	const y = pos[1];

	const dirs = [];
	if(last_movement !== DIR.W && this.blocking[this.map[y][x+1]] === '0' && this.mobmap[y][x+1] === null) {
		dirs.push(DIR.E);
	}
	if(last_movement !== DIR.E && this.blocking[this.map[y][x-1]] === '0' && this.mobmap[y][x-1] === null) {
		dirs.push(DIR.W);
	}
	if(last_movement !== DIR.N && this.blocking[this.map[y+1][x]] === '0' && this.mobmap[y+1][x] === null) {
		dirs.push(DIR.S);
	}
	if(last_movement !== DIR.S && this.blocking[this.map[y-1][x]] === '0' && this.mobmap[y-1][x] === null) {
		dirs.push(DIR.N);
	}

	return dirs;
};


Level.prototype.is_unblocked = function(pos, dir=0) {
	const x = pos[0];
	const y = pos[1];

	switch(dir) {
		case DIR.S: return this.blocking[this.map[y+1][x]] === '0' && this.mobmap[y+1][x] === null;
		case DIR.N: return this.blocking[this.map[y-1][x]] === '0' && this.mobmap[y-1][x] === null;
		case DIR.E: return this.blocking[this.map[y][x+1]] === '0' && this.mobmap[y][x+1] === null;
		case DIR.W: return this.blocking[this.map[y][x-1]] === '0' && this.mobmap[y][x-1] === null;
		default: return this.blocking[this.map[y][x]] === '0' && this.mobmap[y][x] === null;
	}
};


function Character(species, tile) {
	this.type = SURV_MAP.PLAYER;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.movement = 0;
	this.invincible = false;
	this.steps = 40 + game.current_player.iq * 10;
	this.time = 2000; // ms per turn TODO RESEARCH: Is this correct?

	this.url = 'gfx/spec' + (species+1) + '.png';
	this.anims = anims_players[species];

	this.victories = [];

	this.sprite = new Sprite(this.url, [64, 64], this.anims.still.soffset, this.anims.still.frames);
}


function Predator(species, tile) {
	this.type = SURV_MAP.PREDATOR;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.movement = 0;       // current movement direction
	this.last_movement = 0;  // last movement direction (important, because they can't move back)

	this.url = 'gfx/pred' + (species+1) + '.png';
	this.anims = anims_predators[species];
	this.defeated = random_element(this.anims.defeated);

	this.sprite = new Sprite(this.url, [64, 64], this.anims.still.soffset, this.anims.still.frames);

	//             dino, mushroom, human
	this.attack = [250 ,   350   ,  150][species];
	this.scent =  [100 ,    70   ,  150][species];
}


Predator.prototype.defeat = function() {
	this.type = SURV_MAP.UNRESPONSIVE;
	const def = random_int(0, 2);
	this.sprite = new Sprite(this.url, [64, 64], this.anims.defeated[def].soffset, this.anims.defeated[def].frames);
};


function Female(species, tile) {
	this.type = SURV_MAP.FEMALE;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.has_offspring = false;

	this.url = 'gfx/spec' + (species+1) + '.png';
	this.anims = anims_players[species];

	this.sprite = new Sprite(this.url, [64, 64], this.anims.female.soffset, this.anims.female.frames);
}


Female.prototype.offspring = function() {
	this.type = SURV_MAP.UNRESPONSIVE;
	this.sprite = new Sprite(this.url, [64, 64], this.anims.offspring.soffset, this.anims.offspring.frames);
};


function Enemy(species, tile) {
	this.type = SURV_MAP.ENEMY;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.lost = false;

	this.url = 'gfx/enemies.png';
	this.anims = anims_players[species];

	this.sprite = new Sprite(this.url, [64, 64], this.anims.enem_still.soffset, this.anims.enem_still.frames);
}


Enemy.prototype.defeat = function() {
	this.type = SURV_MAP.UNRESPONSIVE;
	const def = random_int(0, 2);
	this.sprite = new Sprite(this.url, [64, 64], this.anims.enem_defeated[def].soffset, this.anims.enem_defeated[def].frames);
};
