let isInit = true;
let size, dt = {};
let param = {};

function preload() {
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	// frameRate(10);
	noLoop();
}

function draw() {
	_spirals = isInit ? [...Array(10)] : dt.spirals;
	dt.spirals = _spirals.map((_spiral, i) => {
		const spiral = {};
		spiral.angle = (() => {
			// reset when _radius over max
		})();
		spiral.a = (() => {
			// reset when angle === 0
		})();
		spiral.b = (() => {
			// reset when angle === 0
		})();
		spiral.radius = (() => {
			// determind by angle
		})();
		spiral.mid = (() => {
			// reset when angle === 0
		})();
		return spiral;
	})
	background(255);
	drawFrame(size, size);
	// debug
	debug();
	// reset status
	if (isInit) isInit = false;
}
