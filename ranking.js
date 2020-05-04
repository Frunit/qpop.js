'use strict';

function Ranking() {
	this.id = SCENE.RANKING;
	this.bg_pic = resources.get('gfx/dark_bg.png');
	this.pics = resources.get('gfx/ranking.png');
	this.wreath_pic = resources.get('gfx/wreath.png');

	// CONST_START
	this.pics_url = 'gfx/ranking.png';

	this.load_dim = [230, 22];
	this.save_dim = [231, 22];
	this.next_dim = [181, 22];
	this.pillarbottom_dim = [100, 100];
	this.pillarcenter_dim = [50, 8];
	this.pillartop_dim = [50, 10];
	this.species_dim = [64, 64];
	this.icon_dim = [16, 16];
	this.draw_area_dim = [634, 333];

	this.load_offset = [0, 458];
	this.save_offset = [229, 458];
	this.next_offset = [459, 458];
	this.final_turn_offset = [307, 147];
	this.turn_offset = [316, 39];
	this.pillarbottom_offset = [21, 356];
	this.pillarcenter_offset = [43, 325];
	this.pillartop_offset = [43, 315];
	this.wreath_offset = [140, 6];
	this.sign_offset = [39, 373];
	this.draw_area_offset = [3, 23];

	this.sym_spec_offset = [43, 372];
	this.sym_dna_offset = [43, 397];
	this.sym_total_offset = [43, 422];
	this.text_spec_offset = [83, 386];
	this.text_dna_offset = [83, 410];
	this.text_total_offset = [83, 435];

	this.pillarbottom_soffset = [0, 0];
	this.pillarcenter_soffset = [0, 111];
	this.pillartop_soffset = [0, 101];
	this.outoforder_soffset = [384, 384];
	this.sym_dna_soffset = [400, 480];
	this.sym_total_soffset = [384, 480];

	this.pillartop_dx = 51;
	this.sign_dx = 100;
	this.walk_y = 252;

	this.delta = 8;
	// CONST_END

	this.dead_soffsets = [[384, 0], [384, 64], [384, 128], [384, 192], [384, 256], [384, 320]];
	this.sym_spec_soffsets = [[384, 448], [400, 448], [416, 448], [432, 448], [384, 464], [400, 464]];
	this.rel_dx = [0, 106, 206, 306, 406, 504];
	this.max_heights = [167, 128, 104, 80, 56, 32];

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
	this.sprites = [];

	// Phase 0: Walking in from right to left
	// Phase 1: Moving upwards
	// Phase 2: Standing still, the winner waves its hand
	this.phase = 0;
	this.delay = anim_delays.ranking;
	this.delay_counter = 0;

	this.lead_x = 641;
	this.height = 0;
	this.heights = [0, 0, 0, 0, 0, 0];
	this.final_heights = [0, 0, 0, 0, 0, 0];
	this.winners = [];
}


Ranking.prototype.initialize = function() {
	audio.play_music('intro');
	this.sprites = [];
	for(let i = 0; i < 6; i++) {
		this.sprites.push(
			new Sprite(this.pics_url, [64, 64], anim_delays.ranking, anim_ranking.walking[i].offset, anim_ranking.walking[i].frames)
		);
	}

	this.determine_best();
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

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

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

	// Draw lower pillar parts
	for(let i = -1; i < 7; i++) {
		ctx.drawImage(this.pics,
			this.pillarbottom_soffset[0], this.pillarbottom_soffset[1],
			this.pillarbottom_dim[0], this.pillarbottom_dim[1],
			this.pillarbottom_offset[0] + i*this.pillarbottom_dim[0], this.pillarbottom_offset[1],
			this.pillarbottom_dim[0], this.pillarbottom_dim[1]);
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

	// Main rectangle (draw last to overwrite any spare pixels from pillar parts)
	draw_rect([0, 20], [640, 439]);

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
	];
};


