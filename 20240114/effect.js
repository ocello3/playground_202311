function drawSpirals() {
	dt.spirals.forEach((spiral, i) => {
		strokeWeight(size * 0.005);
		const length = spiral.positions.length;
		spiral.positions.forEach((pos, j) => {
			if (j < length - 1) {
				stroke(255 * spiral.progress * (1 - (length - j)/length));
				line(pos.x, pos.y, spiral.positions[j + 1].x, spiral.positions[j + 1].y);
			}
		});
	});
	strokeWeight(size * 0.001);
	stroke(50);
	if (dt.connections.length) {
		dt.connections.forEach((connection) => {
			const { id_1, id_2, dist} = connection;
			line(dt.spirals[id_1].head.x, dt.spirals[id_1].head.y, dt.spirals[id_2].head.x, dt.spirals[id_2].head.y);
			snd.fms[id_2].mod.freq(connection.modFreq);
			snd.fms[id_2].mod.amp(connection.modIndex);
			snd.fms[id_2].car.amp(connection.amp);
		});
	}
	dt.isUpdates.forEach((isUpdate, i) => {
		if (!isUpdate) snd.fms[i].car.amp(0);
	});
}