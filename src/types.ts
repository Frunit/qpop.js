import { DIR, SCENE } from "./helper";
import { i18nStrings } from "./i18n";
import { InputManager } from "./input";
import { Player } from "./player";
import { ResourceManager } from "./resources";

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type SixNumbers = Tuple<number, 6>;

export type ClickArea = {
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	down: (x: number, y: number) => void,
	up: (x: number, y: number) => void,
	blur: () => void,
	move?: (x: number, y: number) => void,
	default_pointer?: boolean,
};

export type GameOptions = {
	/** Language of the game */
	language: string,
	/** Internal index of wm_ai_delay options */
	wm_ai_delay_idx: number,
	/** How many frames between two moves of the AI */
	wm_ai_delay: number,
	/** After the AI finished, shall the "continue" button be pressed automatically? */
	wm_ai_auto_continue: boolean,
	/** Enable click and hold to place/remove units from world map */
	wm_click_and_hold: boolean,
	/** Show plant distribution on mutation screen */
	plant_distribtion: boolean,
	/** Show vanquished predators in survival */
	show_predators: boolean,
	/** Show the tutorial */
	tutorial: boolean,
	/** How many frames to show the transition screens */
	transition_delay: number,
	music_on: boolean,
	/** Music volume (0 - 100) */
	music: number,
	sound_on: boolean,
	/** Sound volume (0 - 100) */
	sound: number,
	audio_enabled: boolean,
	/** Screen update frequency in frames per second */
	update_freq: number,
};

export type KeyType = {
	key: string,
	action: () => void,
	reset: boolean,
};

export interface Stage {
	id: SCENE;
	tutorials?: TutorialType[];
	initialize: (autosave?: boolean) => void;
	redraw: () => void;
	render: () => void;
	update: () => void;
	next_player?: () => void;
	clickareas: ClickArea[];
	rightclickareas: ClickArea[];
	keys: KeyType[];
}

export type Point = [number, number];

export type Dimension = [number, number];

export type LocalSave = {
	players: Player[],
	world_map: number[][],
	height_map: number[][],
	map_positions: number[][],
	turn: number,
	max_turns: number,
	humans_present: boolean,
	water_level: number,
	humid: number,
	temp: number,
	infinite_game: boolean,
	datetime: string,
	version: Tuple<number, 3>,
};

export type TechGlobal = {
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	canvas_pos: DOMRect,
	lang: i18nStrings,
	clickareas: ClickArea[];
	rightclickareas: ClickArea[];
	options: GameOptions,
	resources: ResourceManager,
	input: InputManager,
};

export type WorldGlobal = {
	players: Player[],
	max_turns: number,
	turn: number,
	humid: number,
	temp: number,
	water_level: number,
	mountain_level: number,
	humans_present: boolean,
	infinite_game: boolean,
	current_player: Player,
	height_map: number[][],
	world_map: number[][],
	map_positions: number[][],
};

export type ResourceElement = {
	url: string,
	type: string,
	name?: string,
};

type TutorialArrow = {
	dir: DIR,
	offset: number,
};

export type TutorialType = {
	name: keyof i18nStrings['tutorial'],
	pos: Point,
	arrows: TutorialArrow[],
	low_anchor?: boolean,
	highlight?: Tuple<number, 4>,
};

export type AnimationFrames = {
	size?: Dimension,
	offset?: Point,
	soffset?: Point,
	frames: Point[],
};

export type RandomAnimationFrames = {
	soffset: Point,
	frames: Point[][],
	transitions: number[][],
};

export type NamedAnimationFrames = Record<string, AnimationFrames>;
export type NamedListOfAnimationsFrames = Record<string, AnimationFrames[]>;

// Animations

type PicAndPos = [string, number, number];

type Moves = {
  xabs: boolean,
  yabs: boolean,
  fixed: boolean,
  pause: boolean,
  end: boolean,
  img: number,
  delay: number,
  counter: number,
  x: number,
  y: number,
  loop: number[],
  activate: number[],
};

type Seq = {
  delay: number,
  pos: number,
  active: boolean,
  x: number,
  y: number,
  img: number,
  moves: Moves[],
};

type Fixed = {
  seq_img: number,
  move_img: number,
  x: number,
  y: number,
};

export type AnimationType = {
  size: Point,
  bg: PicAndPos,
  imgs: PicAndPos[],
  seqs: Seq[],
  fixed: Fixed[],
  paused: (Fixed | null)[],
};
