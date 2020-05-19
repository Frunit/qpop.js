'use strict';

// MAYBE: After a catastrophe, a symbol of the catastrophe could be shown in the lower right area. What to do with the avatar?

function World() {
	this.id = SCENE.WORLD;
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
	this.calendar_text_offset = [492, 55];
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
	this.minispec_soffset = [320, 16];

	this.dim = [28, 28]; // In tiles
	// CONST_END

	this.bar_colors = ['#ff00ff', '#00ff7f', '#000082', '#ffffff', '#00ff00', '#820000'];
	this.calendar_soffsets = [[0, 100], [60, 100]];
	this.hygro_soffsets = [[0, 0], [40, 0]];
	this.temp_soffsets = [[80, 0], [120, 0]];
	this.spec_soffsets = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];

	this.ai_active = false;
	this.ai_frame = 0;
	this.ai_own_individuals = [];

	this.animation = null;
	this.animation_pos = [[0, 0]];

	this.tutorials = [
		{
			'name': 'wm_units',
			'pos': [75, 155],
			'arrows': [{dir: DIR.N, offset: 42}, {dir: DIR.N, offset: 154}, {dir: DIR.N, offset: 266}, {dir: DIR.E, offset: 130}],
			'highlight': [0, 0, 640, 480],
		},
	];

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];

	// [Ideal_Humid, Ideal_Temp] for Rangones, Blueleaf, ...
	this.ideal = [[65, 60], [72, 50], [85, 90], [50, 30], [70, 75], [40, 40]];

	this.wm_clickpos = null;
	this.wm_rightclickpos = null;
	this.wm_set_mode = 0;  // 0 = no mode; 1 = set; 2 = remove

	this.catastrophe_status = 0;  // 0 = no cata yet; 1 = cata called back; 2 = cata executing; 3 = cata finished
	this.catastrophe_type = -1;
}


World.prototype.initialize = function() {
	audio.play_music('spec' + game.current_player.id);

	if(game.height_map === null) {
		game.height_map = this.create_height_map();
		game.world_map = this.create_world_map();
	}

	if(game.map_positions === null) {
		game.map_positions = Array.from(Array(this.dim[1]), () => Array(this.dim[0]).fill(-1));
	}

	this.redraw();

	if(game.turn === 1) {
		this.tutorials.push({
			'name': 'wm_shadows',
			'pos': [80, 235],
			'arrows': [{dir: DIR.E, offset: 100}],
			'highlight': [this.right_rect_offset[0], this.tomove_offset[1] - 3, 640, this.tomove_offset[1] + this.tile_dim[1] + 3],
		});
	}

	game.tutorial();

	if(game.current_player.type === PLAYER_TYPE.COMPUTER) {
		this.ai();
	}

	this.catastrophe_status = 0;
};


World.prototype.next_player = function() {
	audio.play_music('spec' + game.current_player.id);
	this.draw_avatar();
	this.draw_minispec();

	if(game.current_player.type === PLAYER_TYPE.COMPUTER) {
		this.ai();
	}
};


World.prototype.redraw = function() {
	draw_base();
	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

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
		up: () => this.wm_rightclickup(),
		blur: () => this.wm_rightclickup(),
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
		ctx.font = '15px serif';
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
	let height = Math.floor((this.hygro_bar_dim[1] * game.humid) / 100) + 2;
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

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
	];
};


World.prototype.render = function() {
	if(this.animation) {
		for(let pos of this.animation_pos) {
			this.redraw_wm_part(pos[0], pos[1], false);
		}
		this.animation.render(ctx, [this.map_offset[0] + this.animation_pos[0][0]*this.tile_dim[0], this.map_offset[1] + this.animation_pos[0][1]*this.tile_dim[1]]);
	}
};


World.prototype.update = function() {
	if(this.animation) {
		this.animation.update();
		if(this.animation.finished) {
			this.animation.callback();
		}
	}

	else if(this.ai_active) {
		this.ai_step();
	}

	else if(this.catastrophe_status === 1) {
		this.catastrophe_exec();
	}
};


