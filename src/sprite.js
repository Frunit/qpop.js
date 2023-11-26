
export class Sprite {
	constructor(url, offset = [0, 0], frames = [[0, 0]], delay = 0, size = [64, 64], once = false, callback = null) {
		this.pic = resources.get(url);
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
	render(ctx, pos) {
		const real_idx = this.idx % this.frames.length;
		const frame = this.frames[real_idx];

		ctx.drawImage(this.pic,
			this.offset[0] + frame[0], this.offset[1] + frame[1],
			this.size[0], this.size[1],
			pos[0], pos[1],
			this.size[0], this.size[1]);
	}
}


export class RandomSprite {
	constructor(url, offset = [0, 0], frames = [[[0, 0]]], transitions = [[1]], delay = 0, size = [64, 64]) {
		this.transitions = transitions;
		this.finished = false;
		this.current_idx = 0;
		this.sprites = [];
		for (let sprite_frames of frames) {
			this.sprites.push(new Sprite(url, offset, sprite_frames, delay, size, true));
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
	render(ctx, pos) {
		this.current_sprite.render(ctx, pos);
	}
}
