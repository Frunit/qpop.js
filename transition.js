'use strict';

function Transition(pic, id) {
	this.id = id;
	this.pic = resources.get(pic);

	// CONST_START
	this.pic_dim = [595, 415];
	this.pic_offset = [23, 42];
	this.subtitle_offset = [70, 420];
	// CONST_END

	this.lang_string = pic.split('/').pop().replace('.png', '');

	this.frame = 0;

	this.clickareas = [];
}


Transition.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.redraw();
};


Transition.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 460]); // Main rectangle

	// Inverted rectangle around the picture
	draw_inv_rect([this.pic_offset[0] - 1, this.pic_offset[1] - 1], [this.pic_dim[0] + 2, this.pic_dim[1] + 2]);

	// Background panels
	ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);

	if(lang[this.lang_string]) {
		subtitle(this.subtitle_offset[0], this.subtitle_offset[1], lang[this.lang_string]);
	}

	this.clickareas = [];

	this.clickareas.push({
		x1: this.pic_offset[0],
		y1: this.pic_offset[1],
		x2: this.pic_offset[0] + this.pic_dim[0],
		y2: this.pic_offset[1] + this.pic_dim[1],
		down: () => {},
		up: () => game.next_stage(),
		blur: () => {}
	});
};


Transition.prototype.render = function() {

};


Transition.prototype.update = function() {
	this.frame++;
	if(this.frame > options.transition_delay) {
		game.next_stage();
	}
};


Transition.prototype.handle_input = function() {
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
