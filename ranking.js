'use strict';

// TODO: Species must be shown
// TODO: Pillars must have the right height
// TODO: All animations (walking in, moving up, cheering)

function Ranking() {
	this.id = SCENE.RANKING;
	this.bg_pic = resources.get('gfx/dark_bg.png');
	this.pics = resources.get('gfx/ranking.png');
	this.wreath_pic = resources.get('gfx/wreath.png');

	// CONST_START
	this.load_dim = [230, 22];
	this.save_dim = [231, 22];
	this.next_dim = [181, 22];
	this.pillarbottom_dim = [100, 100];
	this.pillartop_dim = [50, 18];
	this.species_dim = [64, 64];
	this.icon_dim = [16, 16];

	this.load_offset = [0, 458];
	this.save_offset = [229, 458];
	this.next_offset = [459, 458];
	this.turn_offset = [310, 170];
	this.pillarbottom_offset = [21, 356];
	this.pillartop_offset = [46, 338];
	this.wreath_offset = [143, 29];
	this.sign_offset = [39, 373];

	this.sym_spec_offset = [43, 372];
	this.sym_dna_offset = [43, 397];
	this.sym_total_offset = [43, 422];
	this.text_spec_offset = [83, 386];
	this.text_dna_offset = [83, 410];
	this.text_total_offset = [83, 435];

	this.pillarbottom_soffset = [0, 0];
	this.pillartop_soffset = [0, 101];
	this.outoforder_soffset = [384, 384];
	this.sym_dna_soffset = [400, 480];
	this.sym_total_soffset = [384, 480];

	this.pillartop_dx = 51;
	this.sign_dx = 100;
	// CONST_END

	this.dead_soffsets = [[384, 0], [384, 64], [384, 128], [384, 192], [384, 256], [384, 320]];
	this.sym_spec_soffsets = [[384, 448], [400, 448], [416, 448], [432, 448], [384, 464], [400, 464]];

	this.clickareas = [];
}


Ranking.prototype.initialize = function() {
	this.redraw();
};


