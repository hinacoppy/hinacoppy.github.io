// BgXgFontBoard_class.js
'use strict';

class XgFontBoard {
  constructor(xgidstr, rotation) {
    this.rotation = (rotation == 'ccw') ? 0 : 1;
    this.xgid = new Xgid(xgidstr);
    this.turn = (this.xgid.get_turn() == 1) ? 0 : 1;
    this.xgboard = [[32,241,161,178,177,178,162,242,32,13,10],
                    [32,240, 65, 70, 65, 70, 65, 70,64,32,64, 65, 70, 65, 70, 65, 70,240,32,13,10],
                    [32,240, 66, 71, 66, 71, 66, 71,64,32,64, 66, 71, 66, 71, 66, 71,240,32,13,10],
                    [32,240, 67, 72, 67, 72, 67, 72,64,32,64, 67, 72, 67, 72, 67, 72,240,32,13,10],
                    [32,240, 68, 73, 68, 73, 68, 73,64,32,64, 68, 73, 68, 73, 68, 73,240,32,13,10],
                    [32,240, 69, 74, 69, 74, 69, 74,64,32,64, 69, 74, 69, 74, 69, 74,240,32,13,10],
                    [32,240, 32, 32, 32, 32, 32, 32,64,32,64, 32, 32, 32, 32, 32, 32,240,32,13,10],
                    [32,240,106,101,106,101,106,101,64,32,64,106,101,106,101,106,101,240,32,13,10],
                    [32,240,105,100,105,100,105,100,64,32,64,105,100,105,100,105,100,240,32,13,10],
                    [32,240,104, 99,104, 99,104, 99,64,32,64,104, 99,104, 99,104, 99,240,32,13,10],
                    [32,240,103, 98,103, 98,103, 98,64,32,64,103, 98,103, 98,103, 98,240,32,13,10],
                    [32,240,102, 97,102, 97,102, 97,64,32,64,102, 97,102, 97,102, 97,240,32,13,10],
                    [32,243,163,180,179,180,164,244,32,13,10]];
    this.set_frame();
    this.set_cube();
    this.set_dice();
    this.set_bearoff();
    this.set_chequer();
  }

  //ボードフレームを表示
  set_frame() {
    const no = this.rotation + this.turn * 2;
    const frameary = [[161,162,163,164], [254 /* 173 */,174,175,176], [165,166,167,168], [169,170,171,172]];
    //code=173のとき、textareaに表示すると表示が乱れるため、code=254に変更する必要がある
    this.xgboard[ 0][2] = frameary[no][0];
    this.xgboard[ 0][6] = frameary[no][1];
    this.xgboard[12][2] = frameary[no][2];
    this.xgboard[12][6] = frameary[no][3];
  }

  //キューブを表示
  set_cube() {
    if (this.xgid.get_crawford()) { return; }
    const xx = (this.rotation == 0) ? 0 : 18;
    const cubepos = this.xgid.get_cubepos();
    const cubeval = this.xgid.get_cube();
    const yyary = [1, 6, 11];
    const yy = yyary[this.xgid.get_cubepos() + 1]; //cubepos = (-1, 0, 1)
    const cubechar = (cubeval == 0) ? 39 : 33 + cubeval; // 39 = cube64
    this.xgboard[yy][xx] = cubechar;
  }

  //ダイスを表示
  set_dice() {
    if (this.xgid.get_dice() == "00") { return; }
    const xx0 = (this.turn == 0) ? 12 : 3;
    const xx3 = xx0 + 3;
    const offset = (this.turn == 0) ? 55 : 48;
    this.xgboard[6][xx0] = this.xgid.get_dice(1) + offset;
    this.xgboard[6][xx3] = this.xgid.get_dice(2) + offset;
  }

  //ベアオフチェッカーを表示
  set_bearoff() {
    const xx = (this.rotation == 0) ? 18 : 0;
    const bo_me = this.xgid.get_boff( 1);
    const bo_yu = this.xgid.get_boff(-1);
    this.xgboard[ 1][xx] = (bo_yu >  5) ? 230 : ((bo_yu > 0) ? 230 + ( 5 - bo_yu) : 32);
    this.xgboard[ 2][xx] = (bo_yu > 10) ? 230 : ((bo_yu > 5) ? 230 + (10 - bo_yu) : 32);
    this.xgboard[ 3][xx] =                      ((bo_yu >10) ? 230 + (15 - bo_yu) : 32);
    this.xgboard[11][xx] = (bo_me >  5) ? 235 : ((bo_me > 0) ? 235 + ( 5 - bo_me) : 32);
    this.xgboard[10][xx] = (bo_me > 10) ? 235 : ((bo_me > 5) ? 235 + (10 - bo_me) : 32);
    this.xgboard[ 9][xx] =                      ((bo_me >10) ? 235 + (15 - bo_me) : 32);
  }

  //チェッカーを表示
  set_chequer() {
    const xxary = [[9,16,15,14,13,12,11, 7, 6, 5, 4, 3, 2, 2, 3, 4, 5, 6, 7,11,12,13,14,15,16, 9], //CCW
                   [9, 2, 3, 4, 5, 6, 7,11,12,13,14,15,16,16,15,14,13,12,11, 7, 6, 5, 4, 3, 2, 9]]; //CW
    for (let pt = 0; pt < 26; pt++) {
      const col = this.xgid.get_ptcol(pt);
      const no  = this.xgid.get_ptno(pt);
      const xxx = xxary[this.rotation][pt];
      if (no == 0) { continue; }
      for (let yy = 0; yy < 5 && yy < no; yy++) {
        const yyy = (pt >= 13) ? 1 + yy : 11 - yy;
        if (pt == 0 || pt == 25) {
          this.xgboard[yyy][xxx] = (col == 1 ? 219 : 208); //on the bar
        } else {
          this.xgboard[yyy][xxx] += (col == 1 ? 20 : 10); //in field
        }
      }
      if (no >= 6) {
        const yyy = (pt >= 13) ? 5 : 7;
        this.xgboard[yyy][xxx] = no - 5 + (col == 1 ? 219 : 208); //stack chequer
      }
    }
  }

  //ボードを文字コードで組み立てる
  get_xgfontboard() {
    let xgboard = "";
    for (let line of this.xgboard) {
      xgboard += String.fromCharCode.apply(null, line);
    }
    return xgboard;
  }

} // class XgFontBoard
