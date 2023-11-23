let size, mp3, reels;

function preload() {
	mp3 = {
		voice1: loadSound("assets/voice1.mp3"),
		voice2: loadSound("assets/voice2.mp3"),
		voice3: loadSound("assets/voice3.mp3"),
		voice4: loadSound("assets/voice4.mp3"),
		beep: loadSound("assets/beep.mp3"),
		noise: loadSound("assets/noise.mp3"),
		pulse: loadSound("assets/pulse.mp3")
	}
}

function setup() {
	size = getSize();
	const canvas = createCanvas(size, size);
	canvas.parent('canvas');
	reels = [...Array(2)].map((_, i) => {
		const center = (() => {
			const xdir = i === 0 ? -1 : 1;
			const x = size * (0.5 + 0.3 * xdir);
			const y = size * 0.3;
			return createVector(x, y);
		})();
		return {
			angle: 0,
			center,
			radius: size * 0.1,
		}
	})
	// frameRate();
	noLoop();
}

function draw() {
	// update
	reels = reels.map(pre => {
		const nxt = {...pre};
		nxt.angle = pre.angle + 1; // replace 1 to rotate speed
		return nxt;
	});
	// draw
	background(240);
	drawFrame(size, size);
	pp(() => { // out frame
		rectMode(CENTER);
		rect(size * 0.5, size * 0.5, size * 0.8, size * 0.5, 10);
	});
	reels.forEach((reel, i) => { // reels
		pp(() => {
			circle(reel.center.x, reel.center.y, reel.radius);
		});
	})
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