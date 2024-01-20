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
		// reset when _radius over max
		const isReset = _spiral.angle > size * 2 / 3;
		spiral.angle = (() => {
			if (isReset) return 0;
			return _spiral.angle + 1; // todo change speed from 1
		})();
		spiral.a = (() => { // > 0
			if (!isReset) return _spiral.a;
			return random(0.1, 10); // todo find min/max
		})();
		spiral.b = (() => { 
			if (!isReset) return _spiral.a;
			return random(-10, 10); // todo find min/max
		})();
		spiral.radius = (() => {
			// r=ae^{b\theta}
			const ae = spiral.a * Math.E;
			return pow(ae, spiral.b / spiral.angle);
		})();
		spiral.mid = (() => {
			if (!isReset) return _spiral.mid;
			const norm = p5.Vector.random2D(); // 0 - 1 // here change -1 - 1
			const diff = p5.Vector.mult(norm, size * 0.3); // todo find scale
			return 
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
