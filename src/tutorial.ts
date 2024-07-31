import type { Game } from './game';
import { DIR, SCENE, draw_rect, local_save, multiline, write_text } from './helper';
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal, TutorialType } from './types';

export class Tutorial implements Stage {
	id = SCENE.TUTORIAL;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private game: Game;
	private glob: TechGlobal;

	private bg: HTMLImageElement;
	private gfx: HTMLImageElement;
	private textname;
	private offset;
	private arrows;
	private low_anchor: boolean;
	private dim: Dimension = [360, 250]; // Can be changed depending on number of lines

	readonly line_height = 18;
	readonly max_text_width = 260;
	readonly title_dim: Dimension = [360, 21];
	readonly spec_dim: Dimension = [34, 79];
	readonly abort_dim: Dimension = [180, 22];
	readonly continue_dim: Dimension = [181, 22];
	readonly title_offset: Point = [0, 0];
	readonly spec_offset: Point = [35, 45];
	readonly text_offset: Point = [89, 50];
	readonly abort_offset: Point = [0, 128];
	readonly continue_offset: Point = [179, 128];
	readonly spec_soffset: Point = [0, 0];
	readonly arrow_soffsets: Point[] = [
		[34, 0],
		[34, 30],
		[34, 47],
		[34, 77],
	];
	readonly arrow_dims: Dimension[] = [
		[17, 30],
		[30, 17],
		[17, 30],
		[30, 17],
	];

	constructor(game: Game, glob: TechGlobal, tut: TutorialType) {
		this.game = game;
		this.glob = glob;
		this.bg = this.glob.resources.get_image('gfx/dark_bg.png');
		this.gfx = this.glob.resources.get_image('gfx/tutorial.png');

		this.textname = tut.name;
		this.offset = tut.pos;
		this.arrows = tut.arrows;
		this.low_anchor = tut.low_anchor ?? false;
	}

	initialize() {
		this.redraw();
	}

