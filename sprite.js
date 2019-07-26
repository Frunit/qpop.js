'use strict';


function Sprite(url, size, offset=[0,0], frames=[[0,0]], once=false, callback=null) {
	this.pic = resources.get(url);
	this.offset = offset;
	this.size = size;
	this.frames = frames;
	this.once = once;
	this.callback = callback;
	this.idx = 0;
	this.finished = false;
}


Sprite.prototype.update = function() {
	if(!this.finished) {
		this.idx++;
	}
};


Sprite.prototype.reset = function() {
	this.idx = 0;
	this.finished = false;
};


Sprite.prototype.is_new_frame = function() {
	return !this.finished || this.frames.length > 1;
};


Sprite.prototype.render = function(ctx, pos) {
	const real_idx = this.idx % this.frames.length;
	const frame = this.frames[real_idx];

	if(this.once && real_idx === this.frames.length - 1) {
		this.finished = true;
	}

	ctx.drawImage(this.pic,
				  this.offset[0] + frame[0], this.offset[1] + frame[1],
				  this.size[0], this.size[1],
				  pos[0], pos[1],
				  this.size[0], this.size[1]);
};
