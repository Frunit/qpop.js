import type { Game } from "./game";
import { SCENE, draw_base, draw_checkbox, draw_rect, write_text } from "./helper";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal } from "./types";

export class ResourceLoader implements Stage {
	id = SCENE.LOADING;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private glob: TechGlobal;
	private game: Game;

	private bg_pic: HTMLImageElement | null = null;
	private header_pic: HTMLImageElement | null = null;
	private bar_pic: HTMLImageElement | null = null;
	private max_size = 0;
	private suffix = '.mp3';
	private phase = 0;
	private percentage = 0;
	private images_drawn = false;

	readonly header_dim: Dimension = [236, 78];
	readonly bar_dim: Dimension = [300, 16];
	readonly start_dim: Dimension = [200, 50];
	readonly x_dim: Dimension = [12, 12];

	readonly header_offset: Point = [202, 50];
	readonly subtitle_offset: Point = [320, 190];
	readonly bar_offset: Point = [170, 350];
	readonly percent_offset: Point = [320, 362];
	readonly start_offset: Point = [220, 250];
	readonly emptybar_soffset: Point = [300, 80];
	readonly bar_soffsets: Point[] = [[300, 64], [0, 64], [300, 48], [0, 48], [300, 32], [0, 32], [300, 16], [300, 16], [0, 16], [300, 0]];

	readonly checkbox_x = 30;
	readonly text_x = 50;
	readonly text_y_offset = 12;
	readonly tutorial_offset = 450;

	// Get size with `du -c -b *.m4a`
	readonly img_size = 1236659;
	readonly mp3_size = 8603397;
	readonly ogg_size = 12314468;
	readonly m4a_size = 8839096;

	constructor(game: Game, glob: TechGlobal) {
		this.game = game;
		this.glob = glob;
	}

	initialize() {
		this.glob.canvas.style.cursor = 'default';
		this.phase = 0;
		this.percentage = 0;
		this.redraw();

		this.suffix = this.glob.resources.get_suffix();
		this.max_size = this.img_size;
		if (this.suffix === '.m4a') {
			this.max_size += this.m4a_size;
		}
		else if (this.suffix === '.ogg') {
			this.max_size += this.ogg_size;
		}
		else if (this.suffix === '.mp3') {
			this.max_size += this.mp3_size;
		}
		else {
			this.game.disable_audio();
		}

		this.glob.resources.on_ready(this.finished_preloading, this);
		this.glob.resources.load([
			{url: 'gfx/dark_bg.png', type: 'image'},
			{url: 'gfx/mutations.png', type: 'image'},
			{url: 'gfx/header.png', type: 'image'},
			{url: 'gfx/gui.png', type: 'image'},
		]);
	}

