'use strict';
// https://github.com/jlongster/canvas-game-bootstrap

(function() {
	let pressedKeys = {};
	let mousePos = [0, 0];

	function setKey(event, status) {
		const code = event.code || event.key;
		let key;

		switch(code) {
		case 'Space':
		case ' ': // Older browsers: also 'Spacebar'
			key = 'SPACE'; break; // ' ' 1B
		case 'Enter':
			key = 'ENTER'; break; // '⏎' 3B
		case 'Escape': // Older browsers: also 'Esc'
			key = 'ESCAPE'; break; // '␛' 3B
		case 'KeyA':
		case 'ArrowLeft':
		case 'a':
			key = 'LEFT'; break; // '←' 3B
		case 'KeyW':
		case 'ArrowUp':
		case 'w':
			key = 'UP'; break; // '↑' 3B
		case 'KeyD':
		case 'ArrowRight':
		case 'd':
			key = 'RIGHT'; break; // '→' 3B
		case 'KeyS':
		case 'ArrowDown':
		case 's':
			key = 'DOWN'; break; // '↓' 3B
		}

		pressedKeys[key] = status;
	}

	function setMousePos(e) {
		mousePos = [e.x - canvas_pos.left, e.y - canvas_pos.top];
		pressedKeys['MOVE'] = true;
	}

	document.addEventListener('keydown', function(e) {
		setKey(e, true);
	});

	document.addEventListener('keyup', function(e) {
		setKey(e, false);
	});

	canvas.addEventListener('mousedown', function(e) {
		setMousePos(e);
		if(e.button === 0) {
			pressedKeys['CLICK'] = mousePos;
		}
		else if(e.button === 2) {
			pressedKeys['RCLICK'] = mousePos;
		}
		pressedKeys['MOUSE'] = true; // '🖰' 4B
	});

	canvas.addEventListener('mousemove', setMousePos);

	canvas.addEventListener('mouseup', function(e) {
		setMousePos(e);
		if(e.button === 0) {
			pressedKeys['CLICKUP'] = true;
			pressedKeys['CLICK'] = false;
		}
		else if(e.button === 2) {
			pressedKeys['RCLICKUP'] = true;
			pressedKeys['RCLICK'] = false;
		}
		pressedKeys['MOUSE'] = true;
	});

	canvas.addEventListener('mouseout', function(e) {
		pressedKeys['CLICK'] = false;
		pressedKeys['RCLICK'] = false;
		pressedKeys['BLUR'] = true;
		pressedKeys['MOUSE'] = true;
	});

	window.addEventListener('blur', function() {
		pressedKeys = {};
		pressedKeys['CLICK'] = false;
		pressedKeys['RCLICK'] = false;
		pressedKeys['BLUR'] = true;
		pressedKeys['MOUSE'] = true;
	});

	window.input = {
		isDown: function(key) {
			return pressedKeys[key];
		},

		mousePos: function() {
			return mousePos;
		},

		reset: function(key) {
			pressedKeys[key] = false;
		}
	};
})();
