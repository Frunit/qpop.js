'use strict';


function Loader() {
	this.id = SCENE.LOADING;
	this.bg_pic = null;
	this.header_pic = null;
	this.bar_pic = null;

	// CONST_START
	this.header_dim = [236, 78];
	this.bar_dim = [300, 16];
	this.start_dim = [200, 50];

	this.header_offset = [202, 50];
	this.subtitle_offset = [320, 190];
	this.bar_offset = [170, 350];
	this.percent_offset = [320, 362];
	this.start_offset = [220, 250];

	this.emptybar_soffset = [300, 80];

	this.img_size = 1236659;
	this.mp3_size = 8611893;
	this.ogg_size = 5598714;
	this.m4a_size = 4166319;
	// CONST_END

	this.max_size = 0;
	this.suffix = '.mp3';

	this.bar_soffsets = [[300, 64], [0, 64], [300, 48], [0, 48], [300, 32], [0, 32], [300, 16], [300, 16], [0, 16], [300, 0]];

	this.phase = 0;
	this.percentage = 0;
	this.images_drawn = false;

	this.clickareas = [];
	this.rightclickareas = [];
	this.keys = [];
}


Loader.prototype.initialize = function() {
	canvas.style.cursor = 'default';
	this.phase = 0;
	this.percentage = 0;
	this.redraw();

	this.suffix = audio.get_suffix();
	this.max_size = this.img_size;
	if(this.suffix === '.m4a') {
		this.max_size += this.m4a_size;
	}
	else if(this.suffix === '.ogg') {
		this.max_size += this.ogg_size;
	}
	else if(this.suffix === '.mp3') {
		this.max_size += this.mp3_size;
	}
	else {
		game.disable_audio();
	}

	resources.on_ready(this.finished_preloading, this);
	resources.load([
		['gfx/dark_bg.png', 'image'],
		['gfx/mutations.png', 'image'],
		['gfx/header.png', 'image'],
		['gfx/gui.png', 'image'],
	]);
};


Loader.prototype.redraw = function() {
	if(this.phase === 0) {
		// background
		ctx.save();
		ctx.beginPath();
		ctx.rect(0.5, 0.5, canvas.width-1, canvas.height-1);
		ctx.fillStyle = '#a3a3a3';
		ctx.strokeStyle = '#000000';
		ctx.fill();
		ctx.stroke();
		ctx.restore();

		// Title
		ctx.save();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = 'bold 100px serif';
		ctx.fillStyle = '#0000ff';
		ctx.fillText('Q-POP', this.header_offset[0] + Math.floor(this.header_dim[0]/2), this.header_offset[1]);
		ctx.restore();
	}
	else { // phase is 1 or 2
		draw_base();
		draw_rect([0, 20], [640, 460]); // Main rectangle

		ctx.drawImage(this.header_pic, this.header_offset[0], this.header_offset[1]);
	}

	// Subtitle
	ctx.save();
	ctx.textAlign = 'center';
	ctx.font = 'bold 30px sans-serif';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#00ffff';
	ctx.fillText(lang.subtitle, this.subtitle_offset[0]-1, this.subtitle_offset[1]-1);
	ctx.fillStyle = '#000080';
	ctx.fillText(lang.subtitle, this.subtitle_offset[0]+2, this.subtitle_offset[1]+2);
	ctx.fillStyle = '#0000ff';
	ctx.fillText(lang.subtitle, this.subtitle_offset[0], this.subtitle_offset[1]);
	ctx.restore();

	this.draw_bar();

	this.clickareas = game.clickareas.slice();
	this.rightclickareas = game.rightclickareas.slice();

	// Loading/Starting button
	draw_rect(this.start_offset, this.start_dim);
	const text_x = this.start_offset[0] + Math.floor(this.start_dim[0]/2);
	const text_y = this.start_offset[1] + this.start_dim[1] - 18;

	if(this.phase < 2) {
		ctx.save();
		ctx.textAlign = 'center';
		ctx.font = 'bold 24px sans-serif';
		ctx.fillStyle = 'white';
		ctx.fillText(lang.loading, text_x+2, text_y+2);
		ctx.fillStyle = 'grey';
		ctx.fillText(lang.loading, text_x, text_y);
		ctx.restore();
	}
	else {
		// MAYBE: Check if music is playable and proceed without waiting for the click of the user

		ctx.save();
		ctx.textAlign = 'center';
		ctx.font = 'bold 24px sans-serif';
		ctx.fillStyle = 'white';
		ctx.fillText(lang.start_game, text_x+2, text_y+2);
		ctx.fillStyle = 'black';
		ctx.fillText(lang.start_game, text_x, text_y);
		ctx.restore();

		this.clickareas.push({
			x1: this.start_offset[0],
			y1: this.start_offset[1],
			x2: this.start_offset[0] + this.start_dim[0],
			y2: this.start_offset[1] + this.start_dim[1],
			down: () => draw_rect(this.start_offset, this.start_dim, true, true),
			up: () => game.next_stage(),
			blur: () => draw_rect(this.start_offset, this.start_dim)
		});
	}

	this.keys = [
		{'key': 'ENTER', 'action': () => this.next(), 'reset': true},
	];
};


