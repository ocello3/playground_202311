let isInit = true;
let size, dt = {};
let snd = {};
let params;

function preload() {
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	params = {
		count: 10,
		connectLimit: size * 0.13,
	}
	snd.fms = [...Array(params.count)].map((_, i) => {
		const fm = {};
		fm.freq = 100 * i; // todo: change
		fm.car = new p5.Oscillator('sine'); // todo: change to random
		fm.car.amp(0);
		fm.car.freq(fm.freq);
		fm.car.start();
		fm.mod = new p5.Oscillator('sine'); // todo: change to random
		fm.mod.disconnect();
		fm.mod.start();
		fm.car.freq(fm.mod);
		return fm;
	})
	// frameRate(10);
	noLoop();
}

function draw() {
	_spirals = isInit ? [...Array(params.count)] : dt.spirals;
	dt.spirals = _spirals.map((_spiral, i) => {
		// todo: consider reduceing angle from max
		const spiral = {};
		const maxRadius = size * 1 / 2
		const maxAngle = isInit ? 1000 : 1000 * _spiral.rotate;
		const isReset = isInit ? true : _spiral.angle > maxAngle;
		spiral.progress = isInit ? 0 : 1 - (maxAngle - _spiral.angle) / maxAngle;
		spiral.rotate = isReset ? random(0.005, 0.05) : _spiral.rotate; // todo find min/max
		spiral.angle = (() => {
			if (isReset) return 0;
			return _spiral.angle + spiral.rotate;
		})();
		spiral.a = (() => { // > 0
			if (!isReset) return _spiral.a;
			return maxRadius * random(0.01, 0.04); // todo find min/max
		})();
		spiral.b = (() => { 
			if (!isReset) return _spiral.a;
			return random(-15, 15); // todo find min/max
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
		spiral.positions = (() => {
			if (isReset) return [...Array(10)].map(() => spiral.head);
			return _spiral.positions.map((_pos, i) => {
				if (i === 0) return spiral.head;
				return _spiral.positions[i - 1];
			});
		})();
		spiral.modFreq = 1500; // todo: change later
		spiral.modIndex = map(constrain(spiral.head.y, 0, size), 0, size, 10, 100);
		spiral.amp = map(constrain(spiral.head.y, 0, size), 0, size, 0, 0.1 / params.count);
		spiral.pan = map(constrain(spiral.head.x, 0, size), 0, size, -1, 1);
		return spiral;
	});
	dt.connections = (() => {
		const connections = [];
		dt.spirals.forEach((spiral, i) => {
			dt.spirals.forEach((_spiral, _i) => {
				if (i > _i) {
					const length = p5.Vector.dist(spiral.head, _spiral.head);
					if (length < params.connectLimit) {
						const connection = {};
						connection.id_1 = i;
						connection.id_2 = _i;
						connection.length = length;
						connection.modFreq = snd.fms[_i].freq;
						connection.modIndex = map(length, 0, params.connectLimit, 100, 10);
						connection.amp = map(length, 0, params.connectLimit, 0.8 / params.count, 0.3 / params.count);
						connections.push(connection);
					}
				}
			});
		});
		return connections;
	})();
	const sndIds = dt.connections.map(connection => connection.id_2);
	dt.isUpdates = (() => {
		if (isInit) return [...Array(params.count)].map(() => true);
		return dt.isUpdates.map((_, i) => sndIds.includes(i));
	})();
	background(255);
	drawSpirals();
	drawFrame(size, size);
	// debug
	debug();
	// reset status
	if (isInit) isInit = false;
}
