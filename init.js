'use strict';

function Init() {
	this.id = SCENE.INIT;
	this.bg = resources.get('gfx/init.png');
	this.spec_pics = resources.get('gfx/species.png');

	// CONST_START
	this.panel_dim = [308, 140];
	this.type_dim = [63, 63];
	this.iq_dim = [12, 11];
	this.iq_text_dim = [140, 11];
	this.load_dim = [230, 22];
	this.next_dim = [181, 22];

	this.spec_offset = [8, 31];
	this.type_offset = [83, 32];
	this.load_offset = [0, 458];
	this.next_offset = [459, 458];
	this.iq_offset = [158, 115];
	this.text_iq_offset = [216, 38];
	this.text_iqs_offset = [179, 58];

	this.iq_dy = 22;
	this.line_y = 34;
	this.line_from_to = [157, 297];

	this.panel_soffset = [0, 0];
	// CONST_END

	this.panel_offsets = [[8, 27], [322, 27], [8, 169], [322, 169], [8, 311], [322, 311]];

	this.type_soffsets = [[0, 0], [309, 65], [309, 1], [373, 1]];
	this.iq_soffsets = [[387, 65], [373, 65], [373, 78], [373, 91], [373, 104]];
	this.spec_soffsets = [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]];

	this.clickareas = [];
	this.rightclickareas = [];
}


Init.prototype.initialize = function() {
	this.redraw();
};


Init.prototype.redraw = function() {
	draw_base();

	draw_rect([0, 20], [640, 439]); // Main rectangle
	draw_rect(this.load_offset, this.load_dim); // Load
	write_text(lang.load_game, [115, 473], 'white', 'black');
	draw_rect([229, 458], [231, 22]); // Bottom middle
	draw_rect(this.next_offset, this.next_dim); // Continue
	write_text(lang.next, [549, 473], 'white', 'black');

	this.clickareas = [];
	this.rightclickareas = [];

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

	// Lengths of lines around iq title
	const distance = Math.ceil(ctx.measureText(lang.iq).width/2) + 5;
	const left_line_to = this.text_iq_offset[0] - distance;
	const right_line_from = this.text_iq_offset[0] + distance;

	for(let playernum = 0; playernum < this.panel_offsets.length; playernum++) {
		const panel_offset = this.panel_offsets[playernum];
		ctx.drawImage(this.bg,						// Panel
			this.panel_soffset[0], this.panel_soffset[1],
			this.panel_dim[0], this.panel_dim[1],
			panel_offset[0], panel_offset[1],
			this.panel_dim[0], this.panel_dim[1]);


		let soffset = this.iq_soffsets[game.players[playernum].iq];
		ctx.drawImage(this.bg,						// IQ symbol
			soffset[0], soffset[1],
			this.iq_dim[0], this.iq_dim[1],
			panel_offset[0] + this.iq_offset[0],
			panel_offset[1] + this.iq_offset[1] - this.iq_dy*(game.players[playernum].iq-1),
			this.iq_dim[0], this.iq_dim[1]);

		soffset = this.type_soffsets[game.players[playernum].type];
		ctx.drawImage(this.bg,						// Player symbol
			soffset[0], soffset[1],
			this.type_dim[0], this.type_dim[1],
			panel_offset[0] + this.type_offset[0], panel_offset[1] + this.type_offset[1],
			this.type_dim[0], this.type_dim[1]);

		soffset = this.spec_soffsets[playernum];
		ctx.drawImage(this.spec_pics,				// Species symbol
			soffset[0], soffset[1],
			this.type_dim[0], this.type_dim[1],
			panel_offset[0] + this.spec_offset[0], panel_offset[1] + this.spec_offset[1],
			this.type_dim[0], this.type_dim[1]);

		write_text(lang.player.replace('{num}', (playernum + 1)), [Math.floor(this.panel_dim[0]/2) + panel_offset[0], panel_offset[1] + 15], 'black', 'white');

		write_text(lang.species[playernum], [panel_offset[0] + 77, panel_offset[1] + 121], 'black', 'white');

		write_text(lang.iq, [panel_offset[0] + this.text_iq_offset[0], panel_offset[1] + this.text_iq_offset[1]], '#000000', null, 'center');
		for(let iq = 0; iq < 4; iq++) {
			write_text(lang.iqs[iq], [panel_offset[0] + this.text_iqs_offset[0], panel_offset[1] + this.text_iqs_offset[1] + this.iq_dy*iq], '#000000', null, 'left');
		}

		// Draw Line around IQ title   (------ IQ ------)
		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(panel_offset[0] + this.line_from_to[0], panel_offset[1] + this.line_y);
		ctx.lineTo(panel_offset[0] + left_line_to, panel_offset[1] + this.line_y);
		ctx.moveTo(panel_offset[0] + right_line_from, panel_offset[1] + this.line_y);
		ctx.lineTo(panel_offset[0] + this.line_from_to[1], panel_offset[1] + this.line_y);
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		ctx.restore();

		// Click areas for Type change (human, computer, inactive)
		this.clickareas.push({
			x1: panel_offset[0] + this.type_offset[0],
			y1: panel_offset[1] + this.type_offset[1],
			x2: panel_offset[0] + this.type_offset[0] + this.type_dim[0],
			y2: panel_offset[1] + this.type_offset[1] + this.type_dim[1],
			down: () => {},
			up: () => this.change_type(playernum, 1),
			blur: () => {}
		});

		// RichtClick areas for Type change (human, computer, inactive)
		this.rightclickareas.push({
			x1: panel_offset[0] + this.type_offset[0],
			y1: panel_offset[1] + this.type_offset[1],
			x2: panel_offset[0] + this.type_offset[0] + this.type_dim[0],
			y2: panel_offset[1] + this.type_offset[1] + this.type_dim[1],
			down: () => {},
			up: () => this.change_type(playernum, 0),
			blur: () => {}
		});

		// Click areas for IQ change
		for(let iq = 0; iq < 4; iq++) {
			this.clickareas.push({
				x1: panel_offset[0] + this.iq_offset[0],
				y1: panel_offset[1] + this.iq_offset[1] - this.iq_dy*iq,
				x2: panel_offset[0] + this.iq_offset[0] + this.iq_text_dim[0],
				y2: panel_offset[1] + this.iq_offset[1] - this.iq_dy*iq + this.iq_text_dim[1],
				down: () => {},
				up: () => this.change_iq(playernum, iq+1),
				blur: () => {}
			});
		}
	}
};


