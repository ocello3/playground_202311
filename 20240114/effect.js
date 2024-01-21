function drawSpirals() {
	dt.spirals.forEach((spiral, i) => {
		strokeWeight(size * 0.02 * (1 - spiral.progress));
		stroke(255 * spiral.progress);
		beginShape();
		spiral.positions.forEach((pos) => curveVertex(pos.x, pos.y));
		endShape();
	});
}