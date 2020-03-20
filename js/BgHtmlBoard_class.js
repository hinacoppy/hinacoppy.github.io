// BgHtmlBoard_class.js
'use strict';

class HtmlBoard {
  constructor(xgidstr) {
    this._checker_me = "";
    this._checker_yu = "";
    this._imgpath = "";
    this._boardtype = "";
    this._rotation = "";
    this._xgid = new Xgid(xgidstr);
  }
  // 画像ファイルへのパスを設定するsetter関数
  set imgpath(path) {
    this._imgpath = path;
  }
  // ボードタイプを設定するsetter関数
  set boardtype(type) {
    this._boardtype = type;
  }
  // ローテーションを設定するsetter関数
  set rotation(rotation) {
    this._rotation = rotation;
  }
  //HTML形式のボードデータを返す関数
  get_board_html() {
    if (this._boardtype == 'iti') {
      return this._get_html_iti();
    } else if (this._rotation == 'ccw' && (this._boardtype == 'gnu' || this._boardtype == 'bw')) {
      return this._get_html_gnu_ccw();
    } else if (this._rotation == 'cw'  && (this._boardtype == 'gnu' || this._boardtype == 'bw')) {
      return this._get_html_gnu_cw();
    } else {
      return "BOARD TYPE ERROR (only gnu, bw and iti)";
    }
  }
  //ピップ情報を返す関数
  get_pipinfo() {
    const pip_me = this._xgid.get_pip(1);
    const pip_yu = this._xgid.get_pip(-1);
    return "pips me="+pip_me+" yu="+pip_yu;
  }
  //HTML画像の横方向のサイズを返す関数
  get_bdwidth() {
    if (this._boardtype == 'iti') {
      return "328px";
    } else {
      return "432px";
    }
  }

  // ポイントにあるチェッカーの色と数を組み合わせて画像ファイル名を出力する補助関数
  _parts(pt, boardtype) {
    let no, co;
    if (boardtype == 'iti') {
      no = this._no(pt);
      co = this._col(pt);
    } else {
      no = this._no(pt);
      no = (no == 0) ? "" : no;
      co = this._col(pt);
    }
    return co.toString() + no.toString();
  }
  // ポイントにあるチェッカーの色を出力する補助関数
  _col(pt) {
    switch (this._xgid.get_ptcol(pt)) {
      case 1:
        return this._checker_me;
        break;
      case -1:
        return this._checker_yu;
        break;
      default:
        return "";
    }
  }
  // ポイントにあるチェッカーの数を出力する補助関数
  _no(pt) {
    return this._xgid.get_ptno(pt);
  }
  // ボードの上辺、下辺の画像ファイル名を作成
  _frametop(t, r) { //turn, rotation
    return "b-"+ (t==1 ? "hi":"lo") +"top"+ (r=="cw" ? "":"r") +".png";
  }
  _frametbtm(t, r) {
    return "b-"+ (t==1 ? "lo":"hi") +"bot"+ (r=="cw" ? "":"r") +".png";
  }
  // ボード左右のダイス画像ファイル名を作成
  _dice_r(t, d) { //turn, dice_odr
    return "b-midr" + ((d == "00" || t == -1) ? "" : "-o"+d) + ".png";
  }
  _dice_l(t, d) {
    return "b-midl" + ((d == "00" || t ==  1) ? "" : "-x"+d) + ".png";
  }

