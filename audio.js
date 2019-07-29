'use strict';

// https://www.html5rocks.com/en/tutorials/webaudio/intro/
// https://css-tricks.com/introduction-web-audio-api/

(function() {
	let context = new AudioContext();
	let music_node = context.createGain();
	let sound_node = context.createGain();
	let resourceCache = {};
	let loading = [];
	let readyCallback = () => {};
	let progressCallback = () => {};
	let loaded = 0;

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

			request.onload = () => {
				context.decodeAudioData(request.response, (buffer) => {
					resourceCache[url] = buffer;
				}, (e) => {console.log('Error: ' + e.err)});

				loaded++;
				progressCallback(loaded);

				if(isReady()) {
					readyCallback();
				}
			};
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

	function onProgress(func) {
		progressCallback = func;
	}

	function play(file) {
		const bufferSource = context.createBufferSource();
		bufferSource.buffer = get(file);
		bufferSource.connect(sound_node).connect(context.destination);
		bufferSource.start();
	};

	window.audio = {
		load: load,
		get: get,
		play: play,
		onReady: onReady,
		onProgress: onProgress,
		isReady: isReady,
	};
})();
