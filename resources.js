'use strict';

(function() {
	const resource_cache = {};
	let ready_callback = () => {};
	let ready_param = null;
	const loading = [];
	const load_status = {};
	let loaded = 0;
	let audio_enabled = true;
	let initial_play = true;

	let best_audio_suffix = null;
	const context = new AudioContext();
	const music_node = context.createGain();
	const sound_node = context.createGain();
	const musics = {};
	const sounds = {};
	let currently_playing_music = '';
	const currently_playing_sounds = new Set();


	// Load an array of resources
	// Format: [url, type, name]. Name is optional. Type must be "audio" or "image". The suffix for "audio" will be appended, so give the url without suffix for audio.
	function load(Arr) {
		for(let elem of Arr) {
			let url = elem[0];
			const type = elem[1];
			const name = (elem.length === 3) ? elem[2] : url;

			// determine audio format. If no audio is possible, load nothing.
			if(type === 'audio') {
				if(best_audio_suffix === null || !audio_enabled) {
					continue;
				}

				url += best_audio_suffix;
			}

			_load(url, name, type);
		}
	}

	function _load(url, name, type) {
		if(!resource_cache[name]) {
			loading.push(name);
			resource_cache[name] = true;

			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			load_status[name] = 0;

			if(type === 'audio') {
				request.addEventListener('load',
					(event) => {
						context.decodeAudioData(request.response, (buffer) => {
							resource_cache[name] = buffer;
							loaded++;
							_update_load_status(name, event.loaded);

							if(_is_ready()) {
								ready_callback(ready_param);
							}
						}, (e) => {console.warn('Error: ' + e.err);});
					}
				);
			}
			else { // image
				request.addEventListener('load',
					(event) => {
						const img = new Image();
						const blob = new Blob([request.response]);
						img.src = window.URL.createObjectURL(blob);
						resource_cache[name] = img;
						window.URL.revokeObjectURL(blob);

						loaded++;
						_update_load_status(name, event.loaded);

						if(_is_ready()) {
							ready_callback(ready_param);
						}
					}
				);
			}

			request.addEventListener('progress',
				(event) => {_update_load_status(name, event.loaded);}
			);

			request.send();
		}
	}

	function _update_load_status(name, bytes) {
		load_status[name] = bytes;
	}

	function get_suffix() {
		if(!audio_enabled) {
			return '';
		}

		if(best_audio_suffix === null) {
			const mimes = [
				['.mp3', 'audio/mp3; codecs="mp3"'],
				['.mp3', 'audio/mp4; codecs="mp3"'],
				['.mp3', 'audio/mpeg; codecs="mp3"'],
				['.ogg', 'audio/ogg; codecs="vorbis"'],
				['.m4a', 'audio/m4a; codecs="aac"'],
				['.m4a', 'audio/aac; codecs="aac"'],
			];

			const audio_elem = document.createElement('audio');
			for(let mime of mimes) {
				if(audio_elem.canPlayType(mime[1]) === 'probably') {
					best_audio_suffix = mime[0];
					break;
				}
			}

			if(best_audio_suffix === null) {
				return '';
			}
		}

		return best_audio_suffix;
	}

	function get(name) {
		return resource_cache[name];
	}

	function _is_ready() {
		return loaded === loading.length;
	}

	function on_ready(func, param) {
		ready_callback = func;
		ready_param = param;
	}

	function get_status() {
		let bytes = 0;
		for(let obj in load_status) {
			bytes += load_status[obj];
		}
		return bytes;
	}

	function play_music(name) {
		if(initial_play) {
			initial_play = false;

			if(context.state === 'suspended') {
				context.resume();
			}
		}

		if(currently_playing_music) {
			if(currently_playing_music === name) {
				return;
			}

			musics[currently_playing_music].stop();
		}

		musics[name] = context.createBufferSource();
		musics[name].connect(music_node).connect(context.destination);
		musics[name].loop = true;
		musics[name].buffer = get(name);

		musics[name].start(0, 0);

		currently_playing_music = name;
	}

	function play_sound(name, loop=false) {
		if(initial_play) {
			initial_play = false;

			if(context.state === 'suspended') {
				context.resume();
			}
		}

		if(currently_playing_sounds.has(name)) {
			sounds[name].stop();
			currently_playing_sounds.delete(name);
		}

		sounds[name] = context.createBufferSource();
		sounds[name].connect(sound_node).connect(context.destination);
		sounds[name].buffer = get(name);
		sounds[name].addEventListener('ended',
			() => {currently_playing_sounds.delete(name);}
		);
		sounds[name].loop = loop;
		sounds[name].start(0, 0);

		currently_playing_sounds.add(name);
	}

	function stop_music() {
		if(currently_playing_music) {
			musics[currently_playing_music].stop();
			currently_playing_music = '';
		}
	}

	function stop_sound(name=null) {
		if(name === null) {
			for(let elem of currently_playing_sounds) {
				sounds[elem].stop();
			}
			currently_playing_sounds.clear();
		}

		if(sounds[name]) {
			sounds[name].stop();
			currently_playing_sounds.delete(name);
		}
	}

	function set_music_volume(volume) {
		music_node.gain.value = volume;
	}

	function set_sound_volume(volume) {
		sound_node.gain.value = volume;
	}

	function pause() {
		if(context.state === 'running') {
			context.suspend();
		}
	}

	function unpause() {
		if(context.state === 'suspended' && audio_enabled) {
			context.resume();
		}
	}

	function disable_audio() {
		audio_enabled = false;
	}

	window.resources = {
		load: load,
		get: get,
		on_ready: on_ready,
		get_status: get_status,
	};

	window.audio = {
		play_music: play_music,
		play_sound: play_sound,
		stop_music: stop_music,
		stop_sound: stop_sound,
		pause: pause,
		unpause: unpause,
		set_music_volume: set_music_volume,
		set_sound_volume: set_sound_volume,
		get_suffix: get_suffix,
		disable_audio: disable_audio,
	};
})();
