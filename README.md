# playground_202311
simple playground for p5.js/p5.sound

# how to use
## common
- import "util.js" as "u", "effect.js" as "e"
- declare "size", "dt", "snd", "p" and "f"
- declare "dt" in draw() with sub-objects
- declare with "_" ahead of the name of object for previous object, which has not been updated in draw()

## how to use util.js
- createPane: tweakpaneのパネルを作成するのでデフォルトの記載でよい。fとして宣言して.addFolderによりsketchなどのフォルダを作成してボタンなどを追加する。
- debug: 任意のオブジェクトを引数にとることでオブジェクトの中身を表示する
- getSize: 引数にsをとり画面サイズを返す
- drawFrame: 枠を描画する
- pp: s, func, pgを引数にとり、funcをpush() とpop()で囲んでから実行する。
