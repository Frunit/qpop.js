'use strict';

// TODO: Actions must be rendered!

function Survival() {
	this.bg_pic = resources.get('gfx/dark_bg.png');
	//this.tiles_pics = resources.get('gfx/back_tiles.png');
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
	this.sym_dead_offset = [465, 408];
	this.minimap_offset = [465, 26];
	this.minimap_sym_soffset = [0, 16];

	this.sym_food_soffset = [0, 0];
	this.sym_love_soffset = [16, 0];
	this.sym_dead_soffset = [32, 0];
	this.icon_steps_soffset = [48, 0];
	this.icon_time_soffset = [68, 0];
	this.minispec_soffset = [0, 24];

	this.icon_dy = 25;
	this.food_dx = 8;

	this.minimap_width = 21;
	this.minimap_center = 10; // === (this.minimap_width - 1) / 2
	// CONST_END

	this.ai_active = false;
	this.ai_last_move = 0;
	this.ai_dt = 0;
	this.ai_own_individuals = [];

	this.action_active = false;
	this.action_sprite = null;
	this.action_tiles = [[0, 0]];
	this.action_offset = [0, 0];

	this.move_active = false;

	this.clickareas = [];
	this.rightclickareas = [];

	this.cam_clickpos = null;
	this.cam_rightclickpos = null;

	this.timer = 100;
}


Survival.prototype.initialize = function() {
	if(game.current_player.type === COMPUTER) {
		//this.ai();
	}

	this.level = new Level();
	this.camera = new Camera(this.level, this, this.tile_dim, this.camera_dim, this.camera_offset);

	this.redraw();
};


Survival.prototype.redraw = function() {
	draw_base();
	this.clickareas = [];
	this.rightclickareas = [];

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

	// Click on camera
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
	this.camera.draw_minimap();

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
	// TODO: one or more own functions for the symbols

};


