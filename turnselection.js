'use strict';

function Turnselection() {
	this.id = SCENE.TURN_SELECTION;
	this.bg = resources.get('gfx/light_bg.png');
	this.pics = resources.get('gfx/turns.png');

	// CONST_START
	this.pics_url = 'gfx/turns.png';

	this.panel_dim = [620, 211];
	this.anim_dim = [420, 90];
	this.anim_part_dim = [60, 90];
	this.button_dim = [43, 43];
	this.bar_dim = [357, 43];
	this.load_dim = [230, 22];
	this.next_dim = [181, 22];

	this.anim_offset = [98, 87];
	this.bar_offset = [138, 328];
	this.load_offset = [0, 458];
	this.next_offset = [459, 458];
	this.bar_text_offset = [316, 354];

	this.anim_left_cb_offset = [98, 87];
	this.anim_right_cb_offset = [458, 87];
	this.anim_amorph_offset = [278, 87];

	this.bar_soffset = [86, 630];
	// CONST_END

	this.panel_offsets = [[9, 27], [9, 241]];
	this.button_offsets = [[95, 328], [495, 328]];

	this.anim_soffsets = [[0, 0], [0, 90], [0, 180]];
	this.button_soffsets = [[0, 630], [43, 630]];

	this.turns = [5, 10, 20, 255];
	this.turn_index = 0;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];

	this.animations = null;
}


Turnselection.prototype.initialize = function() {
	this.redraw();
};


Turnselection.prototype.draw_turn_changed = function() {
	ctx.drawImage(this.bg,						// Animations background
		this.anim_offset[0] - this.panel_offsets[0][0], this.anim_offset[1] - this.panel_offsets[0][1],
		this.anim_dim[0], this.anim_dim[1],
		this.anim_offset[0], this.anim_offset[1],
		this.anim_dim[0], this.anim_dim[1]);

	ctx.drawImage(this.pics,						// Turn indicator
		this.bar_soffset[0], this.bar_soffset[1],
		this.bar_dim[0], this.bar_dim[1],
		this.bar_offset[0], this.bar_offset[1],
		this.bar_dim[0], this.bar_dim[1]);

	write_text(lang.turns[this.turn_index], this.bar_text_offset, 'black', false);

	if(this.turn_index === 3) {
		if(this.animations === null) {
			if(random_int(0, 1)) {
				// Amorph splatters
				this.animations = [new Sprite(this.pics_url, this.anim_dim,
					anim_delays.turn_selection, [420, 450],
					[[0, 0], [0, 90]],
					true, () => this.end_animation(1))];
			}
			else {
				// Chuckberry stumbles
				this.animations = [new Sprite(this.pics_url, this.anim_dim,
					anim_delays.turn_selection, [0, 270],
					[[0, 0], [0, 90], [0, 180], [0, 270]],
					true, () => this.end_animation(0))];
			}
		}

		this.render();
	}
	else {
		this.animations = null;

		ctx.drawImage(this.pics,						// Amorph and Chuck Berrys
			this.anim_soffsets[this.turn_index][0], this.anim_soffsets[this.turn_index][1],
			this.anim_dim[0], this.anim_dim[1],
			this.anim_offset[0], this.anim_offset[1],
			this.anim_dim[0], this.anim_dim[1]);
	}
};


Turnselection.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 439]); // Main rectangle
	draw_rect(this.load_offset, this.load_dim); // Load
	write_text(lang.load_game, [115, 473], 'white', 'black');
	draw_rect([229, 458], [231, 22]); // Bottom middle
	draw_rect(this.next_offset, this.next_dim); // Continue
	write_text(lang.next, [549, 473], 'white', 'black');

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

	this.clickareas.push({
		x1: this.load_offset[0],
		y1: this.load_offset[1],
		x2: this.load_offset[0] + this.load_dim[0],
		y2: this.load_offset[1] + this.load_dim[1],
		down: () => draw_rect(this.load_offset, this.load_dim, true, true),
		up: () => this.load_game(),
		blur: () => draw_rect(this.load_offset, this.load_dim)
	});

	this.clickareas.push({
		x1: this.next_offset[0],
		y1: this.next_offset[1],
		x2: this.next_offset[0] + this.next_dim[0],
		y2: this.next_offset[1] + this.next_dim[1],
		down: () => draw_rect(this.next_offset, this.next_dim, true, true),
		up: () => this.next(),
		blur: () => draw_rect(this.next_offset, this.next_dim)
	});

	for(let i = 0; i < 2; i++) {
		// Background panels
		ctx.drawImage(this.bg, this.panel_offsets[i][0], this.panel_offsets[i][1]);
	}

	for(let i = 0; i < 2; i++) {
		// Buttons
		ctx.drawImage(this.pics,
			this.button_soffsets[i][0], this.button_soffsets[i][1],
			this.button_dim[0], this.button_dim[1],
			this.button_offsets[i][0], this.button_offsets[i][1],
			this.button_dim[0], this.button_dim[1]);

		this.clickareas.push({
			x1: this.button_offsets[i][0],
			y1: this.button_offsets[i][1],
			x2: this.button_offsets[i][0] + this.button_dim[0],
			y2: this.button_offsets[i][1] + this.button_dim[1],
			down: () => draw_rect(this.button_offsets[i], this.button_dim, true, true),
			up: () => this.change_turn(i),
			blur: () => draw_rect(this.button_offsets[i], this.button_dim)
		});
	}

	this.draw_turn_changed();

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
		{'key': 'RIGHT', 'action': () => this.change_turn(1), 'reset': true},
		{'key': 'UP', 'action': () => this.change_turn(1), 'reset': true},
		{'key': 'LEFT', 'action': () => this.change_turn(0), 'reset': true},
		{'key': 'DOWN', 'action': () => this.change_turn(0), 'reset': true},
	];
};


