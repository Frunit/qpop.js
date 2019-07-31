'use strict';

// TODO RESEARCH: All values have to be checked (dims, offsets, ...)
// TODO: The catastrophe should be animation, not only show a image.

function Catastrophe() {
	this.id = SCENE.CATASTROPHE;
	this.bg = resources.get('gfx/dark_bg.png');
	this.cata_pic = resources.get('gfx/dummy_cata.png');

	// CONST_START
	this.dim = [300, 200];
	this.title_dim = [300, 20];
	this.img_dim = [260, 160];

	this.offset = [140, 165];
	this.title_offset = [150, 10];
	this.img_offset = [20, 20];

	this.img_soffset = [0, 0];
	// CONST_END

	this.clickareas = [];

	this.type = this.choose();
	this.current_time = 0;
}


Catastrophe.prototype.initialize = function() {
	ctx.drawImage(this.bg,
		0, 0,
		this.dim[0], this.dim[1],
		this.offset[0], this.offset[1],
		this.dim[0], this.dim[1]);

	draw_black_rect([this.offset[0], this.offset[1]], [this.dim[0]-1, this.dim[1]-1]);

	// Title
	draw_rect([this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
	write_text(lang.catastrophe, [this.offset[0] + this.title_offset[0] + this.title_dim[0]/2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

	ctx.drawImage(this.cata_pic,
		this.img_soffset[0], this.img_soffset[1] + this.type * this.img_dim[1],
		this.img_dim[0], this.img_dim[1],
		this.offset[0] + this.img_offset[0], this.offset[1] + this.img_offset[1],
		this.img_dim[0], this.img_dim[1]);

	this.clickareas.push({
		x1: this.offset[0] + this.img_offset[0],
		y1: this.offset[1] + this.img_offset[1],
		x2: this.offset[0] + this.img_offset[0] + this.img_dim[0],
		y2: this.offset[1] + this.img_offset[1] + this.img_dim[1],
		down: () => {},
		up: () => this.end(),
		blur: () => {}
	});
};

Catastrophe.prototype.render = function() {
	return;
};


Catastrophe.prototype.update = function(dt) {
	this.current_time += dt;
	if(this.current_time > options.transition_delay) {
		this.end();
	}
	this.handle_input(dt);
};


Catastrophe.prototype.choose = function() {
	return random_int(0, 8);
};


Catastrophe.prototype.handle_input = function(dt) {
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
