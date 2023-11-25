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
	pg.outer = createGraphics(size, size);
	pg.reels = createGraphics(size, size);
	dt.outer = [...Array(1)].map(() => {
		const outer = {};
		outer.mid = createVector(size * 0.5, size * 0.5);
		outer.size = createVector(size * 0.8, size * 0.5);
		return outer;
	});
	dt.reels = [...Array(2)].map((_, i) => {
		const reels = {};
		reels.mid = (() => {
			const xdir = i === 0 ? -1 : 1;
			const x = size * (0.5 + 0.3 * xdir);
			const y = size * 0.3;
			return createVector(x, y);
		})();
		reels.angle = 0;
		reels.radius = size * 0.1;
		return reels;
	});
	// frameRate();
	noLoop();
}

function draw() {
	dt.outer = dt.outer.map(pre => {
		pp(() => { // out frame
			pg.outer.fill("blue");
			pg.outer.rectMode(CENTER);
			pg.outer.rect(pre.mid.x, pre.mid.y, pre.size.x, pre.size.y, 10);
		});
		return pre;
	});
	dt.reels = dt.reels.map(pre => {
		const nxt = {...pre};
		nxt.angle = pre.angle + 1; // replace 1 to rotate speed
		pp(() => {
			//pg.reels.fill("red");
			pg.reels.circle(pre.mid.x, pre.mid.y, pre.radius);
		}, pg.reels);
		return nxt;
	});
	background(240);
	drawFrame(size, size);
	image(pg.outer, 0, 0);
	image(pg.reels, 0, 0);
	// debug
	text(keyCode, size/2, size/2);
	debug();
}

function mouseClicked() {
	userStartAudio();
	loop();
}

function keyPressed() {
	if (key === "1") mp3.voice1.play();
	if (key === "2") mp3.voice2.play();
	if (key === "3") mp3.voice3.play();
	if (key === "4") mp3.voice4.play();
}