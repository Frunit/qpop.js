'use strict';


// TODO: Enemies, Females and Offspring must have randomized sprite animations
// TODO RESEARCH: Chuck Berry feeding has only 5 (instead of 8) frames. How to handle predators?
// TODO: Radar is updated at the beginning of the movement, not at the end

function Survival() {
	this.id = SCENE.SURVIVAL;
	this.bg_pic = resources.get('gfx/dark_bg.png');
	this.gui_pics = resources.get('gfx/survival_gui.png');

	// CONST_START
	this.camera_dim = [448, 448];
	this.tile_dim = [64, 64];
	this.left_rect_dim = [460, 460];
	this.right_rect_dim = [181, 439];
	this.next_dim = [181, 22];
	this.time_dim = [122, 25];
	this.steps_dim = [122, 25];
	this.icon_dim = [20, 20];
	this.sym_dim = [16, 16];
	this.minimap_dim = [168, 168];
	this.minimap_sym_dim = [8, 8];

	this.camera_offset = [6, 26];
	this.left_rect_offset = [0, 20];
	this.right_rect_offset = [459, 20];
	this.next_offset = [459, 458];
	this.steps_offset = [508, 205];
	this.time_offset = [508, 240];
	this.icon_steps_offset = [470, 243];
	this.icon_time_offset = [470, 208];
	this.sym_food_offset = [465, 286];
	this.sym_love_offset = [465, 347];
	this.sym_dead_offset = [465, 381];
	this.sym_won_offset = [465, 416];
	this.minimap_offset = [465, 26];
	this.minimap_sym_soffset = [0, 16];

	this.sym_food_soffset = [0, 0];
	this.sym_love_soffset = [16, 0];
	this.sym_dead_soffset = [32, 0];
	this.sym_won_soffset = [0, 24];
	this.icon_steps_soffset = [48, 0];
	this.icon_time_soffset = [68, 0];
	this.minispec_soffset = [0, 24];

	this.sym_food_delta = [8, 25];
	this.sym_dx = 17;

	this.minimap_width = 21;
	this.minimap_center = 10; // === (this.minimap_width - 1) / 2

	this.eating_div = 37;
	// CONST_END

	this.action = null;
	this.movement_active = false;
	this.movement_just_finished = false;

	this.delay = anim_delays.movement;
	this.delay_counter = 0;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];

	this.cam_clickpos = null;
	this.cam_rightclickpos = null;
}


Survival.prototype.initialize = function() {
	game.current_player.loved = 0;
	game.current_player.eaten = 0;
	game.current_player.experience = 0;
	game.current_player.deaths = 0;

	if(game.current_player.type === PLAYER_TYPE.COMPUTER) {
		this.ai();
		return;
	}

	this.level = new Level();
	this.camera = new Camera(this.level, this, this.tile_dim, this.camera_dim, this.camera_offset);

	this.redraw();
};