Loader.prototype.draw_bar = function() {
	if(this.phase === 0) {
		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.rect(this.bar_offset[0], this.bar_offset[1], this.bar_dim[0], this.bar_dim[1]);
		ctx.strokeStyle = '#000000';
		ctx.stroke();

		ctx.beginPath();
		ctx.rect(this.bar_offset[0], this.bar_offset[1], Math.floor(this.percentage * 3), this.bar_dim[1]);
		ctx.fillStyle = '#9a4155';
		ctx.fill();
		ctx.restore();
	}
	else {
		const length = Math.floor(this.percentage * 3 - 3);

		ctx.drawImage(this.bar_pic,
			this.emptybar_soffset[0], this.emptybar_soffset[1],
			this.bar_dim[0], this.bar_dim[1],
			this.bar_offset[0], this.bar_offset[1],
			this.bar_dim[0], this.bar_dim[1]);

		if(length > 0) {
			const soffset = this.bar_soffsets[Math.min(9, Math.floor(this.percentage/10))];

			// Main bar
			ctx.drawImage(this.bar_pic,
				soffset[0], soffset[1],
				length, this.bar_dim[1],
				this.bar_offset[0], this.bar_offset[1],
				length, this.bar_dim[1]);
			// Last bit
			ctx.drawImage(this.bar_pic,
				soffset[0] + this.bar_dim[0] - 3, soffset[1],
				3, this.bar_dim[1],
				this.bar_offset[0] + length, this.bar_offset[1],
				3, this.bar_dim[1]);
		}
	}

	write_text(this.percentage.toFixed(2) + '%', [this.percent_offset[0], this.percent_offset[1]]);
};


