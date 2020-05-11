'use strict';

// TODO: Number of tiles must be checked (compare original and remake distribution using the same savegame)

function Level() {
	this.map = null;
	this.mobmap = null;
	this.neighbourfields = 0;
	this.predators = [];
	this.individuals = game.current_player.individuals;
	this.density = 0;
	this.blocking = '000000000000000000000000000000000000111111111111111111111110011110111100000000001111111100000000000111111111111111111100001111111111111';
	this.edible = '011111011111011111011111011111011111000000000000000000000000000000000000000000000000000001111110000000000000000000000010100000000000000';
	this.height = 100;
	this.width = 100;
	this.enemies = [];

	this.character = new Character(game.current_player.id, [49, 49]);

	this.generate_map();
	this.populate();
	this.bg_sprites = Array.from(Array(100), () => Array(100).fill(null));
}


Level.prototype.list_to_map = function(mainpart, border) {
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


Level.prototype.update_tile_numbers = function(x, y, numbers) {
	const height = game.height_map[y][x];
	const local_temp = game.temp + y*3 - height;
	const local_humid = game.humid - height;
	let bases = 0;
	let craters = 0;

	for(let xpos = Math.max(0, x-2); xpos <= Math.min(27, x+2); xpos++) {
		for(let ypos = Math.max(0, y-2); ypos <= Math.min(27, y+2); ypos++) {
			if(game.world_map[ypos][xpos] === WORLD_MAP.HUMANS) {
				bases += [0, 2, 1][Math.max(Math.abs(xpos), Math.abs(ypos))];
			}
			else if(game.world_map[ypos][xpos] === WORLD_MAP.CRATER) {
				craters += [0, 2, 1][Math.max(Math.abs(xpos), Math.abs(ypos))];
			}
		}
	}

	// Mountains, vulcanos, and crystals
	let mountains = 0;
	let crystals = 0;

	if(40 <= height && height <= 50) {
		mountains = 50;
	}
	else if(51 <= height && height <= 60) {
		mountains = 100;
		crystals = 15;
	}
	else if(61 <= height) {
		mountains = 150;
		crystals = 30;
	}

	numbers[51] += mountains; // mountains 1
	numbers[52] += mountains; // mountains 1
	numbers[53] += mountains; // mountains 1
	numbers[54] += mountains; // mountains 1
	numbers[44] += 6 * crystals; // volcano
	numbers[61] += 6 * crystals; // silent volcano
	numbers[80] += 3 * crystals; // crystals 1
	numbers[84] += 3 * crystals; // crystals 2
	numbers[88] += 4 * crystals; // small crystals

	// Cacti, whips, trees, eyes, lakes, mossy rocks, and drippy flowers
	let whips = 0;
	let trees = 0;
	let eye = 0;
	let lakes = 0;

	if(local_humid < -50) {
		lakes = 20;
	}
	else if(local_humid <= -30) {
		whips = 200;
	}
	else if(local_humid <= -10) {
		whips = 100;
		trees = 180;
	}
	else if(local_humid <= 10) {
		trees = 340;
		eye = 320;
	}
	else if(local_humid <= 30) {
		trees = 180;
		lakes = 10;
	}
	else {
		lakes = 20;
	}

	numbers[57] += 3 * whips; // cactus 1
	numbers[58] += 3 * whips; // cactus 1
	numbers[125] += 2 * whips; // whip plant 1
	numbers[130] += 2 * whips; // whip plant 2

	numbers[56] += trees; // dead tree
	numbers[64] += 3 * trees; // tree

	numbers[114] += eye; // eye

	numbers[59] += 30 * lakes; // lake 1
	numbers[60] += 30 * lakes; // lake 2
	numbers[63] += 14 * lakes; // mossy rocks
	numbers[110] += 26 * lakes; // drippy flowers

	// Humans
	numbers[104] += bases * 25; // base structure 1
	numbers[105] += bases * 25; // base structure 1
	numbers[106] += bases * 25; // base structure 1
	numbers[107] += bases * 25; // base structure 1
	numbers[108] += bases * 25; // base structure 1
	numbers[109] += bases * 25; // base structure 1
	numbers[122] += bases * 150; // nuclear waste

	// Craters; please note! Craters do not appear in the original game, although the graphic is there. I included them in a similar way that human structures are included to use the graphic.
	numbers[55] += craters * 25;

	// Green flower
	if(0 <= local_humid && local_humid <= 10 && 20 <= local_temp && local_temp <= 50) {
		numbers[62] += 300;
	}

	// Swamp and snail shell TODO: actual numbers are not clear, yet.
	if((local_humid <= -51 || local_humid >= 11) && (local_temp <= -12 || local_temp >= 40)) {
		numbers[36] += 300;
		numbers[66] += 400;
	}
};


Level.prototype.scan_world_map = function() {
	const numbers = Array(135).fill(0);
	const wtable = [0, 0, 0, 0, 0, 0];
	const enemies = new Set();
	let num_neighbours = 0;

	const wm_width = game.map_positions[0].length;
	const wm_height = game.map_positions.length;
	const player = game.current_player.id;

	for(let x = 1; x < wm_width - 1; x++) {
		for(let y = 1; y < wm_height - 1; y++) {
			if(game.map_positions[y][x] !== player) {
				if(game.map_positions[y][x-1] === player ||
					game.map_positions[y][x+1] === player ||
					game.map_positions[y-1][x] === player ||
					game.map_positions[y+1][x] === player)
				{
					num_neighbours++;
				}
			}
			else {  // game.map_positions[y][x] === player
				this.update_tile_numbers(x, y, numbers);
				if(game.world_map[y][x] >= WORLD_MAP.RANGONES && game.world_map[y][x] <= WORLD_MAP.FIREGRASS) {
					const plant_type = [0, 3, 1, 4, 5, 2][game.world_map[y][x] - WORLD_MAP.RANGONES];
					wtable[plant_type] += 1;
				}

				for(let xx = x-1; xx <= x+1; xx++) {
					for(let yy = y-1; yy <= y+1; yy++) {
						if(game.map_positions[yy][xx] >= 0 && game.map_positions[yy][xx] !== player)
						{
							enemies.add(game.map_positions[yy][xx]);
						}
					}
				}
			}
		}
	}

	for(let i = 0; i < numbers.length; i++) {
		numbers[i] = Math.floor(numbers[i] / this.individuals);
	}

	// Power food
	numbers[118] = 4;
	numbers[120] = 4;

	// Green blobs
	numbers[50] = random_int(10, 70);

	// Food
	this.density = 10 * this.individuals / num_neighbours;
	const mod_density = 50 + 10 * this.density;
	const wfactor = Math.floor(2500/this.individuals);

	for(let i = 0; i < wtable.length; i++) {
		wtable[i] *= wfactor;
	}

	for(let i = 0; i < 5; i++) {
		if(wtable[i] > 0) {
			const factor = Math.floor(wtable[i]/mod_density);
			const plant_offset = i*6;
			numbers[plant_offset + 5] = 5*factor;
			numbers[plant_offset + 4] = 9*factor;
			numbers[plant_offset + 3] = 12*factor;
			numbers[plant_offset + 2] = 19*factor;
			numbers[plant_offset + 1] = 31*factor;
			numbers[plant_offset] = (mod_density - 76)*factor;
		}
	}

	// Empty spaces and constants
	const remaining = 8836 - numbers.reduce((a, b) => a + b);
	let empty = remaining;
	let num;

	// Empty spaces (70-79)
	num = Math.floor(remaining * 0.04);
	for(let i = 70; i < 80; i++) {
		numbers[i] = num;
	}
	empty -= num*10;

	// Brains and yellow ponds (89-98)
	num = Math.floor(remaining * 0.01);
	for(let i = 89; i < 99; i++) {
		numbers[i] = num;
	}
	empty -= num*10;

	// Remaining empty spaces (65)
	numbers[65] = empty;

	return [numbers, enemies];
};


Level.prototype.generate_map = function() {
	// Border is based on RAM analysis. The (0-based) tiles 44, 51, 52, 53, 54, 61 make 14.3% each and 80, 84, 99 make 4.8% each
	const border = Array(1164).fill(44, 0, 166).fill(51, 166, 332).fill(52, 332, 498).fill(53, 498, 664).fill(54, 664, 830).fill(61, 830, 996).fill(80, 996, 1052).fill(84, 1052, 1108).fill(99, 1108);

	// The mainpart is also based on RAM analysis. However, it is depending on various factors on the world map
	const mainpart = Array(8836);

	const [tile_numbers, enemies] = this.scan_world_map();
	this.enemies = [...enemies];

	let main_pos = 0;
	for(let i = 0; i < tile_numbers.length; i++) {
		if(tile_numbers[i] > 0) {
			mainpart.fill(i, main_pos, main_pos + tile_numbers[i]);
			main_pos += tile_numbers[i];
		}
	}

	//console.log(mainpart.join(',')); // DEBUG

	// Shuffle everything and create the actual map
	shuffle(mainpart);
	shuffle(border);
	this.map = this.list_to_map(mainpart, border);

	// If humans are in vicinity, a base is created at fixed coordinates, overwriting whatever there was before
	const tiles_human_base = [104, 105, 106, 107, 108, 109];
	if(tile_numbers[122] > 0) {
		for(let x = 47; x <= 51; x++) {
			for(let y = 37; y <= 41; y++) {
				const r = Math.random();
				if(r <= 0.2) {
					// Radar station (on average 5)
					this.map[y][x] = 100;
				}
				else if(r <= 0.7) {
					// Other human base structures (on average 2 per tile or 12 in total)
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
	let num_females = Math.floor(20 + 10 * this.density);
	if(num_females > 200) {
		num_females = 200;
	}

	// Fixed number of enemies, iff enemies are in neighbourhood on world map.
	// If more enemies are in the neighbourhood, they have to share the 100 spots.
	let num_enemies = 0;
	if(this.enemies.length > 0) {
		num_enemies = 100;
	}

	debug_out('Creating ' + num_predators + ' predators, ' + num_females + ' females, and ' + num_enemies + ' enemies');

	this.mobmap = Array.from(Array(100), () => Array(100).fill(null));
	let pos;

	// Place the player somewhere around the center
	this.place_player([49, 49]);
	debug_out('Player placed at: ', this.character.tile);

	let free_tiles = this.find_free_tiles();

	for(let i = 0; i < num_predators; i++) {
		// Predators may not be placed within 2 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 2 && Math.abs(pos[1] - this.character.tile[1]) <= 2);
		const species = random_int(0, 1 + game.humans_present);
		this.mobmap[pos[1]][pos[0]] = new Predator(species, pos);
		this.predators.push(this.mobmap[pos[1]][pos[0]]);
	}

	for(let i = 0; i < num_females; i++) {
		// Females may not be placed within 3 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];

		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
		this.mobmap[pos[1]][pos[0]] = new Female(game.current_player.id, pos);
	}

	for(let i = 0; i < num_enemies; i++) {
		// Enemies may not be placed within 3 fields of the player
		do {
			pos = free_tiles.splice(free_tiles.length * Math.random() | 0, 1)[0];
		} while(Math.abs(pos[0] - this.character.tile[0]) <= 3 && Math.abs(pos[1] - this.character.tile[1]) <= 3);
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

		// 65 exists more often to make it more likely to choose it
		const empty_tiles = [65, 65, 65, 65, 65, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79];

		for(let y = ideal_pos[1] -1; y <= ideal_pos[1] + 1; y++) {
			for(let x = ideal_pos[0] -1; x <= ideal_pos[0] + 1; x++) {
				this.mobmap[y][x] = null;
				this.map[y][x] = random_element(empty_tiles);
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

	if(survival_background.hasOwnProperty(type)) {
		this.bg_sprites[y][x] = new Sprite('gfx/background.png', [64, 64], anim_delays.background, [0, 0], survival_background[type]);
	}
	else {
		const xx = Math.floor(type % 10);
		const yy = Math.floor(type / 10);
		this.bg_sprites[y][x] = new Sprite('gfx/background.png', [64, 64], anim_delays.background, [xx*64, yy*64]);
	}
};


Level.prototype.eat_tile = function(tile) {
	const food_type = this.map[tile[1]][tile[0]];

	// Normal food gets one less
	if(food_type < 36) {
		this.map[tile[1]][tile[0]]--;
	}

	// Power food has its corresponding empty space at +1
	else if(food_type >= 118) {
		this.map[tile[1]][tile[0]]++;
	}

	// Poison is never diminshed or changed

	this.request_sprite(...tile);
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


Level.prototype.get_sounds = function() {
	const sounds = new Set();
	const [player_x, player_y] = this.character.tile;

	for(let y = player_y - 2; y <= player_y + 2; y++) {
		for(let x = player_x - 2; x <= player_x + 2; x++) {
			const tile = this.map[y][x];
			if(tile >= 36 && tile <= 43) {
				sounds.add('swamp');
			}
			else if(tile >= 44 && tile <= 49) {
				sounds.add('volcano');
			}
			else if(tile >= 100 && tile <= 103) {
				sounds.add('human_base');
			}

			if(this.mobmap[y][x] !== null && this.mobmap[y][x].hasOwnProperty('env_sound') && this.mobmap[y][x].env_sound !== null) {
				sounds.add(this.mobmap[y][x].env_sound);
			}
		}
	}

	return sounds;
};


function Character(species, tile) {
	this.type = SURV_MAP.PLAYER;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.movement = 0;
	this.last_movement = 0;	// last movement direction
	this.invincible = false;
	this.hidden = false;

	this.url = 'gfx/spec' + (species+1) + '.png';
	this.anims = anims_players[species];

	this.victories = [];

	this.sprite = new Sprite(this.url, [64, 64], 0, this.anims.still.soffset, this.anims.still.frames);
}


function Predator(species, tile) {
	this.type = SURV_MAP.PREDATOR;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.movement = 0;		// current movement direction
	this.last_movement = 0;	// last movement direction
	this.hidden = false;

	this.url = 'gfx/pred' + (species+1) + '.png';
	this.anims = anims_predators[species];
	this.defeated = random_element(this.anims.defeated);

	this.sprite = new Sprite(this.url, [64, 64], 0, this.anims.still.soffset, this.anims.still.frames);

	//             dino, mushroom, human
	this.attack = [250 ,   350   ,  150][species];
	this.scent =  [100 ,    70   ,  150][species];
}


function Female(species, tile) {
	this.type = SURV_MAP.FEMALE;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.has_offspring = false;
	this.hidden = false;
	if(species !== SPECIES.ISNOBUG) {
		this.env_sound = 'female_' + ['purplus', 'kiwi', 'pesci', '_', 'amorph', 'chuck'][species];
	}

	this.url = 'gfx/spec' + (species+1) + '.png';
	this.anims = anims_players[species];

	this.sprite = new Sprite(this.url, [64, 64], anim_delays.female, this.anims.female.soffset, this.anims.female.frames);
}


function Enemy(species, tile) {
	this.type = SURV_MAP.ENEMY;
	this.tile = tile;
	this.species = species;
	this.rel_pos = [0, 0];
	this.hidden = false;

	this.url = 'gfx/enemies.png';
	this.anims = anims_players[species];
	this.defeated = this.anims.defeated;

	this.sprite = new Sprite(this.url, [64, 64], anim_delays.female, this.anims.enem_still.soffset, this.anims.enem_still.frames);
}
