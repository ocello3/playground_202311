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
			const step = createVector((size - outer.size.x) / (2 + 4 - 1), (size - outer.size.y) / (2 + 4 - 1));
			return p5.Vector.mult(step, i + 1);
		})();
		return outer;
	});
	dt.reels = dt.outer.map((outer, i) => {
		return [...Array(2)].map((_, j) => {
			const reel = {};
			reel.mid = (() => {
				const xdir = j === 0 ? -1 : 1;
				const steprate = [0.5 + 0.27 * xdir, 0.4];
				return p5.Vector.mult(dt.outer[0].size, steprate);
			})();
			reel.angle = 0;
			reel.radius = outer.size.x * 0.17;
			return reel;
		});
	});
	// frameRate();
	noLoop();
}

function draw() {
	dt.outer = dt.outer.map((pre, i) => {
		pp(() => { // out frame
			pg.outer[i].noFill();
			pg.outer[i].strokeWeight(size * 0.005);
			pg.outer[i].stroke(0, 255 / (i * 0.5 + 1));
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
			pg.reels[i].noFill();
			pg.reels[i].strokeWeight(size * 0.005);
			pg.reels[i].stroke(0, 255 / (i * 0.5 + 1));
			pg.reels[i].circle(pre.mid.x, pre.mid.y, pre.radius);
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
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}