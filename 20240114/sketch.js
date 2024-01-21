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
		const maxRadius = size * 1 / 3
		const maxAngle = isInit ? 1000 : 150 * _spiral.rotate;
		const isReset = isInit ? true : _spiral.angle > maxAngle;
		spiral.progress = isInit ? 0 : 1 - (maxAngle - _spiral.angle) / maxAngle;
		spiral.rotate = isReset ? random(0.01, 0.1) : _spiral.rotate;
		spiral.angle = (() => {
			if (isReset) return 0;
			return _spiral.angle + 0.01; // todo change speed from 1
		})();
		spiral.a = (() => { // > 0
			if (!isReset) return _spiral.a;
			return maxRadius * random(0.01, 0.03); // todo find min/max
		})();
		spiral.b = (() => { 
			if (!isReset) return _spiral.a;
			return random(-10, 10); // todo find min/max
		})();
		spiral.radius = (() => {
			/*r=ae^{b\theta} */
			const ae = spiral.a * Math.E;
			return pow(ae, spiral.b / spiral.angle);
		})();
		spiral.mid = (() => {
			if (!isReset) return _spiral.mid;
			const norm = p5.Vector.random2D(); // 0 - 1
			const centerize = p5.Vector.sub(p5.Vector.mult(norm, 2), 1); // -1 - 1
			const diff = p5.Vector.mult(centerize, size * 0.1); // todo find scale
			const base = createVector(size * 0.5, size * 0.5);
			return p5.Vector.add(base, diff);
		})();
		spiral.head = p5.Vector.add(spiral.mid, p5.Vector.fromAngle(spiral.angle, spiral.radius));
		return spiral;
	})
	background(255);
	drawSpirals();
	drawFrame(size, size);
	// debug
	debug(dt.spirals[0]);
	// reset status
	if (isInit) isInit = false;
}
