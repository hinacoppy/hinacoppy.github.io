// BgTextBoard_class.js
'use strict';

class TextBoard {
  constructor(xgidstr, rotation='ccw', col='xo') {
    this.rotation = (rotation == 'cw'); //boolean
    this.xgid = new Xgid(xgidstr);
    this.turn = (this.xgid.get_turn() == 1); //boolean
    this.chqer = (col == 'xo') ? ["X", "O"] : ["O", "X"];
    this.board = (this.rotation) ? this.make_textboard_cw() : this.make_textboard_ccw();
  }

  p(pt, line) {
    const num = this.xgid.get_ptno(pt);
    const col = this.xgid.get_ptcol(pt);

    let retstr;
    if (line == 5 && num >= 6) {
      retstr = (" " + num + " ").slice(-3); //右から3文字
    } else if (num >= line) {
      retstr = " " + this.chqer[((col == 1) ? 0 : 1)] + " "; //(col -> idx) => chqer
    } else {
      retstr = "   ";
    }
    return retstr;
  }

  cube(cubepos) {
    const cubeval = this.xgid.get_cube();
    let cubestr = "";
    if (this.xgid.get_crawford()) {
      cubestr = "[Cr]";
    } else if (cubeval == 0) {
      cubestr = "[64]";
    } else if (cubeval >= 1) {
      cubestr = "[" + Math.pow(2, cubeval) + "]";
    }
    return (cubepos == this.xgid.get_cubepos()) ? cubestr : "";
  }

  dice(tn) {
    const dice = this.xgid.get_dice();
    const dicestr = (dice == '00') ? "   " : this.xgid.get_dice(1) + " " + this.xgid.get_dice(2);
    return (tn == this.turn) ? dicestr : "   ";
  }

