// BgBoard_class.js
'use strict';

class BgBoard {
  constructor(gamemode, gametype) {
    this.gametype = gametype;
    const gameparam = BgUtil.getGametypeParam(this.gametype);
    this.ckrnum = gameparam[1]; //chequer num
    this.param0 = gameparam[0]; //my inner point = point num of one area
    this.param1 = this.param0 * 4 + 1; //array param of XGID position
    this.param2 = this.param0 * 4 + 2; //bar1
    this.param3 = this.param0 * 4 + 3; //bar2
    this.param4 = this.param0 * 2;     //half area points
    this.param5 = this.param0 * 2 + 2; //half area points with bar and offtray
    this.param6 = this.param0 * 2 + 1; //offtray area
    this.param7 = this.param0 * 4 + 4; //stackinfo
    this.dicemx = gameparam[2]; //dice pip max

    this.xgidstr = "XGID=" + "-".repeat(this.param2) + ":0:0:0:00:0:0:0:0:0";
    this.mainBoard = $('#board'); //need to define before bgBoardConfig()
    this.bgBoardConfig();
    this.prepareSvgDice();
    this.setDomNameAndStyle();
  } //end of constructor()

  prepareSvgDice() {
    this.svgDice = [];
    this.svgDice[0]  = '';
    this.svgDice[1]  = '<svg class="dice-one" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[1] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[1] += '<circle cx="90" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[1] += '</svg>';
    this.svgDice[2]  = '<svg class="dice-two" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[2] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[2] += '<circle cx="50" cy="130" r="8" stroke-width="18"/>';
    this.svgDice[2] += '<circle cx="130" cy="50" r="8" stroke-width="18"/>';
    this.svgDice[2] += '</svg>';
    this.svgDice[3]  = '<svg class="dice-three" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[3] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[3] += '<circle cx="48" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[3] += '<circle cx="90" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[3] += '<circle cx="132" cy="48" r="8" stroke-width="18" />';
    this.svgDice[3] += '</svg>';
    this.svgDice[4]  = '<svg class="dice-four" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[4] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[4] += '<circle cx="48" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[4] += '<circle cx="48" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[4] += '<circle cx="132" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[4] += '<circle cx="132" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[4] += '</svg>';
    this.svgDice[5]  = '<svg class="dice-five" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[5] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[5] += '<circle cx="48" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[5] += '<circle cx="48" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[5] += '<circle cx="90" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[5] += '<circle cx="132" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[5] += '<circle cx="132" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[5] += '</svg>';
    this.svgDice[6]  = '<svg class="dice-six" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[6] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[6] += '<circle cx="48" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[6] += '<circle cx="48" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[6] += '<circle cx="48" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[6] += '<circle cx="132" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[6] += '<circle cx="132" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[6] += '<circle cx="132" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[6] += '</svg>';
    this.svgDice[7]  = '<svg class="dice-six" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[7] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[7] += '<circle cx="65" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="65" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="40" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="90" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="115" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="140" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[7] += '<circle cx="115" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[7] += '</svg>';
    this.svgDice[8]  = '<svg class="dice-six" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">';
    this.svgDice[8] += '<rect x="7" y="7" rx="30" width="166" height="166" stroke-width="1"/>';
    this.svgDice[8] += '<circle cx="48" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="48" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="132" cy="48" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="132" cy="132" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="90" cy="60" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="60" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="120" cy="90" r="8" stroke-width="18"/>';
    this.svgDice[8] += '<circle cx="90" cy="120" r="8" stroke-width="18"/>';
    this.svgDice[8] += '</svg>';
  }