World.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);

	if(this.ai_active || this.animation !== null) {
		return;
	}

	if(this.catastrophe_status === 3 || game.current_player.toplace === 0) {
		this.next_popup(1);
	}
	else if(game.current_player.individuals === 0) {
		open_popup(lang.popup_title, 'dino', lang.where_to_live, () => {}, lang.next);
	}
	else {
		open_popup(lang.popup_title, 'chuck_berry', lang.turn_finished, (x) => this.next_popup(x), lang.no, lang.yes);
	}
};


World.prototype.next_popup = function(answer) {
	if(answer === 1) {
		if(game.current_player.individuals === 0 && !game.current_player.is_dead) {
			game.current_player.is_dead = true;
			open_popup(lang.popup_title, game.current_player.id, lang.dead, () => this.next_popup(1), lang.next);
			return;
		}

		if(this.catastrophe_status === 3) {
			// The catastrophe is finished, distribute evolution points.
			// The first turn has no catastrophe, but the evolution points are fixed to 100, so no special condition here

			const scores = [];
			for(let i = 0; i < 6; i++) {
				scores.push([i, game.players[i].individuals]);
			}

			scores.sort((a, b) => b[1] - a[1]);

			game.players[scores[0][0]].evo_score = game.evo_points[0];
			for(let i = 1; i < 6; i++) {
				const p = game.players[scores[i][0]];
				if(p.is_dead || p.type === PLAYER_TYPE.NOBODY) {
					p.evo_score = 0;
				}
				else if(scores[i-1][1] === scores[i][1]) {
					p.evo_score = game.players[scores[i-1][0]].evo_score;
				}
				else {
					p.evo_score = game.evo_points[i];
				}
			}
		}

		game.next_stage();
	}
};


World.prototype.catastrophe_start = function() {
	const self = this;
	game.backstage.push(game.stage);
	game.stage = new Catastrophe(self.catastrophe_callback);
	game.stage.initialize();
};


World.prototype.catastrophe_callback = function(type) {
	game.stage = game.backstage.pop();
	game.stage.catastrophe_type = type;
	game.stage.catastrophe_status = 1;
};


World.prototype.catastrophe_exec = function() {
	this.catastrophe_status = 2;
	this.redraw();
	switch(this.catastrophe_type) {
	case 0: // Warming
		game.temp += 10;
		game.humid -= 10;
		game.water_level -= 2;
		this.catastrophe_finish();
		break;
	case 1: // Cooling
		game.temp -= 10;
		game.humid += 10;
		this.catastrophe_finish();
		break;
	case 2: { // Comet
		game.temp -= 10;
		game.water_level -= 3;

		const impactable = [];
		for(let x = 10; x <= 18; x++) {
			for(let y = 10; y <= 18; y++) {
				if(game.world_map[y][x] !== WORLD_MAP.WATER) {
					impactable.push([x, y]);
				}
			}
		}

		const [x, y] = random_element(impactable);

		this.animation_pos = [];

		for(let xx = x - 1; xx <= x + 1; xx++) {
			for(let yy = y - 1; yy <= y + 1; yy++) {
				this.animation_pos.push([xx, yy]);
			}
		}

		// Big Explosion
		this.animation = new Sprite('gfx/world.png', [0, 32],
		[[0, 0], [48, 0], [96, 0], [144, 0], [192, 0], [240, 0], [288, 0], [336, 0], [384, 0], [432, 0], [480, 0], [528, 0]], anim_delays.world, [48, 48],
		true, () => this.comet_finish());
		break;
		}
	case 3: { // Plague
		const creatures = [];
		for(let x = 3; x <= 24; x++) {
			for(let y = 3; y <= 24; y++) {
				if(game.map_positions[y][x] >= 0) {
					creatures.push([x, y]);
				}
			}
		}

		const [x, y] = random_element(creatures);

		// MAYBE: This could be animated such that not all creatures disappear simultaneously but one after the other
		for(let xx = x - 3; xx <= x + 3; xx++) {
			for(let yy = y - 3; yy <= y + 3; yy++) {
				const player_num = game.map_positions[yy][xx];
				if(player_num >= 0 && random_int(0, 1)) {
					this.kill_individual(xx, yy);
				}
			}
		}
		this.catastrophe_finish();
		break;
		}
	case 4: { // Volcano
		const volcanos = [];
		for(let x = 3; x <= 24; x++) {
			for(let y = 3; y <= 24; y++) {
				if(game.world_map[y][x] === WORLD_MAP.MOUNTAIN) {
					volcanos.push([x, y]);
				}
			}
		}
		this.volcano_step(5, volcanos);
		break;
		}
	case 5: // Flood
		game.temp += 10;
		game.water_level += 5;
		this.catastrophe_finish();
		break;
	case 6: // Earthquake
		game.height_map = this.create_height_map();
		this.catastrophe_finish();
		break;
	case 7: { // Humans
		const land = [];
		for(let x = 10; x <= 18; x++) {
			for(let y = 10; y <= 18; y++) {
				if(game.world_map[y][x] !== WORLD_MAP.WATER) {
					land.push([x, y]);
				}
			}
		}

		const [x, y] = random_element(land);
		this.animation_pos = [[x, y]];

		this.animation = new Sprite('gfx/world.png', [512, 16],
			[[0,0], [16,0], [32,0], [48,0], [0,0], [16,0], [32,0], [48,0]], anim_delays.world, [16, 16],
			true, () => this.humans_finish());
		break;
		}
	case 8: { // Cosmic rays
		for(let player of game.players) {
			if(player.type !== PLAYER_TYPE.NOBODY && !player.is_dead) {
				const stats = player.stats.slice();
				shuffle(stats);
				player.stats = stats.slice();
			}
		}
		this.catastrophe_finish();
		break;
		}
	default:
		console.warn(this.catastrophe_type);
		open_popup(lang.popup_title, 'dino_cries', 'Wrong catastrophe code. This should never ever happen!',
					() => {}, lang.debug_too_bad);
	}
};


