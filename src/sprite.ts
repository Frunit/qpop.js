import { Dimension, Point } from "./types";

export interface ISprite {
	finished: boolean;
	callback: Function | null;
	update: Function;
	reset: Function;
	is_new_frame: Function;
	render: Function;
}

export class Sprite implements ISprite {
	finished: boolean
	callback: Function | null;

	private pic: HTMLImageElement;
	private offset: Point;
	private size: Dimension;
	private delay: number;
	private frames: Point[];
	private once: boolean;

	private idx = 0;
	private fresh = true;
	private delay_counter = 0;


	constructor(pic: HTMLImageElement, offset: Point = [0, 0], frames: Point[] = [[0, 0]], delay = 0, size: Dimension = [64, 64], once = false, callback: Function | null = null) {
		this.pic = pic;
		this.offset = offset;
		this.size = size;
		this.delay = delay;
		this.frames = frames;
		this.once = once;
		this.callback = callback;
		this.delay_counter = 0;
		this.idx = 0;
		this.fresh = true;
		this.finished = frames.length === 1; // true for one-frame Sprites; false for others
	}

	update() {
		if (!this.finished) {
			this.delay_counter++;

			if (this.delay_counter >= this.delay) {
				this.delay_counter = 0;
				this.idx++;

				if (this.once && this.idx === this.frames.length) {
					this.idx--; // Let the index point to the last frame (i.e. this.frames.length - 1)
					this.finished = true;
				}
			}
		}
	}

	reset() {
		this.idx = 0;
		this.delay_counter = 0;
		this.fresh = true;
		this.finished = this.frames.length === 1;
	}

	is_new_frame() {
		if (this.fresh) {
			this.fresh = false;
			return true;
		}

		return this.delay_counter === 0 && !this.finished;
	}

	render(ctx: CanvasRenderingContext2D, pos: Point) {
		const real_idx = this.idx % this.frames.length;
		const frame = this.frames[real_idx];

		ctx.drawImage(this.pic,
			this.offset[0] + frame[0], this.offset[1] + frame[1],
			this.size[0], this.size[1],
			pos[0], pos[1],
			this.size[0], this.size[1]);
	}
}


export class RandomSprite implements ISprite {
	finished = false;
	callback = null;

	private transitions: number[][];
	private sprites: Sprite[] = [];
	private current_sprite: Sprite;

	private current_idx = 0;

	constructor(pic: HTMLImageElement, offset: Point = [0, 0], frames: Point[][] = [[[0, 0]]], transitions: number[][] = [[1]], delay = 0, size: Dimension = [64, 64]) {
		this.transitions = transitions;
		for (const sprite_frames of frames) {
			this.sprites.push(new Sprite(pic, offset, sprite_frames, delay, size, true));
		}
		this.current_sprite = this.sprites[this.current_idx];
	}

	update() {
		this.current_sprite.update();
		if (this.current_sprite.finished) {
			const rand = Math.random();
			const trans = this.transitions[this.current_idx];
			for (let new_idx = 0; new_idx < trans.length; new_idx++) {
				if (rand < trans[new_idx]) {
					this.current_idx = new_idx;
					this.current_sprite = this.sprites[new_idx];
					this.current_sprite.reset();
					break;
				}
			}
		}
	}

	reset() {
		this.current_sprite.reset();
	}

	is_new_frame() {
		return this.current_sprite.is_new_frame();
	}

	render(ctx: CanvasRenderingContext2D, pos: Point) {
		this.current_sprite.render(ctx, pos);
	}
}
