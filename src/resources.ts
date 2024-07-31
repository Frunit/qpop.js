import { ResourceLoader } from "./loader";
import { ResourceElement } from "./types";

export class ResourceManager {
	private image_cache: {[key: string]: true | HTMLImageElement} = {};
	private audio_cache: {[key: string]: true | AudioBuffer} = {};
	private ready_callback: (self: ResourceLoader) => void = () => {};
	private ready_param?: ResourceLoader;
	private loading: string[] = [];
	private load_status: {[key: string]: number} = {};
	private loaded = 0;
	private audio_enabled = true;
	private initial_play = true;

	private best_audio_suffix: string | null = null;
	private context: AudioContext;
	private music_node: GainNode;
	private sound_node: GainNode;
	private musics: {[key: string]: AudioBufferSourceNode} = {};
	private sounds: {[key: string]: AudioBufferSourceNode} = {};
	private currently_playing_music = '';
	private currently_playing_sounds: Set<string> = new Set();

	constructor() {
		this.context = new AudioContext();
		this.music_node = this.context.createGain();
		this.sound_node = this.context.createGain();
	}


	// Load an array of resources
	// Format: [url, type, name]. Name is optional. Type must be "audio" or "image". The suffix for "audio" will be appended, so give the url without suffix for audio.
	load(resources: ResourceElement[]) {
		for (const resource of resources) {
			let url = resource.url;
			const type = resource.type;
			const name = resource.name ? resource.name : url;

			// determine audio format. If no audio is possible, load nothing.
			if(type === 'audio') {
				if(this.best_audio_suffix === null || !this.audio_enabled) {
					continue;
				}

				url += this.best_audio_suffix;
				this._load_audio(url, name);
			}
			else {
				this._load_image(url, name);
			}
		}
	}

	private _load_audio(url: string, name: string) {
		if(this.audio_cache[name]) {
			return;
		}
		this.loading.push(name);
		this.audio_cache[name] = true;

		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		this.load_status[name] = 0;

		request.addEventListener('load',
			(event) => {
				this.context.decodeAudioData(request.response, (buffer) => {
					this.audio_cache[name] = buffer;
					this.loaded++;
					this._update_load_status(name, event.loaded);

					if(this._is_ready() && this.ready_param) {
						this.ready_callback(this.ready_param);
					}
				}, (e) => {console.warn(`${e.name}: ${e.message}`);});
			}
		);

		request.addEventListener('progress',
			(event) => {this._update_load_status(name, event.loaded);}
		);

		request.send();
	}
	
	private _load_image(url: string, name: string) {
		if(this.image_cache[name]) {
			return;
		}
		this.loading.push(name);
		this.image_cache[name] = true;

		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		this.load_status[name] = 0;

		request.addEventListener('load',
			(event) => {
				const img = new Image();
				const blob = new Blob([request.response]);
				img.src = window.URL.createObjectURL(blob);
				this.image_cache[name] = img;
				window.URL.revokeObjectURL(img.src);

				this.loaded++;
				this._update_load_status(name, event.loaded);

				if(this._is_ready() && this.ready_param) {
					this.ready_callback(this.ready_param);
				}
			}
		);

		request.addEventListener('progress',
			(event) => {this._update_load_status(name, event.loaded);}
		);

		request.send();
	}

	private _update_load_status(name: string, bytes: number) {
		this.load_status[name] = bytes;
	}

	get_suffix() {
		if(!this.audio_enabled) {
			return '';
		}

		if(this.best_audio_suffix === null) {
			const mimes = [
				['.mp3', 'audio/mp3; codecs="mp3"'],
				['.mp3', 'audio/mp4; codecs="mp3"'],
				['.mp3', 'audio/mpeg; codecs="mp3"'],
				['.m4a', 'audio/m4a; codecs="aac"'],
				['.m4a', 'audio/aac; codecs="aac"'],
				['.ogg', 'audio/ogg; codecs="vorbis"'],
			];

			const audio_elem = document.createElement('audio');
			for (const mime of mimes) {
				if(audio_elem.canPlayType(mime[1]) === 'probably') {
					this.best_audio_suffix = mime[0];
					break;
				}
			}

			if(this.best_audio_suffix === null) {
				return '';
			}
		}

		return this.best_audio_suffix;
	}

	get_audio(name: string): AudioBuffer {
		const result = this.audio_cache[name];
		if (result === true) {
			throw new Error(`Audio file ${name} has not finished loading!`);
		}
		return result;
	}

	get_image(name: string): HTMLImageElement {
		const result = this.image_cache[name];
		if (result === true) {
			throw new Error(`Image file ${name} has not finished loading!`);
		}
		return result;
	}

	private _is_ready() {
		return this.loaded === this.loading.length;
	}

	on_ready(func: (self: ResourceLoader) => void, param?: ResourceLoader) {
		this.ready_callback = func;
		this.ready_param = param;
	}

	get_status() {
		let bytes = 0;
		for(const value of Object.values(this.load_status)) {
			bytes += value;
		}
		return bytes;
	}

	play_music(name: string) {
		if(this.initial_play) {
			this.initial_play = false;

			if(this.context.state === 'suspended') {
				this.context.resume();
			}
		}

		if(this.currently_playing_music) {
			if(this.currently_playing_music === name) {
				return;
			}

			this.musics[this.currently_playing_music].stop();
		}

		this.musics[name] = this.context.createBufferSource();
		this.musics[name].connect(this.music_node).connect(this.context.destination);
		this.musics[name].loop = true;
		this.musics[name].buffer = this.get_audio(name);

		this.musics[name].start(0, 0);

		this.currently_playing_music = name;
	}

	play_sound(name: string, loop=false) {
		if(this.initial_play) {
			this.initial_play = false;

			if(this.context.state === 'suspended') {
				this.context.resume();
			}
		}

		if(this.currently_playing_sounds.has(name)) {
			this.sounds[name].stop();
			this.currently_playing_sounds.delete(name);
		}

		this.sounds[name] = this.context.createBufferSource();
		this.sounds[name].connect(this.sound_node).connect(this.context.destination);
		this.sounds[name].buffer = this.get_audio(name);
		this.sounds[name].addEventListener('ended',
			() => {this.currently_playing_sounds.delete(name);}
		);
		this.sounds[name].loop = loop;
		this.sounds[name].start(0, 0);

		this.currently_playing_sounds.add(name);
	}

	stop_music() {
		if(this.currently_playing_music) {
			this.musics[this.currently_playing_music].stop();
			this.currently_playing_music = '';
		}
	}

	stop_sound(name = '') {
		if(name === '') {
			for (const elem of this.currently_playing_sounds) {
				this.sounds[elem].stop();
			}
			this.currently_playing_sounds.clear();
		}
		else if(this.sounds[name]) {
			this.sounds[name].stop();
			this.currently_playing_sounds.delete(name);
		}
	}

	set_music_volume(volume: number) {
		this.music_node.gain.value = volume;
	}

	set_sound_volume(volume: number) {
		this.sound_node.gain.value = volume;
	}

	pause() {
		if(this.context.state === 'running') {
			this.context.suspend();
		}
	}

	unpause() {
		if(this.context.state === 'suspended' && this.audio_enabled) {
			this.context.resume();
		}
	}

	disable_audio() {
		this.audio_enabled = false;
	}
}