Survival.prototype.redraw = function() {
	draw_base();
	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

	draw_rect(this.left_rect_offset, this.left_rect_dim); // Main rectangle
	draw_rect(this.right_rect_offset, this.right_rect_dim); // Right rectangle
	draw_rect(this.next_offset, this.next_dim); // Continue rectangle
	write_text(lang.next, [549, 473], 'white', 'black');
	this.clickareas.push({
		x1: this.next_offset[0],
		y1: this.next_offset[1],
		x2: this.next_offset[0] + this.next_dim[0],
		y2: this.next_offset[1] + this.next_dim[1],
		down: () => draw_rect(this.next_offset, this.next_dim, true, true),
		up: () => this.next(),
		blur: () => draw_rect(this.next_offset, this.next_dim)
	});

	// Black border around camera
	draw_black_rect([this.camera_offset[0] - 1, this.camera_offset[1] - 1], [this.camera_dim[0] + 1, this.camera_dim[1] + 1]);

	// TODO: Click on camera
	/*this.clickareas.push({
		x1: this.camera_offset[0],
		y1: this.camera_offset[1],
		x2: this.camera_offset[0] + this.camera_dim[0],
		y2: this.camera_offset[1] + this.camera_dim[1],
		down: (x, y) => this.cam_click(x, y),
		up: () => this.cam_clickup(),
		blur: () => this.cam_clickup(),
		move: (x, y) => this.cam_move(x, y),
		default_pointer: true
	});*/

	/*this.rightclickareas.push({
		x1: this.camera_offset[0],
		y1: this.camera_offset[1],
		x2: this.camera_offset[0] + this.camera_dim[0],
		y2: this.camera_offset[1] + this.camera_dim[1],
		down: (x, y) => this.cam_rightclick(x, y),
		up: (x, y) => this.cam_rightclickup(),
		blur: (x, y) => this.cam_rightclickup(),
		move: (x, y) => this.cam_rightmove(x, y)
	});*/

	// Minimap
	this.draw_minimap();

	// Steps
	ctx.drawImage(this.gui_pics,
		this.icon_steps_soffset[0], this.icon_steps_soffset[1],
		this.icon_dim[0], this.icon_dim[1],
		this.icon_steps_offset[0], this.icon_steps_offset[1],
		this.icon_dim[0], this.icon_dim[1]);
	this.draw_steps();

	// Time
	ctx.drawImage(this.gui_pics,
		this.icon_time_soffset[0], this.icon_time_soffset[1],
		this.icon_dim[0], this.icon_dim[1],
		this.icon_time_offset[0], this.icon_time_offset[1],
		this.icon_dim[0], this.icon_dim[1]);
	this.draw_time();

	// Symbols
	this.draw_symbols();

	// Main area
	this.camera.render();

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
		{'key': 'ESCAPE', 'action': () => this.suicide(), 'reset': true},
	];
};


Survival.prototype.draw_minimap = function() {
	draw_black_rect(this.minimap_offset, this.minimap_dim, '#000000');

	const MM_PLAYER = 0;
	const MM_FOOD = 1;
	const MM_LOVE = 2;
	const MM_PREDATOR = 3;
	const MM_ENEMY = 4;

	const range = (game.current_player.stats[ATTR.PERCEPTION] * 7 + game.current_player.stats[ATTR.INTELLIGENCE]) / 10;
	let draw = false;

	for(let y = -range; y < range; y++) {
		const real_y = this.level.character.tile[1] + y;
		for(let x = -range; x < range; x++) {
			const real_x = this.level.character.tile[0] + x;
			let sym;

			// If the range is too low, don't show anything here
			if(range <= Math.sqrt(y**2 + x**2) * 10 - 30) {
				continue;
			}

			draw = false;
			if(x === 0 && y === 0) {
				draw = true;
				sym = MM_PLAYER;
			}
			else if(this.level.mobmap[real_y][real_x] !== null) {
				switch(this.level.mobmap[real_y][real_x].type) {
					case SURV_MAP.PREDATOR:
						draw = true;
						sym = MM_PREDATOR;
						break;
					case SURV_MAP.ENEMY:
						draw = true;
						sym = MM_ENEMY;
						break;
					case SURV_MAP.FEMALE:
						draw = true;
						sym = MM_LOVE;
						break;
				}
			}
			else if(this.level.map[real_y][real_x] < 36) {
				let threshold;
				switch(this.level.map[real_y][real_x] % 6) {
					case 3:
						threshold = 75;
						break;
					case 4:
						threshold = 50;
						break;
					case 5:
						threshold = 25;
						break;
					default:
						threshold = 110;
				}

				if(game.current_player.stats[Math.floor(this.level.map[real_y][real_x] / 6)] > threshold) {
					draw = true;
					sym = MM_FOOD;
				}
			}

			if(draw) {
				ctx.drawImage(this.gui_pics,
					this.minimap_sym_soffset[0] + sym * this.minimap_sym_dim[0],
					this.minimap_sym_soffset[1],
					this.minimap_sym_dim[0], this.minimap_sym_dim[1],
					this.minimap_offset[0] + (this.minimap_center + x) * this.minimap_sym_dim[0],
					this.minimap_offset[1] + (this.minimap_center + y) * this.minimap_sym_dim[1],
					this.minimap_sym_dim[0], this.minimap_sym_dim[1]);
			}
		}
	}
};