  setDomNameAndStyle() {
    let xh;

    //bar
    xh = '<div id="bar" class="bar"></div>';
    this.mainBoard.append(xh);
    $("#bar").css(this.getPosObj(this.pointX[0], 0));

    //offtray
    xh  = '<div id="offtray1" class="offtray"></div>';
    xh += '<div id="offtray2" class="offtray"></div>';
    this.mainBoard.append(xh);
    this.offtray = [null, $('#offtray1'), $('#offtray2')];
    $("#offtray1").css(this.getPosObj(this.param6 * this.pointWidth, 50 * this.vh));
    $("#offtray2").css(this.getPosObj(this.param6 * this.pointWidth, 0));
    $("#offtray1, #offtray2").css({"border":"6px solid", "border-color":"inherit"});

    //point triangles
    this.point = [];
    const pointColorClass = ["pt_dnev", "pt_dnod", "pt_upev", "pt_upod"];
    for (let i = 1; i < this.param1; i++) {
      const colfig = ((i > this.param4) ? 1 : 0) * 2 + (i % 2); //0=under+even, 1=under+odd, 2=upper+even, 3=upper+odd
      const xh = '<div id="pt' + i + '" class="point ' + pointColorClass[colfig] + '"></div>';
      this.mainBoard.append(xh);
      this.point[i] = $('#pt' + i);
      const ey = (i > this.param4) ? 0 : this.mainBoardHeight - this.point[i].height();
      this.point[i].css(this.getPosObj(this.pointX[i], ey));
    }
    this.pointAll = $(".point");

    //cube
    xh  = '<div id="cube" class="cube">64</div>';
    this.mainBoard.append(xh);
    this.cube = $('#cube');
    this.cube.css(this.getPosObj(this.cubeX, this.cubeY[0]));

    //dice
    xh  = '<div id="dice10" class="dice"></div>';
    xh += '<div id="dice11" class="dice"></div>';
    xh += '<div id="dice20" class="dice"></div>';
    xh += '<div id="dice21" class="dice"></div>';
    this.mainBoard.append(xh);
    this.dice = [[],[$('#dice10'),$('#dice11')],[$('#dice20'),$('#dice21')]];
    this.dice[1][0].css(this.getPosObj(this.dice10X, this.diceY));
    this.dice[1][1].css(this.getPosObj(this.dice11X, this.diceY));
    this.dice[2][0].css(this.getPosObj(this.dice20X, this.diceY));
    this.dice[2][1].css(this.getPosObj(this.dice21X, this.diceY));

    //stack counter
    this.stacks = [];
    for (let i = 0; i < this.param7; i++) {
      const xh = '<div id="st' + i + '" class="stack"></div>';
      this.mainBoard.append(xh);
      this.stacks[i] = $('#st' + i);
    }

    //Chequer
    this.chequer = [[],[],[]];
    for (let j = 1; j < 3; j++) {
      for (let i = 0; i < this.ckrnum; i++) {
        this.chequer[j][i] = new Chequer(j, i);
        const xh = this.chequer[j][i].domhtml;
        this.mainBoard.append(xh);
        this.chequer[j][i].dom = true;
      }
    }
  }

  showBoard(xgidstr) { // input for XGID string
    this.showBoard2( new Xgid(xgidstr, this.gametype) );
  }

  showBoard2(xg) { // input for XGID object
    this.xgidstr = xg.xgidstr;
    this.showPosition(xg);
    this.showDiceAll(xg);
    this.showCube(xg);
  }

  showCube(xg){
    const offer = xg.get_dbloffer();
    const pos = (!offer) ? xg.get_cubepos() : -1 * xg.get_turn();
    const val = (!offer) ? xg.get_cube() : xg.get_cube() + 1;
    const crawford = xg.get_crawford();
    const cubepos = BgUtil.cvtTurnXg2Bd(pos);
    const cubeval = BgUtil.calcCubeDisp(val, crawford);
    const cubePosClass = ["cubepos0", "cubepos1", "cubepos2"];
    const cubePosJoin = cubePosClass.join(" ");
    this.cube.text(cubeval).css(this.getPosObj(this.cubeX, this.cubeY[cubepos]))
             .removeClass(cubePosJoin).addClass(cubePosClass[cubepos])
             .toggleClass("cubeoffer", offer);
  }

  showDiceAll(xg) {
    const d1 = xg.get_dice(1);
    const d2 = xg.get_dice(2);
    switch( BgUtil.cvtTurnXg2Bd( xg.get_turn() ) ) {
    case 0:
      this.showDice(1, d1, 0);
      this.showDice(2, 0, d2);
      break;
    case 1:
      this.showDice(1, d1, d2);
      this.showDice(2, 0,  0);
      break;
    case 2:
      this.showDice(1, 0,  0);
      this.showDice(2, d1, d2);
      break;
    }
  }

