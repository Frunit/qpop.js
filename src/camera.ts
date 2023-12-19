// MAYBE: Camera optimization has some issues with predators when the player is not moving. left/right moving predators glitch and predators on the edge of the screen disappear suddenly (e.g. left edge going left). This is fixed by force rendering for now, but it would be nice to put optimizations in place again.

import { survivalmap_size } from "./consts";
import { DIR, SURV_MAP, range } from "./helper";
import { ISurvivalCharacter, Level } from "./level";
import { Survival } from "./survival";
import { Dimension, Point, SixNumbers } from "./types";


export class Camera {
	private ctx: CanvasRenderingContext2D;
	private level: Level;
	private survival: Survival;
	private tile_dim: Dimension;
	private offset: Point;
	private cwidth: number;
	private cheight: number;
	private pos_changed: boolean;
	private tiles_to_render: Set<number>;
	private movs_to_render: Set<number>;
	private x_tiles: number[];
	private y_tiles: number[];
	private camera_pos: Point;

	constructor(ctx: CanvasRenderingContext2D, level: Level, survival: Survival, tile_dim: Dimension, window_dim: Dimension, offset: Point) {
		this.ctx = ctx;

		this.level = level;
		this.survival = survival;

		this.tile_dim = tile_dim;
		this.cwidth = window_dim[0];
		this.cheight = window_dim[1];
		this.offset = offset;
		this.pos_changed = true;
		this.tiles_to_render = new Set();
		this.movs_to_render = new Set();
		this.x_tiles = [];
		this.y_tiles = [];

		this.camera_pos = [0, 0]; // Camera position in pixel

		this.move_to(level.character);
		//this.update_visible_level();
	}

	move_to(obj: ISurvivalCharacter) {
		const new_x = obj.tile[0] * this.tile_dim[0] + obj.rel_pos[0] + this.tile_dim[0] / 2 - Math.floor(this.cwidth / 2);
		const new_y = obj.tile[1] * this.tile_dim[1] + obj.rel_pos[1] + this.tile_dim[1] / 2 - Math.floor(this.cheight / 2);

		if (new_x !== this.camera_pos[0]) {
			this.camera_pos[0] = new_x;
			this.pos_changed = true;
			this.x_tiles = range(Math.max(Math.floor(this.camera_pos[0] / this.tile_dim[0]) - 1, 0),
				Math.min(Math.ceil((this.camera_pos[0] + this.cwidth) / this.tile_dim[0]) + 2, survivalmap_size[0]));
		}

		if (new_y !== this.camera_pos[1]) {
			this.camera_pos[1] = new_y;
			this.pos_changed = true;
			this.y_tiles = range(Math.max(Math.floor(this.camera_pos[1] / this.tile_dim[1]) - 1, 0),
				Math.min(Math.ceil((this.camera_pos[1] + this.cheight) / this.tile_dim[1]) + 2, survivalmap_size[1]));
		}
	}

	update_visible_level() {
		if (this.survival.action !== null) {
			for (const tile of this.survival.action.tiles) {
				this.tiles_to_render.add(tile[0] * 100 + tile[1]);
			}
		}

		for (const y of this.y_tiles) {
			for (const x of this.x_tiles) {
				if (this.level.bg_sprites[y][x] === null) {
					this.tiles_to_render.add(x * 100 + y);
				}
				else {
					this.level.bg_sprites[y][x]?.update();
					if (this.pos_changed || this.level.bg_sprites[y][x]?.is_new_frame()) {
						this.tiles_to_render.add(x * 100 + y);
					}
				}

				const mob = this.level.mobmap[y][x];

				if (mob === null || mob.hidden) {
					// save some indentation of the code by this...
					continue;
				}

				// PLAYER and PREDATOR are updated by survival and can move.
				// All others (ENEMY, FEMALE, UNRESPONSIVE) need an update but can't move.
				if (mob.type === SURV_MAP.PLAYER || mob.type === SURV_MAP.PREDATOR) {
					if (this.pos_changed || mob.sprite.is_new_frame()) {
						const mov = mob.movement ? mob.movement : mob.last_movement;
						if (mov) {
							let old_x = mob.tile[0];
							let old_y = mob.tile[1];
							switch (mov) {
								case DIR.N:
									old_y++;
									break;
								case DIR.S:
									old_y--;
									break;
								case DIR.E:
									old_x++;
									break;
								case DIR.W:
									old_x--;
									break;
							}

							this.tiles_to_render.add(old_x * 100 + old_y);
						}
					}
				}
				else {
					mob.sprite.update();
				}

				if (this.pos_changed || mob.sprite.is_new_frame()) {
					this.movs_to_render.add(x * 100 + y);
					this.tiles_to_render.add(x * 100 + y);
				}
			}
		}
	}

	render(force = false) {
		this.ctx.save();
		this.ctx.translate(this.offset[0], this.offset[1]);
		this.ctx.beginPath();
		this.ctx.rect(0, 0, this.cwidth, this.cheight);
		this.ctx.clip();

		if (force) {
			for (const y of this.y_tiles) {
				for (const x of this.x_tiles) {
					this.tiles_to_render.add(x * 100 + y);

					const mob = this.level.mobmap[y][x];
					if (mob !== null && !mob.hidden) {
						this.movs_to_render.add(x * 100 + y);
					}
				}
			}
		}

		for (const coord of this.tiles_to_render) {
			const x = Math.floor(coord / 100);
			const y = coord % 100;

			if (this.level.bg_sprites[y][x] === null) {
				this.level.request_sprite(x, y);
			}

			this.level.bg_sprites[y][x]?.render(this.ctx,
				[x * this.tile_dim[0] - this.camera_pos[0],
				y * this.tile_dim[1] - this.camera_pos[1]]);
		}

		for (const coord of this.movs_to_render) {
			const x = Math.floor(coord / 100);
			const y = coord % 100;
			const mov = this.level.mobmap[y][x];
			mov?.sprite.render(this.ctx,
				[Math.round(mov.tile[0] * this.tile_dim[0] + mov.rel_pos[0] - this.camera_pos[0]),
				Math.round(mov.tile[1] * this.tile_dim[1] + mov.rel_pos[1] - this.camera_pos[1])]);
		}

		if (this.survival.action !== null) {
			this.survival.action.render(this.ctx, this.tile_dim, this.camera_pos);
		}

		this.ctx.restore();

		this.pos_changed = false;
		this.tiles_to_render.clear();
		this.movs_to_render.clear();
	}
}
