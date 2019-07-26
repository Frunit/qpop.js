'use strict';

function World() {
	this.bg_pic = resources.get('gfx/dark_bg.png');
	this.map_pics = resources.get('gfx/world.png');
	this.spec_pics = resources.get('gfx/species.png');
	this.gui_pics = resources.get('gfx/world_gui.png');

	// CONST_START
	this.map_dim = [448, 448];
	this.tile_dim = [16, 16];
	this.left_rect_dim = [460, 460];
	this.right_rect_dim = [181, 439];
	this.next_dim = [181, 22];
	this.calendar_dim = [60, 44];
	this.hygro_dim = [40, 100];
	this.temp_dim = [40, 100];
	this.spec_dim = [64, 64];
	this.bar_dim = [100, 8];

	this.map_offset = [6, 26];
	this.left_rect_offset = [0, 20];
	this.right_rect_offset = [459, 20];
	this.next_offset = [459, 458];
	this.calendar_offset = [465, 26];
	this.hygro_offset = [545, 26];
	this.temp_offset = [585, 26];
	this.spec_offset = [465, 70];
	this.calendar_text_offset = [490, 59]; // TODO RESEARCH: check this!
	this.bar_icon_offset = [465, 146];
	this.bar_offset = [485, 150];
	this.toplace_offset = [465, 286];
	this.tomove_offset = [465, 336];

	this.bar_dy = 20;
	this.minispec_delta = [16, 25];

	this.hygro_bar_offset = [552, 118];
	this.hygro_bar_dim = [24, 82];
	this.temp_bar_offset = [604, 112];
	this.temp_bar_dim = [2, 76];
	this.minispec_soffset = [272, 16];

	this.dim = [28, 28]; // In tiles
	// CONST_END

	this.bar_colors = ['#ff00ff', '#00ff7f', '#000082', '#ffffff', '#00ff00', '#820000'];
	this.calendar_soffsets = [[0, 100], [60, 100]];
	this.hygro_soffsets = [[0, 0], [40, 0]];
	this.temp_soffsets = [[80, 0], [120, 0]];
	this.spec_soffsets = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];

	this.ai_active = false;
	this.ai_last_move = 0;
	this.ai_dt = 0;
	this.ai_own_individuals = [];

	this.fight_active = false;
	this.animation = null;
	this.fight_pos = [0, 0];

	this.clickareas = [];
	this.rightclickareas = [];
	this.timer = 0;

	// [Ideal_Humid, Ideal_Temp] for Rangones, Blueleaf, ...
	this.ideal = [[65, 60], [72, 50], [85, 90], [50, 30], [70, 75], [40, 40]];

	this.wm_clickpos = null;
	this.wm_rightclickpos = null;
	this.wm_set_mode = 0;  // 0 = no mode; 1 = set; 2 = remove
}


World.prototype.initialize = function() {
	if(game.height_map === null) {
		game.height_map = this.create_height_map();
		game.world_map = this.create_world_map();
	}

	if(game.map_positions === null) {
		game.map_positions = Array.from(Array(this.dim[1]), _ => Array(this.dim[0]).fill(-1));
	}

	this.redraw();

	if(game.current_player.type === COMPUTER) {
		this.ai();
	}
};


World.prototype.next_player = function() {
	this.draw_avatar();
	this.draw_minispec();

	if(game.current_player.type === COMPUTER) {
		this.ai();
	}
};


