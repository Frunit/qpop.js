'use strict';
// https://github.com/jlongster/canvas-game-bootstrap

function Sprite(url, size, offset=[0,0], speed=0, frames=[[0,0]], once=false, callback=null) {
	this.pic = resources.get(url);
	this.offset = offset;
	this.size = size;
	this.speed = speed;
	this.active_speed = speed;
	this.frames = frames;
	this.once = once;
	this.callback = callback;
	this._index = 0;
	this._last_frame = 0;
	this.done = false;
}


Sprite.prototype.update = function(dt) {
	this._index += this.speed*dt;
};


Sprite.prototype.reset = function() {
	this._index = 0;
};


Sprite.prototype.stop = function() {
	this.speed = 0;
};


Sprite.prototype.start = function() {
	this.speed = this.active_speed;
};


Sprite.prototype.is_new_frame = function() {
	if(this.speed) {
		return Math.floor(this._index) % this.frames.length !== this._last_frame;
	}
	return false;
};


Sprite.prototype.render = function(ctx, pos) {
	let frame;

	if(this.speed) {
		const max = this.frames.length;
		const idx = Math.floor(this._index);
		frame = this.frames[idx % max];
		if(idx % max !== this._last_frame) {
			this._last_frame = idx % max;
		}

		if(this.once && idx >= max - 1) {
			this.done = true;
		}
	}
	else {
		frame = this.frames[0];
	}

	ctx.drawImage(this.pic,
				  this.offset[0] + frame[0], this.offset[1] + frame[1],
				  this.size[0], this.size[1],
				  pos[0], pos[1],
				  this.size[0], this.size[1]);
};
