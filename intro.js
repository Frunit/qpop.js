'use strict';


function Intro() {
	this.id = SCENE.INTRO;

	// CONST_START
	this.anim_dim = [600, 420];
	this.anim_offset = [19, 39];
	// CONST_END

	this.num = 0;
	this.animation = null;

	this.clickareas = [];
}


Intro.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.animation = new Animation(intro_frames[this.num], this.anim_offset);
	this.redraw();
};


Intro.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

	this.clickareas = [];

	this.clickareas.push({
		x1: this.anim_offset[0],
		y1: this.anim_offset[1],
		x2: this.anim_offset[0] + this.anim_dim[0],
		y2: this.anim_offset[1] + this.anim_dim[1],
		down: () => {},
		up: () => game.next_stage(),
		blur: () => {}
	});
};


Intro.prototype.render = function() {
	this.animation.render();
};


Intro.prototype.update = function() {
	if(this.animation.has_stopped) {
		this.num++;
		if(this.num < 4) {
			this.animation = new Animation(intro_frames[this.num], this.anim_offset);
		}
		else {
			game.next_stage();
		}
	}
	else {
		this.animation.step();
	}
};


Intro.prototype.handle_input = function() {
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
		game.next_stage();
	}
};
