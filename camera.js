'use strict';

function Camera(level, tile_dim, window_dim, offset) {
	this.level = level;
	this.tile_dim = tile_dim;
	this.cwidth = window_dim[0];
	this.cheight = window_dim[1];
	this.offset = offset;
	this._pos_changed = true;
	this._tiles_to_render = new Set();
	this._movs_to_render = [];
	this.x_tiles = [];
	this.y_tiles = [];

	this.cpos = [0, 0]; // Camera position

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

			if(this.level.mobmap[y][x] !== null) {
				this.level.mobmap[y][x].sprite.update(dt);
				if(this._pos_changed || this.level.mobmap[y][x].sprite.is_new_frame()) {
					this._movs_to_render.push(this.level.mobmap[y][x]);
					this._tiles_to_render.add(JSON.stringify([x, y]));
					switch(this.level.mobmap[y][x].movement) {
						case NORTH:
							this._tiles_to_render.add(JSON.stringify([x, y-1]));
							break;
						case SOUTH:
							this._tiles_to_render.add(JSON.stringify([x, y+1]));
							break;
						case WEST:
							this._tiles_to_render.add(JSON.stringify([x-1, y]));
							break;
						case EAST:
							this._tiles_to_render.add(JSON.stringify([x+1, y]));
							break;
					}
				}
			}
		}
	}
};


Camera.prototype.draw_minimap = function() {
	draw_black_rect(this.minimap_offset, this.minimap_dim, '#000000');

	const MM_PLAYER = 0;
	const MM_FOOD = 1;
	const MM_LOVE = 2;
	const MM_PREDATOR = 3;
	const MM_ENEMY = 4;

	const range = (game.current_player.stats[ATT_PERCEPTION] * 7 + game.current_player.stats[ATT_INTELLIGENCE]) / 10;
	let draw = false;
	let sym, real_x, real_y, dist, threshold;

	for(let y = -range; y < range; y++) {
		real_y = this.level.character.tile[1] + y;
		for(let x = -range; x < range; x++) {
			real_x = this.level.character.tile[0] + x;

			// If the range is too low, don't show anything here
			if(range <= Math.sqrt(y**2 + x**2) * 10 - 30) {
				continue;
			}

			draw = false;
			if(x === 0 && y === 0) {
				draw = true;
				sym = MM_PLAYER;
			}
			else if(this.level.mobmap[real_y][real_x] !== null) {
				switch(this.level.mobmap[real_y][real_x].type) {
					case SM_PREDATOR:
						draw = true;
						sym = MM_PREDATOR;
						break;
					case SM_ENEMY:
						draw = true;
						sym = MM_ENEMY;
						break;
					case SM_FEMALE:
						draw = true;
						sym = MM_LOVE;
						break;
				}
			}
			else if(this.level.map[real_y][real_x] < 36) {
				switch(this.level.map[real_y][real_x] % 6) {
					case 3:
						threshold = 75;
						break;
					case 4:
						threshold = 50;
						break;
					case 5:
						threshold = 25;
						break;
					default:
						threshold = 110;
				}

				if(game.current_player.stats[Math.floor(this.level.map[real_y][real_x] / 6)] > threshold) {
					draw = true;
					sym = MM_FOOD;
				}
			}

			if(draw) {
				ctx.drawImage(this.gui_pics,
					this.minimap_sym_soffset[0] + sym * this.minimap_sym_dim[0],
					this.minimap_sym_soffset[1],
					this.minimap_sym_dim[0], this.minimap_sym_dim[1],
					this.minimap_offset[0] + (this.center + x) * this.minimap_sym_dim[0],
					this.minimap_offset[1] + (this.center + y) * this.minimap_sym_dim[1],
					this.minimap_sym_dim[0], this.minimap_sym_dim[1]);
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

	if(this._tiles_to_render.size || this._movs_to_render.length)
		debug1.value = this._tiles_to_render.size + ' ' + this._movs_to_render.length;
	if(this._tiles_to_render.size === 2) {
		console.log(this._movs_to_render);
	}
	let pos, x, y, sprite;
	for(let coord of this._tiles_to_render) {
		pos = JSON.parse(coord);
		x = pos[0];
		y = pos[1];

		if(this.level.bg_sprites[y][x] === null) {
			this.level.request_sprite(x, y);
		}
		this.level.bg_sprites[y][x].render(ctx, [x * this.tile_dim[0] - this.cpos[0], y * this.tile_dim[1] - this.cpos[1]]);
	}

	for(let mov of this._movs_to_render) {
		mov.sprite.render(ctx, [Math.round(mov.tile[0] * this.tile_dim[0] + mov.rel_pos[0] - this.cpos[0]),
		Math.round(mov.tile[1] * this.tile_dim[1] + mov.rel_pos[1] - this.cpos[1])]);
	}

	ctx.restore();

	this.draw_minimap();
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