World.prototype.redraw = function() {
	draw_base();
	this.clickareas = [];
	this.rightclickareas = [];

	draw_rect(this.left_rect_offset, this.left_rect_dim); // World rectangle
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

	// Black border around world
	draw_black_rect([this.map_offset[0] - 1, this.map_offset[1] - 1], [this.map_dim[0] + 1, this.map_dim[1] + 1]);

	// World
	this.draw_worldmap();
	this.clickareas.push({
		x1: this.map_offset[0],
		y1: this.map_offset[1],
		x2: this.map_offset[0] + this.map_dim[0],
		y2: this.map_offset[1] + this.map_dim[1],
		down: (x, y) => this.wm_click(x, y),
		up: () => this.wm_clickup(),
		blur: () => this.wm_clickup(),
		move: (x, y) => this.wm_move(x, y),
		default_pointer: true
	});

	this.rightclickareas.push({
		x1: this.map_offset[0],
		y1: this.map_offset[1],
		x2: this.map_offset[0] + this.map_dim[0],
		y2: this.map_offset[1] + this.map_dim[1],
		down: (x, y) => this.wm_rightclick(x, y),
		up: (x, y) => this.wm_rightclickup(),
		blur: (x, y) => this.wm_rightclickup(),
		move: (x, y) => this.wm_rightmove(x, y)
	});

	// Calendar
	const soffset = (game.turn === 0) ? this.calendar_soffsets[1] : this.calendar_soffsets[0];
	ctx.drawImage(this.gui_pics,
		soffset[0], soffset[1],
		this.calendar_dim[0], this.calendar_dim[1],
		this.calendar_offset[0], this.calendar_offset[1],
		this.calendar_dim[0], this.calendar_dim[1]);

	if(game.turn > 0) {
		ctx.save();
		ctx.font = '18px serif';
		ctx.textAlign = 'center';
		if(game.turn !== game.max_turns) {
			ctx.fillStyle = '#000000';
		}
		else {
			ctx.fillStyle = '#ff0000';
		}
		ctx.fillText(game.turn, this.calendar_text_offset[0], this.calendar_text_offset[1]);
		ctx.restore();
	}

	// Humidity
	ctx.drawImage(this.gui_pics,
		this.hygro_soffsets[0][0], this.hygro_soffsets[0][1],
		this.hygro_dim[0], this.hygro_dim[1],
		this.hygro_offset[0], this.hygro_offset[1],
		this.hygro_dim[0], this.hygro_dim[1]);

	ctx.save();
	ctx.fillStyle = '#0000ff';
	const height = Math.floor((this.hygro_bar_dim[1] * game.humid) / 100) + 2;
	ctx.beginPath();
	ctx.fillRect(this.hygro_bar_offset[0], this.hygro_bar_offset[1] - height, this.hygro_bar_dim[0], height);
	ctx.restore();

	ctx.drawImage(this.gui_pics,
		this.hygro_soffsets[1][0], this.hygro_soffsets[1][1],
		this.hygro_dim[0], this.hygro_dim[1],
		this.hygro_offset[0], this.hygro_offset[1],
		this.hygro_dim[0], this.hygro_dim[1]);

	// Temperature
	ctx.drawImage(this.gui_pics,
		this.temp_soffsets[0][0], this.temp_soffsets[0][1],
		this.temp_dim[0], this.temp_dim[1],
		this.temp_offset[0], this.temp_offset[1],
		this.temp_dim[0], this.temp_dim[1]);

	ctx.save();
	ctx.fillStyle = '#ff0000';
	height = Math.floor((this.temp_bar_dim[1] * game.temp) / 100);
	ctx.beginPath();
	ctx.fillRect(this.temp_bar_offset[0], this.temp_bar_offset[1] - height, this.temp_bar_dim[0], height);
	ctx.restore();

	ctx.drawImage(this.gui_pics,
		this.temp_soffsets[1][0], this.temp_soffsets[1][1],
		this.temp_dim[0], this.temp_dim[1],
		this.temp_offset[0], this.temp_offset[1],
		this.temp_dim[0], this.temp_dim[1]);

	// Picture of current species
	this.draw_avatar();

	// Bar with number of individuals
	this.draw_bar();

	// Individuals to place and move
	this.draw_minispec();
};


World.prototype.render = function() {
	if(this.animation) {
		this.redraw_wm_part(this.fight_pos[0], this.fight_pos[1], false);
		this.animation.render(ctx, [this.map_offset[0] + this.fight_pos[0]*this.tile_dim[0], this.map_offset[1] + this.fight_pos[1]*this.tile_dim[1]]);
	}
};


World.prototype.update = function(dt) {
	this.handle_input(dt);
	// TODO: All functions that act upon input that should not act when AI or animation is active, need respective checks in themselves! The check could be done here, but then option menus would be unresponsive.

	if(this.ai_active) {
		this.ai_step(dt);
	}

	this.timer += dt;
	if(this.timer < 0.1) {
		return;
	}

	if(this.animation) {
		this.animation.update(dt);
		if(this.animation.done) {
			this.animation.callback();
		}
	}

	this.timer = 0;
};


