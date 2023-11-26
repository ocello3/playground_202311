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
	pg.outer = [...Array(4)].map(() => createGraphics(size, size));
	pg.reels = [...Array(4)].map(() => createGraphics(size, size));
	dt.outer = [...Array(4)].map(() => {});
	dt.reels = [...Array(4)].map(() => [...Array(2)].map(() => {}));
	// frameRate();
	noLoop();
}

function draw() {
	dt.outer = dt.outer.map((pre, i) => {
		const nxt = { ...pre };
		nxt.size = (() => {
			if (isInit) {
				return createVector(size * 0.7, size * 0.4);
			} else {
				return pre.size;
			}
		})();
		nxt.margin = (() => {
			if (isInit) {
				const marginNum = 2 + 4 - 1;
				const windowSize = createVector(size, size)
				const marginTotal = p5.Vector.sub(windowSize, nxt.size);
				const step = p5.Vector.div(marginTotal, marginNum);
				return p5.Vector.mult(step, i + 1);
			} else {
				return pre.margin;
			}
		})();
		pp(() => {
			pg.outer[i].noFill();
			pg.outer[i].strokeWeight(size * 0.005);
			pg.outer[i].stroke(0, 255 / (i * 0.5 + 1));
			pg.outer[i].translate(nxt.margin);
			pg.outer[i].rect(0, 0, nxt.size.x, nxt.size.y, 10);
		}, pg.outer[i]);
		return nxt;
	});
	dt.reels = dt.reels.map((pres, i) => pres.map((pre, j) => {
		const nxt = {...pre};
		nxt.mid = (() => {
			if (isInit) {
				const xdir = j === 0 ? -1 : 1;
				const steprate = [0.5 + 0.27 * xdir, 0.4];
				return p5.Vector.mult(dt.outer[0].size, steprate);
			} else {
				return pre.mid;
			}
		})();
		nxt.angle = (() => {
			if (isInit) {
				return 0;
			} else {
				return pre.angle + 1; // replace 1 to rotate speed
			}
		})();
		nxt.radius = (() => {
			if (isInit) {
				return dt.outer[i].size.x * 0.17;
			} else {
				return pre.radius;
			}
		})();
		pp(() => {
			//pg.reels.fill("red");
			pg.reels[i].translate(dt.outer[i].margin);
			pg.reels[i].noFill();
			pg.reels[i].strokeWeight(size * 0.005);
			pg.reels[i].stroke(0, 255 / (i * 0.5 + 1));
			pg.reels[i].circle(nxt.mid.x, nxt.mid.y, nxt.radius);
		}, pg.reels[i]);
		return nxt;
	}));
	background(255);
	drawFrame(size, size);
	pg.outer.forEach(outerpg => image(outerpg, 0, 0));
	pg.reels.forEach(reelspg => image(reelspg, 0, 0));
	// debug
	text(keyCode, size/2, size/2);
	debug();
	if (isInit) isInit = false;
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}