Survival.prototype.draw_steps = function() {
	const width = 40; // TODO

	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(this.steps_offset[0], this.steps_offset[1], this.steps_dim[0], this.steps_dim[1]);
	ctx.fillStyle = '#0000ff';
	ctx.fillRect(this.steps_offset[0]+1, this.steps_offset[1]+1, width, this.steps_dim[1]-1);
	ctx.restore();

	draw_black_rect(this.steps_offset, this.steps_dim);
};


Survival.prototype.draw_time = function() {
	const width = 40; // TODO

	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(this.time_offset[0], this.time_offset[1], this.time_dim[0], this.time_dim[1]);
	ctx.fillStyle = '#ff0000';
	ctx.fillRect(this.time_offset[0]+1, this.time_offset[1]+1, width, this.time_dim[1]-1);
	ctx.restore();

	draw_black_rect(this.time_offset, this.time_dim);
};


Survival.prototype.draw_symbols = function() {
	// Delete earlier drawings
	const w = this.sym_dx * 10;
	const h = this.sym_won_offset[1] - this.sym_food_offset[1] + this.sym_dim[1];
	ctx.drawImage(this.bg_pic,
		this.sym_food_offset[0], this.sym_food_offset[1],
		w, h,
		this.sym_food_offset[0], this.sym_food_offset[1],
		w, h);

	// Food
	for(let i = 0; i < Math.floor(game.current_player.eaten / this.eating_div); i++) {
		ctx.drawImage(this.gui_pics,
			this.sym_food_soffset[0], this.sym_food_soffset[1],
			this.sym_dim[0], this.sym_dim[1],
			this.sym_food_offset[0] + this.sym_food_delta[0] * (i%20), this.sym_food_offset[1] + this.sym_food_delta[1] * Math.floor(i/20),
			this.sym_dim[0], this.sym_dim[1]);
	}

	// Love
	for(let i = 0; i < game.current_player.loved; i++) {
		ctx.drawImage(this.gui_pics,
			this.sym_love_soffset[0], this.sym_love_soffset[1],
			this.sym_dim[0], this.sym_dim[1],
			this.sym_love_offset[0] + this.sym_dx * i, this.sym_love_offset[1],
			this.sym_dim[0], this.sym_dim[1]);
	}

	// Deaths
	for(let i = 0; i < game.current_player.deaths; i++) {
		ctx.drawImage(this.gui_pics,
			this.sym_dead_soffset[0], this.sym_dead_soffset[1],
			this.sym_dim[0], this.sym_dim[1],
			this.sym_dead_offset[0] + this.sym_dx * i, this.sym_dead_offset[1],
			this.sym_dim[0], this.sym_dim[1]);
	}

	// Wins
	for(let i = 0; i < this.level.character.victories.length; i++) {
		ctx.drawImage(this.gui_pics,
			this.sym_won_soffset[0] + this.sym_dim[0]*this.level.character.victories[i], this.sym_won_soffset[1],
			this.sym_dim[0], this.sym_dim[1],
			this.sym_won_offset[0] + this.sym_dx * i, this.sym_won_offset[1],
			this.sym_dim[0], this.sym_dim[1]);
	}
};


Survival.prototype.render = function() {
	this.camera.render();

	if(this.movement_just_finished) {
		this.movement_just_finished = false;
		this.draw_minimap();
	}
};