	redraw() {
		if (this.phase === 0) {
			// background
			this.glob.ctx.save();
			this.glob.ctx.beginPath();
			this.glob.ctx.rect(0.5, 0.5, this.glob.canvas.width - 1, this.glob.canvas.height - 1);
			this.glob.ctx.fillStyle = '#a3a3a3';
			this.glob.ctx.strokeStyle = '#000000';
			this.glob.ctx.fill();
			this.glob.ctx.stroke();
			this.glob.ctx.restore();

			// Title
			this.glob.ctx.save();
			this.glob.ctx.textAlign = 'center';
			this.glob.ctx.textBaseline = 'top';
			this.glob.ctx.font = 'bold 100px serif';
			this.glob.ctx.fillStyle = '#0000ff';
			this.glob.ctx.fillText('Q-POP', this.header_offset[0] + Math.floor(this.header_dim[0] / 2), this.header_offset[1]);
			this.glob.ctx.restore();
		}
		else { // phase is 1 or 2
			// Delete previous drawings completely to avoid Q-POP graphic and
			// text above each other if loading is asynchronous
			this.glob.ctx.save();
			this.glob.ctx.beginPath();
			this.glob.ctx.rect(0.5, 0.5, this.glob.canvas.width - 1, this.glob.canvas.height - 1);
			this.glob.ctx.fillStyle = '#a3a3a3';
			this.glob.ctx.strokeStyle = '#000000';
			this.glob.ctx.fill();
			this.glob.ctx.stroke();
			this.glob.ctx.restore();

			draw_base(this.glob, this.id);
			draw_rect(this.glob.ctx, [0, 20], [640, 460]); // Main rectangle

			this.glob.ctx.drawImage(this.header_pic!, this.header_offset[0], this.header_offset[1]);
		}

		// Subtitle
		this.glob.ctx.save();
		this.glob.ctx.textAlign = 'center';
		this.glob.ctx.font = 'bold 30px sans-serif';
		this.glob.ctx.textAlign = 'center';
		this.glob.ctx.fillStyle = '#00ffff';
		this.glob.ctx.fillText(this.glob.lang.subtitle, this.subtitle_offset[0] - 1, this.subtitle_offset[1] - 1);
		this.glob.ctx.fillStyle = '#000080';
		this.glob.ctx.fillText(this.glob.lang.subtitle, this.subtitle_offset[0] + 2, this.subtitle_offset[1] + 2);
		this.glob.ctx.fillStyle = '#0000ff';
		this.glob.ctx.fillText(this.glob.lang.subtitle, this.subtitle_offset[0], this.subtitle_offset[1]);
		this.glob.ctx.restore();

		this.draw_bar();

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		// Loading/Starting button
		draw_rect(this.glob.ctx, this.start_offset, this.start_dim);
		const text_x = this.start_offset[0] + Math.floor(this.start_dim[0] / 2);
		const text_y = this.start_offset[1] + this.start_dim[1] - 18;

		if (this.phase < 2) {
			this.glob.ctx.save();
			this.glob.ctx.textAlign = 'center';
			this.glob.ctx.font = 'bold 24px sans-serif';
			this.glob.ctx.fillStyle = 'white';
			this.glob.ctx.fillText(this.glob.lang.loading, text_x + 2, text_y + 2);
			this.glob.ctx.fillStyle = 'grey';
			this.glob.ctx.fillText(this.glob.lang.loading, text_x, text_y);
			this.glob.ctx.restore();
		}
		else {
			// MAYBE: Check if music is playable and proceed without waiting for the click of the user
			this.glob.ctx.save();
			this.glob.ctx.textAlign = 'center';
			this.glob.ctx.font = 'bold 24px sans-serif';
			this.glob.ctx.fillStyle = 'white';
			this.glob.ctx.fillText(this.glob.lang.start_game, text_x + 2, text_y + 2);
			this.glob.ctx.fillStyle = 'black';
			this.glob.ctx.fillText(this.glob.lang.start_game, text_x, text_y);
			this.glob.ctx.restore();

			this.clickareas.push({
				x1: this.start_offset[0],
				y1: this.start_offset[1],
				x2: this.start_offset[0] + this.start_dim[0],
				y2: this.start_offset[1] + this.start_dim[1],
				down: () => draw_rect(this.glob.ctx, this.start_offset, this.start_dim, true, true),
				up: () => this.game.next_stage(),
				blur: () => draw_rect(this.glob.ctx, this.start_offset, this.start_dim)
			});
		}

		if (this.phase > 0) {
			// Show tutorial
			draw_checkbox(this.glob.ctx, this.glob.resources, [this.checkbox_x, this.tutorial_offset], this.glob.options.tutorial);
			write_text(this.glob.ctx, this.glob.lang.options_tutorial, [this.text_x, this.tutorial_offset + this.text_y_offset], '#000000', '#ffffff', 'left');
			this.clickareas.push({
				x1: this.checkbox_x,
				y1: this.tutorial_offset,
				x2: this.checkbox_x + this.x_dim[0] + 2,
				y2: this.tutorial_offset + this.x_dim[1] + 2,
				down: () => { },
				up: () => this.game.toggle_tutorial([this.checkbox_x, this.tutorial_offset]),
				blur: () => { }
			});
		}

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.next(), 'reset': true },
		];
	}

	draw_bar() {
		if (this.phase === 0) {
			this.glob.ctx.save();
			this.glob.ctx.translate(0.5, 0.5);
			this.glob.ctx.lineWidth = 1;
			this.glob.ctx.beginPath();
			this.glob.ctx.rect(this.bar_offset[0], this.bar_offset[1], this.bar_dim[0], this.bar_dim[1]);
			this.glob.ctx.strokeStyle = '#000000';
			this.glob.ctx.stroke();

			this.glob.ctx.beginPath();
			this.glob.ctx.rect(this.bar_offset[0], this.bar_offset[1], Math.floor(this.percentage * 3), this.bar_dim[1]);
			this.glob.ctx.fillStyle = '#9a4155';
			this.glob.ctx.fill();
			this.glob.ctx.restore();
		}
		else {
			const length = Math.floor(this.percentage * 3 - 3);

			this.glob.ctx.drawImage(this.bar_pic!,
				this.emptybar_soffset[0], this.emptybar_soffset[1],
				this.bar_dim[0], this.bar_dim[1],
				this.bar_offset[0], this.bar_offset[1],
				this.bar_dim[0], this.bar_dim[1]);

			if (length > 0) {
				const soffset = this.bar_soffsets[Math.min(9, Math.floor(this.percentage / 10))];

				// Main bar
				this.glob.ctx.drawImage(this.bar_pic!,
					soffset[0], soffset[1],
					length, this.bar_dim[1],
					this.bar_offset[0], this.bar_offset[1],
					length, this.bar_dim[1]);
				// Last bit
				this.glob.ctx.drawImage(this.bar_pic!,
					soffset[0] + this.bar_dim[0] - 3, soffset[1],
					3, this.bar_dim[1],
					this.bar_offset[0] + length, this.bar_offset[1],
					3, this.bar_dim[1]);
			}
		}

		write_text(this.glob.ctx, `${this.percentage.toFixed(2)}%`, [this.percent_offset[0], this.percent_offset[1]]);
	}

	finished_preloading(self: ResourceLoader) {
		self.bg_pic = this.glob.resources.get_image('gfx/dark_bg.png');
		self.header_pic = this.glob.resources.get_image('gfx/header.png');
		self.bar_pic = this.glob.resources.get_image('gfx/mutations.png');
		self.phase = 1;

		self.redraw();

		this.glob.resources.on_ready(self.finished_loading, self);
		this.glob.resources.load([
			{url: 'gfx/background.png', type: 'image'},
			{url: 'gfx/clouds.png', type: 'image'},
			{url: 'gfx/electro.png', type: 'image'},
			{url: 'gfx/enemies.png', type: 'image'},
			{url: 'gfx/github.png', type: 'image'},
			{url: 'gfx/init.png', type: 'image'},
			{url: 'gfx/light_bg.png', type: 'image'},
			{url: 'gfx/pred1.png', type: 'image'},
			{url: 'gfx/pred2.png', type: 'image'},
			{url: 'gfx/pred3.png', type: 'image'},
			{url: 'gfx/ranking.png', type: 'image'},
			{url: 'gfx/spec1.png', type: 'image'},
			{url: 'gfx/spec2.png', type: 'image'},
			{url: 'gfx/spec3.png', type: 'image'},
			{url: 'gfx/spec4.png', type: 'image'},
			{url: 'gfx/spec5.png', type: 'image'},
			{url: 'gfx/spec6.png', type: 'image'},
			{url: 'gfx/species.png', type: 'image'},
			{url: 'gfx/survival_gui.png', type: 'image'},
			{url: 'gfx/transition_mutations.png', type: 'image'},
			{url: 'gfx/transition_survival.png', type: 'image'},
			{url: 'gfx/transition_world.png', type: 'image'},
			{url: 'gfx/turns.png', type: 'image'},
			{url: 'gfx/tutorial.png', type: 'image'},
			{url: 'gfx/world_gui.png', type: 'image'},
			{url: 'gfx/world.png', type: 'image'},
			{url: 'gfx/wreath.png', type: 'image'},
			{url: 'sfx/intro', type: 'audio', name: 'intro'},
			{url: 'sfx/spec1', type: 'audio', name: 'spec0'},
			{url: 'sfx/spec2', type: 'audio', name: 'spec1'},
			{url: 'sfx/spec3', type: 'audio', name: 'spec2'},
			{url: 'sfx/spec4', type: 'audio', name: 'spec3'},
			{url: 'sfx/spec5', type: 'audio', name: 'spec4'},
			{url: 'sfx/spec6', type: 'audio', name: 'spec5'},
			{url: 'sfx/ranking', type: 'audio', name: 'ranking'},
			{url: 'sfx/dino_cry', type: 'audio', name: 'dino_cry'},
			{url: 'sfx/dino_win', type: 'audio', name: 'dino_win'},
			{url: 'sfx/electro', type: 'audio', name: 'electro'},
			{url: 'sfx/feeding_chuck', type: 'audio', name: 'feeding_chuck'},
			{url: 'sfx/feeding_kiwi', type: 'audio', name: 'feeding_kiwi'},
			{url: 'sfx/feeding', type: 'audio', name: 'feeding'},
			{url: 'sfx/female_amorph', type: 'audio', name: 'female_amorph'},
			{url: 'sfx/female_chuck', type: 'audio', name: 'female_chuck'},
			{url: 'sfx/female_kiwi', type: 'audio', name: 'female_kiwi'},
			{url: 'sfx/female_pesci', type: 'audio', name: 'female_pesci'},
			{url: 'sfx/female_purplus', type: 'audio', name: 'female_purplus'},
			{url: 'sfx/human_base', type: 'audio', name: 'human_base'},
			{url: 'sfx/human_win', type: 'audio', name: 'human_win'},
			{url: 'sfx/love', type: 'audio', name: 'love'},
			{url: 'sfx/mushroom_win', type: 'audio', name: 'mushroom_win'},
			{url: 'sfx/offspring_amorph', type: 'audio', name: 'offspring_amorph'},
			{url: 'sfx/offspring_chuck', type: 'audio', name: 'offspring_chuck'},
			{url: 'sfx/offspring_kiwi', type: 'audio', name: 'offspring_kiwi'},
			{url: 'sfx/offspring_pesci', type: 'audio', name: 'offspring_pesci'},
			{url: 'sfx/offspring_purplus', type: 'audio', name: 'offspring_purplus'},
			{url: 'sfx/poison', type: 'audio', name: 'poison'},
			{url: 'sfx/posion_chuck', type: 'audio', name: 'poison_chuck'},
			{url: 'sfx/power_food', type: 'audio', name: 'power_food'},
			{url: 'sfx/quicksand', type: 'audio', name: 'quicksand'},
			{url: 'sfx/survival_fight', type: 'audio', name: 'survival_fight'},
			{url: 'sfx/swamp', type: 'audio', name: 'swamp'},
			{url: 'sfx/volcano', type: 'audio', name: 'volcano'},
			{url: 'sfx/win_kiwi', type: 'audio', name: 'win_kiwi'},
			{url: 'sfx/win_pesci', type: 'audio', name: 'win_pesci'},
			{url: 'sfx/win', type: 'audio', name: 'win'},
			{url: 'sfx/world_fight', type: 'audio', name: 'world_fight'},
			{url: 'anim_gfx/alpha.png', type: 'image'},
			{url: 'anim_gfx/amoesaug.png', type: 'image'},
			{url: 'anim_gfx/amoeweg.png', type: 'image'},
			{url: 'anim_gfx/asche.png', type: 'image'},
			{url: 'anim_gfx/balken.png', type: 'image'},
			{url: 'anim_gfx/boschild.png', type: 'image'},
			{url: 'anim_gfx/elektro.png', type: 'image'},
			{url: 'anim_gfx/fegesek.png', type: 'image'},
			{url: 'anim_gfx/haschild.png', type: 'image'},
			{url: 'anim_gfx/intfru1.png', type: 'image'},
			{url: 'anim_gfx/intfru2.png', type: 'image'},
			{url: 'anim_gfx/intfru3.png', type: 'image'},
			{url: 'anim_gfx/intfru.png', type: 'image'},
			{url: 'anim_gfx/inthai.png', type: 'image'},
			{url: 'anim_gfx/introme2.png', type: 'image'},
			{url: 'anim_gfx/intropil.png', type: 'image'},
			{url: 'anim_gfx/intsek1.png', type: 'image'},
			{url: 'anim_gfx/kiwi2.png', type: 'image'},
			{url: 'anim_gfx/kuh1.png', type: 'image'},
			{url: 'anim_gfx/laken2.png', type: 'image'},
			{url: 'anim_gfx/planeten.png', type: 'image'},
			{url: 'anim_gfx/pophin1.png', type: 'image'},
			{url: 'anim_gfx/pophin.png', type: 'image'},
			{url: 'anim_gfx/posilich.png', type: 'image'},
			{url: 'anim_gfx/radar.png', type: 'image'},
			{url: 'anim_gfx/saugsek.png', type: 'image'},
			{url: 'anim_gfx/schipop2.png', type: 'image'},
			{url: 'anim_gfx/space.png', type: 'image'},
			{url: 'anim_gfx/station2.png', type: 'image'},
			{url: 'anim_gfx/staub.png', type: 'image'},
			{url: 'anim_gfx/tafelfru.png', type: 'image'},
			{url: 'anim_gfx/ufos.png', type: 'image'},
		]);
	}

	finished_loading(self: ResourceLoader) {
		self.phase = 2;

		self.redraw();

		this.glob.resources.on_ready(self.finished_postloading, self);
		this.glob.resources.load([
			{url: 'sfx/catastrophe', type: 'audio', name: 'catastrophe'},
			{url: 'sfx/outro', type: 'audio', name: 'outro'},
			{url: 'anim_gfx/amoegro.png', type: 'image'},
			{url: 'anim_gfx/baumbebe.png', type: 'image'},
			{url: 'anim_gfx/baumbe.png', type: 'image'},
			{url: 'anim_gfx/baumgro.png', type: 'image'},
			{url: 'anim_gfx/bauwas.png', type: 'image'},
			{url: 'anim_gfx/beben1.png', type: 'image'},
			{url: 'anim_gfx/beben2.png', type: 'image'},
			{url: 'anim_gfx/beben3.png', type: 'image'},
			{url: 'anim_gfx/beben.png', type: 'image'},
			{url: 'anim_gfx/eisfru.png', type: 'image'},
			{url: 'anim_gfx/eiswolk.png', type: 'image'},
			{url: 'anim_gfx/fisch.png', type: 'image'},
			{url: 'anim_gfx/floss.png', type: 'image'},
			{url: 'anim_gfx/gras.png', type: 'image'},
			{url: 'anim_gfx/hai1.png', type: 'image'},
			{url: 'anim_gfx/hai2.png', type: 'image'},
			{url: 'anim_gfx/hai3.png', type: 'image'},
			{url: 'anim_gfx/hai4.png', type: 'image'},
			{url: 'anim_gfx/kaefer.png', type: 'image'},
			{url: 'anim_gfx/kastro1.png', type: 'image'},
			{url: 'anim_gfx/kastro2a.png', type: 'image'},
			{url: 'anim_gfx/kastro3.png', type: 'image'},
			{url: 'anim_gfx/kastro4.png', type: 'image'},
			{url: 'anim_gfx/kastro5.png', type: 'image'},
			{url: 'anim_gfx/knall.png', type: 'image'},
			{url: 'anim_gfx/krone.png', type: 'image'},
			{url: 'anim_gfx/kuh2.png', type: 'image'},
			{url: 'anim_gfx/kuhtot.png', type: 'image'},
			{url: 'anim_gfx/meteor.png', type: 'image'},
			{url: 'anim_gfx/palme.png', type: 'image'},
			{url: 'anim_gfx/pilzkle.png', type: 'image'},
			{url: 'anim_gfx/pubeben.png', type: 'image'},
			{url: 'anim_gfx/qpopfruk.png', type: 'image'},
			{url: 'anim_gfx/rakete.png', type: 'image'},
			{url: 'anim_gfx/rakrauch.png', type: 'image'},
			{url: 'anim_gfx/rampe.png', type: 'image'},
			{url: 'anim_gfx/schnee.png', type: 'image'},
			{url: 'anim_gfx/see.png', type: 'image'},
			{url: 'anim_gfx/seuvieh.png', type: 'image'},
			{url: 'anim_gfx/sonne2.png', type: 'image'},
			{url: 'anim_gfx/sonne.png', type: 'image'},
			{url: 'anim_gfx/sputnik.png', type: 'image'},
			{url: 'anim_gfx/stuhl.png', type: 'image'},
			{url: 'anim_gfx/tuer2.png', type: 'image'},
			{url: 'anim_gfx/tuer.png', type: 'image'},
			{url: 'anim_gfx/typ.png', type: 'image'},
			{url: 'anim_gfx/vulkan1.png', type: 'image'},
			{url: 'anim_gfx/vulkan2.png', type: 'image'},
			{url: 'anim_gfx/vulkan.png', type: 'image'},
			{url: 'anim_gfx/vulkfru.png', type: 'image'},
			{url: 'anim_gfx/welle.png', type: 'image'},
			{url: 'anim_gfx/dino.png', type: 'image'},
			{url: 'anim_gfx/endamoe.png', type: 'image'},
			{url: 'anim_gfx/endfru.png', type: 'image'},
			{url: 'anim_gfx/endhai2.png', type: 'image'},
			{url: 'anim_gfx/endhai.png', type: 'image'},
			{url: 'anim_gfx/endkaef.png', type: 'image'},
			{url: 'anim_gfx/endtext.png', type: 'image'},
			{url: 'anim_gfx/flugmobi.png', type: 'image'},
			{url: 'anim_gfx/hintend1.png', type: 'image'},
			{url: 'anim_gfx/hintend.png', type: 'image'},
			{url: 'anim_gfx/hunter.png', type: 'image'},
			{url: 'anim_gfx/minidino.png', type: 'image'},
			{url: 'anim_gfx/minipilz.png', type: 'image'},
			{url: 'anim_gfx/nest1.png', type: 'image'},
			{url: 'anim_gfx/nest.png', type: 'image'},
			{url: 'anim_gfx/schiff1.png', type: 'image'},
			{url: 'anim_gfx/schiff.png', type: 'image'},
			{url: 'anim_gfx/statuen.png', type: 'image'},
			{url: 'anim_gfx/tafeldec.png', type: 'image'},
		]);

		// Activate loading of save games by drag and drop
		this.glob.canvas.addEventListener('dragover', event => {
			event.stopPropagation();
			event.preventDefault();
			if(event.dataTransfer !== null) {
				event.dataTransfer.dropEffect = 'copy';
			}
		});

		this.glob.canvas.addEventListener('drop', event => {
			event.stopPropagation();
			event.preventDefault();
			if(event.dataTransfer === null) {
				return;
			}
			const file = event.dataTransfer.files[0];
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.addEventListener('load', readerEvent => {
				if(readerEvent.target?.result) {
					// ArrayBuffer given by function `readAsArrayBuffer` above
					this.game.load_game(readerEvent.target.result as ArrayBuffer);
				}
			});
		});
	}

	finished_postloading(self: ResourceLoader) {
		if (this.game.stage.id === SCENE.LOADING) {
			self.phase = 3;
			self.percentage = 100;
			if (this.glob.resources.get_status() - self.max_size !== 0) {
				console.warn(`Expected size not real size. Diff is ${this.glob.resources.get_status() - self.max_size} Bytes`);
			}

			self.redraw();
		}

		this.glob.resources.on_ready(() => { });
	}

	render() {
		if (this.phase < 3) {
			if (!this.images_drawn && this.bar_pic && this.bg_pic && this.header_pic) {
				this.images_drawn = true;
				this.redraw();
			}
			else {
				this.draw_bar();
			}
		}
	}

	update() {
		if (this.phase < 3) {
			this.percentage = (this.glob.resources.get_status() / this.max_size) * 100;
		}
	}

	next() {
		if (this.phase >= 2) {
			this.game.next_stage();
		}
	}
}
