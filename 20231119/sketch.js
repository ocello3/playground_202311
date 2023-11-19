let size;
let mp3_voice1, mp3_voice2, mp3_voice3, mp3_voice4;
let mp3_beep, mp3_noise, mp3_pulse;

function setup() {
	size = getSize();
	const canvas = createCanvas(size, size);
	canvas.parent('canvas');
	mp3_voice1 = loadSound("assets/voice1.mp3");
	mp3_voice2 = loadSound("assets/voice2.mp3");
	mp3_voice3 = loadSound("assets/voice3.mp3");
	mp3_voice4 = loadSound("assets/voice4.mp3");
	mp3_beep = loadSound("assets/beep.mp3");
	mp3_noise = loadSound("assets/noise.mp3");
	mp3_pulse = loadSound("assets/pulse.mp3");
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
	if (key === "1") mp3_voice1.play();
	if (key === "2") mp3_voice2.play();
	if (key === "3") mp3_voice3.play();
	if (key === "4") mp3_voice4.play();
}