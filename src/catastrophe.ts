import { Animation } from './animation';
import { catastrophe_frames } from './frames';
import { SCENE, draw_black_rect, draw_inv_rect, draw_rect, random_int, write_text } from './helper';
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal } from './types';

export class Catastrophe implements Stage {
	id = SCENE.CATASTROPHE;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private bg: HTMLImageElement;
	private callback: (type: number) => void;
	private animation: Animation | null = null;
	private type: number;

	readonly dim: Point = [360, 300];
	readonly title_dim: Dimension = [360, 21];
	readonly anim_dim: Dimension = [320, 240];
	readonly offset: Point = [140, 90];
	readonly title_offset: Point = [140, 90];
	readonly anim_offset: Point = [160, 130];

	constructor(
		private glob: TechGlobal,
		callback: (type: number) => void,
	) {
		this.callback = callback;

		this.bg = this.glob.resources.get_image('gfx/dark_bg.png');

		this.type = random_int(0, 8);
	}

	initialize() {
		this.glob.resources.play_music('catastrophe');
		this.glob.canvas.style.cursor = 'default';
		this.animation = new Animation(this.glob, catastrophe_frames[this.type], this.anim_offset);
		this.redraw();
	}
	redraw() {
		// Background
		this.glob.ctx.drawImage(this.bg, 0, 0, this.dim[0], this.dim[1], this.offset[0], this.offset[1], this.dim[0], this.dim[1]);

		// Black rect around whole catastrophe window
		draw_black_rect(this.glob.ctx, [this.offset[0], this.offset[1]], [this.dim[0] - 1, this.dim[1] - 1]);

		// Title
		draw_rect(this.glob.ctx, [this.title_offset[0], this.title_offset[1]], this.title_dim);
		write_text(
			this.glob.ctx,
			this.glob.lang.catastrophe,
			[this.title_offset[0] + this.title_dim[0] / 2, this.title_offset[1] + 15],
			'white',
			'black',
		);

		// Rect around main part
		draw_rect(
			this.glob.ctx,
			[this.offset[0], this.offset[1] + this.title_dim[1] - 1],
			[this.dim[0], this.dim[1] - this.title_dim[1] + 1],
			true,
		);

		// Rect around animation
		draw_inv_rect(this.glob.ctx, [this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

		this.clickareas = [];

		this.clickareas.push({
			x1: this.anim_offset[0],
			y1: this.anim_offset[1],
			x2: this.anim_offset[0] + this.anim_dim[0],
			y2: this.anim_offset[1] + this.anim_dim[1],
			down: () => {},
			up: () => this.end(),
			blur: () => {},
		});

		this.keys = [
			{ key: 'ENTER', action: () => this.end(), reset: true },
			{ key: 'ESCAPE', action: () => this.end(), reset: true },
		];
	}

	render() {
		if (this.animation !== null) {
			this.animation.render();
		}
	}

	update() {
		if (this.animation !== null) {
			if (this.animation.has_stopped) {
				this.end();
			} else {
				this.animation.step();
			}
		}
	}

	private end() {
		this.callback(this.type); // also redraws
	}
}
