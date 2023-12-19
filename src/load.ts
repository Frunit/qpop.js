import type { Game } from "./game";
import { SCENE, draw_rect, draw_upper_left_border, local_load, multiline, write_text } from "./helper";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal } from "./types";

export class Load implements Stage {
	id = SCENE.LOAD_GAME;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private bg: HTMLImageElement;

	readonly dim: Dimension = [400, 386];
	readonly title_dim: Dimension = [400, 21];
	readonly abort_dim: Dimension = [181, 22];
	readonly button_dim: Dimension = [90, 22];
	readonly upload_dim: Dimension = [90, 66];
	readonly upload_area_dim: Dimension = [400, 82];
	readonly upload_text_dim: Dimension = [290, 66];
	readonly browser_area_dim: Dimension = [400, 286];

	readonly offset: Point = [120, 65];
	readonly title_offset: Point = [0, 0];
	readonly abort_offset: Point = [219, 365];
	readonly saves_offset: Point = [8, 109];
	readonly upload_area_offset: Point = [0, 20];
	readonly upload_offset: Point = [8, 28];
	readonly upload_text_offset: Point = [105, 65];
	readonly browser_area_offset: Point = [0, 101];
	readonly browser_text_offset: Point = [105, 109];

	readonly button_y_dist = 25;
	readonly line_height = 18;

	constructor(private game: Game, private glob: TechGlobal) {
		this.bg = this.glob.resources.get_image('gfx/dark_bg.png');
	}

	initialize() {
		this.redraw();

		this.glob.canvas.addEventListener('mouseup', this.init_upload.bind(this));
	}

	init_upload(e: MouseEvent) {
		const pos_x = e.x - this.glob.canvas_pos.left;
		const pos_y = e.y - this.glob.canvas_pos.top;
	
		if(pos_x >= this.offset[0] + this.upload_offset[0] &&
			pos_x <= this.offset[0] + this.upload_offset[0] + this.upload_dim[0] &&
			pos_y >= this.offset[1] + this.upload_offset[1] &&
			pos_y <= this.offset[1] + this.upload_offset[1] + this.upload_dim[1])
		{
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.qpp';
	
			input.addEventListener('change', (event) => {
				this.glob.canvas.removeEventListener('mouseup', this.init_upload);
				const files = (event.target as HTMLInputElement | null)?.files;
				if(!files) {
					return;
				}
				const file = files[0];
				const reader = new FileReader();
				reader.readAsArrayBuffer(file);
	
				reader.addEventListener('load', (readerEvent) => {
					if(readerEvent.target?.result) {
						// ArrayBuffer given by function `readAsArrayBuffer` above
						this.game.load_game(readerEvent.target.result as ArrayBuffer);
					}
				});
			});
	
			input.click();
		}
	}