  bo(w, m) {
    const tn = (w == 0) ? 1 : -1;
    const bof = this.xgid.get_boff(tn);
    const chk = this.chqer[w]; //w==0 -> me, w==1 -> yu
    let re;
    if (this.rotation) {
      re  = (bof >= 15 || bof >10 && (bof%5) >= m ) ? chk : " ";
      re += (bof >= 10 || bof > 5 && (bof%5) >= m ) ? chk : " ";
      re += (bof >=  5 || bof > 0 && (bof%5) >= m ) ? chk : " ";
    } else {
      re  = (bof >=  5 || bof > 0 && (bof%5) >= m ) ? chk : " ";
      re += (bof >= 10 || bof > 5 && (bof%5) >= m ) ? chk : " ";
      re += (bof >= 15 || bof >10 && (bof%5) >= m ) ? chk : " ";
    }
    return re;
  }

// テキスト形式のボード出力(時計回り)
  make_textboard_cw() {
    let txtbd;
    txtbd  = (this.turn ? "   +24-23-22-21-20-19------18-17-16-15-14-13-+" : "   +-1--2--3--4--5--6-------7--8--9-10-11-12-+")
            +this.cube(-1)+"\n";
    txtbd += this.bo(1,1)+"|"+this.p(24,1)+this.p(23,1)+this.p(22,1)+this.p(21,1)+this.p(20,1)+this.p(19,1)+"|"
            +this.p(25,5)+"|"+this.p(18,1)+this.p(17,1)+this.p(16,1)+this.p(15,1)+this.p(14,1)+this.p(13,1)+"|\n";
    txtbd += this.bo(1,2)+"|"+this.p(24,2)+this.p(23,2)+this.p(22,2)+this.p(21,2)+this.p(20,2)+this.p(19,2)+"|"
            +this.p(25,4)+"|"+this.p(18,2)+this.p(17,2)+this.p(16,2)+this.p(15,2)+this.p(14,2)+this.p(13,2)+"|\n";
    txtbd += this.bo(1,3)+"|"+this.p(24,3)+this.p(23,3)+this.p(22,3)+this.p(21,3)+this.p(20,3)+this.p(19,3)+"|"
            +this.p(25,3)+"|"+this.p(18,3)+this.p(17,3)+this.p(16,3)+this.p(15,3)+this.p(14,3)+this.p(13,3)+"|\n";
    txtbd += this.bo(1,4)+"|"+this.p(24,4)+this.p(23,4)+this.p(22,4)+this.p(21,4)+this.p(20,4)+this.p(19,4)+"|"
            +this.p(25,2)+"|"+this.p(18,4)+this.p(17,4)+this.p(16,4)+this.p(15,4)+this.p(14,4)+this.p(13,4)+"|\n";
    txtbd += this.bo(1,5)+"|"+this.p(24,5)+this.p(23,5)+this.p(22,5)+this.p(21,5)+this.p(20,5)+this.p(19,5)+"|"
            +this.p(25,1)+"|"+this.p(18,5)+this.p(17,5)+this.p(16,5)+this.p(15,5)+this.p(14,5)+this.p(13,5)+"|\n";
    txtbd += "   |      "+this.dice(false)+"         |BAR|      "+this.dice(true)+"         |"+this.cube(0)+"\n";
    txtbd += this.bo(0,5)+"|"+this.p( 1,5)+this.p( 2,5)+this.p( 3,5)+this.p( 4,5)+this.p( 5,5)+this.p( 6,5)+"|"
            +this.p( 0,1)+"|"+this.p( 7,5)+this.p( 8,5)+this.p( 9,5)+this.p(10,5)+this.p(11,5)+this.p(12,5)+"|\n";
    txtbd += this.bo(0,4)+"|"+this.p( 1,4)+this.p( 2,4)+this.p( 3,4)+this.p( 4,4)+this.p( 5,4)+this.p( 6,4)+"|"
            +this.p( 0,2)+"|"+this.p( 7,4)+this.p( 8,4)+this.p( 9,4)+this.p(10,4)+this.p(11,4)+this.p(12,4)+"|\n";
    txtbd += this.bo(0,3)+"|"+this.p( 1,3)+this.p( 2,3)+this.p( 3,3)+this.p( 4,3)+this.p( 5,3)+this.p( 6,3)+"|"
            +this.p( 0,3)+"|"+this.p( 7,3)+this.p( 8,3)+this.p( 9,3)+this.p(10,3)+this.p(11,3)+this.p(12,3)+"|\n";
    txtbd += this.bo(0,2)+"|"+this.p( 1,2)+this.p( 2,2)+this.p( 3,2)+this.p( 4,2)+this.p( 5,2)+this.p( 6,2)+"|"
            +this.p( 0,4)+"|"+this.p( 7,2)+this.p( 8,2)+this.p( 9,2)+this.p(10,2)+this.p(11,2)+this.p(12,2)+"|\n";
    txtbd += this.bo(0,1)+"|"+this.p( 1,1)+this.p( 2,1)+this.p( 3,1)+this.p( 4,1)+this.p( 5,1)+this.p( 6,1)+"|"
            +this.p( 0,5)+"|"+this.p( 7,1)+this.p( 8,1)+this.p( 9,1)+this.p(10,1)+this.p(11,1)+this.p(12,1)+"|\n";
    txtbd += (this.turn ? "   +-1--2--3--4--5--6-------7--8--9-10-11-12-+" : "   +24-23-22-21-20-19------18-17-16-15-14-13-+")
            +this.cube(1)+"\n";
    txtbd += "   Pips " + this.chqer[0] + "= " + this.xgid.get_pip(1) + " " + this.chqer[1] + "= " + this.xgid.get_pip(-1) +"\n";
    return txtbd;
  }
  // テキスト形式のボード出力(反時計回り)
  make_textboard_ccw() {
    let txtbd;
    txtbd  = (this.turn ? "+13-14-15-16-17-18------19-20-21-22-23-24-+" : "+12-11-10--9--8--7-------6--5--4--3--2--1-+")
            +this.cube(-1)+"\n";
    txtbd += "|"+this.p(13,1)+this.p(14,1)+this.p(15,1)+this.p(16,1)+this.p(17,1)+this.p(18,1)+"|"+this.p(25,5)
            +"|"+this.p(19,1)+this.p(20,1)+this.p(21,1)+this.p(22,1)+this.p(23,1)+this.p(24,1)+"|"+this.bo(1,1)+"\n";
    txtbd += "|"+this.p(13,2)+this.p(14,2)+this.p(15,2)+this.p(16,2)+this.p(17,2)+this.p(18,2)+"|"+this.p(25,4)
            +"|"+this.p(19,2)+this.p(20,2)+this.p(21,2)+this.p(22,2)+this.p(23,2)+this.p(24,2)+"|"+this.bo(1,2)+"\n";
    txtbd += "|"+this.p(13,3)+this.p(14,3)+this.p(15,3)+this.p(16,3)+this.p(17,3)+this.p(18,3)+"|"+this.p(25,3)
            +"|"+this.p(19,3)+this.p(20,3)+this.p(21,3)+this.p(22,3)+this.p(23,3)+this.p(24,3)+"|"+this.bo(1,3)+"\n";
    txtbd += "|"+this.p(13,4)+this.p(14,4)+this.p(15,4)+this.p(16,4)+this.p(17,4)+this.p(18,4)+"|"+this.p(25,2)
            +"|"+this.p(19,4)+this.p(20,4)+this.p(21,4)+this.p(22,4)+this.p(23,4)+this.p(24,4)+"|"+this.bo(1,4)+"\n";
    txtbd += "|"+this.p(13,5)+this.p(14,5)+this.p(15,5)+this.p(16,5)+this.p(17,5)+this.p(18,5)+"|"+this.p(25,1)
            +"|"+this.p(19,5)+this.p(20,5)+this.p(21,5)+this.p(22,5)+this.p(23,5)+this.p(24,5)+"|"+this.bo(1,5)+"\n";
    txtbd += "|      "+this.dice(false)+"         |BAR|      "+this.dice(true)+"         |"+this.cube(0)+"\n";
    txtbd += "|"+this.p(12,5)+this.p(11,5)+this.p(10,5)+this.p( 9,5)+this.p( 8,5)+this.p( 7,5)+"|"+this.p( 0,1)
            +"|"+this.p( 6,5)+this.p( 5,5)+this.p( 4,5)+this.p( 3,5)+this.p( 2,5)+this.p( 1,5)+"|"+this.bo(0,5)+"\n";
    txtbd += "|"+this.p(12,4)+this.p(11,4)+this.p(10,4)+this.p( 9,4)+this.p( 8,4)+this.p( 7,4)+"|"+this.p( 0,2)
            +"|"+this.p( 6,4)+this.p( 5,4)+this.p( 4,4)+this.p( 3,4)+this.p( 2,4)+this.p( 1,4)+"|"+this.bo(0,4)+"\n";
    txtbd += "|"+this.p(12,3)+this.p(11,3)+this.p(10,3)+this.p( 9,3)+this.p( 8,3)+this.p( 7,3)+"|"+this.p( 0,3)
            +"|"+this.p( 6,3)+this.p( 5,3)+this.p( 4,3)+this.p( 3,3)+this.p( 2,3)+this.p( 1,3)+"|"+this.bo(0,3)+"\n";
    txtbd += "|"+this.p(12,2)+this.p(11,2)+this.p(10,2)+this.p( 9,2)+this.p( 8,2)+this.p( 7,2)+"|"+this.p( 0,4)
            +"|"+this.p( 6,2)+this.p( 5,2)+this.p( 4,2)+this.p( 3,2)+this.p( 2,2)+this.p( 1,2)+"|"+this.bo(0,2)+"\n";
    txtbd += "|"+this.p(12,1)+this.p(11,1)+this.p(10,1)+this.p( 9,1)+this.p( 8,1)+this.p( 7,1)+"|"+this.p( 0,5)
            +"|"+this.p( 6,1)+this.p( 5,1)+this.p( 4,1)+this.p( 3,1)+this.p( 2,1)+this.p( 1,1)+"|"+this.bo(0,1)+"\n";
    txtbd += (this.turn ? "+12-11-10--9--8--7-------6--5--4--3--2--1-+" : "+13-14-15-16-17-18------19-20-21-22-23-24-+")
            +this.cube(1)+"\n";
    txtbd += "Pips " + this.chqer[0] + "= " + this.xgid.get_pip(1) + " " + this.chqer[1] + "= " + this.xgid.get_pip(-1) +"\n";
    return txtbd;
  }

  //テキストボードを返すメソッド
  get txtboard() {
    return this.board;
  }

  //テキストボードを返す関数
  get_txtboard() {
    return this.board;
  }

} // class TextBoard
