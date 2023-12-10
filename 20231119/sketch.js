let isInit = true;
let size = {}, mp3 = {}, pg = {}, dt = {};

function preload() {
	mp3.voice1 = loadSound("assets/voice1.mp3");
	mp3.voice2 = loadSound("assets/voice2.mp3");
	mp3.voice3 = loadSound("assets/voice3.mp3");
	mp3.voice4 = loadSound("assets/voice4.mp3");
	mp3.beep = loadSound("assets/beep.mp3");
	mp3.noise = loadSound("assets/noise.mp3");
	mp3.pulse = loadSound("assets/pulse.mp3");
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	pg = {
		players: [...Array(4)].map(() => {
			const player = {};
			player.outer = createGraphics(size, size);
			player.reels = createGraphics(size, size);
			player.anchors = createGraphics(size, size);
			player.tape = createGraphics(size, size);
			return player;
		}),
	}
	// frameRate();
	noLoop();
}

function draw() {
	const _players = isInit ? [...Array(4)] : dt.players;
	dt.players = _players.map((_player, i) => {
		const player = {};
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
			pp(() => {
				const _pg = pg.players[i].outer;
				_pg.noFill();
				_pg.strokeWeight(size * 0.005);
				_pg.stroke(0, 255 / (i * 0.5 + 1));
				_pg.translate(outer.margin);
				_pg.rect(0, 0, outer.size.x, outer.size.y, 10);
			}, pg.players[i].outer);
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
			reel.angle = (() => {
				if (isInit) {
					return 0;
				} else {
					return _reel.angle + 1; // replace 1 to rotate speed
				}
			})();
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
				if (isInit) {
					const angle = 0.05 * PI;
					if (j === 0) { // left
						const diff = p5.Vector.fromAngle(PI - angle, reel.diameter * 0.5);
						return p5.Vector.add(reel.mid, diff);
					} else { // right
						const diff = p5.Vector.fromAngle(angle, reel.diameter * 0.5);
						return p5.Vector.add(reel.mid, diff);
					}
				} else {
					return _reel.contact;
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
			pp(() => {
				const _pg = pg.players[i].reels;
				//pg.reels.fill("red");
				_pg.translate(player.outer.margin);
				_pg.strokeWeight(size * 0.005);
				_pg.noFill();
				_pg.stroke(0, 255 / (i * 0.5 + 1));
				reel.gears.forEach(gear => _pg.line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
				_pg.circle(reel.mid.x, reel.mid.y, reel.diameter);
				_pg.circle(reel.mid.x, reel.mid.y, reel.outer);
			}, pg.players[i].reels);
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
			pp(() => {
				const _pg = pg.players[i].anchors;
				_pg.translate(player.outer.margin);
				_pg.circle(anchor.mid.x, anchor.mid.y, anchor.diameter);
			}, pg.players[i].anchors)
			return anchor;
		});
		player.tape = (() => {
			const tape = {};
			pp(() => {
				const _pg = pg.players[i].tape;
				_pg.translate(player.outer.margin);
				player.reels.forEach((reel, j) => {
					_pg.line(reel.contact.x, reel.contact.y, player.anchors[j].contact.x, player.anchors[j].contact.y);
				});
				_pg.line(player.anchors[0].bottom.x, player.anchors[0].bottom.y, player.anchors[1].bottom.x, player.anchors[1].bottom.y);
			}, pg.players[i].tape);
			return tape;
		})();
		return player;
	});
	background(255);
	drawFrame(size, size);
	pg.players.forEach(player => {
		image(player.outer, 0, 0);
		player.outer.clear();
		image(player.reels, 0, 0);
		player.reels.clear();
		image(player.anchors, 0, 0);
		player.anchors.clear();
		image(player.tape, 0, 0);
		player.tape.clear();
	});
	// debug
	text(keyCode, size / 2, size / 2);
	debug(dt.players[0]);
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}