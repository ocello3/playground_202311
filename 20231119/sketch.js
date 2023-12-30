let isInit = true;
let size = {}, mp3 = {}, dt = {};
let param = {
	isEnded: [false, false, false, false],
	rate: {
		play: 2,
		reverse: 0.8,
	}
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
	frameRate(10);
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
				} else if (param.isEnded[i] === true) {
					if (_player.ctrl.direction === true) {
						return 'reverse';
					} else {
						return 'stop';
					}
				} else if (dt.nxt.some(v => v === i)) {
					return 'play';
				} else {
					return 'keep';
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
					return random() * param.rate.play;
				} else if (ctrl.status === 'reverse') {
					return random() * param.rate.reverse;
				}
			})();
			ctrl.duration = isInit ? mp3.voices[i].duration() : _player.ctrl.duration; // second
			ctrl.progress = (() => { // 0 - 1
				if (isInit || ctrl.status === 'stop' || ctrl.status === 'start') return 0;
				if (ctrl.status === 'reverse') return 1;
				return mp3.voices[i].currentTime() / ctrl.duration;
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
				const velocity = player.ctrl.rate * 0.5;
				if (player.ctrl.status === 'play') return velocity;
				if (player.ctrl.status === 'reverse') return -1 * velocity;
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
			reel.maxThickness = isInit ? player.outer.size.x * 0.15 : _reel.maxThickness;
			reel.tapeInc = (() => {
				if (player.ctrl.status === 'play' || player.ctrl.status === 'reverse') {
					const totalFrame = player.ctrl.duration * 60;
					const diff = reel.maxThickness / totalFrame * player.ctrl.rate;
					const inc = j === 0 ? diff : diff * (-1);
					return player.ctrl.direction ? inc * (-1) : inc;
				} else if (player.ctrl.status === 'stop') {
					return 0;
				} else {
					return isInit ? 0 : _reel.tapeInc;
				};
			})();
			reel.thickness = (() => {
				if (player.ctrl.status === 'start' || player.ctrl.status === 'stop') {
					if (j === 0) return reel.maxThickness
					return 0;
				} else if (isInit) {
					if (j === 0) return reel.maxThickness
					return 0;
				} else if (player.ctrl.status === 'reverse') {
					if (j === 0) return 0;
					return reel.maxThickness;
				} else {
					return _reel.thickness + reel.tapeInc;
				}
			})();
			reel.outer = reel.diameter + reel.thickness;
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
	// debug
	text(keyCode, size / 2, size / 2);
	debug({
		status: dt.players[0].ctrl.status,
		progress: dt.players[0].ctrl.progress,
	});
	// reset status
	param.isEnded = [false, false, false, false];
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === '1') mp3.voices[0].play();
	if (key === '1') mp3.voices[1].play();
	if (key === '2') mp3.voices[2].play();
	if (key === '3') mp3.voices[3].play();
}