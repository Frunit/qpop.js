'use strict';

// TODO RESEARCH: Compare animation speed and frames with original for both animations

function Turnselection() {
	this.id = 2;
	this.bg = resources.get('gfx/light_bg.png');
	this.pics = resources.get('gfx/turns.png');

	// CONST_START
	this.panel_dim = [620, 211];
	this.anim_dim = [420, 90];
	this.anim_part_dim = [60, 90]
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
	this.anim_speed = 1; // DEBUG
	// CONST_END

	this.panel_offsets = [[9, 27], [9, 241]];
	this.button_offsets = [[95, 328], [495, 328]];

	this.anim_soffsets = [[0, 0], [0, 90], [0, 180], [0, 270]];
	this.button_soffsets = [[0, 630], [43, 630]];

	this.turns = [5, 10, 20, 255];
	this.turn_index = 0;

	this.clickareas = [];

	this.animations = null;
	this.animation_type = 0;
	this.timer = 0;
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

	ctx.drawImage(this.pics,						// Animation
		this.anim_soffsets[this.turn_index][0], this.anim_soffsets[this.turn_index][1],
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
		this.animation_type = random_int(0, 1);

		if(this.animation_type) {
			// Amorph splatters
			this.animations = [new Sprite('gfx/turns.png', this.anim_dim, [420, 450],
				[[0, 0], [0, 90]],
				true, () => this.end_animation())];
		}
		else {
			// Chuckberry stumbles
			this.animations = [new Sprite('gfx/turns.png', this.anim_dim, [0, 270],
				[[0, 0], [0, 90], [0, 180], [0, 270]],
				true, () => this.end_animation())];
		}
	}
	else {
		this.animations = null;
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

	this.clickareas = [];

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
};


Turnselection.prototype.render = function() {
	if(this.animations) {
		if(this.animations.length === 1) {
			ctx.drawImage(this.bg,
				this.anim_offset[0] - this.panel_offsets[0][0], this.anim_offset[1] - this.panel_offsets[0][1],
				this.anim_dim[0], this.anim_dim[1],
				this.anim_offset[0], this.anim_offset[1],
				this.anim_dim[0], this.anim_dim[1]);
			this.animations[0].render(ctx, this.anim_offset);
		}
		else {
			ctx.drawImage(this.bg,
				this.anim_left_cb_offset[0] - this.panel_offsets[0][0], this.anim_left_cb_offset[1] - this.panel_offsets[0][1],
				this.anim_part_dim[0], this.anim_part_dim[1],
				this.anim_left_cb_offset[0], this.anim_left_cb_offset[1],
				this.anim_part_dim[0], this.anim_part_dim[1]);
			ctx.drawImage(this.bg,
				this.anim_right_cb_offset[0] - this.panel_offsets[0][0], this.anim_right_cb_offset[1] - this.panel_offsets[0][1],
				this.anim_part_dim[0], this.anim_part_dim[1],
				this.anim_right_cb_offset[0], this.anim_right_cb_offset[1],
				this.anim_part_dim[0], this.anim_part_dim[1]);
			ctx.drawImage(this.bg,
				this.anim_amorph_offset[0] - this.panel_offsets[0][0], this.anim_amorph_offset[1] - this.panel_offsets[0][1],
				this.anim_part_dim[0], this.anim_part_dim[1],
				this.anim_amorph_offset[0], this.anim_amorph_offset[1],
				this.anim_part_dim[0], this.anim_part_dim[1]);

			// Three animations when Amorph is ripped apart
			this.animations[0].render(ctx, this.anim_left_cb_offset);
			this.animations[1].render(ctx, this.anim_right_cb_offset);
			this.animations[2].render(ctx, this.anim_amorph_offset);
		}
	}
};


Turnselection.prototype.update = function(dt) {
	this.handle_input(dt);

	this.timer += dt;
	if(this.timer < 0.1) {
		return;
	}

	if(this.animations) {
		if(this.animations.length === 1) {
			this.animations[0].update(dt);
			if(this.animations[0].finished) {
				this.animations[0].callback();
			}
		}
		else {
			for(let anim of this.animations) {
				anim.update(dt);
			}
		}
	}

	this.timer = 0;
};


Turnselection.prototype.handle_input = function(dt) {
	if(input.isDown('MOVE')) {
		let pos = input.mousePos();
		if(game.clicked_element) {
			let area = game.clicked_element;
			if(!(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2))
			{
				area.blur();
				game.clicked_element = null;
			}
		}
		else {
			let found = false;
			for(let area of this.clickareas) {
				if(pos[0] >= area.x1 && pos[0] <= area.x2 &&
						pos[1] >= area.y1 && pos[1] <= area.y2)
				{
					canvas.style.cursor = 'pointer';
					found = true;
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
		else if(input.isDown('BLUR')) {
			input.reset('BLUR')
			if(game.clicked_element) {
				game.clicked_element.blur();
				game.clicked_element = null;
			}
		}
	}

	if(input.isDown('ENTER')) {
		input.reset('ENTER');
		this.next();
	}
	else if(input.isDown('RIGHT')) {
		input.reset('RIGHT');
		this.change_turn(1);
	}
	else if(input.isDown('UP')) {
		input.reset('UP');
		this.change_turn(1);
	}
	else if(input.isDown('LEFT')) {
		input.reset('LEFT');
		this.change_turn(0);
	}
	else if(input.isDown('DOWN')) {
		input.reset('DOWN');
		this.change_turn(0);
	}
};


Turnselection.prototype.end_animation = function() {
	if(this.animation_type) {
		// Amorph splatters

		this.animations = [
			// left Chuckberry
			new Sprite('gfx/turns.png', this.anim_part_dim, [420, 270],
			[[0, 0], [60, 0], [120, 0], [180, 0]],
			true, () => this.end_animation()),

			// right Chuckberry
			new Sprite('gfx/turns.png', this.anim_part_dim, [420, 360],
			[[0, 0], [60, 0], [120, 0], [180, 0]],
			true, () => this.end_animation()),

			// Amorph
			new Sprite('gfx/turns.png', this.anim_part_dim, [660, 270],
			[[0, 0], [60, 0], [120, 0], [0, 90]],
			true, () => this.end_animation())
		];
	}
	else {
		// Chuckberry stumbles
		this.animations = [new Sprite('gfx/turns.png', this.anim_dim, [420, 0],
			[[0, 0], [0, 90], [0, 180]],
			false)];
	}
};


Turnselection.prototype.change_turn = function(up) {
	draw_rect(this.button_offsets[up], this.button_dim);
	if(up && this.turn_index < 3) {
		this.turn_index++;
	}
	else if(!up && this.turn_index > 0) {
		this.turn_index--;
	}

	this.draw_turn_changed();
};


Turnselection.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);
	game.next_stage();
};


Turnselection.prototype.load_game = function() {
	draw_rect(this.load_offset, this.load_dim);
	open_popup(lang.popup_title, 'dino_cries', lang.debug_no_loading, () => {}, lang.debug_too_bad);

	// TODO → Load game
};
