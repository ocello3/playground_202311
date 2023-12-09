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
		tapes: [...Array(4)].map(() => {
			const tape = {};
			tape.outer = createGraphics(size, size);
			tape.reels = createGraphics(size, size);
			return tape;
		}),
	}
	dt = {
		tapes: [...Array(4)].map(() => {
			const tape = {};
			tape.outer = {};
			tape.reels = [...Array(2)].map(() => { });
			return tape;
		}),
	}
	// frameRate();
	noLoop();
}

function draw() {
	dt.tapes = dt.tapes.map((_tape, i) => {
		const tape = {};
		tape.outer = (() => {
			const outer = {};
			outer.size = (() => {
				if (isInit) {
					return createVector(size * 0.7, size * 0.4);
				} else {
					return _tape.outer.size;
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
					return _tape.outer.margin;
				}
			})();
			pp(() => {
				pg.tapes[i].outer.noFill();
				pg.tapes[i].outer.strokeWeight(size * 0.005);
				pg.tapes[i].outer.stroke(0, 255 / (i * 0.5 + 1));
				pg.tapes[i].outer.translate(outer.margin);
				pg.tapes[i].outer.rect(0, 0, outer.size.x, outer.size.y, 10);
			}, pg.tapes[i].outer);
			return outer;
		})();
		tape.reels = _tape.reels.map((_wheel, j) => {
			const wheel = {};
			wheel.mid = (() => {
				if (isInit) {
					const xdir = j === 0 ? -1 : 1; // left or right
					const steprate = [0.5 + 0.27 * xdir, 0.4];
					return p5.Vector.mult(tape.outer.size, steprate);
				} else {
					return _wheel.mid;
				}
			})();
			wheel.angle = (() => {
				if (isInit) {
					return 0;
				} else {
					return _wheel.angle + 1; // replace 1 to rotate speed
				}
			})();
			wheel.diameter = (() => {
				if (isInit) {
					return tape.outer.size.x * 0.17;
				} else {
					return _wheel.diameter;
				}
			})();
			wheel.gears = (() => {
				const radius = wheel.diameter * 0.5;
				const length = radius * 0.3;
				const num = 6;
				const interval = 2 * PI / num;
				const pre = isInit ? [...Array(num)] : _wheel.gears;
				return pre.map((_, k) => {
					const gear = {};
					const unit = p5.Vector.fromAngle(interval * k + wheel.angle);
					gear.start = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius - length));
					gear.end = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius));
					return gear; // improve?
				});
			})();
			pp(() => {
				//pg.reels.fill("red");
				pg.tapes[i].reels.translate(tape.outer.margin);
				pg.tapes[i].reels.strokeWeight(size * 0.005);
				pg.tapes[i].reels.noFill();
				pg.tapes[i].reels.stroke(0, 255 / (i * 0.5 + 1));
				wheel.gears.forEach(gear => pg.tapes[i].reels.line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
				pg.tapes[i].reels.circle(wheel.mid.x, wheel.mid.y, wheel.diameter);
			}, pg.tapes[i].reels);
			return wheel;
		});
		return tape;
	});
	background(255);
	drawFrame(size, size);
	pg.tapes.forEach(tape => {
		image(tape.outer, 0, 0);
		tape.outer.clear();
		image(tape.reels, 0, 0);
		tape.reels.clear();
	});
	// debug
	text(keyCode, size / 2, size / 2);
	debug(dt.tapes[0]);
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}