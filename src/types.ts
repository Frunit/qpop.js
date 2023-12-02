import { DIR, SCENE } from "./helper";
import { InputManager } from "./input";
import { Player } from "./player";
import { ResourceManager } from "./resources";

export const LANG_DE = 'DE';
export const LANG_EN = 'EN';

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type SixNumbers = Tuple<number, 6>;

export type ClickArea = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    down: Function,
    up: Function,
    blur: Function,
    move?: Function,
	default_pointer?: boolean,
};

// export type TutorialType = {
//     name: string,
//     pos: Point,
//     arrows: ;
//     low_anchor: ;
// };

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
    clickareas: ClickArea[];
    rightclickareas: ClickArea[];
    keys: KeyType[];
    glob: TechGlobal;
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
    lang: any, // TODO
    clickareas: ClickArea[];
	rightclickareas: ClickArea[];
    options: any, // TODO
    next_stage: Function, // TODO
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
    name: string,
    pos: Point,
    arrows: TutorialArrow[],
    low_anchor?: boolean,
    highlight?: Tuple<number, 4>,
};

export type AnimationFrames = {
	size?: Dimension,
	offset?: Point,
	soffset?: Point,
	frames: Point[] | Point[][],
    transitions?: number[][],
};

export type NamedAnimationFrames = Record<string, AnimationFrames>;

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