World.prototype.handle_input = function(dt) {
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

	if(input.isDown('ENTER')) {
		input.reset('ENTER');
		this.next();
	}
};


// TODO: Need to test if game is finished. A rudimentary function is game.test_finished()
World.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);

	if(game.current_player.toplace === 0) {
		this.test_if_dead();
		game.next_stage();
	}
	else if(game.current_player.individuals === 0) {
		open_popup(lang.popup_title, 'dino', lang.where_to_live, () => {}, lang.next);
	}
	else {
		// TODO RESEARCH: Which image? Which answers?
		open_popup(lang.popup_title, 'chuck_berry', lang.turn_finished, (x) => this.next_popup(x), lang.no, lang.yes);
	}
};


World.prototype.next_popup = function(answer) {
	if(answer === 1) {
		this.test_if_dead();
		game.next_stage();
	}
};


World.prototype.test_if_dead = function() {
	for(let player of game.players) {
		if(player.type !== NOBODY && !player.is_dead && player.individuals === 0) {
			open_popup(lang.popup_title, player.id, lang.dead, () => {}, lang.next);
			player.is_dead = true;
		}
	}
};


World.prototype.exec_catastrophe = function(type) {
	this.redraw();
	let x, y;
	switch(type) {
	case 0: // Warming
		game.temp += 10;
		game.humid -= 10;
		game.water_level -= 2;
		this.catastrophe_finished();
		break;
	case 1: // Cooling
		game.temp -= 10;
		game.humid += 10;
		this.catastrophe_finished();
		break;
	case 2: // Comet
		game.temp -= 10;
		game.water_level -= 3;

		const impactable = [];
		for(x = 10; x <= 18; x++) {
			for(y = 10; y <= 18; y++) {
				if(game.world_map[y][x] !== WM_WATER) {
					impactable.push([x, y]);
				}
			}
		}

		[x, y] = random_element(impactable);

		for(let xx = x - 1; xx <= x + 1; xx++) {
			for(let yy = y - 1; yy <= y + 1; yy++) {
				game.height_map[yy][xx] = 100;
				game.world_map[yy][xx] = WM_MOUNTAIN;
			}
		}
		game.world_map[y][x] = WM_CRATER;

		// Big Explosion
		this.animation = new Sprite('gfx/world.png', [48, 48], [0, 32],
		[[0, 0], [48, 0], [96, 0], [144, 0], [192, 0], [240, 0], [288, 0], [336, 0], [384, 0], [432, 0]],
		true, () => this.catastrophe_finished());
		break;
	case 3: // Plague
		const creatures = [];
		for(x = 3; x <= 24; x++) {
			for(y = 3; y <= 24; y++) {
				if(game.map_positions[y][x] >= 0) {
					creatures.push([x, y]);
				}
			}
		}

		[x, y] = random_element(creatures);

		// TODO: This could be animated such that not all creatures disappear simultaneously but one after the other
		for(let xx = x - 3; xx <= x + 3; xx++) {
			for(let yy = y - 3; yy <= y + 3; yy++) {
				const player_num = game.map_positions[yy][xx];
				if(player_num >= 0 && random_int(0, 1)) {
					this.kill_individual(xx, zz);
				}
			}
		}
		break;
	case 4: // Volcano
		const volcanos = [];
		for(x = 3; x <= 24; x++) {
			for(y = 3; y <= 24; y++) {
				if(game.world_map[y][x] === WM_MOUNTAIN) {
					volcanos.push([x, y]);
				}
			}
		}
		this.volcano_step(5, volcanos);
		break;
	case 5: // Flood
		game.temp += 10;
		game.water_level += 5;
		this.catastrophe_finished();
		break;
	case 6: // Earthquake
		game.height_map = this.create_height_map();
		game.world_map = this.create_world_map();
		// TODO RESEARCH: Are humans removed by an earthquake? I.e. is also the flag removed from the save?
		this.catastrophe_finished();
		break;
	case 7: // Humans
		const land = [];
		for(x = 10; x <= 18; x++) {
			for(y = 10; y <= 18; y++) {
				if(game.world_map[y][x] !== WM_WATER) {
					land.push([x, y]);
				}
			}
		}

		[x, y] = random_element(land);
		game.world_map[y][x] = WM_HUMANS;
		// TODO RESEARCH: Is there an explosion? Otherwise: this.catastrophe_finished();
		game.humans_present = true;
		break;
	case 8: // Cosmic rays
		for(let player of game.players) {
			if(player.type !== NOBODY && !player.is_dead) {
				const stats = player.stats.slice();
				for(let i = 0; i < stats.length; i++) {
					player.stats[i] = stats.splice(stats.length * Math.random() | 0, 1)[0];
				}
			}
		}
		this.catastrophe_finished();
		break;
	}
};


