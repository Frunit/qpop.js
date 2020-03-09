'use strict';


// TODO: Camera has some issues with predators when the player is not moving. left/right moving predators glitch and predators on the edge of the screen disappear suddenly (e.g. left edge going left). This is fixed by force rendering for now.


function Camera(level, survival, tile_dim, window_dim, offset) {
	this.level = level;
	this.survival = survival;

	this.tile_dim = tile_dim;
	this.cwidth = window_dim[0];
	this.cheight = window_dim[1];
	this.offset = offset;
	this._pos_changed = true;
	this._tiles_to_render = new Set();
	this._movs_to_render = new Set();
	this.x_tiles = [];
	this.y_tiles = [];

	this.cpos = [0, 0]; // Camera position in pixel

	this.move_to(level.character);
	//this.update_visible_level();
}


Camera.prototype.move_to = function(obj) {
	const new_x = obj.tile[0] * this.tile_dim[0] + obj.rel_pos[0] + this.tile_dim[0]/2 - Math.floor(this.cwidth/2);
	const new_y = obj.tile[1] * this.tile_dim[1] + obj.rel_pos[1] + this.tile_dim[1]/2 - Math.floor(this.cheight/2);

	if(new_x !== this.cpos[0]) {
		this.cpos[0] = new_x;
		this._pos_changed = true;
		this.x_tiles = range(Math.floor(this.cpos[0] / this.tile_dim[0]),
			Math.ceil((this.cpos[0] + this.cwidth) / this.tile_dim[0]) + 1);
	}

	if(new_y !== this.cpos[1]) {
		this.cpos[1] = new_y;
		this._pos_changed = true;
		this.y_tiles = range(Math.floor(this.cpos[1] / this.tile_dim[1]),
			Math.ceil((this.cpos[1] + this.cheight) / this.tile_dim[1]) + 1);
	}
};


Camera.prototype.update_visible_level = function() {
	if(this.survival.action !== null) {
		for(let tile of this.survival.action.tiles) {
			this._tiles_to_render.add(tile[0] * 100 + tile[1]);
		}
	}

	for(let y of this.y_tiles) {
		for(let x of this.x_tiles) {
			if(this.level.bg_sprites[y][x] === null) {
				this._tiles_to_render.add(x * 100 + y);
			}
			else {
				this.level.bg_sprites[y][x].update();
				if(this._pos_changed || this.level.bg_sprites[y][x].is_new_frame()) {
					this._tiles_to_render.add(x * 100 + y);
				}
			}

			const mob = this.level.mobmap[y][x];

			if(mob === null || mob.hidden) {
				// save some indentation of the code by this...
				continue;
			}

			// PLAYER and PREDATOR are updated by survival and can move.
			// All others (ENEMY, FEMALE, UNRESPONSIVE) need an update but can't move.
			if(mob.type === SURV_MAP.PLAYER || mob.type === SURV_MAP.PREDATOR) {
				if(this._pos_changed || mob.sprite.is_new_frame()) {
					const mov = mob.movement ? mob.movement : mob.last_movement;
					if(mov) {
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

						this._tiles_to_render.add(old_x * 100 + old_y);
					}
				}
			}
			else {
				mob.sprite.update();
			}

			if(this._pos_changed || mob.sprite.is_new_frame()) {
				this._movs_to_render.add(x * 100 + y);
				this._tiles_to_render.add(x * 100 + y);
			}
		}
	}
};


Camera.prototype.render = function(force=false) {
	ctx.save();
	ctx.translate(this.offset[0], this.offset[1]);
	ctx.beginPath();
	ctx.rect(0, 0, this.cwidth, this.cheight);
	ctx.clip();

	if(force) {
		for(let y of this.y_tiles) {
			for(let x of this.x_tiles) {
				this._tiles_to_render.add(x * 100 + y);

				const mob = this.level.mobmap[y][x];
				if(mob !== null && !mob.hidden) {
					this._movs_to_render.add(x * 100 + y);
				}
			}
		}
	}

	if(this._tiles_to_render.size || this._movs_to_render.size) {
		debug1.value = 'tiles rndr: ' + this._tiles_to_render.size;
		debug5.value = 'moves rndr: ' + this._movs_to_render.size;
	}

	for(let coord of this._tiles_to_render) {
		const x = Math.floor(coord / 100);
		const y = coord % 100;

		if(this.level.bg_sprites[y][x] === null) {
			this.level.request_sprite(x, y);
		}

		this.level.bg_sprites[y][x].render(ctx,
			[x * this.tile_dim[0] - this.cpos[0],
			y * this.tile_dim[1] - this.cpos[1]]);
	}

	for(let coord of this._movs_to_render) {
		const x = Math.floor(coord / 100);
		const y = coord % 100;
		const mov = this.level.mobmap[y][x];
		mov.sprite.render(ctx,
			[Math.round(mov.tile[0] * this.tile_dim[0] + mov.rel_pos[0] - this.cpos[0]),
			Math.round(mov.tile[1] * this.tile_dim[1] + mov.rel_pos[1] - this.cpos[1])]);
	}

	if(this.survival.action !== null) {
		this.survival.action.render(ctx, this.tile_dim, this.cpos);
	}

	ctx.restore();

	this._pos_changed = false;
	this._tiles_to_render.clear();
	this._movs_to_render.clear();
};
