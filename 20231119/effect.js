const playSample = (ctrl, i) => {
	if (ctrl.status === 'play' || ctrl.status === 'reverse') {
		mp3.voices[i].rate(ctrl.rate);
		if (ctrl.status === 'reverse') mp3.voices[i].reverseBuffer();
		mp3.voices[i].play();
	}
}
const drawOuter = (outer, i) => () => {
	noFill();
	strokeWeight(size * 0.005);
	// stroke(0, 255 / (i * 0.5 + 1));
	rect(0, 0, outer.size.x, outer.size.y, 10);
}
const drawReels = (reels, i) => () => {
	strokeWeight(size * 0.005);
	noFill();
	// stroke(0, 255 / (i * 0.5 + 1));
	reels.forEach((reel) => {
		reel.gears.forEach(gear => line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
		circle(reel.mid.x, reel.mid.y, reel.diameter);
		circle(reel.mid.x, reel.mid.y, reel.outer);
	});
}
const drawAnchor = (anchors) => () => {
	anchors.forEach((anchor) => {
		circle(anchor.mid.x, anchor.mid.y, anchor.diameter);
	})
}
const drawTape = (reels, anchors) => () => {
	reels.forEach((reel, j) => {
		line(reel.contact.x, reel.contact.y, anchors[j].contact.x, anchors[j].contact.y);
	});
	line(anchors[0].bottom.x, anchors[0].bottom.y, anchors[1].bottom.x, anchors[1].bottom.y);
}
const drawPlayer = (player, i) => () => {
	const { outer, reels, anchors, ctrl } = player;
	translate(outer.margin);
	if (ctrl.direction) {
		stroke('blue');
	} else {
		stroke('red');
	}
	playSample(ctrl, i);
	pp(drawOuter(outer, i));
	pp(drawReels(reels, i));
	pp(drawAnchor(anchors));
	pp(drawTape(reels, anchors));
}