Survival.prototype.ai = function() {
	const iq = 5 - game.current_player.iq;
	game.current_player.experience = random_int(0, iq);

	// MAYBE correct: This does not include the density that affects human players. For human players: Higher density -> less food
	let food = 0;

	for(let x = 1; x <= 26; x++) {
		for(let y = 1; y <= 26; y++) {
			if(game.map_positions[y][x] === game.current_player.id) {
				food += (20 + iq*20 + game.current_player.stats[ATTR.PERCEPTION] / 5 + game.current_player.stats[ATTR.INTELLIGENCE] / 10) * game.current_player.stats[game.world_map[y][x]] / (3 * this.eating_div);
			}
		}
	}

	food = Math.floor(food / game.current_player.individuals);

	if(food > 40) {
		food = 40;
	}

	let death = Math.floor(random_int(0, game.current_player.individuals - 1) / 10) + 5;
	let saved = 0;
	for(let i = 0; i < death; i++) {
		if(random_int(0, 600) < game.current_player.stats[ATTR.SPEED] ||
				random_int(0, 300) < game.current_player.stats[ATTR.CAMOUFLAGE] ||
				random_int(0, 1000) < game.current_player.stats[ATTR.INTELLIGENCE] ||
				random_int(0, 600) < game.current_player.stats[ATTR.DEFENSE] ||
				random_int(0, 6) < iq)
		{
			saved++;
		}
	}

	death -= saved;
	let death_prob = death * 0.05;
	if(food < 20) {
		death_prob += (20 - food) * 0.05;
	}
	if(death_prob > 0.9) {
		death_prob = 0.9;
	}

	for(let x = 1; x <= 26; x++) {
		for(let y = 1; y <= 26; y++) {
			if(game.map_positions[y][x] === game.current_player.id && Math.random() < death_prob) {
				game.map_positions[y][x] = -1;
				game.current_player.individuals--;
			}
		}
	}

	// This does not take into account density. For a human player: Higher density > more females
	let loved = random_int(0, iq * 2 + 2);
	if(food > 20) {
		loved += Math.floor((food - 20) / 10);
	}

	game.current_player.toplace = Math.floor(loved * game.current_player.stats[ATTR.REPRODUCTION] / 20);
	if(game.current_player.toplace > 20) {
		game.current_player.toplace = 20;
	}
	else if(game.current_player.toplace < loved) {
		game.current_player.toplace = loved;
	}

	game.current_player.toplace = 0;
	game.current_player.tomove = Math.floor(game.current_player.stats[ATTR.SPEED] / 5);

	game.next_stage();
};


Survival.prototype.finish_movement = function() {
	this.movement_just_finished = true;
	const char = this.level.character;
	const current_bg = this.level.map[char.tile[1]][char.tile[0]];
	this.delay_counter = 0;
	char.hidden = false;
	this.action = null;
	this.movement_active = false;

	// Test for Quicksand
	if(Math.random() <= 0.001 &&
			((current_bg > 63 && current_bg < 89) || (current_bg >= 95 && current_bg <= 98)) &&
			!(input.isDown('DOWN') || input.isDown('UP') || input.isDown('LEFT') || input.isDown('RIGHT') || input.isDown('SPACE')))
	{
		this.level.mobmap[char.tile[1]][char.tile[0]] = null;
		this.action = new Quicksand(char, () => this.player_death(true));

		return;
	}

	// TODO RESEARCH: Test for electric flower

	// Enemy or Female found
	const [dir, adjacent] = this.get_adjacent();
	if(dir) {
		if(adjacent.type === SURV_MAP.FEMALE) {
			this.action = new Love(dir, char, adjacent, () => this.finish_love(adjacent));
		}
		else {
			const player_wins = this.does_player_win(adjacent);
			this.action = new Fight(dir, char, adjacent, player_wins, () => this.finish_fight(player_wins, adjacent));
		}

		this.level.mobmap[char.tile[1]][char.tile[0]].hidden = true;
		this.level.mobmap[adjacent.tile[1]][adjacent.tile[0]].hidden = true;

		return;
	}

	if(this.test_movement_input()) {
		return;
	}

	// Nothing happened, end movement
	char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.still.soffset, char.anims.still.frames);
};