Survival.prototype.draw_minimap = function() {
	draw_black_rect(this.minimap_offset, this.minimap_dim, '#000000');

	const MM_PLAYER = 0;
	const MM_FOOD = 1;
	const MM_LOVE = 2;
	const MM_PREDATOR = 3;
	const MM_ENEMY = 4;

	const range = (game.current_player.stats[ATT_PERCEPTION] * 7 + game.current_player.stats[ATT_INTELLIGENCE]) / 10 * 10; // DEBUG: Remove *10
	let draw = false;
	let sym, real_x, real_y, dist, threshold;

	for(let y = -range; y < range; y++) {
		real_y = this.level.character.tile[1] + y;
		for(let x = -range; x < range; x++) {
			real_x = this.level.character.tile[0] + x;

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
					case SM_PREDATOR:
						draw = true;
						sym = MM_PREDATOR;
						break;
					case SM_ENEMY:
						draw = true;
						sym = MM_ENEMY;
						break;
					case SM_FEMALE:
						draw = true;
						sym = MM_LOVE;
						break;
				}
			}
			else if(this.level.map[real_y][real_x] < 36) {
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
	let width = 40; // TODO

	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(this.steps_offset[0], this.steps_offset[1], this.steps_dim[0], this.steps_dim[1]);
	ctx.fillStyle = '#0000ff';
	ctx.fillRect(this.steps_offset[0]+1, this.steps_offset[1]+1, width, this.steps_dim[1]-1);
	ctx.restore();

	draw_black_rect(this.steps_offset, this.steps_dim);
};


Survival.prototype.draw_time = function() {
	let width = 40; // TODO

	ctx.save();
	ctx.fillStyle = '#c3c3c3';
	ctx.fillRect(this.time_offset[0], this.time_offset[1], this.time_dim[0], this.time_dim[1]);
	ctx.fillStyle = '#ff0000';
	ctx.fillRect(this.time_offset[0]+1, this.time_offset[1]+1, width, this.time_dim[1]-1);
	ctx.restore();

	draw_black_rect(this.time_offset, this.time_dim);
};


Survival.prototype.render = function() {
	this.camera.render();
};


Survival.prototype.finish_movement = function() {
	const char = this.level.character;
	const current_bg = this.level.map[char.tile[1]][char.tile[0]]
	char.rel_pos = [0, 0];

	if(Math.random <= 0.001 &&
			((current_bg > 63 && current_bg < 89) || (current_bg >= 95 && current_bg <= 98)) &&
			!(input.isDown('DOWN') || input.isDown('UP') || input.isDown('LEFT') || input.isDown('RIGHT')))
	{
		this.action_active = true;
		this.move_active = false;

		this.level.mobmap[char.tile[1]][char.tile[0]] = null;
		this.action_sprite = new Sprite(char.url, [64, 64], char.anims.quicksand.soffset, char.anims.quicksand.frames, true, () => this.player_death());
		this.action_tiles = [char.tile];
		this.action_offset = [0, 0];

		return;
	}

	// TODO: Test for electric flower

	const [dir, adjacent] = this.get_adjacent();
	if(dir) {
		this.action_active = true;
		this.move_active = false;

		switch(adjacent.type) {
			case SM_FEMALE:
				switch(dir) {
					case NORTH:
						this.action_tiles = [[char.tile[0], char.tile[1] - 1], char.tile];
						this.action_offset = anims_clouds.love_vert.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, true, () => this.love_finished());
						break;
					case SOUTH:
						this.action_tiles = [[char.tile[0], char.tile[1] + 1], char.tile];
						this.action_offset = anims_clouds.love_vert.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_vert.size, anims_clouds.love_vert.soffset, anims_clouds.love_vert.frames, true, () => this.love_finished());
						break;
					case EAST:
						this.action_tiles = [[char.tile[0] + 1, char.tile[1]], char.tile];
						this.action_offset = anims_clouds.love_hor.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, true, () => this.love_finished());
						break;
					case WEST:
						this.action_tiles = [[char.tile[0] - 1, char.tile[1]], char.tile];
						this.action_offset = anims_clouds.love_hor.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.love_hor.size, anims_clouds.love_hor.soffset, anims_clouds.love_hor.frames, true, () => this.love_finished());
						break;
				}
				break;
			default:
				// TODO: There is a short "pre-attack phase" where the predator opens its mouth.
				let player_wins = this.does_player_win(adjacent);
				switch(dir) {
					case NORTH:
						this.action_tiles = [[char.tile[0], char.tile[1] - 1], char.tile];
						this.action_offset = anims_clouds.fight_vert.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, true, () => this.fight_finished(player_wins));
						break;
					case SOUTH:
						this.action_tiles = [[char.tile[0], char.tile[1] + 1], char.tile];
						this.action_offset = anims_clouds.fight_vert.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_vert.size, anims_clouds.fight_vert.soffset, anims_clouds.fight_vert.frames, true, () => this.fight_finished(player_wins));
						break;
					case EAST:
						this.action_tiles = [[char.tile[0] + 1, char.tile[1]], char.tile];
						this.action_offset = anims_clouds.fight_hor.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, true, () => this.fight_finished(player_wins));
						break;
					case WEST:
						this.action_tiles = [[char.tile[0] - 1, char.tile[1]], char.tile];
						this.action_offset = anims_clouds.fight_hor.offset;
						this.action_sprite = new Sprite('gfx/clouds.png', anims_clouds.fight_hor.size, anims_clouds.fight_hor.soffset, anims_clouds.fight_hor.frames, true, () => this.fight_finished(player_wins));
						break;
				}
				break;
		}

		return;
	}

	if(this.test_movement_input()) {
		return;
	}

	// Nothing happened, end movement
	char.movement = 0;
	char.sprite = new Sprite(char.url, [64, 64], char.anims.still.soffset, char.anims.still.frames);
	this.move_active = false;
};