	redraw() {
		const ctx = this.glob.ctx;
		const text = multiline(ctx, this.glob.lang.tutorial[this.textname], this.max_text_width);
		this.dim[1] = 2 * this.title_dim[1] + 2 * this.continue_dim[1] + Math.max(text.length * this.line_height, this.spec_dim[1]);

		if (this.low_anchor) {
			this.offset[1] -= this.dim[1];
			this.low_anchor = false; // Otherwise, the operation is rerun when redrawing
		}

		ctx.drawImage(this.bg, 0, 0, this.dim[0], this.dim[1], this.offset[0], this.offset[1], this.dim[0], this.dim[1]);

		draw_rect(
			ctx,
			[this.offset[0], this.offset[1] + this.title_dim[1] - 1],
			[this.dim[0], this.dim[1] - this.title_dim[1] - this.continue_dim[1] + 2],
			true,
		);

		this.clickareas = [];

		// Title
		draw_rect(ctx, [this.offset[0] + this.title_offset[0], this.offset[1] + this.title_offset[1]], this.title_dim);
		write_text(
			ctx,
			this.glob.lang.tutorial_title,
			[this.offset[0] + this.title_offset[0] + this.title_dim[0] / 2, this.offset[1] + this.title_offset[1] + 15],
			'white',
			'black',
		);

		// Text
		for (let i = 0; i < text.length; i++) {
			write_text(
				ctx,
				text[i],
				[this.offset[0] + this.text_offset[0], this.offset[1] + this.text_offset[1] + this.line_height * i],
				'white',
				'black',
				'left',
			);
		}

		// Species image
		this.glob.ctx.drawImage(
			this.gfx,
			this.spec_soffset[0],
			this.spec_soffset[1],
			this.spec_dim[0],
			this.spec_dim[1],
			this.offset[0] + this.spec_offset[0],
			this.offset[1] + this.spec_offset[1],
			this.spec_dim[0],
			this.spec_dim[1],
		);

		// Abort
		draw_rect(ctx, [this.offset[0] + this.abort_offset[0], this.offset[1] + this.dim[1] - this.abort_dim[1]], this.abort_dim);
		write_text(
			ctx,
			this.glob.lang.tutorial_abort,
			[this.offset[0] + this.abort_offset[0] + this.abort_dim[0] / 2, this.offset[1] + this.dim[1] - this.abort_dim[1] + 15],
			'white',
			'black',
		);

		this.clickareas.push({
			x1: this.offset[0] + this.abort_offset[0],
			y1: this.offset[1] + this.dim[1] - this.abort_dim[1],
			x2: this.offset[0] + this.abort_offset[0] + this.abort_dim[0],
			y2: this.offset[1] + this.dim[1],
			down: () =>
				draw_rect(
					ctx,
					[this.offset[0] + this.abort_offset[0], this.offset[1] + this.dim[1] - this.abort_dim[1]],
					this.abort_dim,
					true,
					true,
				),
			up: () => this.next(true),
			blur: () => this.redraw(),
		});

		// Continue
		draw_rect(ctx, [this.offset[0] + this.continue_offset[0], this.offset[1] + this.dim[1] - this.continue_dim[1]], this.continue_dim);
		write_text(
			ctx,
			this.glob.lang.next,
			[this.offset[0] + this.continue_offset[0] + this.continue_dim[0] / 2, this.offset[1] + this.dim[1] - this.continue_dim[1] + 15],
			'white',
			'black',
		);

		this.clickareas.push({
			x1: this.offset[0] + this.continue_offset[0],
			y1: this.offset[1] + this.dim[1] - this.continue_dim[1],
			x2: this.offset[0] + this.continue_offset[0] + this.continue_dim[0],
			y2: this.offset[1] + this.dim[1],
			down: () =>
				draw_rect(
					ctx,
					[this.offset[0] + this.continue_offset[0], this.offset[1] + this.dim[1] - this.continue_dim[1]],
					this.continue_dim,
					true,
					true,
				),
			up: () => this.next(),
			blur: () => this.redraw(),
		});

		// Arrows
		for (const arrow of this.arrows) {
			switch (arrow.dir) {
				case DIR.N:
					this.glob.ctx.drawImage(
						this.gfx,
						this.arrow_soffsets[0][0],
						this.arrow_soffsets[0][1],
						this.arrow_dims[0][0],
						this.arrow_dims[0][1],
						this.offset[0] + arrow.offset,
						this.offset[1] - this.arrow_dims[0][1] + 3,
						this.arrow_dims[0][0],
						this.arrow_dims[0][1],
					);
					break;
				case DIR.E:
					this.glob.ctx.drawImage(
						this.gfx,
						this.arrow_soffsets[1][0],
						this.arrow_soffsets[1][1],
						this.arrow_dims[1][0],
						this.arrow_dims[1][1],
						this.offset[0] + this.dim[0] - 3,
						this.offset[1] + arrow.offset,
						this.arrow_dims[1][0],
						this.arrow_dims[1][1],
					);
					break;
				case DIR.S:
					this.glob.ctx.drawImage(
						this.gfx,
						this.arrow_soffsets[2][0],
						this.arrow_soffsets[2][1],
						this.arrow_dims[2][0],
						this.arrow_dims[2][1],
						this.offset[0] + arrow.offset,
						this.offset[1] + this.dim[1] - 3,
						this.arrow_dims[2][0],
						this.arrow_dims[2][1],
					);
					break;
				case DIR.W:
					this.glob.ctx.drawImage(
						this.gfx,
						this.arrow_soffsets[3][0],
						this.arrow_soffsets[3][1],
						this.arrow_dims[3][0],
						this.arrow_dims[3][1],
						this.offset[0] - this.arrow_dims[3][0] + 3,
						this.offset[1] + arrow.offset,
						this.arrow_dims[3][0],
						this.arrow_dims[3][1],
					);
					break;
			}
		}

		this.keys = [
			{ key: 'ENTER', action: () => this.next(), reset: true },
			{ key: 'ESCAPE', action: () => this.next(true), reset: true },
		];
	}
	render() {}
	update() {}
	next(abort = false) {
		if (abort) {
			this.glob.options.tutorial = false;
			local_save('tutorial', false);
		}
		this.game.stage = this.game.backstage.pop()!;
		this.game.stage.redraw();
		this.game.tutorial();
	}
}
