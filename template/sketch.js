let size;

function setup() {
	size = getSize();
	const canvas = createCanvas(size, size);
	canvas.parent('canvas');
	// frameRate();
	// noLoop();
}

function draw() {
	background(240);
	drawFrame(size, size);
	debug();
}