Survival.prototype.does_player_win = function(opponent) {
	// The player wins if the character is invincible, fights against an enemy, or has a high defense.
	// DEBUG
	return true || this.level.character.invincible ||
		opponent.type === SURV_MAP.ENEMY ||
		random_int(0, opponent.attack) <= game.current_player.stats[ATTR.DEFENSE];
};


Survival.prototype.finish_feeding = function(food) {
	// Power food
	if(food >= 118) {
		this.level.character.invincible = true;
	}
	// Normal food
	else if(food < 36) {
		// Mapping from survival food to stats food.
		const food_type = [0, 2, 5, 1, 3, 4][Math.floor(food / 6)];
		game.current_player.eaten += game.current_player.stats[food_type];
		if(game.current_player.eaten > 1480) {
			game.current_player.eaten = 1480;
		}
		this.draw_symbols();
	}

	// Nothing happens with poison (it just steals your time by the lengthy animation)

	this.finish_movement();
};


Survival.prototype.finish_love = function(partner) {
	partner.hidden = false;
	this.level.character.hidden = false;
	partner.type = SURV_MAP.UNRESPONSIVE;
	partner.sprite = this.action.offspring_sprite;
	game.current_player.loved++;
	if(game.current_player.loved > 10) {
		game.current_player.loved = 10;
	}
	this.draw_symbols();
	this.finish_movement();
};


Survival.prototype.finish_fight = function(player_wins, opponent) {
	opponent.hidden = false;
	if(player_wins) {
		if(this.level.character.victories.length < 10) {
			if(opponent.type === SURV_MAP.ENEMY) {
				this.level.character.victories.push(opponent.species);
			}
			else { // Predator
				this.level.character.victories.push(opponent.species + 6);
			}
		}
		game.current_player.experience++;

		this.level.character.hidden = false;
		opponent.type = SURV_MAP.UNRESPONSIVE;
		opponent.sprite = this.action.final_opponent_sprite;
		this.draw_symbols();
		this.finish_movement();
	}
	else {
		opponent.sprite = new Sprite(opponent.url, [64, 64], 0, opponent.anims.still.soffset, opponent.anims.still.frames);
		this.player_death();
	}
};


Survival.prototype.get_adjacent = function() {
	const x = this.level.character.tile[0];
	const y = this.level.character.tile[1];

	if(this.level.mobmap[y-1][x] !== null && this.level.mobmap[y-1][x].type !== SURV_MAP.UNRESPONSIVE && this.level.mobmap[y-1][x].type !== SURV_MAP.PLACEHOLDER) {
		return [DIR.N, this.level.mobmap[y-1][x]];
	}

	if(this.level.mobmap[y][x+1] !== null && this.level.mobmap[y][x+1].type !== SURV_MAP.UNRESPONSIVE && this.level.mobmap[y][x+1].type !== SURV_MAP.PLACEHOLDER) {
		return [DIR.E, this.level.mobmap[y][x+1]];
	}

	if(this.level.mobmap[y+1][x] !== null && this.level.mobmap[y+1][x].type !== SURV_MAP.UNRESPONSIVE && this.level.mobmap[y+1][x].type !== SURV_MAP.PLACEHOLDER) {
		return [DIR.S, this.level.mobmap[y+1][x]];
	}

	if(this.level.mobmap[y][x-1] !== null && this.level.mobmap[y][x-1].type !== SURV_MAP.UNRESPONSIVE && this.level.mobmap[y][x-1].type !== SURV_MAP.PLACEHOLDER) {
		return [DIR.W, this.level.mobmap[y][x-1]];
	}

	return [0, null];
};


