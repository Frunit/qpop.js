// MAYBE: Subtitles for some animations? (Intro and Outro text)

import { AnimationType, Point, TechGlobal } from './types';

type DrawImageExpected =
	| [HTMLImageElement, number, number]
	| [HTMLImageElement, number, number, number, number]
	| [HTMLImageElement, number, number, number, number, number, number, number, number];

export class Animation {
	has_stopped = false;

	private animation: AnimationType;
	private pics: HTMLImageElement[];
	private bg: HTMLImageElement;
	private offset: Point;
	private to_render: DrawImageExpected[] = [];
	private glob: TechGlobal;

	constructor(glob: TechGlobal, animation: AnimationType, offset: Point) {
		this.glob = glob;
		this.animation = structuredClone(animation);
		this.offset = offset;

		this.pics = [];
		for (let i = 0; i < this.animation.imgs.length; i++) {
			this.pics.push(glob.resources.get_image(this.animation.imgs[i][0]));
		}

		this.bg = glob.resources.get_image(this.animation.bg[0]);
	}

	render() {
		this.glob.ctx.save();

		// clip area (don't draw anything outside this area)
		this.glob.ctx.beginPath();
		this.glob.ctx.rect(this.offset[0], this.offset[1], this.animation.size[0], this.animation.size[1]);
		this.glob.ctx.clip();

		// translate to center
		this.glob.ctx.translate(this.offset[0] + this.animation.size[0] / 2, this.offset[1] + this.animation.size[1] / 2);

		for (const img of this.to_render) {
			this.glob.ctx.drawImage(...(img as [HTMLImageElement, number, number])); // Type might not be correct, but the union type doesn't work.
		}

		this.glob.ctx.restore();
	}

