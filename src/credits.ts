import { SCENE, draw_base, draw_rect, draw_upper_left_border, multiline, write_text } from "./helper";
import { ClickArea, KeyType, Point, Stage, TechGlobal } from "./types";

export class Credits implements Stage {
	id = SCENE.CREDITS;
	clickareas: ClickArea[] = [];
	rightclickareas: ClickArea[] = [];
	keys: KeyType[] = [];
	tutorials = [];
	glob: TechGlobal;

	private bg: any; // TODO
	private github: any; // TODO
	
	readonly upper_panel_dim: Point = [620, 130];
	readonly lower_panel_dim: Point = [305, 280];
	readonly close_dim : Point = [181, 22];
	readonly github_dim : Point = [64, 83];
	readonly upper_panel_offset : Point = [9, 29];
	readonly left_panel_offset : Point = [9, 168];
	readonly right_panel_offset : Point = [324, 168];
	readonly close_offset : Point = [459, 458];
	readonly text_rel_offset : Point = [10, 22];
	readonly github_offset : Point = [538, 50];
	readonly max_text_width = 500;
	readonly line_height = 20;

	constructor(glob: TechGlobal) {
		this.glob = glob;
		this.bg = resources.get('gfx/light_bg.png');
		this.github = resources.get('gfx/github.png');
	}

	initialize() {
		this.redraw();
	}

	redraw() {
		draw_base();

		draw_rect([0, 20], [640, 460]); // Main rectangle
		draw_rect(this.close_offset, this.close_dim); // Close
		draw_upper_left_border(this.close_offset, this.close_dim);
		write_text(this.glob.lang.close, [549, 473], 'white', 'black');

		this.clickareas = this.glob.clickareas.slice();
		this.rightclickareas = this.glob.rightclickareas.slice();

		this.clickareas.push({
			x1: this.close_offset[0],
			y1: this.close_offset[1],
			x2: this.close_offset[0] + this.close_dim[0],
			y2: this.close_offset[1] + this.close_dim[1],
			down: () => draw_rect(this.close_offset, this.close_dim, true, true),
			up: () => this.close(),
			blur: () => draw_rect(this.close_offset, this.close_dim)
		});

		// Background panels
		this.glob.ctx.save();
		const rep = this.glob.ctx.createPattern(this.bg, 'repeat');
		if(rep !== null) {
			this.glob.ctx.fillStyle = rep;
		}

		draw_rect(this.upper_panel_offset, this.upper_panel_dim, true, false, true);
		this.glob.ctx.fillRect(this.upper_panel_offset[0] + 3, this.upper_panel_offset[1] + 3, this.upper_panel_dim[0] - 6, this.upper_panel_dim[1] - 6);

		draw_rect(this.left_panel_offset, this.lower_panel_dim, true, false, true);
		this.glob.ctx.fillRect(this.left_panel_offset[0] + 3, this.left_panel_offset[1] + 3, this.lower_panel_dim[0] - 6, this.lower_panel_dim[1] - 6);

		draw_rect(this.right_panel_offset, this.lower_panel_dim, true, false, true);
		this.glob.ctx.fillRect(this.right_panel_offset[0] + 3, this.right_panel_offset[1] + 3, this.lower_panel_dim[0] - 6, this.lower_panel_dim[1] - 6);

		this.glob.ctx.restore();

		// Info text
		const text = multiline(this.glob.lang.information, this.max_text_width);
		for (let i = 0; i < text.length; i++) {
			write_text(text[i], [this.text_rel_offset[0] + this.upper_panel_offset[0], this.text_rel_offset[1] + this.upper_panel_offset[1] + this.line_height * i], '#000000', '#ffffff', 'left');
		}

		// Github logo
		this.glob.ctx.drawImage(this.github, this.github_offset[0], this.github_offset[1]);
		this.clickareas.push({
			x1: this.github_offset[0],
			y1: this.github_offset[1],
			x2: this.github_offset[0] + this.github_dim[0],
			y2: this.github_offset[1] + this.github_dim[1],
			down: () => { },
			up: () => window.open('https://www.github.com/Frunit/qpop.js', '_blank'),
			blur: () => { }
		});

		// Credits for original game
		let line = 1;
		write_text('1995', [this.left_panel_offset[0] + this.lower_panel_dim[0] - 8, this.text_rel_offset[1] + this.left_panel_offset[1]], '#000000', '#ffffff', 'right');
		for (let i = 0; i < this.glob.lang.credits_original.length; i++) {
			write_text(this.glob.lang.credits_original[i][0], [this.text_rel_offset[0] + this.left_panel_offset[0], this.text_rel_offset[1] + this.left_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
			line++;
			for (let j = 0; j < this.glob.lang.credits_original[i][1].length; j++) {
				write_text(this.glob.lang.credits_original[i][1][j], [this.text_rel_offset[0] + this.left_panel_offset[0] + 30, this.text_rel_offset[1] + this.left_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
				line++;
			}
		}

		// Credits for remake
		line = 1;
		write_text('2020', [this.right_panel_offset[0] + this.lower_panel_dim[0] - 8, this.text_rel_offset[1] + this.right_panel_offset[1]], '#000000', '#ffffff', 'right');
		for (let i = 0; i < this.glob.lang.credits_remake.length; i++) {
			write_text(this.glob.lang.credits_remake[i][0], [this.text_rel_offset[0] + this.right_panel_offset[0], this.text_rel_offset[1] + this.right_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
			line++;
			for (let j = 0; j < this.glob.lang.credits_remake[i][1].length; j++) {
				write_text(this.glob.lang.credits_remake[i][1][j], [this.text_rel_offset[0] + this.right_panel_offset[0] + 30, this.text_rel_offset[1] + this.right_panel_offset[1] + this.line_height * line], '#000000', '#ffffff', 'left');
				line++;
			}
		}

		this.keys = [
			{ key: 'ENTER', action: () => this.close(), reset: true },
			{ key: 'ESCAPE', action: () => this.close(), reset: true },
		];
	}

	render() {
	}

	update() {
	}

	close() {
		draw_rect(this.close_offset, this.close_dim);
		game.stage = game.backstage.pop();
		game.stage.redraw();
	}
}
