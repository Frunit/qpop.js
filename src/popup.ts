import type { Game } from "./game";
import { SCENE, draw_rect, draw_upper_left_border, multiline, write_text } from "./helper";
import { Sprite } from "./sprite";
import { anim_delays } from "./sprite_positions";
import { ClickArea, Dimension, KeyType, Point, Stage, TechGlobal } from "./types";

export class Popup implements Stage {
	id = SCENE.POPUP;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private glob: TechGlobal;
	private game: Game;

	private bg: HTMLImageElement;
	private text: string[];
	private callback: ((x: number) => void) | null;
	private right_answer: string;
	private left_answer: string | undefined;
	private sprite: Sprite;

	readonly line_height = 18;
	readonly max_text_width = 260;

	readonly dim: Point = [360, 150];
	readonly title_dim: Dimension = [360, 21];
	readonly spec_dim: Dimension = [64, 64];
	readonly left_answer_dim: Dimension = [180, 22];
	readonly right_answer_dim: Dimension = [181, 22];

	readonly spec_positions: {[key: string]: Point[]} = {
		0: [[0, 0]],
		1: [[64, 0]],
		2: [[128, 0]],
		3: [[192, 0]],
		4: [[256, 0]],
		5: [[320, 0]],
		dino: [[0, 64], [64, 64]],
		chuck_berry: [[128, 64], [192, 64]],
		dino_cries: [[256, 64], [320, 64]],
	};

	readonly offset: Point = [140, 165];
	readonly title_offset: Point = [0, 0];
	readonly spec_offset: Point = [21, 42];
	readonly text_offset: Point = [219, 80];
	readonly left_answer_offset: Point = [0, 128];
	readonly right_answer_offset: Point = [179, 128];

	constructor(game: Game, image: string, callback: ((x: number) => void) | null, text: string, right_answer: string, left_answer?: string) {
		this.game = game;
		this.glob = game.glob;
		this.text = multiline(this.glob.ctx, text, this.max_text_width);
		this.right_answer = right_answer;
		this.left_answer = left_answer;
		this.callback = callback;

		this.bg = this.glob.resources.get_image('gfx/dark_bg.png');
		this.sprite = new Sprite(this.glob.resources.get_image('gfx/species.png'), [0, 0], this.spec_positions[image], anim_delays.popups);
	}

	initialize() {
		this.redraw();
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
		write_text(this.glob.ctx, this.glob.lang.popup_title, [this.offset[0] + this.title_offset[0] + this.title_dim[0] / 2, this.offset[1] + this.title_offset[1] + 15], 'white', 'black');

		// Species image
		this.sprite.render(this.glob.ctx, [this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1]]);

		// Text
		const line_correction = this.line_height * this.text.length / 2;
		for (let i = 0; i < this.text.length; i++) {
			write_text(this.glob.ctx, this.text[i], [this.offset[0] + this.text_offset[0], this.offset[1] + this.text_offset[1] - line_correction + this.line_height * i], 'white', 'black');
		}

		// Left answer (button) if present
		if (this.left_answer) {
			draw_rect(this.glob.ctx, [this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim);
			write_text(this.glob.ctx, this.left_answer, [this.offset[0] + this.left_answer_offset[0] + this.left_answer_dim[0] / 2, this.offset[1] + this.left_answer_offset[1] + 15], 'white', 'black');

			this.clickareas.push({
				x1: this.offset[0] + this.left_answer_offset[0],
				y1: this.offset[1] + this.left_answer_offset[1],
				x2: this.offset[0] + this.left_answer_offset[0] + this.left_answer_dim[0],
				y2: this.offset[1] + this.left_answer_offset[1] + this.left_answer_dim[1],
				down: () => draw_rect(this.glob.ctx, [this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim, true, true),
				up: () => this.clicked(1),
				blur: () => draw_rect(this.glob.ctx, [this.offset[0] + this.left_answer_offset[0], this.offset[1] + this.left_answer_offset[1]], this.left_answer_dim)
			});
		}

		// Right answer (button)
		draw_rect(this.glob.ctx, [this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim);
		write_text(this.glob.ctx, this.right_answer, [this.offset[0] + this.right_answer_offset[0] + this.right_answer_dim[0] / 2, this.offset[1] + this.right_answer_offset[1] + 15], 'white', 'black');

		this.clickareas.push({
			x1: this.offset[0] + this.right_answer_offset[0],
			y1: this.offset[1] + this.right_answer_offset[1],
			x2: this.offset[0] + this.right_answer_offset[0] + this.right_answer_dim[0],
			y2: this.offset[1] + this.right_answer_offset[1] + this.right_answer_dim[1],
			down: () => draw_rect(this.glob.ctx, [this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim, true, true),
			up: () => this.clicked(0),
			blur: () => draw_rect(this.glob.ctx, [this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim)
		});

		// Grey border
		if (!this.left_answer) {
			draw_upper_left_border(this.glob.ctx, [this.offset[0] + this.right_answer_offset[0], this.offset[1] + this.right_answer_offset[1]], this.right_answer_dim);
		}
		else {
			this.glob.ctx.save();
			this.glob.ctx.lineWidth = 2;
			this.glob.ctx.strokeStyle = '#828282';
			this.glob.ctx.beginPath();
			this.glob.ctx.moveTo(this.offset[0] + this.left_answer_offset[0] + 1, this.offset[1] + this.left_answer_offset[1] - 1);
			this.glob.ctx.lineTo(this.offset[0] + this.right_answer_offset[0] + this.right_answer_dim[0] - 1, this.offset[1] + this.right_answer_offset[1] - 1);
			this.glob.ctx.stroke();
			this.glob.ctx.restore();
		}

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.clicked(this.left_answer ? 1 : 0), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => this.clicked(0), 'reset': true },
		];
	}

	render() {
		if (this.sprite.is_new_frame()) {
			this.glob.ctx.drawImage(this.bg,
				this.spec_offset[0], this.spec_offset[1],
				this.spec_dim[0], this.spec_dim[1],
				this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1],
				this.spec_dim[0], this.spec_dim[1]);

			this.sprite.render(this.glob.ctx, [this.offset[0] + this.spec_offset[0], this.offset[1] + this.spec_offset[1]]);
		}
	}

	update() {
		this.sprite.update();
	}

	clicked(answer: number) {
		this.game.get_last_stage();
		if (this.callback) {
			this.callback(answer);
		}
	}
}