World.prototype.catastrophe_finish = function() {
	game.temp  = clamp(game.temp, 0, 100)
	game.humid  = clamp(game.humid, 0, 100)
	game.water_level  = clamp(game.water_level, 0, 100)

	this.animation = null;
	game.world_map = this.create_world_map();

	for(let y = 1; y < this.dim[1] - 1; y++) {
		for(let x = 1; x < this.dim[0] - 1; x++) {
			if((!game.world_map[y][x] || game.world_map[y][x] >= WORLD_MAP.MOUNTAIN) && game.map_positions[y][x] >= 0) {
				this.kill_individual(x, y);
			}
		}
	}

	for(let player of game.players) {
		if(player.type !== PLAYER_TYPE.NOBODY && !player.is_dead && player.individuals === 0) {
			player.is_dead = true;
			open_popup(lang.popup_title, player.id, lang.dead, () => this.catastrophe_finish(), lang.next);
			return;
		}
	}

	this.redraw();

	this.catastrophe_status = 3;

	if(!game.seen_tutorials.has('catastrophe')) {
		this.tutorials.push({
			'name': 'catastrophe',
			'pos': [140, 150],
			'arrows': [],
			'highlight': [0, 0, 640, 480],
		});

		game.tutorial();
	}
};


World.prototype.comet_finish = function() {
	const [x, y] = this.animation_pos[0];
	for(let xx = x; xx <= x + 2; xx++) {
		for(let yy = y; yy <= y + 2; yy++) {
			game.height_map[yy][xx] = 100;
			game.world_map[yy][xx] = WORLD_MAP.MOUNTAIN;
		}
	}
	game.world_map[y+1][x+1] = WORLD_MAP.CRATER;

	this.catastrophe_finish();
};


World.prototype.humans_finish = function() {
	const [x, y] = this.animation_pos[0];
	game.world_map[y][x] = WORLD_MAP.HUMANS;
	game.humans_present = true;
	this.catastrophe_finish();
};


