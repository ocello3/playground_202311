import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";
import * as e from "./effect.js";

const sketch = (s) => {
  let size,
    dt,
    snd = {};
  let p = {
    // default
    isInit: true,
    play: false,
    vol: 0,
    frameRate: 0,
    // sketch
    // sound
    drop: {
      interval: 10,
    },
  };
  const f = u.createPane(s, p, snd);
  const f1 = f.addFolder({
    title: "sketch",
  });
  s.setup = () => {
    s.createCanvas().parent("canvas");
    size = u.getSize(s);
    // frameRate(10);
    s.noLoop();
    s.outputVolume(0);
  };

  s.draw = () => {
    s.background(255);
    s.noStroke();
    u.drawFrame(s, size);
    e.playOsc(s, p, snd);
    // debug
    u.debug(s);
    // reset params
    // if (p.isInit) p.isInit = false;
    p.frameRate = s.isLooping() ? s.frameRate() : 0;
  };
  s.windowResized = () => {
    size = u.getSize(s);
  };
};
new p5(sketch);

