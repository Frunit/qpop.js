// MAYBE: Subtitles for intro texts

export class Intro {
	constructor() {
		this.id = SCENE.INTRO;

		// CONST_START
		this.anim_dim = [600, 420];
		this.anim_offset = [19, 39];
		// CONST_END
		this.num = 0;
		this.animation = null;

		this.clickareas = [];
		this.rightclickareas = [];
		this.keys = [];
	}
	initialize() {
		audio.play_music('intro');
		canvas.style.cursor = 'default';
		this.animation = new Animation(intro_frames[this.num], this.anim_offset);
		this.redraw();
	}
	redraw() {
		draw_base();

		draw_rect([0, 20], [640, 460]); // Main rectangle


		// Inverted rectangle around the picture
		draw_inv_rect([this.anim_offset[0] - 1, this.anim_offset[1] - 1], [this.anim_dim[0] + 2, this.anim_dim[1] + 2]);

		this.clickareas = game.clickareas.slice();
		this.rightclickareas = game.rightclickareas.slice();

		this.clickareas.push({
			x1: this.anim_offset[0],
			y1: this.anim_offset[1],
			x2: this.anim_offset[0] + this.anim_dim[0],
			y2: this.anim_offset[1] + this.anim_dim[1],
			down: () => { },
			up: () => game.next_stage(),
			blur: () => { }
		});

		this.keys = [
			{ 'key': 'ENTER', 'action': () => game.next_stage(), 'reset': true },
			{ 'key': 'ESCAPE', 'action': () => game.next_stage(), 'reset': true },
		];

		this.render();
	}
	render() {
		this.animation.render();
	}
	update() {
		if (this.animation.has_stopped) {
			this.num++;
			if (this.num < 4) {
				this.animation = new Animation(intro_frames[this.num], this.anim_offset);
			}
			else {
				game.next_stage();
			}
		}
		else {
			this.animation.step();
		}
	}
}
