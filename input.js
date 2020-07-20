'use strict';


(function() {
	let pressedKeys = {};
	let mousePos = [0, 0];

	function setKey(code, status) {
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

		pressedKeys[key] = status;
	}

	function setMousePos(e) {
		mousePos = [e.x - canvas_pos.left, e.y - canvas_pos.top];
		pressedKeys['MOVE'] = true;
	}

	document.addEventListener('keydown', function(event) {
		const code = event.code || event.key;
		if(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Space', ' '].includes(code)) {
			event.preventDefault();
		}
		setKey(code, true);
	});

	document.addEventListener('keyup', function(event) {
		const code = event.code || event.key;
		setKey(code, false);
	});

	canvas.addEventListener('mousedown', function(e) {
		setMousePos(e);
		if(e.button === 0) {
			pressedKeys['CLICK'] = mousePos;
		}
		else if(e.button === 2) {
			pressedKeys['RCLICK'] = mousePos;
		}
		pressedKeys['MOUSE'] = true;
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

	canvas.addEventListener('mouseout', function() {
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
