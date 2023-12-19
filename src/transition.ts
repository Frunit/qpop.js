import { Game } from "./game";
import { draw_base, draw_inv_rect, draw_rect, subtitle } from "./helper";
import { ClickArea, KeyType, Stage, TechGlobal } from "./types";


export class Transition implements Stage {
	id: number;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];

	private pic: HTMLImageElement;
	private lang_string: string;
	private frame = 0;

	readonly pic_dim = [595, 415];
	readonly pic_offset = [23, 42];
	readonly subtitle_offset = [70, 420];

	constructor(private game: Game, private glob: TechGlobal, pic: any, id: number) {
		this.id = id;
		this.pic = this.glob.resources.get_image(pic);
		this.lang_string = pic.split('/').pop().replace('.png', '');
	}

	initialize() {
		this.glob.resources.stop_music(); // MAYBE: Fade out
		this.glob.canvas.style.cursor = 'default';
		this.redraw();
	}

	redraw() {
		draw_base(this.glob, this.id);

		draw_rect(this.glob.ctx, [0, 20], [640, 460]); // Main rectangle

		// Inverted rectangle around the picture
		draw_inv_rect(this.glob.ctx, [this.pic_offset[0] - 1, this.pic_offset[1] - 1], [this.pic_dim[0] + 2, this.pic_dim[1] + 2]);

		// Background panels
		this.glob.ctx.drawImage(this.pic, this.pic_offset[0], this.pic_offset[1]);

		if (this.glob.lang[this.lang_string]) {
			subtitle(this.glob.ctx, this.subtitle_offset[0], this.subtitle_offset[1], this.glob.lang[this.lang_string]);
		}

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.pic_offset[0],
			y1: this.pic_offset[1],
			x2: this.pic_offset[0] + this.pic_dim[0],
			y2: this.pic_offset[1] + this.pic_dim[1],
			down: () => { },
			up: () => this.game.next_stage(),
			blur: () => { }
		});

		this.keys = [
			{ key: 'ENTER', action: () => this.game.next_stage(), reset: true },
		];
	}

	render() {
	}

	update() {
		this.frame++;
		if (this.frame > this.glob.options.transition_delay) {
			this.game.next_stage();
		}
	}
}
