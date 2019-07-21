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
	return [5, new Set()]; // DEBUG
	/*let num_neighbours = 0;
	let enemies = new Set();
	const wm_width = game.map_positions[0].length;
	const wm_height = game.map_positions.length;
	const player = game.current_player_num;
	for(let x = 1; x < width - 1; x++) {
		for(let y = 1; y < height - 1; y++) {
			if(game.map_positions[y][x] !== game.current_player_num &&
				(game.map_positions[y][x-1] === player ||
				game.map_positions[y][x+1] === player ||
				game.map_positions[y-1][x] === player ||
				game.map_positions[y+1][x] === player))
			{
				num_neighbours++;
			}

			if(game.map_positions[y][x] === game.current_player_num)
			{
				for(let xx = x-1; x <= x+1; x++) {
					for(let y = y-1; y <= y+1; y++) {
						if(game.map_positions[yy][xx] !== 0 &&
							game.map_positions[yy][xx] !== game.current_player_num)
						{
							enemies.add(game.map_positions[yy][xx]);
						}
					}
				}
			}
		}
	}

	return num_neighbours, enemies;*/
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
	const wtable = Array(6).fill(0); // wtable[n]+=wfactor for each own individual on plant n in world map
	wtable[2] = 10*wfactor; // DEBUG Should be determined by the positions on the world map

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

	for(let i = mainpart.length; i < 8836; i++) {
		mainpart.push(74); // TODO: Should be the real empty fields!
	}

	shuffle(mainpart);
	shuffle(border);

	this.map = this.listToMap(mainpart, border);

	if(game.humans_present) {
		// If humans are present, a base is created at fixed coordinates

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
	let num_predators = 30 + (5 - game.current_player.iq) * this.individuals;
	if(num_predators > 240) {
		num_predators = 240;
	}

	let num_females = 20 + 10 * this.density
	if(num_females > 200) {
		num_females = 200;
	}

	let num_enemies = 0;
	if(this.enemies.length > 0) {
		num_enemies = 100;
	}

	this.mobmap = Array.from(Array(100), _ => Array(100).fill(null));

	this.mobmap[this.character.tile[1]][this.character.tile[0]] = this.character;
	this.mobmap[50][49] = new Predator(PRED_DINO, [50, 49]);
	this.predators.push(this.mobmap[50][49]);
};


Level.prototype.request_sprite = function(x, y) {
	let type = this.map[y][x];
	let xx = Math.floor(type % 10);
	let yy = Math.floor(type / 10);
	this.bg_sprites[y][x] = new Sprite('gfx/background.png', [64, 64], [xx*64, yy*64]);
};


Level.prototype.get_dirs = function(pos) {
	const x = pos[0];
	const y = pos[1];

	let dirs = [];
	if(this.blocking[this.map[y][x+1]] === '0') {
		dirs.push(EAST);
	}
	if(this.blocking[this.map[y][x-1]] === '0') {
		dirs.push(WEST);
	}
	if(this.blocking[this.map[y+1][x]] === '0') {
		dirs.push(SOUTH);
	}
	if(this.blocking[this.map[y-1][x]] === '0') {
		dirs.push(NORTH);
	}

	return dirs;
};


Level.prototype.is_unblocked = function(pos, dir=0) {
	const x = pos[0];
	const y = pos[1];

	switch(dir) {
		case SOUTH: return this.blocking[this.map[y+1][x]] === '0';
		case NORTH: return this.blocking[this.map[y-1][x]] === '0';
		case EAST: return this.blocking[this.map[y][x+1]] === '0';
		case WEST: return this.blocking[this.map[y][x-1]] === '0';
		default: return this.blocking[this.map[y][x]] === '0';
	}
};


function Character(species, tile) {
	this.tile = tile;
	this.rel_pos = [0, 0];
	this.movement = 0;
	this.steps = 40 + game.current_player.iq * 10;
	this.time = 0; // TODO: How much time do you have for one turn?

	// TODO: sprites must be defined by species
	this.sprite_still = new Sprite('gfx/spec1.png', [64, 64]);
	this.sprite_north = new Sprite('gfx/spec1.png', [64, 64], [128, 64], 9, [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_east = new Sprite('gfx/spec1.png', [64, 64], [0, 0], 9, [[512, 0], [576, 0], [0, 64], [64, 64]]);
	this.sprite_south = new Sprite('gfx/spec1.png', [64, 64], [64, 0], 9, [[0, 0], [64, 0], [128, 0], [64, 0]]);
	this.sprite_west = new Sprite('gfx/spec1.png', [64, 64], [256, 0], 9, [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_still;
}


function Predator(type, tile) {
	this.tile = tile;
	this.rel_pos = [0, 0];
	this.movement = 0;

	// TODO: sprites must be defined by species
	this.sprite_still = new Sprite('gfx/pred1.png', [64, 64]);
	this.sprite_north = new Sprite('gfx/pred1.png', [64, 64], [0, 0], 9, [[576, 0], [0, 64], [64, 64], [128, 64]]);
	this.sprite_east = new Sprite('gfx/pred1.png', [64, 64], [64, 0], 9, [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite_south = new Sprite('gfx/pred1.png', [64, 64], [192, 64], 9, [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite_west = new Sprite('gfx/pred1.png', [64, 64], [320, 0], 9, [[0, 0], [64, 0], [128, 0], [192, 0]]);
	this.sprite = this.sprite_still;

	switch(type) {
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
