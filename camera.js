'use strict';


// TODO: When the player stands still, predators move animation is strange towards the end


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
	//this.update_tiles(); Already done in move_to()
	this.update_visible_level();
}


Camera.prototype.move_to = function(obj) {
	const new_x = obj.tile[0] * this.tile_dim[0] + obj.rel_pos[0] + this.tile_dim[0]/2 - Math.floor(this.cwidth/2);
	const new_y = obj.tile[1] * this.tile_dim[1] + obj.rel_pos[1] + this.tile_dim[1]/2 - Math.floor(this.cheight/2);

	//debug2.value = 'nx: ' + new_x + '; ny: ' + new_y;

	if(new_x !== this.cpos[0]) {
		this.cpos[0] = new_x;
		this._pos_changed = true;
		this.x_tiles = range(Math.floor(this.cpos[0] / this.tile_dim[0]),
			Math.ceil((this.cpos[0] + this.cwidth) / this.tile_dim[0]));
	}

	if(new_y !== this.cpos[1]) {
		this.cpos[1] = new_y;
		this._pos_changed = true;
		this.y_tiles = range(Math.floor(this.cpos[1] / this.tile_dim[1]),
			Math.ceil((this.cpos[1] + this.cheight) / this.tile_dim[1]));
	}

	/*debug3.value = 'tiles: ' + Math.floor(this.cpos[0] / this.tile_dim[0]) + '-' +
					Math.ceil((this.cpos[0] + this.cwidth) / this.tile_dim[0]) + ' ' +
					Math.floor(this.cpos[1] / this.tile_dim[1]) + '-' +
					Math.ceil((this.cpos[1] + this.cheight) / this.tile_dim[1]);*/
};


Camera.prototype.update_visible_level = function() {
	if(this.survival.action !== null) {
		for(let tile of this.survival.action.tiles) {
			this._tiles_to_render.add(JSON.stringify(tile));
		}

		this.survival.action.update();
	}

	for(let y of this.y_tiles) {
		for(let x of this.x_tiles) {
			if(this.level.bg_sprites[y][x] === null) {
				this._tiles_to_render.add(JSON.stringify([x, y]));
			}
			else {
				this.level.bg_sprites[y][x].update();
				if(this._pos_changed || this.level.bg_sprites[y][x].is_new_frame()) {
					this._tiles_to_render.add(JSON.stringify([x, y]));
				}
			}

			const mob = this.level.mobmap[y][x];

			if(mob !== null && !mob.hidden) {
				if(mob.type === SURV_MAP.ENEMY ||
						mob.type === SURV_MAP.FEMALE ||
						mob.type === SURV_MAP.UNRESPONSIVE) {
					mob.sprite.update();
				}

				if(mob.type !== SURV_MAP.PLACEHOLDER) {
					if(this._pos_changed || mob.sprite.is_new_frame()) {
						this._movs_to_render.add(JSON.stringify([x, y]));
						this._tiles_to_render.add(JSON.stringify([x, y]));
					}
				}
				else { // if type === SURV_MAP.PLACEHOLDER
					const fx = mob.from_x;
					const fy = mob.from_y;

					// Render sprites that are outside the camera but are about to move into the camera (usually enemies)
					// The placeholder indicates where the object comes from that will occupy the spot
					if(!this.x_tiles.includes(fx) || !this.y_tiles.includes(fy)) {
						if(this._pos_changed || this.level.mobmap[fy][fx].sprite.is_new_frame()) {
							this._movs_to_render.add(JSON.stringify([fx, fy]));
							this._tiles_to_render.add(JSON.stringify([fx, fy]));
							this._tiles_to_render.add(JSON.stringify([x, y]));
						}
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

	if(this._tiles_to_render.size || this._movs_to_render.size) {
		debug1.value = 'tiles rndr: ' + this._tiles_to_render.size;
		debug5.value = 'moves rndr: ' + this._movs_to_render.size;

		/*if(this._movs_to_render.size === 1 && this._tiles_to_render.size === 1) {
			console.log(this.level.character.sprite.is_new_frame());
		}

		console.log(this._tiles_to_render.size, this._movs_to_render.size);*/
	}

	for(let coord of this._tiles_to_render) {
		const [x, y] = JSON.parse(coord);

		if(this.level.bg_sprites[y][x] === null) {
			this.level.request_sprite(x, y);
		}
		this.level.bg_sprites[y][x].render(ctx,
			[x * this.tile_dim[0] - this.cpos[0],
			y * this.tile_dim[1] - this.cpos[1]]);
	}

	for(let coord of this._movs_to_render) {
		const [x, y] = JSON.parse(coord);
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
