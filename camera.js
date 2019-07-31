'use strict';

function Camera(level, survival, tile_dim, window_dim, offset) {
	this.level = level;
	this.survival = survival;

	this.tile_dim = tile_dim;
	this.cwidth = window_dim[0];
	this.cheight = window_dim[1];
	this.offset = offset;
	this._pos_changed = true;
	this._tiles_to_render = new Set();
	this._movs_to_render = [];
	this.x_tiles = [];
	this.y_tiles = [];

	this.cpos = [0, 0]; // Camera position in pixel

	this.move_to(level.character);
	//this.update_tiles(); Already done in move_to()
	this.update_visible_level();
}


Camera.prototype.move_to = function(obj) {
	const new_x = obj.tile[0] * this.tile_dim[0] + obj.rel_pos[0] + this.tile_dim[0]/2 - Math.floor(this.cwidth/2);
	const new_y = obj.tile[1] * this.tile_dim[1] + obj.rel_pos[1] + this.tile_dim[1]/2 - Math.floor(this.cheight/2);

	let must_update_tiles = true; // DEBUG

	debug2.value = new_x + ' ' + new_y;

	if(new_x !== this.cpos[0]) {
		this.cpos[0] = new_x;
		/*if(Math.floor(this.cpos[0] / this.tile_dim[0]) !== this.x_tiles[0]) {
			must_update_tiles = true;
		}*/
	}

	if(new_y !== this.cpos[1]) {
		this.cpos[1] = new_y;
		/*if(Math.floor(this.cpos[1] / this.tile_dim[1]) !== this.y_tiles[0]) {
			must_update_tiles = true;
		}*/
	}

	if(must_update_tiles) {
		this.update_tiles();
	}

	this._pos_changed = true;
};


Camera.prototype.update_tiles = function() {
	this.x_tiles = range(Math.floor(this.cpos[0] / this.tile_dim[0]),
		Math.ceil((this.cpos[0] + this.cwidth) / this.tile_dim[0]));
	this.y_tiles = range(Math.floor(this.cpos[1] / this.tile_dim[1]),
		Math.ceil((this.cpos[1] + this.cheight) / this.tile_dim[1]));

	debug3.value = Math.floor(this.cpos[0] / this.tile_dim[0]) + '-' + Math.ceil((this.cpos[0] + this.cwidth) / this.tile_dim[0]) + ' ' + Math.floor(this.cpos[1] / this.tile_dim[1]) + '-' + Math.ceil((this.cpos[1] + this.cheight) / this.tile_dim[1]);
};


Camera.prototype.update_visible_level = function(dt) {
	if(this.survival.action_active) {
		for(let tile of this.survival.action.tiles) {
			this._tiles_to_render.add(JSON.stringify(tile));
		}

		this.survival.action.update(dt);
	}

	for(let y of this.y_tiles) {
		for(let x of this.x_tiles) {
			if(this.level.bg_sprites[y][x] === null) {
				this._tiles_to_render.add(JSON.stringify([x, y]));
			}
			else {
				this.level.bg_sprites[y][x].update(dt);
				if(this._pos_changed || this.level.bg_sprites[y][x].is_new_frame()) {
					this._tiles_to_render.add(JSON.stringify([x, y]));
				}
			}

			if(this.level.mobmap[y][x] !== null && this.level.mobmap[y][x].type !== SURV_MAP.PLACEHOLDER) {
				this.level.mobmap[y][x].sprite.update(dt);
				if(this._pos_changed || this.level.mobmap[y][x].sprite.is_new_frame()) {
					this._movs_to_render.push(this.level.mobmap[y][x]);
					this._tiles_to_render.add(JSON.stringify([x, y]));
					switch(this.level.mobmap[y][x].movement) {
						case DIR.N:
							this._tiles_to_render.add(JSON.stringify([x, y-1]));
							break;
						case DIR.S:
							this._tiles_to_render.add(JSON.stringify([x, y+1]));
							break;
						case DIR.W:
							this._tiles_to_render.add(JSON.stringify([x-1, y]));
							break;
						case DIR.E:
							this._tiles_to_render.add(JSON.stringify([x+1, y]));
							break;
					}
				}
			}
		}
	}
};


Camera.prototype.render = function() {
	ctx.save();
	ctx.translate(this.offset[0], this.offset[1]);
	ctx.beginPath();
	ctx.rect(0, 0, this.cwidth, this.cheight);
	ctx.clip();

	if(this._tiles_to_render.size || this._movs_to_render.length) {
		debug1.value = this._tiles_to_render.size + ' ' + this._movs_to_render.length;
	}
	/*if(this._tiles_to_render.size === 2) {
		console.log(this._movs_to_render);
	}*/
	let pos, x, y;
	for(let coord of this._tiles_to_render) {
		pos = JSON.parse(coord);
		x = pos[0];
		y = pos[1];

		if(this.level.bg_sprites[y][x] === null) {
			this.level.request_sprite(x, y);
		}
		this.level.bg_sprites[y][x].render(ctx,
			[x * this.tile_dim[0] - this.cpos[0],
			y * this.tile_dim[1] - this.cpos[1]]);
	}

	for(let mov of this._movs_to_render) {
		mov.sprite.render(ctx,
			[Math.round(mov.tile[0] * this.tile_dim[0] + mov.rel_pos[0] - this.cpos[0]),
			Math.round(mov.tile[1] * this.tile_dim[1] + mov.rel_pos[1] - this.cpos[1])]);
	}

	if(this.survival.action_active) {
		this.survival.action.render(ctx,
			[Math.round(this.survival.action.tiles[0][0] * this.tile_dim[0] - this.cpos[0] + this.survival.action.offset[0]),
			Math.round(this.survival.action.tiles[0][1] * this.tile_dim[1] - this.cpos[1] + this.survival.action.offset[1])]);
	}

	ctx.restore();

	this.survival.draw_minimap();
	this._pos_changed = false;
	this._tiles_to_render.clear();
	this._movs_to_render = [];
};


/*Camera.prototype.to_tiles = function(obj, size) {
	const pos = [obj.tile[0] * this.tile_dim[0] + obj.rel_pos[0], obj.tile[1] * this.tile_dim[1] + obj.rel_pos[1]];
	const x_tiles = range(Math.floor(pos[0] / this.tile_dim[0]), Math.ceil((pos[0] + size[0]) / this.tile_dim[0]));
	const y_tiles = range(Math.floor(pos[1] / this.tile_dim[1]), Math.ceil((pos[1] + size[1]) / this.tile_dim[1]));

	let res = [];
	for(let x of x_tiles) {
		for(let y of y_tiles) {
			res.push([x, y]);
		}
	}

	return res;
};*/
