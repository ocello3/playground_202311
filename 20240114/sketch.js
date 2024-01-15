let isInit = true;
let size, dt = {};
let param = {};

function preload() {
}

function setup() {
	size = getSize();
	createCanvas(size, size).parent('canvas');
	// frameRate(10);
	noLoop();
}

function draw() {
	background(255);
	drawFrame(size, size);
	// debug
	debug();
	// reset status
	if (isInit) isInit = false;
}
