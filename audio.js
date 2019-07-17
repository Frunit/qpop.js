'use strict';

// https://www.html5rocks.com/en/tutorials/webaudio/intro/
// https://css-tricks.com/introduction-web-audio-api/

(function() {
	let context = AudioContext();
	let resourceCache = {};
	let loading = [];
	let readyCallback = null;

	// Load an array of sound urls
	function load(Arr) {
		Arr.forEach((url) => { _load(url); });
	}

	function _load(url) {
		if(!resourceCache[url]) {
			loading.push(url)
			let request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = function() => {
				context.decodeAudioData(request.response, (buffer) => {
					resourceCache[url] = buffer;

					if(isReady()) {
						readyCallback();
					}
				}, onError);
			}
			request.send();
		}
	}

	function get(url) {
		return resourceCache[url];
	}

	function isReady() {
		for(let k in loading) {
			if(!resourceCache[k]) {
				return false;
			}
		}
		return true;
	}

	function onReady(func) {
		readyCallback = func;
	}

	window.audio = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady
	};
})();