Survival.prototype.start_movement = function(dir) {
	if(this.movement_active) { // DEBUG
		return;                // DEBUG
	}                          // DEBUG
	const char = this.level.character;
	char.movement = dir;
	const pos = char.tile;
	this.delay = anim_delays.movement;

	switch(dir) {
		case DIR.S:
			char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.south.soffset, char.anims.south.frames);
			this.level.mobmap[pos[1] + 1][pos[0]] = new Placeholder(pos[0], pos[1]); // Block the position, the player wants to go, so no other predator will go there in the same moment
			break;
		case DIR.N:
			char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.north.soffset, char.anims.north.frames);
			this.level.mobmap[pos[1] - 1][pos[0]] = new Placeholder(pos[0], pos[1]);
			break;
		case DIR.E:
			char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.east.soffset, char.anims.east.frames);
			this.level.mobmap[pos[1]][pos[0] + 1] = new Placeholder(pos[0], pos[1]);
			break;
		case DIR.W:
			char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.west.soffset, char.anims.west.frames);
			this.level.mobmap[pos[1]][pos[0] - 1] = new Placeholder(pos[0], pos[1]);
			break;
		case 0: { // Feeding/waiting
			const food_type = this.level.map[pos[1]][pos[0]];
			if(this.level.edible[food_type] === '1') {
				this.action = new Feeding(char, this.level, food_type, () => this.finish_feeding(food_type));
				char.hidden = true;
				this.delay = anim_delays.feeding;
			}
			else {
				this.action = new Waiting(char, () => this.finish_feeding(100));
				char.hidden = true;
			}
			break;
		}
	}

	this.start_predator_movement();
	this.movement_active = true;
};


Survival.prototype.resolve_movement = function(obj) {
	const speed = options.surv_move_speed;
	let finished_move = false;
	obj.sprite.update();
	switch (obj.movement) {
	case DIR.S:
		if(obj.rel_pos[1] + speed >= this.tile_dim[1]) {
			obj.tile[1]++;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]-1][obj.tile[0]];
			this.level.mobmap[obj.tile[1]-1][obj.tile[0]] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[1] += speed;
		}
		break;
	case DIR.N:
		if(Math.abs(obj.rel_pos[1] - speed) >= this.tile_dim[1]) {
			obj.tile[1]--;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]+1][obj.tile[0]];
			this.level.mobmap[obj.tile[1]+1][obj.tile[0]] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[1] -= speed;
		}
		break;
	case DIR.W:
		if(Math.abs(obj.rel_pos[0] - speed) >= this.tile_dim[0]) {
			obj.tile[0]--;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]][obj.tile[0]+1];
			this.level.mobmap[obj.tile[1]][obj.tile[0]+1] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[0] -= speed;
		}
		break;
	case DIR.E:
		if(obj.rel_pos[0] + speed >= this.tile_dim[0]) {
			obj.tile[0]++;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]][obj.tile[0]-1];
			this.level.mobmap[obj.tile[1]][obj.tile[0]-1] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[0] += speed;
		}
		break;
	}

	if(finished_move) {
		obj.rel_pos = [0, 0];
		obj.last_movement = obj.movement;
		obj.movement = 0;

		if(obj.type === SURV_MAP.PLAYER) {
			this.finish_movement();
		}
		else {
			obj.sprite = new Sprite(obj.url, [64, 64], 0, obj.anims.still.soffset, obj.anims.still.frames);
		}
	}
};