  showDice(turn, d0, d1) {
    const dicefaceClass = ["", "diceface1", "diceface2"];
    this.dice[turn][0].html(this.svgDice[d0]);
    this.dice[turn][1].html(this.svgDice[d1]);
    this.dice[turn][0].children("svg").addClass(dicefaceClass[turn]);
    this.dice[turn][1].children("svg").addClass(dicefaceClass[turn]);
    (d0 == 0) ? this.dice[turn][0].hide() : this.dice[turn][0].show();
    (d1 == 0) ? this.dice[turn][1].hide() : this.dice[turn][1].show();
  }

  showPosition(xg) {
    //XGIDから各ポイントの駒を数える
    let piecePointer = [0, 0, 0];
    for (let pt = 0; pt <= this.param1; pt++) {
      const num = xg.get_ptno(pt);
      const player = BgUtil.cvtTurnXg2Bd(xg.get_ptcol(pt));
      for (let j = 0; j < num; j++) {
        this.chequer[player][piecePointer[player]].point = pt;
        this.chequer[player][piecePointer[player]].stack = num;
        piecePointer[player] += 1;
      }
    }

    //XGIDにでてこない駒は上がっている駒
    for (let player = 1; player <= 2; player++) {
      for (let i = piecePointer[player]; i < this.ckrnum; i++) {
        const pt = (player == 1) ? this.param2 : this.param3;
        this.chequer[player][i].point = pt;
        this.chequer[player][i].stack = this.ckrnum - piecePointer[player];
      }
    }

    //駒をボードに並べる
    let ex, ey, ty, sf, bf;
    let ptStack = Array(this.param7);
    ptStack.fill(0);
    for (let player = 1; player <= 2; player++) {
      for (let i = 0; i < this.ckrnum; i++) {
        const pt = this.chequer[player][i].point;
        const st = this.chequer[player][i].stack;
        const which = player;
        const which2 = (pt > this.param4);
        bf = false;

        if (pt == this.param2 || pt == this.param3) { //bear off
          bf = true;
          ex = this.pointX[this.param2];
          sf = false;
          ey = (which == 1) ? this.offY[which] - (ptStack[pt] * this.boffHeight)
                            : this.offY[which] + (ptStack[pt] * this.boffHeight); //player==2
        } else if (pt == 0 || pt == this.param1) { //on the bar
          ex = this.pointX[pt];
          sf = (st > this.barStackThreshold + 1);
          ty = (ptStack[pt] > this.barStackThreshold) ? this.barStackThreshold : ptStack[pt];
          ey = (pt == 0) ? this.barY[which] + (ty * this.pieceHeight)
                         : this.barY[which] - (ty * this.pieceHeight); //pt==this.param1
        } else { //in field
          ex = this.pointX[pt];
          sf = (st > this.pointStackThreshold + 1);
          ty = (ptStack[pt] > this.pointStackThreshold) ? this.pointStackThreshold : ptStack[pt];
          ey = (which2) ? this.yupper + (ty * this.pieceHeight)
                        : this.ylower - (ty * this.pieceHeight);
        }
        ptStack[pt] += 1;
        const position = this.getPosObj(ex, ey);
        const zindex = 10 + ptStack[pt];
        this.chequer[player][i].stackidx = ptStack[pt];
        this.chequer[player][i].dom.css(position).css("z-index", zindex).toggleClass("bearoff", bf);
        this.showStackInfo(sf, pt, st, position, player);
      }
    }
  }

  showStackInfo(stackflag, pt, num, position, player) {
    const stackColorClass = ["", "stackcol1", "stackcol2"];
    this.stacks[pt].text("").removeClass(stackColorClass.join(" "));
    if (stackflag) {
      this.stacks[pt].text(num).css(position).addClass(stackColorClass[player]);
    }
  }

  animateDice(msec) {
    const diceanimclass = "faa-shake animated"; //ダイスを揺らすアニメーション
    this.dice[1][0].addClass(diceanimclass);
    this.dice[1][1].addClass(diceanimclass);
    this.dice[2][0].addClass(diceanimclass); //見せないダイスも一緒に揺らす
    this.dice[2][1].addClass(diceanimclass);

    const defer = $.Deferred(); //deferオブジェクトからpromiseを作る
    setTimeout(() => { //msec秒待ってアニメーションを止める
      this.dice[1][0].removeClass(diceanimclass);
      this.dice[1][1].removeClass(diceanimclass);
      this.dice[2][0].removeClass(diceanimclass);
      this.dice[2][1].removeClass(diceanimclass);
      defer.resolve();
    }, msec);

    return defer.promise();
  }