World.prototype.catastrophe_finished = function() {
	if(game.temp > 100) { game.temp = 100; }
	else if (game.temp < 0) { game.temp = 0; }
	if(game.humid > 100) { game.humid = 100; }
	else if (game.humid < 0) { game.humid = 0; }
	if(game.water_level > 100) { game.water_level = 100; }
	else if (game.water_level < 0) { game.water_level = 0; }

	for(let y = 1; y < this.dim[1] - 1; y++) {
		for(let x = 1; x < this.dim[0] - 1; x++) {
			if((!game.world_map[y][x] || game.world_map >= WM_MOUNTAIN) && game.map_positions[y][x] >= 0) {
				this.kill_individual(x, y);
			}
		}
	}

	for(let player of game.players) {
		if(player.type !== NOBODY && !player.is_dead && player.individuals === 0) {
			open_popup(lang.popup_title, player.id, lang.dead, () => {}, lang.next);
			player.is_dead = true;
		}
	}

	this.redraw();
};


World.prototype.volcano_step = function(volcanos_left, positions) {
	if(!volcanos_left) {
		this.catastrophe_finished();
	}

	const [x, y] = random_element(positions);

	for(let xx = x - 1; xx <= x + 1; xx++) {
		for(let yy = y - 1; yy <= y + 1; yy++) {
			this.kill_individual(xx, zz);
		}
	}

	// TODO RESEARCH: Check if frames and speed are correct
	this.animation = new Sprite('gfx/world.png', [16, 16], [464, 16],
		[[0,0], [16,0], [32,0], [48,0], [0,0], [16,0], [32,0], [48,0]],
		true, () => this.volcano_step(volcanos_left - 1, positions));
};


World.prototype.kill_individual = function(x, y) {
	const player_num = game.map_positions[y][x];
	if(player_num >= 0) {
		game.map_positions[y][x] = -1;
		game.players[player_num].individuals--;
	}
};


World.prototype.take_individual = function(x, y) {
	game.map_positions[y][x] = -1;
	game.current_player.toplace++;
	game.current_player.tomove--;
	game.current_player.individuals--;
	this.draw_bar();
	this.draw_minispec();
	this.redraw_wm_part(x, y);
};


World.prototype.fight = function(x, y) {
	this.fight_active = true;
	const attack = game.current_player.stats[ATT_ATTACK] + game.current_player.stats[ATT_INTELLIGENCE]/2 + game.current_player.experience * 10 + game.current_player.stats[game.world_map[y][x] - WM_RANGONES];

	const enemy = game.players[game.map_positions[y][x]];
	const defense = enemy.stats[ATT_DEFENSE] + enemy.stats[ATT_INTELLIGENCE]/2 + enemy.experience * 10 + enemy.stats[game.world_map[y][x] - WM_RANGONES];

	//console.log("Attacker:", game.map_positions[y][x], " with attack ", attack, "; Defender: ", game.current_player.id, " with defense ", defense)

	const winner = (attack + random_int(0, attack) > defense + random_int(0, defense)) ? game.current_player.id : game.map_positions[y][x];

	this.animation = new Sprite('gfx/world.png', [16, 16], [464, 16],
		[[0,0], [16,0], [32,0], [48,0], [0,0], [16,0], [32,0], [48,0]],
		true, () => this.fight_end(winner, enemy, x, y));

	this.fight_pos = [x, y];
};


