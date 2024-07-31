import { Point } from "./types";

// TODO: Remember that canvasPos probably needs to be updated when the window size changes!

export class InputManager {
	private pressedKeys: {[key: string]: boolean} = {};
	private mousePos: Point = [0, 0];
	private clickPos: Point | null = null;
	private rightClickPos: Point | null = null;
	static #instance: InputManager | null = null;

	constructor(canvas: HTMLCanvasElement, private canvasPos: DOMRect) {
		if (InputManager.#instance !== null) {
			throw new Error("InputManager can't be instantiated more than once.")
		}
		InputManager.#instance = this;
		this.setListeners(canvas);
	}

	getMousePos(): Point {
		return this.mousePos;
	}

	getClickPos(): Point | null {
		return this.clickPos;
	}

	getRightClickPos(): Point | null {
		return this.rightClickPos;
	}

	isDown(key: string): boolean {
		return this.pressedKeys[key];
	}

	reset(key: string): void {
		this.pressedKeys[key] = false;
	}

	resetClickPos(): void {
		this.clickPos = null;
	}

	resetRightClickPos(): void {
		this.rightClickPos = null;
	}

	private setKey(code: string, status: boolean): void {
		let key;

		switch(code) {
		case 'Space':
		case ' ': // Older browsers: also 'Spacebar'
			key = 'SPACE'; break;
		case 'Enter':
			key = 'ENTER'; break;
		case 'Escape': // Older browsers: also 'Esc'
			key = 'ESCAPE'; break;
		case 'KeyA':
		case 'ArrowLeft':
		case 'a':
			key = 'LEFT'; break;
		case 'KeyW':
		case 'ArrowUp':
		case 'w':
			key = 'UP'; break;
		case 'KeyD':
		case 'ArrowRight':
		case 'd':
			key = 'RIGHT'; break;
		case 'KeyS':
		case 'ArrowDown':
		case 's':
			key = 'DOWN'; break;
		case 'KeyP':
		case 'p':
			key = 'PAUSE'; break;
		}

		if (key !== undefined) {
			this.pressedKeys[key] = status;
		}
	}

	private setMousePos(event: MouseEvent): void {
		this.mousePos = [event.x - this.canvasPos.left, event.y - this.canvasPos.top];
		this.pressedKeys['MOVE'] = true;
	}

	private onKeyDown(event: KeyboardEvent) {
		const code = event.code || event.key;
		if(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Space', ' '].includes(code)) {
			event.preventDefault();
		}
		if(!event.repeat) {
			this.setKey(code, true);
		}
	}

	private onKeyUp(event: KeyboardEvent) {
		const code = event.code || event.key;
		this.setKey(code, false);
	}

	private onMouseDown(event: MouseEvent) {
		this.setMousePos(event);
		if(event.button === 0) {
			this.clickPos = this.mousePos;
		}
		else if(event.button === 2) {
			this.rightClickPos = this.mousePos;
		}
		this.pressedKeys['MOUSE'] = true;
	}

	private onMouseUp(event: MouseEvent) {
		this.setMousePos(event);
		if(event.button === 0) {
			this.pressedKeys['CLICKUP'] = true;
			this.clickPos = null;
		}
		else if(event.button === 2) {
			this.pressedKeys['RCLICKUP'] = true;
			this.rightClickPos = null;
		}
		this.pressedKeys['MOUSE'] = true;
	}

	private onMouseOut() {
		this.clickPos = null;
		this.rightClickPos = null;
		this.pressedKeys['BLUR'] = true;
		this.pressedKeys['MOUSE'] = true;
	}

	private onBlur() {
		this.pressedKeys = {};
		this.pressedKeys['CLICK'] = false;
		this.pressedKeys['RCLICK'] = false;
		this.pressedKeys['BLUR'] = true;
		this.pressedKeys['MOUSE'] = true;
	}

	private setListeners(canvas: HTMLCanvasElement) {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
	
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	
		canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
	
		canvas.addEventListener('mousemove', this.setMousePos.bind(this));
	
		canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
	
		canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
	
		window.addEventListener('blur', this.onBlur.bind(this));
	}
}