  animateCube(msec) {
    const cubeanimclass = "faa-tada animated faa-fast"; //キューブオファーのアニメーション
    this.cube.addClass(cubeanimclass);

    const defer = $.Deferred(); //deferオブジェクトからpromiseを作る
    setTimeout(() => { //msec秒待ってアニメーションを止める
      this.cube.removeClass(cubeanimclass);
      defer.resolve();
    }, msec);

    return defer.promise();
  }

  bgBoardConfig() {
    //CSSで定義された数値情報を取得
    const style = getComputedStyle(document.querySelector('.container'));
    const boardHeightNum   = parseFloat(style.getPropertyValue('--boardHeightNum'));
    const boardWidthNum    = parseFloat(style.getPropertyValue('--boardWidthNum'));
    const pointWidthNum    = parseFloat(style.getPropertyValue('--pointWidthNum'));
    const cubeSizeNum      = parseFloat(style.getPropertyValue('--cubeSizeNum'));
    const offtrayMarginNum = parseFloat(style.getPropertyValue('--offtrayMarginNum'));

    //ボード表示のための位置と大きさの定数を計算
    this.mainBoardHeight = this.mainBoard.height();
    this.mainBoardWidth = this.mainBoard.width();

    this.vw = this.mainBoardWidth / boardWidthNum;
    this.vh = this.mainBoardHeight / boardHeightNum;

    this.pointWidth = pointWidthNum * this.vw;
    this.cubeSize = cubeSizeNum * this.vw;
    this.pieceWidth = this.pointWidth;
    const phr = this.mainBoardHeight / this.param6 / this.pieceWidth;
    const pieceHeightRatio = (phr > 1) ? 1 : phr;
    this.pieceHeight = this.pieceWidth * pieceHeightRatio;
    this.boffHeight = this.pieceWidth / 4 ;  //ベアオフの駒は立てたように表示
    this.offtrayMargin = offtrayMarginNum;

    this.pointX = this.getPointXary();
    for (let i=0; i< this.pointX.length; i++) {
      this.pointX[i] *= this.pointWidth;
    }

    this.yupper = 0;
    this.ylower = this.mainBoardHeight - this.pieceWidth;

    const tray2Y = -0.4 * this.pieceHeight;
    const tray1Y = this.mainBoardHeight - this.pieceWidth - tray2Y;
    this.offY = [null, tray1Y, tray2Y];

    this.diceSize = this.pointWidth;
    this.diceY = this.mainBoardHeight / 2 - this.diceSize / 2;
    const dx = this.getDiceX();
    this.dice10X = this.pointX[dx[0]];
    this.dice11X = this.pointX[dx[1]];
    this.dice20X = this.pointX[dx[2]];
    this.dice21X = this.pointX[dx[3]];

    const th = this.getStackThres();
    this.pointStackThreshold = th[0];
    this.barStackThreshold = th[1];

    this.cubeX = this.pointX[0] + (this.pointWidth - this.cubeSize) / 2; // cube class widthを加味
    const cubeY0 = Math.round(this.mainBoardHeight / 2 - this.cubeSize / 2);
    const cubeY2 = 5;
    const cubeY1 = this.mainBoardHeight - this.cubeSize - cubeY2;
    this.cubeY = [cubeY0, cubeY1, cubeY2];

    const bar1Y = this.mainBoardHeight / 2 - (this.pieceHeight * 2);
    const bar2Y = this.mainBoardHeight / 2 + this.pieceHeight;
    this.barY = [null, bar1Y, bar2Y];

    this.pointX[this.param2] += offtrayMarginNum;
  }

  getPointXary() {
    switch(this.gametype) {
      case "micro": return [4,8,7,6,5,3,2,1,0,0,1,2,3,5,6,7,8,4,9];
      case "short": return [5,10,9,8,7,6,4,3,2,1,0,0,1,2,3,4,6,7,8,9,10,5,11];
      case "long":  return [7,14,13,12,11,10,9,8,6,5,4,3,2,1,0,0,1,2,3,4,5,6,8,9,10,11,12,13,14,7,15];
      default:      return [6,12,11,10,9,8,7,5,4,3,2,1,0,0,1,2,3,4,5,7,8,9,10,11,12,6,13];
    }
  }

