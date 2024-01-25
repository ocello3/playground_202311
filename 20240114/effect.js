function drawSpirals() {
	dt.spirals.forEach((spiral, i) => {
		strokeWeight(size * 0.02);
		const length = spiral.positions.length;
		spiral.positions.forEach((pos, j) => {
			if (j < length - 1) {
				stroke(42, 79, 110, 255 * spiral.progress * (length - j)/length);
				line(pos.x, pos.y, spiral.positions[j + 1].x, spiral.positions[j + 1].y);
			}
		});
		if(dt.isUpdates[i] === false) {
			snd.fms[i].mod.freq(spiral.modFreq);
			snd.fms[i].mod.amp(spiral.modIndex);
			snd.fms[i].car.amp(spiral.amp);
			snd.fms[i].car.pan(spiral.pan);
		}
	});
	strokeWeight(size * 0.001);
	stroke(78, 112, 139, 250);
	if (dt.connections.length) {
		dt.connections.forEach((connection) => {
			const { id_1, id_2, dist} = connection;
			line(dt.spirals[id_1].head.x, dt.spirals[id_1].head.y, dt.spirals[id_2].head.x, dt.spirals[id_2].head.y);
			snd.fms[id_2].mod.freq(connection.modFreq);
			snd.fms[id_2].mod.amp(connection.modIndex);
			snd.fms[id_2].car.amp(connection.amp);
			snd.fms[id_2].car.pan(dt.spirals[id_2].pan);
		});
	}
}