Loader.prototype.finished_preloading = function(self) {
	self.bg_pic = resources.get('gfx/dark_bg.png');
	self.header_pic = resources.get('gfx/header.png');
	self.bar_pic = resources.get('gfx/mutations.png');
	self.phase = 1;

	self.redraw();

	resources.on_ready(self.finished_loading, self);
	resources.load([
		['gfx/background.png', 'image'],
		['gfx/clouds.png', 'image'],
		['gfx/electro.png', 'image'],
		['gfx/enemies.png', 'image'],
		['gfx/github.png', 'image'],
		['gfx/init.png', 'image'],
		['gfx/light_bg.png', 'image'],
		['gfx/pred1.png', 'image'],
		['gfx/pred2.png', 'image'],
		['gfx/pred3.png', 'image'],
		['gfx/ranking.png', 'image'],
		['gfx/spec1.png', 'image'],
		['gfx/spec2.png', 'image'],
		['gfx/spec3.png', 'image'],
		['gfx/spec4.png', 'image'],
		['gfx/spec5.png', 'image'],
		['gfx/spec6.png', 'image'],
		['gfx/species.png', 'image'],
		['gfx/survival_gui.png', 'image'],
		['gfx/transition_mutations.png', 'image'],
		['gfx/transition_survival.png', 'image'],
		['gfx/transition_world.png', 'image'],
		['gfx/turns.png', 'image'],
		['gfx/tutorial.png', 'image'],
		['gfx/world_gui.png', 'image'],
		['gfx/world.png', 'image'],
		['gfx/wreath.png', 'image'],
		['sfx/intro', 'audio', 'intro'], // Music
		['sfx/spec1', 'audio', 'spec0'],
		['sfx/spec2', 'audio', 'spec1'],
		['sfx/spec3', 'audio', 'spec2'],
		['sfx/spec4', 'audio', 'spec3'],
		['sfx/spec5', 'audio', 'spec4'],
		['sfx/spec6', 'audio', 'spec5'],
		['sfx/dino_cry', 'audio', 'dino_cry'], // Sounds
		['sfx/dino_win', 'audio', 'dino_win'],
		['sfx/electro', 'audio', 'electro'],
		['sfx/feeding_chuck', 'audio', 'feeding_chuck'],
		['sfx/feeding_kiwi', 'audio', 'feeding_kiwi'],
		['sfx/feeding', 'audio', 'feeding'],
		['sfx/female_amorph', 'audio', 'female_amorph'],
		['sfx/female_chuck', 'audio', 'female_chuck'],
		['sfx/female_kiwi', 'audio', 'female_kiwi'],
		['sfx/female_pesci', 'audio', 'female_pesci'],
		['sfx/female_purplus', 'audio', 'female_purplus'],
		['sfx/human_base', 'audio', 'human_base'],
		['sfx/human_win', 'audio', 'human_win'],
		['sfx/love', 'audio', 'love'],
		['sfx/mushroom_win', 'audio', 'mushroom_win'],
		['sfx/offspring_amorph', 'audio', 'offspring_amorph'],
		['sfx/offspring_chuck', 'audio', 'offspring_chuck'],
		['sfx/offspring_kiwi', 'audio', 'offspring_kiwi'],
		['sfx/offspring_pesci', 'audio', 'offspring_pesci'],
		['sfx/offspring_purplus', 'audio', 'offspring_purplus'],
		['sfx/poison', 'audio', 'poison'],
		['sfx/posion_chuck', 'audio', 'poison_chuck'],
		['sfx/power_food', 'audio', 'power_food'],
		['sfx/quicksand', 'audio', 'quicksand'],
		['sfx/survival_fight', 'audio', 'survival_fight'],
		['sfx/swamp', 'audio', 'swamp'],
		['sfx/volcano', 'audio', 'volcano'],
		['sfx/win_kiwi', 'audio', 'win_kiwi'],
		['sfx/win_pesci', 'audio', 'win_pesci'],
		['sfx/win', 'audio', 'win'],
		['sfx/world_fight', 'audio', 'world_fight'],
		['anim_gfx/alpha.png', 'image'], // Intro gfx
		['anim_gfx/amoesaug.png', 'image'],
		['anim_gfx/amoeweg.png', 'image'],
		['anim_gfx/asche.png', 'image'],
		['anim_gfx/balken.png', 'image'],
		['anim_gfx/boschild.png', 'image'],
		['anim_gfx/elektro.png', 'image'],
		['anim_gfx/fegesek.png', 'image'],
		['anim_gfx/haschild.png', 'image'],
		['anim_gfx/intfru1.png', 'image'],
		['anim_gfx/intfru2.png', 'image'],
		['anim_gfx/intfru3.png', 'image'],
		['anim_gfx/intfru.png', 'image'],
		['anim_gfx/inthai.png', 'image'],
		['anim_gfx/introme2.png', 'image'],
		['anim_gfx/intropil.png', 'image'],
		['anim_gfx/intsek1.png', 'image'],
		['anim_gfx/kiwi2.png', 'image'],
		['anim_gfx/kuh1.png', 'image'],
		['anim_gfx/laken2.png', 'image'],
		['anim_gfx/planeten.png', 'image'],
		['anim_gfx/pophin1.png', 'image'],
		['anim_gfx/pophin.png', 'image'],
		['anim_gfx/posilich.png', 'image'],
		['anim_gfx/radar.png', 'image'],
		['anim_gfx/saugsek.png', 'image'],
		['anim_gfx/schipop2.png', 'image'],
		['anim_gfx/space.png', 'image'],
		['anim_gfx/station2.png', 'image'],
		['anim_gfx/staub.png', 'image'],
		['anim_gfx/tafelfru.png', 'image'],
		['anim_gfx/ufos.png', 'image'],
	]);
};