  // GnuBGの部品画像ファイルでのHTML出力(反時計回り)
  _get_html_gnu_ccw() {
    this._checker_me = "-o";
    this._checker_yu = "-x";
    const rotation = "ccw";
    const xgid = this._xgid;
    const imgpath = this._imgpath;
    const brd = this._boardtype;
    const cube_up = (xgid.get_cubepos() == -1 ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const cube_dn = (xgid.get_cubepos() == 1  ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const cube_cn = ((xgid.get_cubepos() == 0 && xgid.get_crawford() == 0) ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const turn    = xgid.get_turn();
    const dice_r = this._dice_r(turn, xgid.get_dice_odr());
    const dice_l = this._dice_l(turn, xgid.get_dice_odr());

    let html = "";
    html += "<table cellpadding='0' border='0' cellspacing='0' style='margin: 0; padding: 0; border: 0'>";
    html += "\n";
    html += "<tr><td colspan='15'><img src='"+imgpath+this._frametop(turn, rotation)+"'></td></tr>";
    html += "\n";
    html += "<tr>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-x0.png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(13,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(14,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(15,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(16,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(17,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(18,brd)+".png'></td>";
    html += "<td><img src='"+imgpath+"b-ct"+cube_up+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(19,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(20,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(21,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(22,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(23,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(24,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-x"+xgid.get_boff(-1)+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-bar-o"+this._no(0)+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-midlb.png'></td>";
    html += "<td colspan='6'><img src='"+imgpath+dice_l+"'></td>";
    html += "<td><img src='"+imgpath+"b-midc"+cube_cn +".png'></td>";
    html += "<td colspan='6'><img src='"+imgpath+dice_r+"'></td>";
    html += "<td><img src='"+imgpath+"b-midrb.png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-o0.png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts(12,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts(11,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts(10,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 9,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 8,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 7,brd)+".png'></td>";
    html += "<td><img src='"+imgpath+"b-bar-x"+this._no(25)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 6,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 5,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 4,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 3,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 2,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 1,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-o"+xgid.get_boff(1)+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-cb"+cube_dn+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr><td colspan='15'><img src='"+imgpath+this._frametbtm(turn, rotation)+"'></td></tr></table>";
    html += "\n";
  
    return html;
  }

  // GnuBGの部品画像ファイルでのHTML出力(時計回り)
  _get_html_gnu_cw() {
    this._checker_me = "-o";
    this._checker_yu = "-x";
    const rotation = "cw";
    const xgid = this._xgid;
    const imgpath = this._imgpath;
    const brd = this._boardtype;
    const cube_up = (xgid.get_cubepos() == -1 ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const cube_dn = (xgid.get_cubepos() == 1  ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const cube_cn = ((xgid.get_cubepos() == 0 && xgid.get_crawford() == 0) ? "-"+Math.pow(2, xgid.get_cube()).toString() : "" );
    const turn    = xgid.get_turn();
    const dice_r = this._dice_r(turn, xgid.get_dice_odr());
    const dice_l = this._dice_l(turn, xgid.get_dice_odr());

    let html = "";
    html += "<table cellpadding='0' border='0' cellspacing='0' style='margin: 0; padding: 0; border: 0'>";
    html += "\n";
    html += "<tr><td colspan='15'><img src='"+imgpath+this._frametop(turn, rotation)+"'></td></tr>";
    html += "\n";
    html += "<tr>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-x"+xgid.get_boff(-1)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(24,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(23,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(22,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(21,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(20,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(19,brd)+".png'></td>";
    html += "<td><img src='"+imgpath+"b-ct"+cube_up+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(18,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(17,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(16,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(15,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gd"+this._parts(14,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-rd"+this._parts(13,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-x0.png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-bar-o"+this._no(0)+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-midlb.png'></td>";
    html += "<td colspan='6'><img src='"+imgpath+dice_l+"'></td>";
    html += "<td><img src='"+imgpath+"b-midc"+cube_cn+".png'></td>";
    html += "<td colspan='6'><img src='"+imgpath+dice_r+"'></td>";
    html += "<td><img src='"+imgpath+"b-midrb.png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-o"+xgid.get_boff(1)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 1,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 2,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 3,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 4,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 5,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 6,brd)+".png'></td>";
    html += "<td><img src='"+imgpath+"b-bar-x"+this._no(25)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 7,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts( 8,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts( 9,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts(10,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-ru"+this._parts(11,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-gu"+this._parts(12,brd)+".png'></td>";
    html += "<td rowspan='2'><img src='"+imgpath+"b-roff-o0.png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr>";
    html += "<td><img src='"+imgpath+"b-cb"+cube_dn+".png'></td>";
    html += "</tr>";
    html += "\n";
    html += "<tr><td colspan='15'><img src='"+imgpath+this._frametbtm(turn, rotation)+"'></td></tr></table>";
    html += "\n";

    return html;
  }

  // 市川さんのサイトの部品画像ファイルでのHTML出力
  _get_html_iti() {
    this._checker_me = "b_";
    this._checker_yu = "w_";
    const imgpath = this._imgpath;
    const xgid = this._xgid;
    const brd  = this._boardtype;
    const cube_up = (xgid.get_cubepos() == -1 ? Math.pow(2, xgid.get_cube()).toString() : "0" );
    const cube_dn = (xgid.get_cubepos() == 1  ? Math.pow(2, xgid.get_cube()).toString() : "0" );
    const cube_cn = ((xgid.get_cubepos() == 0 && xgid.get_crawford() == 0) ? "center" : "blank" );
    const turn    = (xgid.get_turn() == 1); //turn == 1 then true, else false
    const diceroll = (xgid.get_dice() == "00" ? "" : xgid.get_dice_odr()+ (turn ? "right" : "left"));

    let html = "";
    html += "<img src='"+imgpath+ (turn ? "n_high" : "n_low") +".gif'>";
    html += "<img src='"+imgpath+"o_w_"+xgid.get_boff(-1)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(24,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(23,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(22,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(21,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(20,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(19,brd)+".gif'>";
    html += "<img src='"+imgpath+"b_up_"+this._no(25)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(18,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(17,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(16,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(15,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_ud_"+this._parts(14,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_up_"+this._parts(13,brd)+".gif'>";
    html += "<img src='"+imgpath+"c_up_"+ cube_up +".gif'>";
    html += "<img src='"+imgpath+"b_center"+ diceroll +".gif'>";
    html += "<img src='"+imgpath+"c_"+ cube_cn +".gif'>";
    html += "<img src='"+imgpath+"o_b_"+xgid.get_boff(1)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts( 1,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts( 2,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts( 3,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts( 4,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts( 5,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts( 6,brd)+".gif'>";
    html += "<img src='"+imgpath+"b_dn_"+this._no( 0)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts( 7,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts( 8,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts( 9,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts(10,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dn_"+this._parts(11,brd)+".gif'>";
    html += "<img src='"+imgpath+"p_dd_"+this._parts(12,brd)+".gif'>";
    html += "<img src='"+imgpath+"c_dn_"+ cube_dn +".gif'>";
    html += "<img src='"+imgpath+ (turn ? "n_low" : "n_high") +".gif'>";
    html += "\n";

    return html;
  }
} //class HtmlBoard
