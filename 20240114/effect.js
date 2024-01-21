function drawSpirals() {
	dt.spirals.forEach((spiral, i) => {
		fill(255 * spiral.progress);
		circle(spiral.head.x, spiral.head.y, 10);
	});
}