import { SCENE } from "./helper";
import { i18n } from "./i18n";
import { Player } from "./player";

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
    tutorials: any[]; // TODO: Type of tutorials!!!
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
	height_map: number[][] | null,
	world_map: number[][] | null,
	map_positions: number[][] | null,
};

export type ResourceElement = {
    url: string,
    type: string,
    name?: string,
};