World.prototype.volcano_step = function(volcanos_left, positions) {
	if(volcanos_left === 0) {
		this.catastrophe_finish();
		return;
	}

	this.draw_worldmap();

	const [x, y] = random_element(positions);

	for(let xx = x - 1; xx <= x + 1; xx++) {
		for(let yy = y - 1; yy <= y + 1; yy++) {
			this.kill_individual(xx, yy);
		}
	}

	this.animation = new Sprite('gfx/world.png', [512, 16],
		[[0,0], [16,0], [32,0], [48,0], [0,0], [16,0], [32,0], [48,0]], anim_delays.world, [16, 16],
		true, () => this.volcano_step(volcanos_left - 1, positions));
	this.animation_pos = [[x, y]];
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
	const attack = game.current_player.stats[ATTR.ATTACK] + game.current_player.stats[ATTR.INTELLIGENCE]/2 + game.current_player.experience * 10 + game.current_player.stats[game.world_map[y][x] - WORLD_MAP.RANGONES];

	const enemy = game.players[game.map_positions[y][x]];
	const defense = enemy.stats[ATTR.DEFENSE] + enemy.stats[ATTR.INTELLIGENCE]/2 + enemy.experience * 10 + enemy.stats[game.world_map[y][x] - WORLD_MAP.RANGONES];

	const winner = (attack + random_int(0, attack) > defense + random_int(0, defense)) ? game.current_player.id : game.map_positions[y][x];

	this.animation = new Sprite('gfx/world.png', [512, 16],
		[[0,0], [16,0], [32,0], [48,0], [0,0], [16,0], [32,0], [48,0]], anim_delays.world, [16, 16],
		true, () => this.fight_end(winner, enemy, x, y));

	this.animation_pos = [[x, y]];

	audio.play_sound('world_fight');
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

	if(enemy.individuals === 0) {
		enemy.is_dead = true;
		open_popup(lang.popup_title, enemy.id, lang.dead, () => {}, lang.next);
	}
};


