let size;
let mp3;

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
	// frameRate();
	noLoop();
}

function draw() {
	background(240);
	drawFrame(size, size);
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