// called on "play" checkbox once
export const startOsc = (s, p, snd) => {
	// white noise
	snd.filter = new p5.LowPass();
	snd.filter.freq(1500);
	snd.filter.disconnect();
	snd.filter.connect(snd.reverb);
	snd.noiseGen = new p5.Noise("white");
	snd.noiseGen.amp(0.1);
	snd.noiseGen.start();
	snd.noiseGen.disconnect();
	snd.noiseGen.connect(snd.filter);
	// drops
	snd.drop = new p5.Oscillator('sine');
	snd.drop.amp(0);
	snd.drop.start();
	// reverb
	snd.reverb = new p5.Reverb(); // revierb-time and decay
	snd.reverb.process(snd.noiseGen, 3, 2);
	snd.reverb.process(snd.drop, 3, 2);
};

export const playOsc = (s, p, snd) => {
	if (s.frameCount % p.drop.interval === 0) {
		snd.drop.freq(s.random(300, 600));
		snd.drop.amp(0.2, 0.02);
		snd.drop.amp(0, 0.1, 0.1);
		p.drop.interval = s.ceil(s.random(2, 50));
	}

}
