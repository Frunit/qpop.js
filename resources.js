'use strict';
// https://github.com/jlongster/canvas-game-bootstrap

(function() {
	let resourceCache = {};
	let readyCallback = null;
	let progressCallback = null;
	let loaded = 0;

	// Load an image url or an array of image urls
	function load(Arr) {
		Arr.forEach((url) => { _load(url); });
	}

	function _load(url) {
		if( ! resourceCache[url]) {
			let img = new Image();
			img.onload = function() {
				resourceCache[url] = img;

				loaded++;
				progressCallback(loaded);

				if(isReady()) {
					readyCallback();
				}
			};
			img.src = url;
		}
		resourceCache[url] = false;
	}

	function get(url) {
		return resourceCache[url];
	}

	function isReady() {
		for(let k in resourceCache) {
			if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
				return false;
			}
		}
		return true;
	}

	function onReady(func) {
		readyCallback = func;
	}

	function onProgress(func) {
		progressCallback = func;
	}

	window.resources = {
		load: load,
		get: get,
		onReady: onReady,
		onProgress: onProgress,
		isReady: isReady,
	};
})();