World.prototype.fight_end = function(winner, enemy, x, y) {
	if(winner === game.current_player.id) {
		enemy.individuals--;
		game.map_positions[y][x] = game.current_player.id;
		game.current_player.individuals++;
	}
	game.current_player.toplace--;
	this.redraw_wm_part(x, y);
	this.draw_bar();
	this.draw_minispec();

	this.animation = null;
	this.fight_active = false;

	if(enemy.individuals === 0) {
		open_popup(lang.popup_title, enemy.id, lang.dead, () => {}, lang.next);
		enemy.is_dead = true;
	}
};


World.prototype.set_individual = function(x, y) {
	// Fight against another player
	if(game.map_positions[y][x] >= 0) {
		if(game.turn === -1) { // DEBUG! Should be 0 instead of -1
			// No one may attack during the first turn
			return;
		}
		this.fight(x, y);
		return;
	}

	// Normal click in the neighborhood
	game.map_positions[y][x] = game.current_player.id;
	game.current_player.toplace--;
	game.current_player.individuals++;
	this.draw_bar();
	this.draw_minispec();
	this.redraw_wm_part(x, y);
};


World.prototype.wm_rightclick = function(x, y, raw = true) {
	if(raw) {
		x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
		y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);
	}

	this.wm_rightclickpos = [x, y];

	// Clicked on individual -> hide it
	if(game.map_positions[y][x] >= 0) {
		this.redraw_wm_part(x, y, false);
	}
};


World.prototype.wm_rightclickup = function() {
	const [x, y] = this.wm_rightclickpos;
	this.wm_rightclickpos = null;

	// Show the individual again
	this.redraw_wm_part(x, y, true);
};


World.prototype.wm_rightmove = function(x, y) {
	x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
	y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

	if(x !== this.wm_rightclickpos[0] || y !== this.wm_rightclickpos[1]) {
		this.wm_rightclickup();
		this.wm_rightclick(x, y, false);
	}
};


World.prototype.wm_click = function(x, y, raw = true) {
	if(raw) {
		x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
		y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);
	}

	this.wm_clickpos = [x, y];

	// Clicked on own individual -> take it
	if(game.map_positions[y][x] === game.current_player.id) {
		// But only, if you still can move individuals
		if(game.current_player.tomove && game.current_player.toplace < 20 && game.current_player.individuals > 1 && this.wm_set_mode !== 1) {
			this.take_individual(x, y);
			this.wm_set_mode = 2;
		}
	}
	else if(game.current_player.toplace &&
			game.world_map[y][x] >= WM_DESERT &&
			game.world_map[y][x] <= WM_FIREGRASS &&
			this.is_neighbour(game.current_player.id, x, y) &&
			this.wm_set_mode !== 2)
	{
		this.set_individual(x, y);
		this.wm_set_mode = 1;
	}
};


World.prototype.wm_clickup = function() {
	this.wm_set_mode = 0;
	this.wm_clickpos = null;
};


World.prototype.wm_move = function(x, y) {
	x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
	y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

	if(x !== this.wm_clickpos[0] || y !== this.wm_clickpos[1]) {
		this.wm_click(x, y, false);
	}
};


World.prototype.is_neighbour = function(num, x, y) {
	// If the player does not have any individuals (first turn), all fields are
	// neighbored.

	// This function is only called for land and the world border consists of
	// water, so I don't need the check if x or y +/-1 exist

	return (game.current_player.individuals === 0 ||
			game.map_positions[y][x-1] === num ||
			game.map_positions[y][x+1] === num ||
			game.map_positions[y-1][x] === num ||
			game.map_positions[y+1][x] === num);
};


World.prototype.ai = function() {
	canvas.style.cursor = 'wait';
	this.ai_active = true;

	this.ai_dt = 0;
	this.ai_last_move = 0;

	this.ai_own_individuals = [];
	for(let x = 1; x < this.dim[0] - 1; x++) {
		for(let y = 1; y < this.dim[1] - 1; y++) {
			if(game.map_positions[y][x] === game.current_player.id) {
				this.ai_own_individuals.push([x, y]);
			}
		}
	}
};


