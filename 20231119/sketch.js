let isInit = true;
let size = {}, mp3 = {}, dt = {};
let param = {
	isEnded: [false, false, false, false],
}

function preload() {
	mp3.voices = [...Array(4)].map((_, i) => {
		const path = `assets/voice${i}.mp3`;
		return loadSound(path).onended(() => {
			param.isEnded[i] = true;
		});
	});
	mp3.beep = loadSound('assets/beep.mp3');
	mp3.noise = loadSound('assets/noise.mp3');
	mp3.pulse = loadSound('assets/pulse.mp3');
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	// frameRate();
	noLoop();
}

function draw() {
	background(255);
	dt.nxt = (() => {
		if (isInit) return [];
		if (param.isEnded.every((status) => status === false)) return [];
		const endedIndexes = param.isEnded.flatMap((v, i) => (v === true) ? i : []);
		const waitingIndexs = mp3.voices.flatMap((s, i) => (s.isPlaying() ? [] : i));
		function getIndexes(total, length, acc = []) {
			if (acc.length === length) {
				return acc;
			}
			const randomIndex = floor(random() * n) + 1;
			if (!acc.includes(randomIndex)) {
				return getIndexes(total, [...acc, randomIndex]);
			} else {
				return getIndexes(total, acc);
			}
		}
		if (endedIndexes.length = waitingIndexs.length) {
			return waitingIndexs;
		} else if (endedIndexes.length < waitingIndexs.length) {
			const indexes = getIndexes(waitingIndexs.length, endedIndexes.length);
			return indexes.map(i => waitingIndexs[i]);
		} else {
			// if number of ended tracks is less than not playing tracks (irregular case)
			return getIndexes(param.isEnded.length, endedIndexes.length);
		}
	})();
	const _players = isInit ? [...Array(4)] : dt.players;
	dt.players = _players.map((_player, i) => {
		const player = {};
		player.ctrl = (() => {
			const ctrl = {};
			ctrl.status = (() => {
				if (isInit) {
					if (i === 0) return 'play';
					return 'keep';
				} else if (dt.nxt.some(v => v === i)) {
					return 'play';
				} else if (param.isEnded[i] === false) {
					return 'keep';
				} else if (_player.ctrl.direction === true) {
					throw 'working';
					return 'reverse';
				} else if (_player.ctrl.direction === false) {
					throw 'working';
					return 'stop';
				} else {
					throw `isEnded: ${param.isEnded}`;
				}
			})();
			ctrl.direction = (() => {
				if (isInit) return true;
				if (ctrl.status === 'play') return true;
				if (ctrl.status === 'reverse') return false;
				return _player.ctrl.direction;
			})();
			ctrl.rate = (() => {
				if (ctrl.status === 'play') {
					return random() * 2;
				} else if (ctrl.status === 'reverse') {
					return random() * 0.8;
				}
			})();
			return ctrl;
		})();
		player.outer = (() => {
			const outer = {};
			outer.size = (() => {
				if (isInit) {
					return createVector(size * 0.7, size * 0.4);
				} else {
					return _player.outer.size;
				}
			})();
			outer.margin = (() => {
				if (isInit) {
					const marginNum = 2 + 4 - 1;
					const windowSize = createVector(size, size)
					const marginTotal = p5.Vector.sub(windowSize, outer.size);
					const step = p5.Vector.div(marginTotal, marginNum);
					return p5.Vector.mult(step, i + 1);
				} else {
					return _player.outer.margin;
				}
			})();
			return outer;
		})();
		const _reels = isInit ? [...Array(2)] : _player.reels;
		player.reels = _reels.map((_reel, j) => {
			const reel = {};
			reel.mid = (() => {
				if (isInit) {
					const xdir = j === 0 ? -1 : 1; // left or right
					const steprate = [0.5 + 0.27 * xdir, 0.4];
					return p5.Vector.mult(player.outer.size, steprate);
				} else {
					return _reel.mid;
				}
			})();
			reel.rotate = (() => {
				const speed = player.ctrl.rate * 0.7;
				if (player.ctrl.status === 'play') return speed;
				if (player.ctrl.status === 'reverse') return -1 * speed;
				if (isInit) return 0;
				if (player.ctrl.status === 'stop') return 0;
				if (player.ctrl.status === 'keep') return _reel.rotate;
				throw `status: ${player.ctrl.status}`;
			})();
			reel.angle = isInit ? 0 : _reel.angle + reel.rotate;
			reel.diameter = (() => {
				if (isInit) {
					return player.outer.size.x * 0.17;
				} else {
					return _reel.diameter;
				}
			})();
			reel.outer = (() => {
				const max = player.outer.size.x * 0.07;
				const iphase = j === 0 ? 0 : PI;
				const thickness = (cos(frameCount * 0.1 + iphase) + 1) * 0.5 * max;
				return reel.diameter + thickness;
			})();
			reel.contact = (() => {
				const angle = 0.05 * PI;
				if (j === 0) { // left
					const diff = p5.Vector.fromAngle(PI - angle, reel.outer * 0.5);
					return p5.Vector.add(reel.mid, diff);
				} else { // right
					const diff = p5.Vector.fromAngle(angle, reel.outer * 0.5);
					return p5.Vector.add(reel.mid, diff);
				}
			})();
			reel.gears = (() => {
				const radius = reel.diameter * 0.5;
				const length = radius * 0.3;
				const num = 6;
				const interval = 2 * PI / num;
				const pre = isInit ? [...Array(num)] : _reel.gears;
				return pre.map((_, k) => {
					const gear = {};
					const unit = p5.Vector.fromAngle(interval * k + reel.angle);
					gear.start = p5.Vector.add(reel.mid, p5.Vector.setMag(unit, radius - length));
					gear.end = p5.Vector.add(reel.mid, p5.Vector.setMag(unit, radius));
					return gear; // improve?
				});
			})();
			return reel;
		});
		const _anchors = isInit ? [...Array(2)] : _player.anchors;
		player.anchors = _anchors.map((_anchor, j) => {
			const anchor = {};
			anchor.mid = (() => {
				if (isInit) {
					const xdir = j === 0 ? -1 : 1; // left or right
					const steprate = [0.5 + 0.3 * xdir, 0.8];
					return p5.Vector.mult(player.outer.size, steprate);
				} else {
					return _anchor.mid;
				}
			})();
			anchor.diameter = (() => {
				if (isInit) {
					return player.outer.size.x * 0.03;
				} else {
					return _anchor.diameter;
				}
			})();
			anchor.contact = (() => {
				if (isInit) {
					const angle = 0.1 * PI;
					if (j === 0) { // left
						const diff = p5.Vector.fromAngle(PI - angle, anchor.diameter * 0.5);
						return p5.Vector.add(anchor.mid, diff);
					} else { // right
						const diff = p5.Vector.fromAngle(angle, anchor.diameter * 0.5);
						return p5.Vector.add(anchor.mid, diff);
					}
				} else {
					return _anchor.contact;
				}
			})();
			anchor.bottom = (() => {
				if (isInit) {
					const diff = p5.Vector.fromAngle(PI * 0.5, anchor.diameter * 0.5);
					return p5.Vector.add(anchor.mid, diff);
				} else {
					return _anchor.bottom;
				}
			})();
			return anchor;
		});
		return player;
	});
	dt.players.forEach((player, i) => pp(drawPlayer(player, i)));
	drawFrame(size, size);
	// reset status
	param.isEnded = [false, false, false, false];
	// debug
	text(keyCode, size / 2, size / 2);
	debug({
		a: dt.players[0].ctrl.direction,
		b: dt.players[1].ctrl.direction,
		c: dt.players[2].ctrl.direction,
		d: dt.players[3].ctrl.direction,
	});
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === '1') mp3.voices[0].play();
	if (key === '1') mp3.voices[1].play();
	if (key === '2') mp3.voices[2].play();
	if (key === '3') mp3.voices[3].play();
}