// MAYBE: Subtitles for intro texts

import { Animation } from "./animation";
import { intro_frames } from "./frames";
import { SCENE, draw_base, draw_inv_rect, draw_rect } from "./helper";
import { ClickArea, KeyType, Point, Stage, TechGlobal } from "./types";

export class Intro implements Stage {
	id: number = SCENE.INTRO;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	glob: TechGlobal;

	private num: number = 0;
	private animation: Animation | null = null;

	readonly anim_dim: Point = [600, 420];
	readonly anim_offset: Point = [19, 39];

	constructor(glob: TechGlobal) {
		this.glob = glob;
	}

	initialize() {
		this.glob.resources.play_music('intro');
		this.glob.canvas.style.cursor = 'default';
		this.animation = new Animation(intro_frames[this.num], this.anim_offset);
		this.redraw();
	}

	redraw() {
		draw_base();

		draw_rect([0, 20], [640, 460]); // Main rectangle


		// Inverted rectangle around the picture
		draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas =this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.anim_offset[0],
			y1: this.anim_offset[1],
			x2: this.anim_offset[0] + this.anim_dim[0],
			y2: this.anim_offset[1] + this.anim_dim[1],
			down: () => { },
			up: () => this.glob.next_stage(),
			blur: () => { }
		});

		this.keys = [
			{ 'key': 'ENTER', 'action': () => this.glob.next_stage(), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => this.glob.next_stage(), 'reset': true },
		];

		this.render();
	}

	render() {
		if(this.animation !== null) {
			this.animation.render();
		}
	}

	update() {
		if(this.animation !== null) {
			if (this.animation.has_stopped) {
				this.num++;
				if (this.num < 4) {
					this.animation = new Animation(intro_frames[this.num], this.anim_offset);
				}
				else {
					this.glob.next_stage();
				}
			}
			else {
				this.animation.step();
			}
		}
	}
}