World.prototype.ai_step = function(dt) {
	if(this.animation) {
		return;
	}

	this.ai_dt += dt;
	if(this.ai_dt < this.ai_last_move + options.wm_ai_delay) {
		return;
	}

	if(!(game.current_player.toplace || game.current_player.tomove)) {
		this.ai_end();
		return;
	}

	let depth = 4 - game.current_player.iq;
	if(game.turn === 0) {
		depth = 4; // Make the AI smarter in the first turn to avoid islands etc.
	}
	let value = 0;
	let best_value = -Infinity;
	let best_move = [];
	let to_remove = 0;

	this.ai_dt = 0;
	this.ai_last_move += this.ai_dt;

	// Only use shadows (movements) if no individuals for placement are left
	if(game.current_player.toplace === 0) {
		if(game.current_player.tomove === 0 || game.current_player.individuals < 2) {
			// The AI doesn't have shadows left or has only on individual on the map
			this.ai_end();
			return;
		}

		to_remove = random_element(this.ai_own_individuals);
		remove_from_array(this.ai_own_individuals, to_remove);
		this.take_individual(to_remove[0], to_remove[1]);
		return;
	}

	for(let move of this.ai_possible_moves(this.ai_own_individuals)) {
		value = this.ai_rate_move(move[0], move[1], depth);
		if(value > best_value) {
			best_value = value;
			best_move = move;
		}
	}

	if(best_move.length === 0) {
		// The AI cannot physically move anymore
		this.ai_end();
		return;
	};

	this.set_individual(best_move[0], best_move[1]);
	this.ai_own_individuals.push(best_move);
};


World.prototype.ai_end = function() {
	this.ai_active = false;
	canvas.style.cursor = 'default';
	if(options.wm_ai_auto_continue) {
		this.next();
	}
};


World.prototype.ai_rate_move = function(x, y, depth) {
	let value = 0;
	let weight = 0;
	let winning_chance = 0;

	for(let xx = Math.max(1, x - depth); xx < Math.min(this.dim[0] - 1, x + depth); xx++) {
		for(let yy = Math.max(1, y - depth); yy < Math.min(this.dim[1] - 1, y + depth); yy++) {
			// Closer fields are more important
			weight = depth + 1 - Math.max(Math.abs(xx - x), Math.abs(yy - y));

			// Not too close to water to protect from catastrophes
			if(game.world_map[yy][xx] === WM_WATER) {
				value -= 20 * weight;
			}
			else if(game.map_positions[yy][xx] >= 0 && game.map_positions[yy][xx] !== game.current_player.id) {
				// In the first turn, the players should be placed with some distance to each other
				if(game.turn === 0) {
					value -= 100 * weight;
				}
				else {
					const player = game.current_player;
					const enemy = game.players[game.map_positions[yy][xx]];
					winning_chance = player.stats[game.world_map[yy][xx] - WM_RANGONES] +
						player.stats[ATT_ATTACK] + player.stats[ATT_INTELLIGENCE]/4 -
						enemy.stats[game.world_map[yy][xx] - WM_RANGONES] -
						enemy.stats[ATT_DEFENSE] - enemy.stats[ATT_INTELLIGENCE]/4;
					value += winning_chance * weight;
				}
			}
			else if(game.world_map[yy][xx] > WM_DESERT && game.world_map[yy][xx] <= WM_FIREGRASS) {
				value += game.players[game.current_player.id].stats[game.world_map[yy][xx] - WM_RANGONES] * weight;
			}
		}
	}

	return value;
};


World.prototype.ai_possible_moves = function(individuals) {
	const possible_moves = [];
	if(individuals.length === 0) {
		for(let x = 1; x < this.dim[0] - 1; x++) {
			for(let y = 1; y < this.dim[1] - 1; y++) {
				if(game.map_positions[y][x] === -1 && game.world_map[y][x] >= WM_DESERT && game.world_map[y][x] <= WM_FIREGRASS) {
					possible_moves.push([x, y]);
				}
			}
		}
	}
	else {
		for(let ind of individuals) {
			const x = ind[0];
			const y = ind[1];
			for(let pos of [[x-1, y], [x+1, y], [x, y-1], [x, y+1]]) {
				const xx = pos[0];
				const yy = pos[1];
				if(possible_moves.indexOf(pos) === -1 && game.map_positions[yy][xx] !== game.current_player.id && game.world_map[yy][xx] >= WM_DESERT && game.world_map[yy][xx] <= WM_FIREGRASS) {
					possible_moves.push(pos);
				}
			}
		}
	}

	return possible_moves;
};