Survival.prototype.start_predator_movement = function() {
	const player_pos = this.level.character.tile;
	const anim_delay = 0;
	const evasion = game.current_player.stats[ATTR.CAMOUFLAGE] * 4 + game.current_player.stats[ATTR.SPEED] * 2 +  game.current_player.stats[ATTR.INTELLIGENCE];

	for(let predator of this.level.predators) {
		if(predator.type === SURV_MAP.UNRESPONSIVE) {
			continue;
		}
		const pos = predator.tile;

		const dx = Math.abs(pos[0] - player_pos[0]);
		const dy = Math.abs(pos[1] - player_pos[1]);
		const dist = Math.max(dx, dy);

		let scent_chance;

		switch(dist) {
			case 1: scent_chance = -1; break;
			case 2: scent_chance = 10; break;
			case 3: scent_chance = 5; break;
			default: scent_chance = 0;
		}
		scent_chance *= predator.scent;

		// Open directions. Note, that a predator may not go backwards!
		const dirs = this.level.get_dirs(predator.tile, predator.last_movement);
		const target_dirs = [0, 0];

		// If the predator scents the player, try to get closer or don't move at all:
		// If possible, move closer on the axis where the predator is further away.
		// If not, move close on the other axis.
		// If both axes are equally close, prefer DIR.N/DIR.S over DIR.E/DIR.W.
		// If a move would put the predator further away from the player, don't move (that's not necessarily very smart, but the original behaviour).
		if(scent_chance < 0 || (scent_chance > 0 && random_int(0, scent_chance-1) > evasion)) {
			if(pos[1] - player_pos[1] > 0) {
				target_dirs[0] = DIR.N;
			}
			else {
				target_dirs[0] = DIR.S;
			}

			if(pos[0] - player_pos[0] > 0) {
				target_dirs[1] = DIR.W;
			}
			else {
				target_dirs[1] = DIR.E;
			}

			if(dx > dy) {
				target_dirs.reverse();
			}

			if(dirs.includes(target_dirs[0])) {
				predator.movement = target_dirs[0];
			}
			else if(dirs.includes(target_dirs[1])) {
				predator.movement = target_dirs[1];
			}
			else {
				predator.movement = 0;
			}
		}
		// Otherwise move to a random position, if possible.
		else {
			if(dirs.length) {
				predator.movement = random_element(dirs);
			}
			else {
				predator.movement = 0;
			}
		}

		switch(predator.movement) {
			case DIR.N:
				predator.sprite = new Sprite(predator.url, [64, 64], anim_delay, predator.anims.north.soffset, predator.anims.north.frames);
				this.level.mobmap[pos[1] - 1][pos[0]] = new Placeholder(pos[0], pos[1]); // Block the spot on the map to prevent others from going there
				break;
			case DIR.S:
				predator.sprite = new Sprite(predator.url, [64, 64], anim_delay, predator.anims.south.soffset, predator.anims.south.frames);
				this.level.mobmap[pos[1] + 1][pos[0]] = new Placeholder(pos[0], pos[1]);
				break;
			case DIR.W:
				predator.sprite = new Sprite(predator.url, [64, 64], anim_delay, predator.anims.west.soffset, predator.anims.west.frames);
				this.level.mobmap[pos[1]][pos[0] - 1] = new Placeholder(pos[0], pos[1]);
				break;
			case DIR.E:
				predator.sprite = new Sprite(predator.url, [64, 64], anim_delay, predator.anims.east.soffset, predator.anims.east.frames);
				this.level.mobmap[pos[1]][pos[0] + 1] = new Placeholder(pos[0], pos[1]);
				break;
		}
	}
};


Survival.prototype.suicide = function() {
	open_popup(lang.popup_title, 'chuck_berry', lang.suicide, (x) => {if(x===1) {this.player_death(true);}}, lang.no, lang.yes);
};


Survival.prototype.player_death = function(delete_sprite = false) {
	console.info('Player died');
	game.current_player.deaths++;
	if(game.current_player.deaths > 10) {
		game.current_player.deaths = 10;
	}
	this.draw_symbols();

	const char = this.level.character;

	if(delete_sprite) {
		this.level.mobmap[char.tile[1]][char.tile[0]] = null;
	}
	this.level.place_player([random_int(20, 80), random_int(20, 80)]);
	char.sprite = new Sprite(char.url, [64, 64], 0, char.anims.still.soffset, char.anims.still.frames);
	this.level.mobmap[char.tile[1]][char.tile[0]] = char;
	char.hidden = false;
	this.action = null;
	this.movement_active = false;
	this.movement_just_finished = true;
	this.delay_counter = 0;
	this.camera.move_to(char);
};


