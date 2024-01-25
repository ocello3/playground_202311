import {Pane} from '../lib/tweakpane-4.0.3.min.js';
import * as u from '../util/util.js';
import '../lib/p5.min.js';
import '../lib/p5.sound.min.js';
import * as e from './effect.js';

const sketch = s => {
	let isInit = true;
	let size, dt = {};
	let snd = {};
	let params = {
		count: 10,
		connectLimit: 0.13,
	};
	const pane = new Pane({
		container: document.getElementById('pane'),
	});
	pane.addBinding(params, 'connectLimit', {
		min: 0.05,
		max: 0.2,
	});

	s.setup =() => {
		size = u.getSize(s);
		s.createCanvas(size, size).parent('canvas');
		snd.fms = [...Array(params.count)].map((_, i) => {
			const fm = {};
			fm.freq = 110 * i; // todo: change
			fm.car = new p5.Oscillator('sine'); // todo: change to s.random
			fm.car.amp(0);
			fm.car.freq(fm.freq);
			fm.car.start();
			fm.mod = new p5.Oscillator('sine'); // todo: change to s.random
			fm.mod.disconnect();
			fm.mod.start();
			fm.car.freq(fm.mod);
			return fm;
		})
		// frameRate(10);
		u.defalt(s);
		s.noLoop();
	}

	s.draw = () => {
		const _spirals = isInit ? [...Array(params.count)] : dt.spirals;
		dt.spirals = _spirals.map((_spiral, i) => {
			// todo: consider reduceing angle from max
			const spiral = {};
			const maxRadius = size * 1 / 2
			const isReset = isInit ? true : _spiral.progress > 1;
			spiral.maxAngle = isReset ? s.random(100, 300) : _spiral.maxAngle;
			spiral.progressRate = isReset ? s.random(0.0002, 0.002) : _spiral.progressRate; // todo find min/max
			spiral.progress = isReset ? 0 : _spiral.progress + spiral.progressRate;
			spiral.angle = spiral.maxAngle * s.pow(spiral.progress, 3);
			spiral.a = (() => { // > 0
				if (!isReset) return _spiral.a;
				return maxRadius * s.random(0.01, 0.04); // todo find min/max
			})();
			spiral.b = (() => {
				if (!isReset) return _spiral.a;
				return s.random(-15, 15); // todo find min/max
			})();
			spiral.radius = (() => {
				/*r=ae^{b\theta} */
				const ae = spiral.a * Math.E;
				return s.pow(ae, spiral.b / spiral.angle);
			})();
			spiral.mid = (() => {
				if (!isReset) return _spiral.mid;
				const norm = p5.Vector.random2D(); // 0 - 1
				const centerize = p5.Vector.sub(p5.Vector.mult(norm, 2), 1); // -1 - 1
				const diff = p5.Vector.mult(centerize, size * 0.1); // todo find scale
				const base = s.createVector(size * 0.5, size * 0.5);
				return p5.Vector.add(base, diff);
			})();
			spiral.head = p5.Vector.add(spiral.mid, p5.Vector.fromAngle(spiral.angle, spiral.radius));
			spiral.positions = (() => {
				if (isReset) return [...Array(10)].map(() => spiral.head);
				return _spiral.positions.map((_pos, i) => {
					if (i === 0) return spiral.head;
					if (s.frameCount % 4 === 0) return _spiral.positions[i - 1];
					return _spiral.positions[i];
				});
			})();
			spiral.modFreq = 1500; // todo: change later
			spiral.modIndex = s.map(s.constrain(spiral.head.y, 0, size), 0, size, 10, 100);
			spiral.amp = s.map(s.constrain(spiral.head.y, 0, size), 0, size, 0, 0.1 / params.count);
			spiral.pan = s.map(s.constrain(spiral.head.x, 0, size), 0, size, -1, 1);
			return spiral;
		});
		dt.connections = (() => {
			const connections = [];
			dt.spirals.forEach((spiral, i) => {
				dt.spirals.forEach((_spiral, _i) => {
					if (i > _i) {
						const length = p5.Vector.dist(spiral.head, _spiral.head);
						const connectLimit = params.connectLimit * size;
						if (length < connectLimit) {
							const connection = {};
							connection.id_1 = i;
							connection.id_2 = _i;
							connection.length = length;
							connection.modFreq = snd.fms[_i].freq;
							connection.modIndex = s.map(length, 0, connectLimit, 100, 10);
							connection.amp = s.map(length, 0, connectLimit, 0.8 / params.count, 0.3 / params.count);
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
		s.background(255);
		s.noStroke();
		for (let i = 0; i < params.count; i++) {
			s.fill(216, 229, 240, 255 / params.count * i);
			s.rect(0, size / params.count * i, size, size / params.count)
		}
		e.drawSpirals(s, dt, snd, size);
		u.drawFrame(s, size);
		// debug
		u.debug(s);
		// reset status
		if (isInit) isInit = false;
	}
}
new p5(sketch);
// new p5(sketch, 'canvas');