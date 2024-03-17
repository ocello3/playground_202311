import '../lib/p5.min.js';
import '../lib/p5.sound.min.js';
import * as u from './util.js';
import * as e from './effect.js';

const sketch = s => {
	let size, dt, snd = {};
	let p = {
		// default
		isInit: true,
		play: false,
		vol: 0,
		frameRate: 0,
		// sketch
	};
	const f = u.createPane(s, p);
	const f1 = f.addFolder({
		title: 'sketch',
	});
	s.setup =() => {
		size = u.getSize(s);
		s.createCanvas(size, size).parent('canvas');
		// frameRate(10);
		s.noLoop();
		s.outputVolume(0);
	}

	s.draw = () => {
		s.background(255);
		s.noStroke();
		u.drawFrame(s, size);
		// debug
		u.debug(s);
		// reset params 
		if (p.isInit) p.isInit = false;
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
	}
}
new p5(sketch);