Survival.prototype.does_player_win = function(opponent) {
	// The player wins if the character is invincible, fights against an enemy, or has a high defense.
	return this.level.character.invincible ||
		opponent.type === SM_ENEMY ||
		random_int(0, opponent.attack) <= game.current_player.stats[ATT_DEFENSE];
};


Survival.prototype.get_adjacent = function() {
	const x = this.level.character.tile[0];
	const y = this.level.character.tile[1];

	// TODO: Are females prioritized? What is the order of checking?
	if(this.level.mobmap[y-1][x] !== null && this.level.mobmap[y-1][x].type !== SM_UNRESPONSIVE && this.level.mobmap[y-1][x].type !== SM_PLACEHOLDER) {
		return [NORTH, this.level.mobmap[y-1][x]];
	}

	if(this.level.mobmap[y][x+1] !== null && this.level.mobmap[y][x+1].type !== SM_UNRESPONSIVE && this.level.mobmap[y][x+1].type !== SM_PLACEHOLDER) {
		return [EAST, this.level.mobmap[y][x+1]];
	}

	if(this.level.mobmap[y+1][x] !== null && this.level.mobmap[y+1][x].type !== SM_UNRESPONSIVE && this.level.mobmap[y+1][x].type !== SM_PLACEHOLDER) {
		return [SOUTH, this.level.mobmap[y+1][x]];
	}

	if(this.level.mobmap[y][x-1] !== null && this.level.mobmap[y][x-1].type !== SM_UNRESPONSIVE && this.level.mobmap[y][x-1].type !== SM_PLACEHOLDER) {
		return [WEST, this.level.mobmap[y][x-1]];
	}

	return [0, null];
};


Survival.prototype.start_movement = function(dir) {
	this.level.character.movement = dir;
	const char = this.level.character;
	const pos = char.tile;

	switch(dir) {
		case SOUTH:
			char.sprite = new Sprite(char.url, [64, 64], char.anims.south.soffset, char.anims.south.frames);
			this.level.mobmap[pos[1] + 1][pos[0]] = placeholder; // Block the position, the player wants to go, so no other predator will go there in the same moment
			break;
		case NORTH:
			char.sprite = new Sprite(char.url, [64, 64], char.anims.north.soffset, char.anims.north.frames);
			this.level.mobmap[pos[1] - 1][pos[0]] = placeholder;
			break;
		case EAST:
			char.sprite = new Sprite(char.url, [64, 64], char.anims.east.soffset, char.anims.east.frames);
			this.level.mobmap[pos[1]][pos[0] + 1] = placeholder;
			break;
		case WEST:
			char.sprite = new Sprite(char.url, [64, 64], char.anims.west.soffset, char.anims.west.frames);
			this.level.mobmap[pos[1]][pos[0] - 1] = placeholder;
			break;
		/*
		case 0: // Feeding/waiting
			char.sprite = new Sprite(char.url, [64, 64], char.anims.feeding.soffset, char.anims.feeding.frames);
			break;
		*/
	}

	this.start_predator_movement();
	this.move_active = true;
};


Survival.prototype.resolve_movement = function(obj, dt) {
	const speed = options.surv_move_speed * dt;
	let finished_move = false;
	switch (obj.movement) {
	case SOUTH:
		if(obj.rel_pos[1] + speed > this.tile_dim[1]) {
			obj.tile[1]++;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]-1][obj.tile[0]];
			this.level.mobmap[obj.tile[1]-1][obj.tile[0]] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[1] += speed;
		}
		break;
	case NORTH:
		if(Math.abs(obj.rel_pos[1] - speed) > this.tile_dim[1]) {
			obj.tile[1]--;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]+1][obj.tile[0]];
			this.level.mobmap[obj.tile[1]+1][obj.tile[0]] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[1] -= speed;
		}
		break;
	case WEST:
		if(Math.abs(obj.rel_pos[0] - speed) > this.tile_dim[0]) {
			obj.tile[0]--;
			this.level.mobmap[obj.tile[1]][obj.tile[0]] = this.level.mobmap[obj.tile[1]][obj.tile[0]+1];
			this.level.mobmap[obj.tile[1]][obj.tile[0]+1] = null;
			finished_move = true;
		}
		else {
			obj.rel_pos[0] -= speed;
		}
		break;
	case EAST:
		if(obj.rel_pos[0] + speed > this.tile_dim[0]) {
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
		if(obj.type === SM_PLAYER) {
			this.finish_movement();
		}
		else {
			obj.rel_pos = [0, 0]
			obj.last_movement = obj.movement;
			obj.movement = 0;
			obj.sprite = new Sprite(obj.url, [64, 64], obj.anims.still.soffset, obj.anims.still.frames);
		}
	}
};