World.prototype.create_height_map = function() {
	const map = Array.from(Array(this.dim[1]), _ => Array(this.dim[0]).fill(0));

	// Mountains
	for(let i = 0; i < 20; i++) {
		const x = random_int(4, 23);
		const y = random_int(4, 23);

		for(let xx = x - 2; xx <= x + 2; xx++) {
			for(let yy = y - 2; yy <= y + 2; yy++) {
				map[yy][xx] += random_int(2, 20);
			}
		}

		for(let xx = x - 1; xx <= x + 1; xx++) {
			for(let yy = y - 1; yy <= y + 1; yy++) {
				map[yy][xx] += random_int(2, 20);
			}
		}

		map[y][x] += random_int(2, 20);
	}

	// Basemap
	const half = Math.floor(this.dim[0] / 2);
	for(y = 1; y < this.dim[1] - 1; y++) {
		for(x = 1; x < this.dim[0] - 1; x++) {
			const dx = Math.abs(half - x);
			const dy = Math.abs(half - y);
			map[y][x] += random_int(0, Math.floor(((half - Math.max(dx, dy)) * 100) / half));
			if(map[y][x] > 100) {
				map[y][x] = 100;
			}
		}
	}

	return map;
};


World.prototype.create_world_map = function() {
	const map = Array.from(Array(this.dim[1]), _ => Array(this.dim[0]).fill(0));

	for(let y = 0; y < this.dim[1]; y++) {
		for(let x = 0; x < this.dim[0]; x++) {
			if(!game.world_map || game.world_map[y][x] < WM_MOUNTAIN) {
				map[y][x] = this.find_tile(game.height_map[y][x], y);
			}
		}
	}

	return map;
};

World.prototype.find_tile = function(height, y) {
	if(height <= game.water_level) {
		return WM_WATER;
	}

	if(height >= game.mountain_level) {
		return WM_MOUNTAIN;
	}

	let temp = game.temp + (y - this.dim[1] / 2) * 3 - height + 50;
	if(temp < 0) temp = 0;
	if(temp > 100) temp = 100;

	let humid = game.humid - height + 50;
	if(humid < 0) humid = 0;
	if(humid > 100) humid = 100;

	let delta = Infinity;
	let tile = 0;
	for(let i = 0; i < this.ideal.length; i++) {
		const d = Math.max(Math.abs(this.ideal[i][0] - humid), Math.abs(this.ideal[i][1] - temp));
		if(d < delta) {
			delta = d;
			tile = i;
		}
	}

	return tile + WM_RANGONES;
};


World.prototype.draw_avatar = function() {
	const soffset = this.spec_soffsets[game.current_player.id];

	ctx.drawImage(this.bg_pic,
		this.spec_offset[0], this.spec_offset[1],
		this.spec_dim[0], this.spec_dim[1],
		this.spec_offset[0], this.spec_offset[1],
		this.spec_dim[0], this.spec_dim[1]);

	ctx.drawImage(this.spec_pics,
		soffset[0], soffset[1],
		this.spec_dim[0], this.spec_dim[1],
		this.spec_offset[0], this.spec_offset[1],
		this.spec_dim[0], this.spec_dim[1]);
};


World.prototype.draw_bar = function() {
	const w = this.bar_offset[0] - this.bar_icon_offset[0] + this.bar_dim[0];
	const h = this.bar_dy * game.players.length;
	ctx.drawImage(this.bg_pic,
		this.bar_icon_offset[0], this.bar_icon_offset[1],
		w, h,
		this.bar_icon_offset[0], this.bar_icon_offset[1],
		w, h);

	let max_individuals = 0;
	for(let player of game.players){
		if(player.individuals > max_individuals) {
			max_individuals = player.individuals;
		}
	}

	for(let i = 0; i < game.players.length; i++){
		ctx.drawImage(this.map_pics,
			this.minispec_soffset[0] + 16*i, this.minispec_soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.bar_icon_offset[0], this.bar_icon_offset[1] + this.bar_dy * i,
			this.tile_dim[0], this.tile_dim[1]);

		if(max_individuals) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.bar_colors[i];
			ctx.fillRect(this.bar_offset[0], this.bar_offset[1] + this.bar_dy * i, this.bar_dim[0] * game.players[i].individuals / max_individuals, this.bar_dim[1]);
			ctx.restore();
		}
	}
};


