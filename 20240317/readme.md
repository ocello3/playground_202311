# 調べもの
対数螺旋
https://ja.wikipedia.org/wiki/%E5%AF%BE%E6%95%B0%E8%9E%BA%E6%97%8B
対数螺旋の座標上で別の図形を描く。あるいは再帰的に対数螺旋を描いてみる。
極座標表示 (r, θ) で
r=ae^{b\theta }
と表記される。
a は正でなければならないが、b は正、負のどちらでも構わない。
正の場合は中心から離れる際に左曲がりである螺旋になり、負の場合は右曲がりの螺旋になる。
裏返すことによって左曲がりを右曲がりにできるため、b > 0 に限った定義をすることもある。
定義式において形式的に b = 0 とすると、半径 a の円となる。

自己相似の性質
任意の倍率で拡大または縮小したものは、適当な回転によって元の螺旋と一致する。例えば、e2πb 倍に拡大したものは、回転することなしに元の螺旋と一致する。
隣り合う交点について、原点との距離の比は一定で e^(2πb) である。

中心から伸ばした半直線と対数螺旋が成す角は一定である。
α=arccot(b)

対数螺旋の形状は巻きの向きとピッチのみ、すなわち b のみによって決まる

# 案
任意の座標から散発的に螺旋が発生する。
近くの3点で三角形を作る。三角形の面積をエフェクトに割り当てる
2つの点が一定以下の距離の時に線にする。線の長さを音量にする
2つの点の座標それぞれを音源に割り当てる。
xの平均: pan
y: tone これだと気持ち悪い持続音になりそう。単発音につかえない？am音源のパラメーターとか

# fm音源
pure dataでの実装
https://puredatajapan.info/?page_id=1070

p5jsでの実装
https://p5js.org/examples/sound-frequency-modulation.html

１つの「osc~」からの出力が、増幅されもう一つの「osc~」の周波数を操作しています。
キャリア周波数: 400 Hz
キャリア周波数を変化させる変調周波数(Modulation Frequency）: 2 Hz
変調の振幅大きさである変調指数(Modulation Index): 100に設定
→ 400 Hz.を中心にサイン波が300Hzと500Hzの間をいったりきたりしてビブラートのような効果が得られます。
→ 変調周波数を10、20、30、40と高めていくと、AMではサイドバンドが２本立ち「山」の形が見えて来ましたが、FMではサイドバンドが多数立ち上がり「山脈」が見え始めます、これが典型的なFMのスペクトラムです（下図）。
サイドバンド群の周波数は、キャリア周波数と変調周波数の和と差になります。
例えば、キャリアが800 Hz.で変調周波数が200 Hz.の場合、
800 + 200 = 1000 Hz.
800 + 200 * 2 = 1200 Hz.
800 + 200 + 3 = 1600 Hz.
800 – 200 = 600 Hz.
800 – 200 * 2 = 400 Hz.
800 – 200 * 3 = 200 Hz.
等にサイドバンドが観測されます。
またキャリア周波数と変調周波数が整数比の場合は調波音となりますが、そうでない場合は非調波音となります。
変調指数のパラメータは上げれば上げるほど、サイドバンドの数が増えます、そして高い「山」がなくなっていき「山脈」が段々平地化していきます。

# fm音源の実装
螺旋一つにつき一つのSinOscと固有の周波数を設定する、
carFreq: idが大きい方の螺旋の周波数
modFreq: idが小さい方の螺旋の周波数
modIndex: length
音量: length
pan: xの平均
螺旋ごとに一つのfm音源。x, y座標でfm音源
距離が一定以下になると発音。距離で音量(長ければ小さい)。panはxの平均

# おわり
- 