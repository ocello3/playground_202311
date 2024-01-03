const playSample = (ctrl, i) => {
	if (ctrl.status === 'play' || ctrl.status === 'reverse') {
		mp3.voices[i].rate(ctrl.rate);
		if (ctrl.status === 'reverse') mp3.voices[i].reverseBuffer();
		mp3.voices[i].setVolume(0.9, mp3.voices[i].duration());
		mp3.voices[i].play();
		if  (ctrl.status === 'play') {
			mp3.ses.beep.pan(map(i, 0, 3, -1, 1));
			mp3.ses.beep.play();
		} else if (ctrl.status === 'reverse') {
			mp3.ses.pulse.pan(map(i, 0, 3, -1, 1));
			mp3.ses.pulse.play();
		}
	}
}
const drawOuter = (outer, colors, i) => () => {
	stroke(colors.line);
	// fill(colors.outer);
	noFill();
	// strokeWeight(size * 0.005);
	// stroke(0, 255 / (i * 0.5 + 1));
	rect(0, 0, outer.size.x, outer.size.y, 10);
}
const drawReels = (reels, colors, i) => () => {
	strokeWeight(size * 0.005);
	reels.forEach((reel) => {
		stroke(colors.outer);
		reel.gears.forEach(gear => line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
		noStroke();
		fill(colors.outer);
		circle(reel.mid.x, reel.mid.y, reel.outer);
		fill(colors.inner);
		circle(reel.mid.x, reel.mid.y, reel.diameter);
	});
}
const drawAnchor = (anchors, colors) => () => {
	noStroke();
	fill(colors.inner);
	anchors.forEach((anchor) => {
		circle(anchor.mid.x, anchor.mid.y, anchor.diameter);
	})
}
const drawTape = (reels, anchors, colors) => () => {
	stroke(colors.line);
	reels.forEach((reel, j) => {
		line(reel.contact.x, reel.contact.y, anchors[j].contact.x, anchors[j].contact.y);
	});
	line(anchors[0].bottom.x, anchors[0].bottom.y, anchors[1].bottom.x, anchors[1].bottom.y);
}
const drawWave = (wave) => () => {
	rectMode(CENTER);
	noStroke();
	wave.poses.forEach((pos, j) => {
		fill(0, wave.alphas[j]);
		rect(pos.x, pos.y, wave.sizes[j].x, wave.sizes[j].y);
	});
}
const drawPlayer = (player, i) => () => {
	const { outer, reels, anchors, ctrl, colors, wave } = player;
	translate(outer.margin);
	playSample(ctrl, i);
	pp(drawOuter(outer, colors, i));
	pp(drawReels(reels, colors, i));
	pp(drawAnchor(anchors, colors));
	pp(drawTape(reels, anchors, colors));
	pp(drawWave(wave));
}