Turnselection.prototype.render = function() {
	if(this.animations) {
		ctx.drawImage(this.bg,  // Clear background
			this.anim_offset[0] - this.panel_offsets[0][0], this.anim_offset[1] - this.panel_offsets[0][1],
			this.anim_dim[0], this.anim_dim[1],
			this.anim_offset[0], this.anim_offset[1],
			this.anim_dim[0], this.anim_dim[1]);

		if(this.animations.length === 1) {
			this.animations[0].render(ctx, this.anim_offset);
		}
		else {
			ctx.drawImage(this.pics, // Splatter image
				420, 540,
				this.anim_dim[0], this.anim_dim[1],
				this.anim_offset[0], this.anim_offset[1],
				this.anim_dim[0], this.anim_dim[1]);

			// Three animations when Amorph is ripped apart
			this.animations[0].render(ctx, this.anim_left_cb_offset);
			this.animations[1].render(ctx, this.anim_right_cb_offset);
			this.animations[2].render(ctx, this.anim_amorph_offset);
		}
	}
};


Turnselection.prototype.update = function() {
	if(this.animations) {
		if(this.animations.length === 1) {
			this.animations[0].update();
			if(this.animations[0].finished) {
				this.animations[0].callback();
			}
		}
		else {
			for(let anim of this.animations) {
				anim.update();
				if(anim.finished) {
					anim.callback();
				}
			}
		}
	}
};


Turnselection.prototype.end_animation = function(animation_type) {
	if(animation_type) {
		// Amorph splatters

		this.animations = [
			// left Chuckberry
			new Sprite(this.pics_url, this.anim_part_dim, anim_delays.turn_selection, [420, 270],
			[[120, 0], [180, 0], [0, 0], [60, 0]],
			false),

			// right Chuckberry
			new Sprite(this.pics_url, this.anim_part_dim, anim_delays.turn_selection, [420, 360],
			[[120, 0], [180, 0], [0, 0], [60, 0]],
			false),

			// Amorph
			new Sprite(this.pics_url, this.anim_part_dim, anim_delays.turn_selection*4, [660, 270],
			[[0, 0], [60, 0], [120, 0]],
			true, () => this.amorph_eye())
		];
	}
	else {
		// Chuckberry stumbles
		this.animations = [new Sprite(this.pics_url, this.anim_dim, anim_delays.turn_selection, [420, 0],
			[[0, 90], [0, 180], [0, 0]],
			false)];
	}
};


Turnselection.prototype.amorph_eye = function() {
	this.animations[2] = new Sprite(this.pics_url, this.anim_part_dim, anim_delays.turn_selection*4, [660, 270],
			[[120, 0], [0, 90]], false)
};


Turnselection.prototype.change_turn = function(up) {
	draw_rect(this.button_offsets[up], this.button_dim);
	if(up && this.turn_index < 3) {
		this.turn_index++;
	}
	else if(!up && this.turn_index > 0) {
		this.turn_index--;
	}

	game.max_turns = this.turns[this.turn_index];

	this.draw_turn_changed();
};


Turnselection.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);

	let players_active = 0;
	for(let i = 0; i < 6; i++) {
		if(game.players[i].type !== PLAYER_TYPE.NOBODY) {
			players_active++;
		}
	}

	if(players_active === 1) {
		game.infinite_game = true;
	}

	game.select_evo_points();
	game.next_stage();
};


Turnselection.prototype.load_game = function() {
	draw_rect(this.load_offset, this.load_dim);
	upload_dialog();
};