  getDiceX() {
    switch(this.gametype) {
      case "micro": return [2, 3, 6, 7];
      case "short": return [2, 4, 7, 9];
      case "long":  return [3, 5,10,12];
      default:      return [3, 4, 9,10];
    }
  }

  getStackThres() {
    switch(this.gametype) {
      case "micro": return [3, 2];
      case "short": return [5, 3];
      case "long":  return [5, 3];
      default:      return [5, 3];
    }
  }

  getPos2ptz() {
    switch(this.gametype) {
      case "micro": return [9,10,11,12,17,13,14,15,16,0,8,7,6,5,17,4,3,2,1,0];
      case "short": return [11,12,13,14,15,21,16,17,18,19,20,0,10,9,8,7,6,21,5,4,3,2,1,0];
      case "long":  return [15,16,17,18,19,20,21,29,22,23,24,25,26,27,28,0,14,13,12,11,10,9,8,29,7,6,5,4,3,2,1,0];
      default:      return [13,14,15,16,17,18,25,19,20,21,22,23,24,0,12,11,10,9,8,7,25,6,5,4,3,2,1,0];
    }
  }

  getPosObj(x, y) {
    return {left:x, top:y}
  }

  getVw() {
    return this.vw;
  }
  getVh() {
    return this.vh;
  }

  getBarPos(player) {
    return this.getPosObj(this.pointX[this.param1], this.barY[player]);
  }

  getDragEndPoint(pos, player) {
    const pos2ptz = this.getPos2ptz();
    const px = Math.floor(pos.left / this.pointWidth + 0.5);
    const py = Math.floor(pos.top / this.mainBoardHeight * 2);
    const pt = pos2ptz[px + py * this.param5];

    if (pt == 0 || pt == this.param1) { return pt; }
    else {
      return (player == 1) ? pt : this.param1 - pt;
    }
  }

  getDragStartPoint(id, player) {
    const chker = this.chequer[player].find(elem => elem.domid == id);
    const pt = chker.point;
    const p = (player == 1) ? pt : this.param1 - pt;
    return p;
  }

  getChequerOnDragging(pt, player) {
    const aryreverse = this.chequer[player].reverse();
    const chker = aryreverse.find(elem => elem.point == pt); //一番上の(最後の)チェッカーを返す
    return chker;
  }

  getChequerHitted(ptt, player) {
    const pt = (player == 1) ? this.param1 - ptt : ptt;
    const chker = this.chequer[player].find(elem => elem.point == pt);
    return chker;
  }

  flashOnMovablePoint(destpt, player) {
    for (const dp of destpt) {
      if (dp == 0) { this.offtray[player].toggleClass("flash", true); }
      else { this.point[dp].toggleClass("flash", true); }
    }
  }

  flashOffMovablePoint() {
    this.pointAll.removeClass("flash");
    this.offtray[1].removeClass("flash");
    this.offtray[2].removeClass("flash");
  }

  redraw() {
    this.bgBoardConfig();

    //bar
    $("#bar").css(this.getPosObj(this.pointX[0], 0));
    //offtray
    $("#offtray1").css(this.getPosObj(this.param6 * this.pointWidth, 50 * this.vh));
    $("#offtray2").css(this.getPosObj(this.param6 * this.pointWidth, 0));
    //point triangles
    for (let i = 1; i < this.param1; i++) {
      const ey = (i > this.param4) ? 0 : this.mainBoardHeight - this.point[i].height();
      this.point[i].css(this.getPosObj(this.pointX[i], ey));
    }
    //dice
    this.dice[1][0].css(this.getPosObj(this.dice10X, this.diceY));
    this.dice[1][1].css(this.getPosObj(this.dice11X, this.diceY));
    this.dice[2][0].css(this.getPosObj(this.dice20X, this.diceY));
    this.dice[2][1].css(this.getPosObj(this.dice21X, this.diceY));

    this.showBoard(this.xgidstr);
  }

} //class BgBoard