Survival.prototype.start_predator_movement = function() {
	const player_pos = this.level.character.tile;
	const evasion = game.current_player.stats[ATT_CAMOUFLAGE] * 4 + game.current_player.stats[ATT_SPEED] * 2 +  game.current_player.stats[ATT_INTELLIGENCE];

	let pos, dirs, dx, dy, dist, scent_chance, target_dirs;

	for(let predator of this.level.predators) {
		pos = predator.tile;

		dx = Math.abs(pos[0] - player_pos[0]);
		dy = Math.abs(pos[1] - player_pos[1]);
		dist = Math.max(dx, dy);
		switch(dist) {
			case 1: scent_chance = -1; break;
			case 2: scent_chance = 10; break;
			case 3: scent_chance = 5; break;
			default: scent_chance = 0;
		}
		scent_chance *= predator.scent;

		// Open directions. Note, that a predator may not go backwards!
		dirs = this.level.get_dirs(predator.tile, predator.last_movement);
		target_dirs = [0, 0];

		// If the predator scents the player, try to get closer or don't move at all.
		// If possible, move closer on the axis where the predator is further away.
		// If not, move close on the other axis.
		// If both axes are equally close, prefer NORTH/SOUTH over EAST/WEST.
		// If a move would put the predator further away from the player, don't move (that's not very smart, but the original behaviour).
		if(scent_chance < 0 || (scent_chance > 0 && random_int(0, scent_chance-1) > evasion)) {
			if(pos[1] - player_pos[1] > 0) {
				target_dirs[0] = NORTH;
			}
			else {
				target_dirs[0] = SOUTH;
			}

			if(pos[0] - player_pos[0] > 0) {
				target_dirs[1] = WEST;
			}
			else {
				target_dirs[1] = EAST;
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
			case NORTH:
				predator.sprite = new Sprite(predator.url, [64, 64], predator.anims.north.soffset, predator.anims.north.frames);
				this.level.mobmap[pos[1] - 1][pos[0]] = placeholder; // Block the spot on the map to prevent others from going there
				break;
			case SOUTH:
				predator.sprite = new Sprite(predator.url, [64, 64], predator.anims.south.soffset, predator.anims.south.frames);
				this.level.mobmap[pos[1] + 1][pos[0]] = placeholder;
				break;
			case WEST:
				predator.sprite = new Sprite(predator.url, [64, 64], predator.anims.west.soffset, predator.anims.west.frames);
				this.level.mobmap[pos[1]][pos[0] - 1] = placeholder;
				break;
			case EAST:
				predator.sprite = new Sprite(predator.url, [64, 64], predator.anims.east.soffset, predator.anims.east.frames);
				this.level.mobmap[pos[1]][pos[0] + 1] = placeholder;
				break;
		}
	}
};


Survival.prototype.player_death = function(sprite = null) {
	game.current_player.deaths++;
	// TODO: Update the death icons
	this.level.mobmap[this.level.character.tile[1]][this.level.character.tile[0]] = sprite;
	this.level.place_player([random_int(20, 80), random_int(20, 80)]);
	this.action_active = false;
};


Survival.prototype.update_entities = function(dt) {
	// Update background sprites
	this.camera.update_visible_level(dt);

	if(this.action_active && this.action_sprite.finished) {
		this.action_sprite.callback();
	}
};


Survival.prototype.update = function(dt) {
	this.handle_input(dt);

	this.timer += dt;
	if(this.timer < 0.1) {
		return;
	}

	if(this.level.character.movement) {
		this.resolve_movement(this.level.character, this.timer);
		this.camera.move_to(this.level.character);

		for(let predator of this.level.predators) {
			this.resolve_movement(predator, this.timer);
		}
	}

	this.update_entities(this.timer);
	this.timer = 0;
};


Survival.prototype.handle_input = function(dt) {
	if(input.isDown('MOVE')) {
		let pos = input.mousePos();
		if(game.clicked_element || game.right_clicked_element) {
			let area = game.clicked_element || game.right_clicked_element;
			if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
				pos[1] >= area.y1 && pos[1] <= area.y2)
			{
				if(area.move) {
					area.move(pos[0], pos[1]);
				}
			}
			else
				{
				area.blur();
				game.clicked_element = null;
				game.right_clicked_element = null;
			}
		}
		else {
			let found = false;
			for(let area of this.clickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
						pos[1] >= area.y1 && pos[1] <= area.y2)
				{
					if(!area.default_pointer) {
						canvas.style.cursor = 'pointer';
						found = true;
					}
					break;
				}
			}

			if(!found) {
				canvas.style.cursor = 'default';
			}
		}
	}

	if(input.isDown('MOUSE')) {
		input.reset('MOUSE')
		if(input.isDown('CLICK')) {
			input.reset('CLICK');
			let pos = input.mousePos();
			for(let area of this.clickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2)
					{
					area.down(pos[0], pos[1]);
					game.clicked_element = area;
					break;
				}
			}
		}
		else if(input.isDown('CLICKUP')) {
			input.reset('CLICKUP');
			if(game.clicked_element) {
				game.clicked_element.up();
				game.clicked_element = null;
			}
		}
		else if(input.isDown('RCLICK')) {
			input.reset('RCLICK');
			let pos = input.mousePos();
			for(let area of this.rightclickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2)
					{
					area.down(pos[0], pos[1]);
					game.right_clicked_element = area;
					break;
				}
			}
		}
		else if(input.isDown('RCLICKUP')) {
			input.reset('RCLICKUP');
			if(game.right_clicked_element) {
				game.right_clicked_element.up();
				game.right_clicked_element = null;
			}
		}
		else if(input.isDown('BLUR')) {
			input.reset('BLUR')
			if(game.clicked_element) {
				game.clicked_element.blur();
				game.clicked_element = null;
			}
			if(game.right_clicked_element) {
				game.right_clicked_element.blur();
				game.right_clicked_element = null;
			}
		}
	}

	if(!this.move_active && !this.action_active) {
		if(input.isDown('ENTER')) {
			input.reset('ENTER');
			this.next();
		}
		else {
			this.test_movement_input();
		}
	}
};


Survival.prototype.test_movement_input = function() {
	if(input.isDown('DOWN')) {
		//input.reset('DOWN');
		if(this.level.is_unblocked(this.level.character.tile, SOUTH)) {
			this.start_movement(SOUTH);
		}
	}

	else if(input.isDown('UP')) {
		//input.reset('UP');
		if(this.level.is_unblocked(this.level.character.tile, NORTH)) {
			this.start_movement(NORTH);
		}
	}

	else if(input.isDown('LEFT')) {
		//input.reset('LEFT');
		if(this.level.is_unblocked(this.level.character.tile, WEST)) {
			this.start_movement(WEST);
		}
	}

	else if(input.isDown('RIGHT')) {
		//input.reset('RIGHT');
		if(this.level.is_unblocked(this.level.character.tile, EAST)) {
			this.start_movement(EAST);
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


Survival.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);

	// TODO: Test if movement points left
	// TODO: Run calculations on outcome. Test if player is still alive.
	game.next_stage();
};


Survival.prototype.next_player = function() {
	// TODO: Next player
};
