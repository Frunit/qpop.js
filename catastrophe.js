'use strict';


function Catastrophe() {
	this.id = SCENE.CATASTROPHE;
	this.bg = resources.get('gfx/dark_bg.png');

	// CONST_START
	this.dim = [360, 300];
	this.title_dim = [360, 21];
	this.anim_dim = [320, 240];

	this.offset = [140, 90];
	this.title_offset = [140, 90];
	this.anim_offset = [160, 130];

	this.anim_soffset = [0, 0];
	// CONST_END

	this.clickareas = [];
	this.animation = null;

	this.type = random_int(0, 8);
}


Catastrophe.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.animation = new Animation(catastrophe_frames[this.type], this.anim_offset);
	this.redraw();
};


Catastrophe.prototype.redraw = function() {
	// Background
	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	// Black rect around whole catastrophe window
	draw_black_rect([this.offset[0], this.offset[1]], [this.dim[0]-1, this.dim[1]-1]);

	// Title
	draw_rect([this.title_offset[0], this.title_offset[1]], this.title_dim);
	write_text(lang.catastrophe,
				[this.title_offset[0] + this.title_dim[0]/2,
				this.title_offset[1] + 15],
				'white', 'black');

	// Rect around animation
	draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

	this.clickareas = [];

	this.clickareas.push({
		x1: this.anim_offset[0],
		y1: this.anim_offset[1],
		x2: this.anim_offset[0] + this.anim_dim[0],
		y2: this.anim_offset[1] + this.anim_dim[1],
		down: () => {},
		up: () => this.end(),
		blur: () => {}
	});
};


Catastrophe.prototype.render = function() {
	this.animation.render();
};


Catastrophe.prototype.update = function() {
	if(this.animation.has_stopped) {
		this.end();
	}
	else {
		this.animation.step();
	}
};


Catastrophe.prototype.handle_input = function() {
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
		input.reset('MOUSE');
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
			input.reset('BLUR');
			if(game.clicked_element) {
				game.clicked_element.blur();
				game.clicked_element = null;
			}
		}
	}

	if(input.isDown('ENTER')) {
		input.reset('ENTER');
		this.end();
	}
	else if(input.isDown('ESCAPE')) {
		input.reset('ESCAPE');
		this.end();
	}
};


Catastrophe.prototype.end = function() {
	game.stage = game.backstage.pop();
	game.stage.exec_catastrophe(self.type); // also redraws
};