Survival.prototype.update = function() {
	this.test_movement_input();

	if(this.movement_active) {
		this.delay_counter++;

		if(this.delay_counter >= this.delay) {
			this.delay_counter = 0;

			for(let predator of this.level.predators) {
				if(predator.type === SURV_MAP.PREDATOR) {
					this.resolve_movement(predator);
				}
			}

			this.resolve_movement(this.level.character);
			this.camera.move_to(this.level.character);
		}
	}

	if(this.action !== null && this.action.finished) {
		this.action.callback();
	}

	debug6.value = 'mvmnt act: ' + this.movement_active + '; act: ' + this.action;

	this.camera.update_visible_level();
};


Survival.prototype.test_movement_input = function() {
	if(this.movement_active || this.action !== null) {
		return;
	}

	if(input.isDown('DOWN')) {
		//input.reset('DOWN');
		if(this.level.is_unblocked(this.level.character.tile, DIR.S)) {
			this.start_movement(DIR.S);
		}
	}

	else if(input.isDown('UP')) {
		//input.reset('UP');
		if(this.level.is_unblocked(this.level.character.tile, DIR.N)) {
			this.start_movement(DIR.N);
		}
	}

	else if(input.isDown('LEFT')) {
		//input.reset('LEFT');
		if(this.level.is_unblocked(this.level.character.tile, DIR.W)) {
			this.start_movement(DIR.W);
		}
	}

	else if(input.isDown('RIGHT')) {
		//input.reset('RIGHT');
		if(this.level.is_unblocked(this.level.character.tile, DIR.E)) {
			this.start_movement(DIR.E);
		}
	}

	else if(input.isDown('SPACE')) {
		//input.reset('SPACE');
		this.start_movement(0);
	}

	else {
		return false;
	}

	return true;
};


Survival.prototype.calc_outcome = function() {
	let death_prob = game.current_player.deaths * 0.05;
	if(game.current_player.eaten < 20 * this.eating_div) {
		death_prob += (20 * this.eating_div - game.current_player.eaten) * 0.05 / this.eating_div;
	}
	if(death_prob > 0.9) {
		death_prob = 0.9;
	}

	for(let x = 1; x <= 26; x++) {
		for(let y = 1; y <= 26; y++) {
			if(game.map_positions[y][x] === game.current_player.id && Math.random() < death_prob) {
				game.map_positions[y][x] = -1;
				game.current_player.individuals--;
			}
		}
	}

	let loved = game.current_player.loved;
	// A little bonus if you have eaten alot. It's a bit more than in the original game, so you actually get a bonus when you fill the second row.
	if(game.current_player.eaten >= 20 * this.eating_div) {
		loved += Math.floor((game.current_player.eaten - 20 * this.eating_div) / (this.eating_div * 10));
	}

	game.current_player.toplace = Math.floor(loved * game.current_player.stats[ATTR.REPRODUCTION] / 20);
	if(game.current_player.toplace > 20) {
		game.current_player.toplace = 20;
	}
	else if(game.current_player.toplace < loved) {
		game.current_player.toplace = loved;
	}

	game.current_player.tomove = Math.floor(game.current_player.stats[ATTR.SPEED] / 5);
};


Survival.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);

	if(this.movement_active || this.action !== null) {
		return;
	}

	if(this.level.character.steps > 0) {
		open_popup(lang.popup_title, 'chuck_berry', lang.turn_finished, (x) => this.next_popup(x), lang.no, lang.yes);
	}
	else {
		this.next_popup(1);
	}
};


Survival.prototype.next_popup = function(answer) {
	if(answer === 1) {
		this.calc_outcome();
		if(game.current_player.individuals === 0) {
			game.current_player.is_dead = true;
			open_popup(lang.popup_title, game.current_player.id, lang.dead, game.next_stage, lang.next);
		}
		else {
			game.next_stage();
		}
	}
};