Loader.prototype.finished_loading = function(self) {
	self.phase = 2;

	self.redraw();

	resources.on_ready(self.finished_postloading, self);
	resources.load([
		['sfx/catastrophe', 'audio', 'catastrophe'], // Music
		['sfx/ranking', 'audio', 'ranking'],
		['sfx/outro', 'audio', 'outro'],
		['anim_gfx/amoegro.png', 'image'], // Catastrophe gfx
		['anim_gfx/baumbebe.png', 'image'],
		['anim_gfx/baumbe.png', 'image'],
		['anim_gfx/baumgro.png', 'image'],
		['anim_gfx/bauwas.png', 'image'],
		['anim_gfx/beben1.png', 'image'],
		['anim_gfx/beben2.png', 'image'],
		['anim_gfx/beben3.png', 'image'],
		['anim_gfx/beben.png', 'image'],
		['anim_gfx/eisfru.png', 'image'],
		['anim_gfx/eiswolk.png', 'image'],
		['anim_gfx/fisch.png', 'image'],
		['anim_gfx/floss.png', 'image'],
		['anim_gfx/gras.png', 'image'],
		['anim_gfx/hai1.png', 'image'],
		['anim_gfx/hai2.png', 'image'],
		['anim_gfx/hai3.png', 'image'],
		['anim_gfx/hai4.png', 'image'],
		['anim_gfx/kaefer.png', 'image'],
		['anim_gfx/kastro1.png', 'image'],
		['anim_gfx/kastro2a.png', 'image'],
		['anim_gfx/kastro3.png', 'image'],
		['anim_gfx/kastro4.png', 'image'],
		['anim_gfx/kastro5.png', 'image'],
		['anim_gfx/knall.png', 'image'],
		['anim_gfx/krone.png', 'image'],
		['anim_gfx/kuh2.png', 'image'],
		['anim_gfx/kuhtot.png', 'image'],
		['anim_gfx/meteor.png', 'image'],
		['anim_gfx/palme.png', 'image'],
		['anim_gfx/pilzkle.png', 'image'],
		['anim_gfx/pubeben.png', 'image'],
		['anim_gfx/qpopfruk.png', 'image'],
		['anim_gfx/rakete.png', 'image'],
		['anim_gfx/rakrauch.png', 'image'],
		['anim_gfx/rampe.png', 'image'],
		['anim_gfx/schnee.png', 'image'],
		['anim_gfx/see.png', 'image'],
		['anim_gfx/seuvieh.png', 'image'],
		['anim_gfx/sonne2.png', 'image'],
		['anim_gfx/sonne.png', 'image'],
		['anim_gfx/sputnik.png', 'image'],
		['anim_gfx/stuhl.png', 'image'],
		['anim_gfx/tuer2.png', 'image'],
		['anim_gfx/tuer.png', 'image'],
		['anim_gfx/typ.png', 'image'],
		['anim_gfx/vulkan1.png', 'image'],
		['anim_gfx/vulkan2.png', 'image'],
		['anim_gfx/vulkan.png', 'image'],
		['anim_gfx/vulkfru.png', 'image'],
		['anim_gfx/welle.png', 'image'],
		['anim_gfx/dino.png', 'image'], // Outro gfx
		['anim_gfx/endamoe.png', 'image'],
		['anim_gfx/endfru.png', 'image'],
		['anim_gfx/endhai2.png', 'image'],
		['anim_gfx/endhai.png', 'image'],
		['anim_gfx/endkaef.png', 'image'],
		['anim_gfx/endtext.png', 'image'],
		['anim_gfx/flugmobi.png', 'image'],
		['anim_gfx/hintend1.png', 'image'],
		['anim_gfx/hintend.png', 'image'],
		['anim_gfx/hunter.png', 'image'],
		['anim_gfx/minidino.png', 'image'],
		['anim_gfx/minipilz.png', 'image'],
		['anim_gfx/nest1.png', 'image'],
		['anim_gfx/nest.png', 'image'],
		['anim_gfx/schiff1.png', 'image'],
		['anim_gfx/schiff.png', 'image'],
		['anim_gfx/statuen.png', 'image'],
		['anim_gfx/tafeldec.png', 'image'],
	]);

	// Activate loading of save games by drag and drop
	canvas.addEventListener('dragover', function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	});

	canvas.addEventListener('drop', function(event) {
		event.stopPropagation();
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.addEventListener('load', readerEvent => {
			game.load_game(readerEvent.target.result);
		});
	});
};


Loader.prototype.finished_postloading = function(self) {
	if(game.stage.id === SCENE.LOADING) {
		self.phase = 3;
		self.percentage = 100;
		if(resources.get_status() - self.max_size !== 0) {
			console.warn('Expected size not real size. Diff is ' + (resources.get_status() - self.max_size) + ' Bytes');
		}

		self.redraw();
	}

	resources.on_ready(() => {});
};


Loader.prototype.render = function() {
	if(this.phase < 3) {
		if(!this.images_drawn && this.bar_pic && this.bg_pic && this.header_pic) {
			this.images_drawn = true;
			this.redraw();
		}
		else {
			this.draw_bar();
		}
	}
};


Loader.prototype.update = function() {
	if(this.phase < 3) {
		this.percentage = (resources.get_status() / this.max_size) * 100;
	}
};


Loader.prototype.next = function() {
	if(this.phase >= 2) {
		game.next_stage();
	}
};
