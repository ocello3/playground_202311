let isInit = true;
let size={}, mp3={}, pg={}, dt={};

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
	pg.outers = [...Array(4)].map(() => createGraphics(size, size));
	pg.reels = [...Array(4)].map(() => createGraphics(size, size));
	dt.outers = [...Array(4)].map(() => {});
	dt.reels = [...Array(4)].map(() => [...Array(2)].map(() => {}));
	// frameRate();
	noLoop();
}

function draw() {
	dt.outers = dt.outers.map((outerPre, i) => {
		const outer = { ...outerPre };
		outer.size = (() => {
			if (isInit) {
				return createVector(size * 0.7, size * 0.4);
			} else {
				return outerPre.size;
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
				return outerPre.margin;
			}
		})();
		pp(() => {
			pg.outers[i].noFill();
			pg.outers[i].strokeWeight(size * 0.005);
			pg.outers[i].stroke(0, 255 / (i * 0.5 + 1));
			pg.outers[i].translate(outer.margin);
			pg.outers[i].rect(0, 0, outer.size.x, outer.size.y, 10);
		}, pg.outers[i]);
		return outer;
	});
	dt.reels = dt.reels.map((reelPre, i) => reelPre.map((wheelPre, j) => {
		const wheel = {...wheelPre};
		wheel.mid = (() => {
			if (isInit) {
				const xdir = j === 0 ? -1 : 1; // left or right
				const steprate = [0.5 + 0.27 * xdir, 0.4];
				return p5.Vector.mult(dt.outers[0].size, steprate);
			} else {
				return wheelPre.mid;
			}
		})();
		wheel.angle = (() => {
			if (isInit) {
				return 0;
			} else {
				return wheelPre.angle + 1; // replace 1 to rotate speed
			}
		})();
		wheel.diameter = (() => {
			if (isInit) {
				return dt.outers[i].size.x * 0.17;
			} else {
				return wheelPre.diameter;
			}
		})();
		wheel.gears = (() => {
			const radius = wheel.diameter * 0.5;
			const length = radius * 0.3;
			const num = 6;
			const interval = 2 * PI / num;
			if (isInit) {
				return [...Array(num)].map((_, k) => {
					const gear = {};
					const unit = p5.Vector.fromAngle(interval * k + wheel.angle);
					gear.start = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius - length));
					gear.end = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius));
					return gear;
				});
			} else {
				return wheelPre.gears.map((_, k) => {
					const gear = {};
					const unit = p5.Vector.fromAngle(interval * k + wheel.angle);
					gear.start = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius - length));
					gear.end = p5.Vector.add(wheel.mid, p5.Vector.setMag(unit, radius));
					return gear; // improve?
				});
			}
		})();
		pp(() => {
			//pg.reels.fill("red");
			pg.reels[i].translate(dt.outers[i].margin);
			pg.reels[i].strokeWeight(size * 0.005);
			pg.reels[i].noFill();
			pg.reels[i].stroke(0, 255 / (i * 0.5 + 1));
			wheel.gears.forEach(gear => pg.reels[i].line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
			pg.reels[i].circle(wheel.mid.x, wheel.mid.y, wheel.diameter);
		}, pg.reels[i]);
		return wheel;
	}));
	background(255);
	drawFrame(size, size);
	pg.outers.forEach(outer => {
		image(outer, 0, 0);
		outer.clear();
	});
	pg.reels.forEach(reel => {
		image(reel, 0, 0);
		reel.clear();
	});
	// debug
	text(keyCode, size/2, size/2);
	debug(dt.reels[0][0].gears);
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}