	step() {
		this.to_render = [];

		// draw background
		this.to_render.push([this.bg, -this.animation.bg[1] / 2, -this.animation.bg[2] / 2]);

		// draw fixed images
		// This might be optimized (i.e. removed fixed images that are not seen, like the text in the very first intro animation), but it runs smoothly so far, so no urgent need for optimization.
		for (const fix of this.animation.fixed) {
			this.to_render.push([
				this.pics[fix.seq_img],
				this.animation.imgs[fix.seq_img][1] * fix.move_img,
				0,
				this.animation.imgs[fix.seq_img][1],
				this.animation.imgs[fix.seq_img][2],
				fix.x - Math.floor(this.animation.imgs[fix.seq_img][1] / 2),
				fix.y - Math.floor(this.animation.imgs[fix.seq_img][2] / 2),
				this.animation.imgs[fix.seq_img][1],
				this.animation.imgs[fix.seq_img][2],
			]);
		}

		// Paused animations are still shown
		for (const fix of this.animation.paused) {
			if (fix !== null) {
				this.to_render.push([
					this.pics[fix.seq_img],
					this.animation.imgs[fix.seq_img][1] * fix.move_img,
					0,
					this.animation.imgs[fix.seq_img][1],
					this.animation.imgs[fix.seq_img][2],
					fix.x - Math.floor(this.animation.imgs[fix.seq_img][1] / 2),
					fix.y - Math.floor(this.animation.imgs[fix.seq_img][2] / 2),
					this.animation.imgs[fix.seq_img][1],
					this.animation.imgs[fix.seq_img][2],
				]);
			}
		}

		// Keep track if animation ended or no sequences are active (in which case the animation ends as well)
		let end = false;
		let num_of_active = 0;

		// Loop through all sequence objects
		// Each sequence object keeps track of its own
		// - position (x, y),
		// - current frame (pos),
		// - active or not (active)
		// - delay (delay)
		for (let seqnum = 0; seqnum < this.animation.seqs.length; seqnum++) {
			const seq = this.animation.seqs[seqnum];
			if (seq.active) {
				const move = seq.moves[seq.pos];

				num_of_active++;

				let x, y;

				// If no delay is active, execute the move
				if (seq.delay === -1) {
					x = move.x;
					y = move.y;
					if (!move.xabs) {
						x += seq.x;

						// If movement was relative, objects that are out of screen on one side come in again on the other side.
						if (x - this.animation.imgs[seq.img][1] / 2 > this.animation.size[0] / 2) {
							x = -Math.floor((this.animation.size[0] + this.animation.imgs[seq.img][1]) / 2);
						} else if (x + this.animation.imgs[seq.img][1] / 2 < -(this.animation.size[0] / 2)) {
							x = Math.floor((this.animation.size[0] + this.animation.imgs[seq.img][1]) / 2);
						}
					}
					if (!move.yabs) {
						y += seq.y;

						// If movement was relative, objects that are out of screen on one side come in again on the other side.
						if (y - this.animation.imgs[seq.img][2] / 2 > this.animation.size[1] / 2) {
							y = -Math.floor((this.animation.size[1] + this.animation.imgs[seq.img][2]) / 2);
						} else if (y + this.animation.imgs[seq.img][2] / 2 < -(this.animation.size[1] / 2)) {
							y = Math.floor((this.animation.size[1] + this.animation.imgs[seq.img][2]) / 2);
						}
					}

					seq.x = x;
					seq.y = y;

					// If the move is marked as fixed, the current state will be saved and redrawn every frame.
					// seq.img is the reference to the actual image, move.img is the number of the "subimage"
					if (move.fixed) {
						this.animation.fixed.push({ seq_img: seq.img, move_img: move.img, x: x, y: y });
					}
				}

				// If a delay is active, don't interpret anything.
				else {
					x = seq.x;
					y = seq.y;
				}

				// This draws the actual image
				// See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
				this.to_render.push([
					this.pics[seq.img],
					this.animation.imgs[seq.img][1] * move.img,
					0,
					this.animation.imgs[seq.img][1],
					this.animation.imgs[seq.img][2],
					x - Math.floor(this.animation.imgs[seq.img][1] / 2),
					y - Math.floor(this.animation.imgs[seq.img][2] / 2),
					this.animation.imgs[seq.img][1],
					this.animation.imgs[seq.img][2],
				]);

				// Define a delay if the move requires it or decrement the current delay if one is active.
				if (move.delay && seq.delay !== 0) {
					if (seq.delay < 0) {
						seq.delay = move.delay - 1;
					} else {
						seq.delay--;
					}
				}
				// If there is no delay, loops may be executed
				// move.counter takes care of counting the loops.
				// a move.counter == 0 means that the loop is finished
				// a move.counter < 0 means that the loop was not executed (so it has to start now)
				// move.loop is an array in the form: [number_of_repetitions, target]
				else {
					if (move.loop.length) {
						if (move.counter !== 0) {
							if (move.counter < 0) {
								if (move.loop[0] === 0) {
									move.counter = Infinity;
								} else {
									move.counter = move.loop[0] - 1;
								}
							} else {
								move.counter--;
							}
							seq.pos = move.loop[1];
						}

						// Loop is finished; go on with the next move and reset the counter
						else {
							seq.pos++;
							move.counter = -1;
						}

						seq.delay = -1;
					} else {
						// Moves may activate other sequence objects.
						if (move.activate.length) {
							for (const target of move.activate) {
								this.animation.seqs[target].moves[this.animation.seqs[target].pos].pause = false;
								this.animation.seqs[target].active = true;
								this.animation.paused[target] = null;
							}
						}

						// Moves may end the whole animation
						if (move.end) {
							end = true;
						}

						seq.pos++;
						seq.delay = -1;
					}
				}

				// The last move was finished, so this sequence becomes inactive.
				if (seq.pos >= seq.moves.length) {
					seq.active = false;
				}

				if (move.pause) {
					seq.active = false;
					this.animation.paused[seqnum] = { seq_img: seq.img, move_img: move.img, x: x, y: y };
				}
			}
		}

		this.has_stopped = end || !num_of_active; // false if the animation is still active
	}
}