Ranking.prototype.redraw = function() {
	draw_base();

	draw_rect(this.load_offset, this.load_dim); // Load
	write_text(lang.load_game, [115, 473], 'white', 'black');
	draw_rect(this.save_offset, this.save_dim); // Save
	write_text(lang.save_game, [344, 473], 'white', 'black');
	draw_rect(this.next_offset, this.next_dim); // Continue
	write_text(lang.next, [549, 473], 'white', 'black');

	this.clickareas = [];

	this.clickareas.push({
		x1: this.load_offset[0],
		y1: this.load_offset[1],
		x2: this.load_offset[0] + this.load_dim[0]-2,
		y2: this.load_offset[1] + this.load_dim[1]-2,
		down: () => draw_rect(this.load_offset, this.load_dim, true, true),
		up: () => this.load_game(),
		blur: () => draw_rect(this.load_offset, this.load_dim)
	});

	this.clickareas.push({
		x1: this.save_offset[0]+1,
		y1: this.save_offset[1]+1,
		x2: this.save_offset[0] + this.save_dim[0]-2,
		y2: this.save_offset[1] + this.save_dim[1]-2,
		down: () => draw_rect(this.save_offset, this.save_dim, true, true),
		up: () => this.save_game(),
		blur: () => draw_rect(this.save_offset, this.save_dim)
	});

	this.clickareas.push({
		x1: this.next_offset[0]+1,
		y1: this.next_offset[1]+1,
		x2: this.next_offset[0] + this.next_dim[0]-1,
		y2: this.next_offset[1] + this.next_dim[1]-1,
		down: () => draw_rect(this.next_offset, this.next_dim, true, true),
		up: () => this.next(),
		blur: () => draw_rect(this.next_offset, this.next_dim)
	});

	// Draw wreath only if the game is finished
	if(game.turn === game.max_turns) {
		ctx.drawImage(this.wreath_pic, this.wreath_offset[0], this.wreath_offset[1]);
	}

	// Draw turn number
	ctx.save();
	ctx.font = '24px serif';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#c3c3c3';
	ctx.fillText(game.turn, this.turn_offset[0]-1, this.turn_offset[1]-1);
	ctx.fillStyle = '#000000';
	ctx.fillText(game.turn, this.turn_offset[0], this.turn_offset[1]);
	ctx.restore();

	// Draw lower pillar parts
	for(let i = -1; i < 7; i++) {
		ctx.drawImage(this.pics,
			this.pillarbottom_soffset[0], this.pillarbottom_soffset[1],
			this.pillarbottom_dim[0], this.pillarbottom_dim[1],
			this.pillarbottom_offset[0] + i*this.pillarbottom_dim[0], this.pillarbottom_offset[1],
			this.pillarbottom_dim[0], this.pillarbottom_dim[1]);
	}

	// Draw upper pillar parts
	for(let i = -1; i < 12; i++) {
		ctx.drawImage(this.pics,
			this.pillartop_soffset[0], this.pillartop_soffset[1],
			this.pillartop_dim[0], this.pillartop_dim[1],
			this.pillartop_offset[0] + i*this.pillartop_dim[0], this.pillartop_offset[1],
			this.pillartop_dim[0], this.pillartop_dim[1]);
	}

	// Draw symbols in pillar signs
	for(let i = 0; i < 6; i++) {
		if(game.players[i].type === PLAYER_TYPE.NOBODY) { // Out of order
			ctx.drawImage(this.pics,
				this.outoforder_soffset[0], this.outoforder_soffset[1],
				this.species_dim[0], this.species_dim[1],
				this.sign_offset[0] + i*this.sign_dx, this.sign_offset[1],
				this.species_dim[0], this.species_dim[1]);
		}
		else if(game.players[i].is_dead) { // Death symbol
			ctx.drawImage(this.pics,
				this.dead_soffsets[i][0], this.dead_soffsets[i][1],
				this.species_dim[0], this.species_dim[1],
				this.sign_offset[0] + i*this.sign_dx, this.sign_offset[1],
				this.species_dim[0], this.species_dim[1]);
		}
		else { // Stats (Three symbols and 3x text)
			ctx.drawImage(this.pics, // Species symbol
				this.sym_spec_soffsets[i][0], this.sym_spec_soffsets[i][1],
				this.icon_dim[0], this.icon_dim[1],
				this.sym_spec_offset[0] + i*this.sign_dx, this.sym_spec_offset[1],
				this.icon_dim[0], this.icon_dim[1]);
			ctx.drawImage(this.pics, // DNA symbol
				this.sym_dna_soffset[0], this.sym_dna_soffset[1],
				this.icon_dim[0], this.icon_dim[1],
				this.sym_dna_offset[0] + i*this.sign_dx, this.sym_dna_offset[1],
				this.icon_dim[0], this.icon_dim[1]);
			ctx.drawImage(this.pics, // Wreath symbol
				this.sym_total_soffset[0], this.sym_total_soffset[1],
				this.icon_dim[0], this.icon_dim[1],
				this.sym_total_offset[0] + i*this.sign_dx, this.sym_total_offset[1],
				this.icon_dim[0], this.icon_dim[1]);

			ctx.save();
			ctx.textAlign = 'center';
			ctx.fillStyle = '#ffffff';
			ctx.fillText(game.players[i].individuals, this.text_spec_offset[0] + i*this.sign_dx, this.text_spec_offset[1]-1);
			ctx.fillText(game.players[i].evo_score, this.text_dna_offset[0] + i*this.sign_dx, this.text_dna_offset[1]-1);
			ctx.fillText(game.players[i].total_score, this.text_total_offset[0] + i*this.sign_dx, this.text_total_offset[1]-1);

			ctx.fillStyle = '#000000';
			ctx.fillText(game.players[i].individuals, this.text_spec_offset[0] + i*this.sign_dx, this.text_spec_offset[1]);
			ctx.fillText(game.players[i].evo_score, this.text_dna_offset[0] + i*this.sign_dx, this.text_dna_offset[1]);
			ctx.fillText(game.players[i].total_score, this.text_total_offset[0] + i*this.sign_dx, this.text_total_offset[1]);
			ctx.restore();
		}
	}

	// Main rectangle (draw last to overwrite any spare pixels from creatures
	draw_rect([0, 20], [640, 439]);
};


Ranking.prototype.render = function() {

};


Ranking.prototype.update = function() {
	this.handle_input();
};


Ranking.prototype.handle_input = function() {
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
};


Ranking.prototype.next = function() {
	game.next_stage();
};


Ranking.prototype.load_game = function() {
	draw_rect(this.load_offset, this.load_dim);
	upload_dialog();
};


Ranking.prototype.save_game = function() {
	draw_rect(this.load_offset, this.load_dim);
	game.save_game();
};