// MAYBE: This could be made more efficient, drawing only the necessary parts depeding on the phase
Ranking.prototype.render = function() {
	// Draw background in draw area
	ctx.drawImage(this.bg_pic,
			this.draw_area_offset[0], this.draw_area_offset[1],
			this.draw_area_dim[0], this.draw_area_dim[1],
			this.draw_area_offset[0], this.draw_area_offset[1],
			this.draw_area_dim[0], this.draw_area_dim[1]);

	ctx.save();
	ctx.translate(this.draw_area_offset[0], this.draw_area_offset[1]);
	ctx.beginPath();
	ctx.rect(0, 0, this.draw_area_dim[0], this.draw_area_dim[1]);
	ctx.clip();

	// Draw wreath only if the game is finished
	if(game.turn === game.max_turns) {
		ctx.drawImage(this.wreath_pic, this.wreath_offset[0], this.wreath_offset[1]);

		// Draw turn number
		ctx.save();
		ctx.font = '24px serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#c3c3c3';
		ctx.fillText(game.turn, this.final_turn_offset[0]-1, this.final_turn_offset[1]-1);
		ctx.fillStyle = '#000000';
		ctx.fillText(game.turn, this.final_turn_offset[0], this.final_turn_offset[1]);
		ctx.restore();
	}
	else {
		// Draw turn number
		ctx.save();
		ctx.font = 'bold 24px serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#828282';
		ctx.fillText(lang.turn + ' ' + game.turn, this.turn_offset[0], this.turn_offset[1]);
		ctx.restore();
	}

	// Draw fixed upper pillar parts
	for(let i = -1; i < 12; i+=2) {
		ctx.drawImage(this.pics,
			this.pillartop_soffset[0], this.pillartop_soffset[1],
			this.pillartop_dim[0], this.pillartop_dim[1],
			this.pillartop_offset[0] + i*this.pillartop_dim[0], this.pillartop_offset[1],
			this.pillartop_dim[0], this.pillartop_dim[1]);

		ctx.drawImage(this.pics,
			this.pillarcenter_soffset[0], this.pillarcenter_soffset[1],
			this.pillarcenter_dim[0], this.pillarcenter_dim[1],
			this.pillarcenter_offset[0] + i*this.pillarcenter_dim[0], this.pillarcenter_offset[1],
			this.pillarcenter_dim[0], this.pillarcenter_dim[1]);
	}


	// Draw variable upper pillar parts
	for(let i = 0; i < 6; i++) {
		ctx.drawImage(this.pics,
			this.pillartop_soffset[0], this.pillartop_soffset[1],
			this.pillartop_dim[0], this.pillartop_dim[1],
			this.pillartop_offset[0] + i*2*this.pillartop_dim[0], this.pillartop_offset[1] - this.heights[i],
			this.pillartop_dim[0], this.pillartop_dim[1]);

		ctx.drawImage(this.pics,
			this.pillarcenter_soffset[0], this.pillarcenter_soffset[1],
			this.pillarcenter_dim[0], this.pillarcenter_dim[1],
			this.pillarcenter_offset[0] + i*2*this.pillarcenter_dim[0], this.pillarcenter_offset[1] - this.heights[i],
			this.pillarcenter_dim[0], this.heights[i] + this.pillarcenter_dim[1]);
	}

	// Draw species
	for(let i = 0; i < 6; i++) {
		this.sprites[i].render(ctx,
			[this.lead_x + this.rel_dx[i],
			this.walk_y - this.heights[i]]
		);
	}

	debug1.value = this.lead_x;

	ctx.restore();
};


Ranking.prototype.update = function() {
	for(let sprite of this.sprites) {
		sprite.update();
	}

	if(this.phase === 2) {
		return;
	}

	this.delay_counter++;
	if(this.delay_counter < this.delay) {
		return;
	}

	this.delay_counter = 0;

	if(this.phase === 0) {
		this.lead_x -= this.delta;

		if(this.lead_x <= 33) {
			this.lead_x = 33;
			this.next_phase();
		}
	}
	else if(this.phase === 1) {
		for(let i = 0; i < 6; i++) {
			this.heights[i] += this.delta;
			if(this.heights[i] > this.final_heights[i]) {
				this.heights[i] = this.final_heights[i];
			}
		}
		this.height += this.delta;

		if(this.height >= this.max_heights[0]) {
			this.next_phase();
		}
	}
};


Ranking.prototype.determine_best = function() {
	const scores = game.get_ranking();

	this.winners = [scores[0][0]];
	for(let i = 1; i < 6; i++) {
		if(scores[i][1] !== scores[i-1][1] || scores[i][2] !== scores[i-1][2]) {
			break;
		}

		this.winners.push(scores[i][0]);
	}

	if(game.players[scores[5][0]].is_dead || game.players[scores[5][0]].type === PLAYER_TYPE.NOBODY) {
		this.final_heights[scores[5][0]] = 0;
	}
	else {
		this.final_heights[scores[5][0]] = this.max_heights[5];
	}

	for(let i = 4; i >= 0; i--) {
		if(scores[i][1] === scores[i+1][1] && scores[i][2] === scores[i+1][2]) {
			this.final_heights[scores[i][0]] = this.final_heights[scores[i+1][0]];
		}
		else {
			this.final_heights[scores[i][0]] = this.max_heights[i];
		}
	}
};


Ranking.prototype.next_phase = function() {
	if(this.phase === 0) {
		this.sprites = [];
		for(let i = 0; i < 6; i++) {
			this.sprites.push(
				new Sprite(this.pics_url, [64, 64], 0, [0, 0], [anim_ranking.standing[i]])
			);
		}

		this.phase++;
	}
	else {
		for(let winner of this.winners) {
			this.sprites[winner] = new Sprite(this.pics_url, [64, 64], anim_delays.ranking_winner, anim_ranking.boasting[winner].offset, anim_ranking.boasting[winner].frames);
		}

		this.delay = anim_delays.ranking_winner;

		this.phase++;
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
