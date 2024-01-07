const playSample = (ctrl, i) => {
	if (ctrl.status === 'play' || ctrl.status === 'reverse') {
		mp3.voices[i].rate(ctrl.rate);
		if (ctrl.status === 'reverse') mp3.voices[i].reverseBuffer();
		mp3.voices[i].setVolume(0.9 - (1 - ctrl.rate) * 0.3 );
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
	stroke(colors.inner);
	fill(colors.inner);
	// strokeWeight(size * 0.005);
	// stroke(0, 255 / (i * 0.5 + 1));
	rect(0, 0, outer.size.x, outer.size.y, 10);
}
const drawReels = (reels, colors, i) => () => {
	reels.forEach((reel) => {
		noStroke();
		fill(colors.outer);
		circle(reel.mid.x, reel.mid.y, reel.outer);
		fill(255);
		stroke(colors.line);
		circle(reel.mid.x, reel.mid.y, reel.diameter);
		reel.gears.forEach(gear => line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
	});
}
const drawAnchor = (anchors, colors) => () => {
	noStroke();
	fill(colors.line);
	anchors.forEach((anchor) => {
		circle(anchor.mid.x, anchor.mid.y, anchor.diameter * 1.1);
	})
}
const drawTape = (reels, anchors, colors) => () => {
	stroke(colors.line);
	reels.forEach((reel, j) => {
		line(reel.contact.x, reel.contact.y, anchors[j].contact.x, anchors[j].contact.y);
	});
	line(anchors[0].bottom.x, anchors[0].bottom.y, anchors[1].bottom.x, anchors[1].bottom.y);
}
const drawCenter = (centerline, colors) => () => {
	stroke(colors.line);
	line(centerline.upper.x, centerline.upper.y, centerline.lower.x, centerline.lower.y);
}
const drawWave = (wave) => () => {
	rectMode(CENTER);
	noStroke();
	wave.poses.forEach((pos, j) => {
		fill(wave.colors[j]);
		rect(pos.x, pos.y, wave.sizes[j].x, wave.sizes[j].y);
	});
}
const drawText = (texts, colors) => () => {
	textSize(texts.size);
	textAlign(LEFT, BOTTOM);
	fill(color([...colors.base]));
	text(texts.statusString, texts.statusPos.x, texts.statusPos.y);
	text(texts.rateString, texts.ratePos.x, texts.ratePos.y);
}
const drawPlayer = (player, i) => () => {
	const { outer, reels, anchors, ctrl, colors, wave, centerline, texts } = player;
	translate(outer.margin);
	strokeWeight(size * 0.003);
	playSample(ctrl, i);
	pp(drawOuter(outer, colors, i));
	pp(drawReels(reels, colors, i));
	pp(drawAnchor(anchors, colors));
	pp(drawTape(reels, anchors, colors));
	pp(drawWave(wave));
	pp(drawCenter(centerline, colors));
	pp(drawText(texts, colors));
}