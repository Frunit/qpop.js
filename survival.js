'use strict';

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
	this.minimap_dim = [168, 168];
	this.minimap_sym_dim = [8, 8];
	this.time_dim = [122, 25];
	this.steps_dim = [122, 25];
	this.icon_dim = [20, 20];

	this.camera_offset = [6, 26];
	this.left_rect_offset = [0, 20];
	this.right_rect_offset = [459, 20];
	this.next_offset = [459, 458];
	this.minimap_offset = [465, 26];
	this.steps_offset = [508, 205];
	this.time_offset = [508, 240];
	this.icon_steps_offset = [470, 243];
	this.icon_time_offset = [470, 208];
	this.sym_food_offset = [465, 286];
	this.sym_love_offset = [465, 347];
	this.sym_dead_offset = [465, 408];

	this.minimap_sym_soffset = [0, 16];
	this.sym_food_soffset = [0, 0];
	this.sym_love_soffset = [16, 0];
	this.sym_dead_soffset = [32, 0];
	this.minispec_soffset = [0, 24];
	this.icon_steps_soffset = [48, 0];
	this.icon_time_soffset = [68, 0];
	this.icon_dy = 25;
	this.food_dx = 8;

	this.minimap_width = 21;
	this.center = 10; // === (this.minimap_width - 1) / 2

	// CONST_END

	this.ai_active = false;
	this.ai_last_move = 0;
	this.ai_dt = 0;
	this.ai_own_individuals = [];

	this.fight_active = false;
	this.fight_animation = null;
	this.fight_pos = [0, 0];

	this.move_active = false;

	this.clickareas = [];
	this.rightclickareas = [];

	this.cam_clickpos = null;
	this.cam_rightclickpos = null;

	this.timer = 100;

	this.initialize();
}


Survival.prototype.initialize = function() {
	if(game.current_player.type === COMPUTER) {
		//this.ai();
	}

	this.level = new Level();
	this.camera = new Camera(this.level, this.tile_dim, this.camera_dim, this.camera_offset);

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
	// TODO: one or more own functions for the symbols

};


Survival.prototype.draw_minimap = function() {
	// TODO: Fill minimap with life
	draw_black_rect(this.minimap_offset, this.minimap_dim, '#000000');

	let range = game.current_player.stats[ATT_PERCEPTION]; // TODO
	let draw = false;
	let sym = 0;
	let real_x, real_y;

	for(let x = -range; x < range; x++) {
		real_x = this.level.character.tile[0] + x;
		for(let y = -range; y < range; y++) {
			real_y = this.level.character.tile[1] + y;
			draw = false;
			if(x === 0 && y === 0) {
				draw = true;
				sym = 0;
			}
			else if(this.level.mobmap[real_y][real_x] !== null) {
				draw = true;
				sym = 3;
			}
			// Test for Positions on the map (enemies, females, food) in this order



			if(draw) {
				ctx.drawImage(this.gui_pics,
					this.minimap_sym_soffset[0] + sym * this.minimap_sym_dim[0],
					this.minimap_sym_soffset[1],
					this.minimap_sym_dim[0], this.minimap_sym_dim[1],
					this.minimap_offset[0] + (this.center + x) * this.minimap_sym_dim[0],
					this.minimap_offset[1] + (this.center + y) * this.minimap_sym_dim[1],
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
		obj.rel_pos = [0, 0]
		obj.movement = 0;
		obj.sprite = obj.sprite_still;
		this.move_active = false;
	}
};


Survival.prototype.init_predator_movement = function(dt) {
	for(let predator of this.level.predators) {
		// TODO: Predator must try to follow the player!
		const new_dir = random_element(this.level.get_dirs(predator.tile));

		predator.movement = new_dir;
		const speed = options.surv_move_speed * dt

		switch(new_dir) {
			case NORTH:
				predator.rel_pos[1] -= speed;
				predator.sprite = predator.sprite_north;
				break;
			case SOUTH:
				predator.rel_pos[1] += speed;
				predator.sprite = predator.sprite_south;
				break;
			case WEST:
				predator.rel_pos[0] -= speed;
				predator.sprite = predator.sprite_west;
				break;
			case EAST:
				predator.rel_pos[0] += speed;
				predator.sprite = predator.sprite_east;
				break;
		}
	}
};


Survival.prototype.update_entities = function(dt) {
	// Update background sprites
	this.camera.update_visible_level(dt);

	// TODO: Should these really be the tasks of the camera or rather the level?
	// Update player
	//this.camera.update_moveable(this.level.character, dt);

	// Update enemies
	/*for(let predator of this.level.predators) {
		this.camera.update_moveable(predator, dt);
	}*/
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

	if(!this.move_active) {

		let new_movement = false;
		const speed = options.surv_move_speed * dt;

		// TODO: Player movement must start after predator movement, because a
		// predator may attack the player in which case the player may not move.

		if(input.isDown('ENTER')) {
			input.reset('ENTER');
			this.next();
		}

		if(input.isDown('DOWN')) {
			input.reset('DOWN');
			if(this.level.is_unblocked(this.level.character.tile, SOUTH)) {
				this.level.character.rel_pos[1] += speed;
				this.level.character.movement = SOUTH;
				this.level.character.sprite = this.level.character.sprite_south;
				new_movement = true;
			}
		}

		else if(input.isDown('UP')) {
			input.reset('UP');
			if(this.level.is_unblocked(this.level.character.tile, NORTH)) {
				this.level.character.rel_pos[1] -= speed;
				this.level.character.movement = NORTH;
				this.level.character.sprite = this.level.character.sprite_north;
				new_movement = true;
			}
		}

		else if(input.isDown('LEFT')) {
			input.reset('LEFT');
			if(this.level.is_unblocked(this.level.character.tile, WEST)) {
				this.level.character.rel_pos[0] -= speed;
				this.level.character.movement = WEST;
				this.level.character.sprite = this.level.character.sprite_west;
				new_movement = true;
			}
		}

		else if(input.isDown('RIGHT')) {
			input.reset('RIGHT');
			if(this.level.is_unblocked(this.level.character.tile, EAST)) {
				this.level.character.rel_pos[0] += speed;
				this.level.character.movement = EAST;
				this.level.character.sprite = this.level.character.sprite_east;
				new_movement = true;
			}
		}

		if(new_movement) {
			this.init_predator_movement(dt);
			this.move_active = true;
		}
	}
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