	redraw() {
		this.glob.ctx.drawImage(this.bg,
			0, 0,
			this.dim[0], this.dim[1],
			this.offset[0], this.offset[1],
			this.dim[0], this.dim[1]);

		draw_rect(this.glob.ctx, [this.offset[0], this.offset[1] + this.title_dim[1] - 1], [this.dim[0], this.dim[1] - this.title_dim[1] + 1], true);

		this.clickareas = [];

		// Title
		draw_rect(this.glob.ctx, [this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
		write_text(this.glob.ctx, this.glob.lang.load_game, [this.offset[0] + this.title_offset[0] + this.title_dim[0] / 2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

		// Upload area
		draw_rect(this.glob.ctx, [this.offset[0] + this.upload_area_offset[0], this.offset[1] + this.upload_area_offset[1]], this.upload_area_dim);

		// Upload button
		draw_rect(this.glob.ctx, [this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim);
		let lines = multiline(this.glob.ctx, this.glob.lang.upload, this.upload_dim[0] - 10);
		let line_correction = this.line_height * (lines.length - 1) / 2;
		for (let i = 0; i < lines.length; i++) {
			write_text(this.glob.ctx, lines[i], [this.offset[0] + this.upload_offset[0] + this.upload_dim[0] / 2, this.offset[1] + this.upload_text_offset[1] - line_correction + this.line_height * i], 'white', 'black');
		}

		// Upload description text
		lines = multiline(this.glob.ctx, this.glob.lang.upload_description, this.upload_text_dim[0]);
		line_correction = this.line_height * (lines.length - 1) / 2;
		for (let i = 0; i < lines.length; i++) {
			write_text(this.glob.ctx, lines[i], [this.offset[0] + this.upload_text_offset[0], this.offset[1] + this.upload_text_offset[1] - line_correction + this.line_height * i], 'white', 'black', 'left');
		}

		this.clickareas.push({
			x1: this.offset[0] + this.upload_offset[0],
			y1: this.offset[1] + this.upload_offset[1],
			x2: this.offset[0] + this.upload_offset[0] + this.upload_dim[0],
			y2: this.offset[1] + this.upload_offset[1] + this.upload_dim[1],
			down: () => draw_rect(this.glob.ctx, [this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim, true, true),
			up: () => draw_rect(this.glob.ctx, [this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim),
			blur: () => draw_rect(this.glob.ctx, [this.offset[0] + this.upload_offset[0], this.offset[1] + this.upload_offset[1]], this.upload_dim)
		});

		// Browser save game list
		draw_rect(this.glob.ctx, [this.offset[0] + this.browser_area_offset[0], this.offset[1] + this.browser_area_offset[1]], this.browser_area_dim);
		const save_array = local_load('save');
		if (!Array.isArray(save_array) || save_array[0] === null) {
			const lines = multiline(this.glob.ctx, this.glob.lang.no_local_saves, this.upload_text_dim[0]);
			const line_correction = this.line_height * (lines.length - 1) / 2;
			for (let i = 0; i < lines.length; i++) {
				write_text(this.glob.ctx, lines[i], [this.offset[0] + this.dim[0] / 2, this.offset[1] + this.browser_area_offset[1] + this.browser_area_dim[1] / 2 - line_correction + this.button_dim[1] * i], 'white', 'black');
			}
		}
		else {
			for (let i = 0; i < save_array.length; i++) {
				if (save_array[i] === null) {
					break;
				}
				// Button
				draw_rect(this.glob.ctx, [this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist * i], this.button_dim);
				write_text(this.glob.ctx, this.glob.lang.load, [this.offset[0] + this.saves_offset[0] + this.button_dim[0] / 2, this.offset[1] + this.saves_offset[1] + this.button_y_dist * i + 15], 'white', 'black');

				// Description
				write_text(this.glob.ctx, `${(new Date(save_array[i].datetime)).toLocaleString()} - ${this.glob.lang.turn} ${save_array[i].turn}`, [this.offset[0] + this.browser_text_offset[0], this.offset[1] + this.browser_text_offset[1] + this.button_y_dist * i + 15], 'white', 'black', 'left');

				this.clickareas.push({
					x1: this.offset[0] + this.saves_offset[0],
					y1: this.offset[1] + this.saves_offset[1] + this.button_y_dist * i,
					x2: this.offset[0] + this.saves_offset[0] + this.button_dim[0],
					y2: this.offset[1] + this.saves_offset[1] + this.button_dim[1] + this.button_y_dist * i,
					down: () => draw_rect(this.glob.ctx, [this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist * i], this.button_dim, true, true),
					up: () => this.load(i),
					blur: () => draw_rect(this.glob.ctx, [this.offset[0] + this.saves_offset[0], this.offset[1] + this.saves_offset[1] + this.button_y_dist * i], this.button_dim)
				});
			}
		}

		// Abort button
		draw_rect(this.glob.ctx, [this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim);
		write_text(this.glob.ctx, this.glob.lang.close, [this.offset[0] + this.abort_offset[0] + this.abort_dim[0] / 2, this.offset[1] + this.abort_offset[1] + 15], 'white', 'black');

		this.clickareas.push({
			x1: this.offset[0] + this.abort_offset[0],
			y1: this.offset[1] + this.abort_offset[1],
			x2: this.offset[0] + this.abort_offset[0] + this.abort_dim[0],
			y2: this.offset[1] + this.abort_offset[1] + this.abort_dim[1],
			down: () => draw_rect(this.glob.ctx, [this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim, true, true),
			up: () => this.close(),
			blur: () => draw_rect(this.glob.ctx, [this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim)
		});

		// Grey border
		draw_upper_left_border(this.glob.ctx, [this.offset[0] + this.abort_offset[0], this.offset[1] + this.abort_offset[1]], this.abort_dim);

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.close(), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => this.close(), 'reset': true },
		];
	}

	render() {
	}

	update() {
	}

	load(num: number) {
		this.glob.canvas.removeEventListener('mouseup', this.init_upload);
		this.game.backstage = [];
		this.game.load_locally(num);
	}

	close() {
		this.glob.canvas.removeEventListener('mouseup', this.init_upload);
		this.game.get_last_stage();
	}
}
