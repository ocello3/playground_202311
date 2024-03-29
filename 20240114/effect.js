export function drawSpirals(s, dt, snd, size) {
	dt.spirals.forEach((spiral, i) => {
		const length = spiral.positions.length;
		spiral.positions.forEach((pos, j) => {
			if (j < length - 1) {
				s.stroke(42, 79, 110, 255 * (1 - spiral.progress) * (length - j)/length);
				s.strokeWeight(size * 0.017 * (length - j)/length);
				s.line(pos.x, pos.y, spiral.positions[j + 1].x, spiral.positions[j + 1].y);
			}
		});
		if(dt.isUpdates[i] === false) {
			snd.fms[i].mod.freq(spiral.modFreq);
			snd.fms[i].mod.amp(spiral.modIndex);
			snd.fms[i].car.amp(spiral.amp);
			snd.fms[i].car.pan(spiral.pan);
		}
	});
	s.strokeWeight(size * 0.001);
	s.stroke(78, 112, 139, 250);
	if (dt.connections.length) {
		dt.connections.forEach((connection) => {
			const { id_1, id_2} = connection;
			s.line(dt.spirals[id_1].head.x, dt.spirals[id_1].head.y, dt.spirals[id_2].head.x, dt.spirals[id_2].head.y);
			snd.fms[id_2].mod.freq(connection.modFreq);
			snd.fms[id_2].mod.amp(connection.modIndex);
			snd.fms[id_2].car.amp(connection.amp);
			snd.fms[id_2].car.pan(dt.spirals[id_2].pan);
		});
	}
}