World.prototype.set_individual = function(x, y) {
	// Fight against another player
	if(game.map_positions[y][x] >= 0) {
		if(game.turn === 0) {
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
	if(this.ai_active || this.animation !== null) {
		return;
	}

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
	if(this.wm_rightclickpos !== null) {
		const [x, y] = this.wm_rightclickpos;
		this.wm_rightclickpos = null;

		// Show the individual again
		this.redraw_wm_part(x, y, true);
	}
};


World.prototype.wm_rightmove = function(x, y) {
	if(this.wm_rightclickpos !== null) {
		x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
		y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

		if(x !== this.wm_rightclickpos[0] || y !== this.wm_rightclickpos[1]) {
			this.wm_rightclickup();
			this.wm_rightclick(x, y, false);
		}
	}
};


World.prototype.wm_click = function(x, y, raw = true) {
	if(this.ai_active || this.animation !== null || this.catastrophe_status > 0) {
		return;
	}

	if(raw) {
		x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
		y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);
	}

	// This can happen when the mouse is moved too fast
	if(x < 0 || x >= this.dim[0] || y < 0 || y >= this.dim[1]) {
		return;
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
			game.world_map[y][x] >= WORLD_MAP.RANGONES &&
			game.world_map[y][x] <= WORLD_MAP.DESERT &&
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
	if(this.wm_clickpos !== null && options.wm_click_and_hold) {
		x = Math.floor((x - this.map_offset[0]) / this.tile_dim[0]);
		y = Math.floor((y - this.map_offset[1]) / this.tile_dim[1]);

		if(x !== this.wm_clickpos[0] || y !== this.wm_clickpos[1]) {
			this.wm_click(x, y, false);
		}
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
	this.ai_frame = 0;

	this.ai_own_individuals = [];
	for(let x = 1; x < this.dim[0] - 1; x++) {
		for(let y = 1; y < this.dim[1] - 1; y++) {
			if(game.map_positions[y][x] === game.current_player.id) {
				this.ai_own_individuals.push([x, y]);
			}
		}
	}
};


World.prototype.ai_step = function() {
	this.ai_frame++;
	if(this.ai_frame < options.wm_ai_delay) {
		return;
	}
	this.ai_frame = 0;

	if(game.current_player.toplace === 0) {
		// No more units to place (but may to move)
		if(game.current_player.tomove === 0 || game.current_player.individuals < 2) {
			// No more shadows or only one individual on map (that cannot be removed)
			this.ai_end();
			return;
		}
	}

	let depth = 4 - game.current_player.iq;
	if(game.turn === 0) {
		depth = 4; // Make the AI smarter in the first turn to avoid islands etc.
	}
	let value = 0;
	let best_value = -Infinity;
	let best_move = [];
	let to_remove = 0;

	// Only use shadows (movements) if no individuals for placement are left
	if(game.current_player.toplace === 0) {
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
	}

	this.set_individual(best_move[0], best_move[1]);
	this.ai_own_individuals.push(best_move);
};


World.prototype.ai_end = function() {
	game.current_player.toplace = 0;
	game.current_player.tomove = 0;
	this.ai_active = false;
	this.draw_minispec();
	canvas.style.cursor = 'default';
	if(options.wm_ai_auto_continue && !game.is_last_player()) {
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
			if(game.world_map[yy][xx] === WORLD_MAP.WATER) {
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
					winning_chance = player.stats[game.world_map[yy][xx] - WORLD_MAP.RANGONES] +
						player.stats[ATTR.ATTACK] + player.stats[ATTR.INTELLIGENCE]/4 -
						enemy.stats[game.world_map[yy][xx] - WORLD_MAP.RANGONES] -
						enemy.stats[ATTR.DEFENSE] - enemy.stats[ATTR.INTELLIGENCE]/4;
					value += winning_chance * weight;
				}
			}
			else if(game.world_map[yy][xx] > WORLD_MAP.RANGONES && game.world_map[yy][xx] <= WORLD_MAP.DESERT) {
				value += game.players[game.current_player.id].stats[game.world_map[yy][xx] - WORLD_MAP.RANGONES] * weight;
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
				if(game.map_positions[y][x] === -1 && game.world_map[y][x] >= WORLD_MAP.RANGONES && game.world_map[y][x] <= WORLD_MAP.DESERT) {
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
				if(possible_moves.indexOf(pos) === -1 && game.map_positions[yy][xx] !== game.current_player.id && game.world_map[yy][xx] >= WORLD_MAP.RANGONES && game.world_map[yy][xx] <= WORLD_MAP.DESERT) {
					possible_moves.push(pos);
				}
			}
		}
	}

	return possible_moves;
};


World.prototype.create_height_map = function() {
	const map = Array.from(Array(this.dim[1]), () => Array(this.dim[0]).fill(0));

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
	for(let y = 1; y < this.dim[1] - 1; y++) {
		for(let x = 1; x < this.dim[0] - 1; x++) {
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
	const map = Array.from(Array(this.dim[1]), () => Array(this.dim[0]).fill(0));

	for(let y = 0; y < this.dim[1]; y++) {
		for(let x = 0; x < this.dim[0]; x++) {
			if(!game.world_map || game.world_map[y][x] < WORLD_MAP.MOUNTAIN) {
				map[y][x] = this.find_tile(game.height_map[y][x], y);
			}
			else {
				map[y][x] = game.world_map[y][x];
			}
		}
	}

	return map;
};


World.prototype.find_tile = function(height, y) {
	if(height <= game.water_level) {
		return WORLD_MAP.WATER;
	}

	if(height >= game.mountain_level) {
		return WORLD_MAP.MOUNTAIN;
	}

	const temp = clamp(game.temp + y * 3 - height + 11, 0, 100);
	const humid = clamp(game.humid - height + 50, 0, 100);

	let delta = Infinity;
	let tile = 0;
	for(let i = 0; i < this.ideal.length; i++) {
		const d = Math.max(Math.abs(this.ideal[i][0] - humid), Math.abs(this.ideal[i][1] - temp));
		if(d < delta) {
			delta = d;
			tile = i;
		}
	}

	return tile + WORLD_MAP.RANGONES;
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
	for(let player of game.players) {
		if(player.individuals > max_individuals) {
			max_individuals = player.individuals;
		}
	}

	for(let i = 0; i < game.players.length; i++) {
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

	for(let i = 0; i < game.current_player.toplace; i++) {
		ctx.drawImage(this.map_pics,
			this.minispec_soffset[0] + this.tile_dim[0]*game.current_player.id, this.minispec_soffset[1],
			this.tile_dim[0], this.tile_dim[1],
			this.toplace_offset[0] + this.minispec_delta[0] * (i%10), this.toplace_offset[1] + this.minispec_delta[1] * Math.floor(i/10),
			this.tile_dim[0], this.tile_dim[1]);
	}

	for(let i = 0; i < game.current_player.tomove; i++) {
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
	if(game.world_map[y][x] === WORLD_MAP.WATER) {
		tile = this.coast_tile(x, y);
	}
	else {
		tile = game.world_map[y][x] + 46;
	}

	const soffset = [(tile % 37) * this.tile_dim[0], Math.floor(tile / 37) * this.tile_dim[0]];

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
