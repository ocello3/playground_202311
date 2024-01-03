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
	// instruments
	mp3.voices = [...Array(4)].map((_, i) => {
		const path = `assets/voice${i}.mp3`;
		const voice = loadSound(path);
		voice.onended(() => {
			param.isEnded[i] = true;
		});
		voice.pan(map(i, 0, 3, -1, 1));
		voice.disconnect();
		return voice;
	});
	mp3.ses = (() => {
		const beep = loadSound('assets/beep.mp3');
		beep.setVolume(0.5);
		beep.disconnect();
		const pulse = loadSound('assets/pulse.mp3');
		pulse.setVolume(0.7);
		pulse.disconnect();
		return { beep, pulse };
	})();
	// effect
	mp3.reverb = new p5.Reverb();
	mp3.reverb.drywet(0.3); // 1 = all reverb, 0 = no reverb
	mp3.reverb.disconnect();
	// mixer
	mp3.voiceNode = new p5.Gain();
	mp3.voices.forEach((voice) => mp3.voiceNode.setInput(voice));
	mp3.reverb.process(mp3.voiceNode, 3, 2);
	mp3.seNode = new p5.Gain();
	mp3.seNode.setInput(mp3.ses.beep);
	mp3.seNode.setInput(mp3.ses.pulse);
	mp3.main = new p5.Gain();
	mp3.main.amp(0.7);
	mp3.main.setInput(mp3.reverb);
	mp3.main.setInput(mp3.seNode);
	mp3.main.connect();
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	// analyzer
	mp3.analyzers = [...Array(4)].map(() => {
		const analyzer = new p5.Amplitude();
		analyzer.toggleNormalize(true);
		return analyzer;
	});
	mp3.voices.forEach((voice, i) => mp3.analyzers[i].setInput(voice));
	// frameRate(10);
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
					return 'keep';
				} else if (param.isEnded[i] === true) {
					if (_player.ctrl.direction === true) {
						return 'reverse';
					} else {
						return 'stop';
					}
				} else if (dt.nxt.some(v => v === i)) {
					return 'play';
				} else if (mp3.voices.every(voice => voice.isPlaying() === false)) {
					if (i === 0) return 'play';
					return 'keep';
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
		player.colors = (() => {
			const colors = {};
			const { status, progress } = player.ctrl;
			colors.base = (isInit || status === 'play') ? lerpColor(color(218, 165, 32), color(72, 61, 139), 0.25 * (i + 1)) : _player.colors.base;
			colors.outer = colors.base;
			colors.outer.setAlpha(255 - progress * 255);
			colors.inner = colors.base;
			colors.inner.setAlpha(progress * 255);
			colors.line = colors.base;
			return colors;
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
			reel.thickness = (() => {
				if (isInit || player.ctrl.status === 'stop') {
					if (j === 0) return reel.maxThickness
					return 0;
				} else {
					if (j === 0) return (1 - player.ctrl.progress) * reel.maxThickness;
					return player.ctrl.progress * reel.maxThickness;
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
		player.wave = (() => {
			const wave = {};
			const { status } = player.ctrl;
			const currentHeight =  mp3.analyzers[i].getLevel() * size * 0.05;
			const rectWidth = size * 0.01;
			const num = 10;
			wave.sizes = isInit
				? [...Array(num)].map((_, j) => {
					if (j === 0) return new p5.Vector(rectWidth, currentHeight);
					return new p5.Vector(0, 0);
				})
				: _player.wave.sizes.map((_, j, self) => {
					if (j === 0) return new p5.Vector(rectWidth, currentHeight);
					return self[j - 1];
				});
			wave.poses = (isInit || status === 'play' || status === 'reverse')
				? wave.sizes.map((_, j) => {
					const mid = p5.Vector.div(p5.Vector.add(player.anchors[0].bottom, player.anchors[1].bottom), 2);
					const diff = player.ctrl.direction ? -rectWidth : rectWidth;
					return p5.Vector.add(mid, new p5.Vector(diff * j, 0));
				})
				: _player.wave.poses;
				wave.alphas = isInit ? wave.sizes.map((_, j) => 255 - ((255/num)*j)) : _player.wave.alphas;
		return wave;
		})();
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