function drawSpirals() {
	dt.spirals.forEach((spiral, i) => {
		strokeWeight(size * 0.02 * (1 - spiral.progress));
		stroke(255 * spiral.progress);
		beginShape();
		spiral.positions.forEach((pos) => curveVertex(pos.x, pos.y));
		endShape();
	});
	if (dt.connections.length) {
		dt.connections.forEach((connection) => {
			const { id_1, id_2, dist} = connection;
			line(dt.spirals[id_1].head.x, dt.spirals[id_1].head.y, dt.spirals[id_2].head.x, dt.spirals[id_2].head.y);
		});
	}
}