World.prototype.draw_minispec = function() {
	const w = this.minispec_delta[0] * 10;
	const h = this.tomove_offset[1] - this.toplace_offset[1] + this.minispec_delta[1] * 2;
	ctx.drawImage(this.bg_pic,
		this.toplace_offset[0], this.toplace_offset[1],
		w, h,
		this.toplace_offset[0], this.toplace_offset[1],
		w, h);

	for(let i = 0; i < game.current_player.toplace; i++){
		ctx.drawImage(this.map_pics,
			this.minispec_soffset[0] + this.tile_dim[0]*game.current_player.id, this.minispec_soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.toplace_offset[0] + this.minispec_delta[0] * (i%10), this.toplace_offset[1] + this.minispec_delta[1] * Math.floor(i/10),
			this.tile_dim[0], this.tile_dim[1]);
	}

	for(let i = 0; i < game.current_player.tomove; i++){
		ctx.drawImage(this.map_pics,
			this.minispec_soffset[0] + this.tile_dim[0]*(game.current_player.id + 6), this.minispec_soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.tomove_offset[0] + this.minispec_delta[0] * (i%10), this.tomove_offset[1] + this.minispec_delta[1] * Math.floor(i/10),
			this.tile_dim[0], this.tile_dim[1]);
	}
};


World.prototype.draw_worldmap = function() {
	for(let y = 0; y < this.dim[1]; y++) {
		for(let x = 0; x < this.dim[0]; x++) {
			this.redraw_wm_part(x, y, true);
		}
	}
};

World.prototype.redraw_wm_part = function(x, y, show_spec=true) {
	let tile = 0;
	if(game.world_map[y][x] === WM_WATER) {
		tile = this.coast_tile(x, y);
	}
	else {
		tile = game.world_map[y][x] + 47;
	}

	const soffset = [(tile % 41) * this.tile_dim[0], Math.floor(tile / 40) * this.tile_dim[0]];

	ctx.drawImage(this.map_pics,
		soffset[0], soffset[1],
		this.tile_dim[0], this.tile_dim[1],
		this.map_offset[0] + x*this.tile_dim[0], this.map_offset[1] + y*this.tile_dim[1],
		this.tile_dim[0], this.tile_dim[1]);

	if(show_spec && game.map_positions[y][x] >= 0) {
		ctx.drawImage(this.map_pics,
			this.minispec_soffset[0] + this.tile_dim[0]*game.map_positions[y][x], this.minispec_soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.map_offset[0] + x*this.tile_dim[0], this.map_offset[1] + y*this.tile_dim[1],
			this.tile_dim[0], this.tile_dim[1]);
	}
};


World.prototype.coast_tile = function(x, y) {
	let idx = 0;

	if(y > 0 && game.world_map[y-1][x] > 0) {
		idx += 1;
	}
	if(y > 0 && x < this.dim[0] - 1 && game.world_map[y-1][x+1] > 0) {
		idx += 2;
	}
	if(x < this.dim[0] - 1 && game.world_map[y][x+1] > 0) {
		idx += 4;
	}
	if(y < this.dim[1] - 1 && x < this.dim[0] - 1 && game.world_map[y+1][x+1] > 0) {
		idx += 8;
	}
	if(y < this.dim[1] - 1 && game.world_map[y+1][x] > 0) {
		idx += 16;
	}
	if(y < this.dim[1] - 1 && x > 0 && game.world_map[y+1][x-1] > 0) {
		idx += 32;
	}
	if(x > 0 && game.world_map[y][x-1] > 0) {
		idx += 64;
	}
	if(y > 0 && x > 0 && game.world_map[y-1][x-1] > 0) {
		idx += 128;
	}

	return correct_world_tile[idx];
};
