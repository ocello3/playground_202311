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
	dt.outer = [...Array(4)].map((_, i) => {
		const outer = {};
		outer.size = createVector(size * 0.7, size * 0.4);
		outer.margin = (() => {
			const margin = createVector((size - outer.size.x) * 0.5, (size - outer.size.y) * 0.5);
			const step = p5.Vector.mult(margin, 0.2 * i);
			return p5.Vector.add(margin, step);
		})();
		return outer;
	});
	dt.reels = dt.outer.map(() => [...Array(2)].map((_, j) => {
		const reel = {};
		reel.mid = (() => {
			const xdir = j === 0 ? -1 : 1;
			const steprate = [0.5 + 0.3 * xdir, 0.3];
			return p5.Vector.mult(dt.outer[0].size, steprate);
		})();
		reel.angle = 0;
		reel.radius = size * 0.1;
		return reel;
	}));
	// frameRate();
	noLoop();
}

function draw() {
	dt.outer = dt.outer.map((pre, i) => {
		pp(() => { // out frame
			pg.outer[i].fill("blue");
			pg.outer[i].rect(pre.margin.x, pre.margin.y, pre.size.x, pre.size.y, 10);
		});
		return pre;
	});
	dt.reels = dt.reels.map((pres, i) => pres.map((pre, j) => {
		const nxt = {...pre};
		nxt.angle = pre.angle + 1; // replace 1 to rotate speed
		pp(() => {
			//pg.reels.fill("red");
			pg.reels[i].translate(dt.outer[i].margin.x, dt.outer[i].margin.y); // translate globally to corner of outer
			pg.reels[i].circle(pre.mid.x, pre.mid.y, pre.radius);
		}, pg.reels[i]);
		return nxt;
	}));
	background(240);
	drawFrame(size, size);
	pg.outer.forEach(outerpg => image(outerpg, 0, 0));
	pg.reels.forEach(reelspg => image(reelspg, 0, 0));
	// debug
	text(keyCode, size/2, size/2);
	debug();
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}