Init.prototype.render = function() {
	return;
};


Init.prototype.update = function() {
	this.handle_input();
};


Init.prototype.handle_input = function() {
	if(input.isDown('MOVE')) {
		let pos = input.mousePos();
		if(game.clicked_element || game.right_clicked_element) {
			let area = game.clicked_element || game.right_clicked_element;
			if(!(pos[0] >= area.x1 && pos[0] <= area.x2 &&
					pos[1] >= area.y1 && pos[1] <= area.y2))
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
			input.reset('BLUR');
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


Init.prototype.change_type = function(num, value) {
	game.players[num].type = (game.players[num].type + value) % 3 + 1;
	const soffset = this.type_soffsets[game.players[num].type];
	const panel_offset = this.panel_offsets[num];
	ctx.drawImage(this.bg,						// Player symbol
		soffset[0], soffset[1],
		this.type_dim[0], this.type_dim[1],
		panel_offset[0] + this.type_offset[0], panel_offset[1] + this.type_offset[1],
		this.type_dim[0], this.type_dim[1]);
};


Init.prototype.change_iq = function(num, iq) {
	game.players[num].iq = iq;
	const panel_offset = this.panel_offsets[num];

	for(let i = 1; i <= 4; i++) {
		const soffset = (i === iq) ? this.iq_soffsets[iq] : this.iq_soffsets[0];
		ctx.drawImage(this.bg,						// IQ symbol
			soffset[0], soffset[1],
			this.iq_dim[0], this.iq_dim[1],
			panel_offset[0] + this.iq_offset[0], panel_offset[1] + this.iq_offset[1] - (i-1)*this.iq_dy,
			this.iq_dim[0], this.iq_dim[1]);
	}
};


Init.prototype.next = function() {
	draw_rect(this.next_offset, this.next_dim);
	let no_human = true;
	let known_first_player = false;

	for(let i = 0; i < game.players.length; i++) {
		if(!known_first_player && game.players[i].type !== PLAYER_TYPE.NOBODY) {
			known_first_player = true;
			game.current_player = game.players[i];
		}

		if(game.players[i].type === PLAYER_TYPE.HUMAN) {
			no_human = false;
			break;
		}
	}

	if(no_human) {
		open_popup(lang.popup_title, 'dino', lang.who_plays, () => {}, lang.next);
		return;
	}

	game.next_stage();
};


Init.prototype.load_game = function() {
	draw_rect(this.load_offset, this.load_dim);
	upload_dialog();
};
