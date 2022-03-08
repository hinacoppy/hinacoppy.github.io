// BgUtil_class.js
'use strict';

class BgUtil {
  constructor() {} // no constructor

  //static utility methods
  static swap(arr, a, b) {
    let t = arr[a]; arr[a] = arr[b]; arr[b] = t;
  }

  static calcCubeVal(val) {
    return  Math.pow(2, val);
  }

  static calcCubeDisp(val, crawford) {
    if (crawford) { return "Cr"; }
    const out = this.calcCubeVal(val);
    return (out <= 1) ? 64 : out;
  }

  static calcCubeValRev(val) {
    return Math.floor(Math.log2(val));
  }

  static cvtTurnXg2kv(t) { //cvt XGID's turn to ThisApp's turn
    const hash = { "0":0, "1":2, "-1":1 };
    return hash[t];
  }

  static cvtTurnKv2xg(t) { //cvt ThisApp's turn to XGID's turn
    const hash = { "0":0, "1":-1, "2":1 };
    return hash[t];
  }

  static ZZZgetOppo(t) { //get Opponent turn number USE:getBdOppo(t)
    const hash = { "0":0, "1":2, "2":1 };
    return hash[t];
  }

  static cvtTurnXg2Bd(t) { //cvt Xgid turn to Board turn
    const hash = { "0":0, "1":1, "-1":2 };
    return hash[t];
  }

  static cvtTurnBd2Xg(t) { //cvt Board turn to Xgid turn
    const hash = { "0":0, "1":1, "2":-1 };
    return hash[t];
  }

  static cvtTurnGm2Bd(t) { //cvt Game turn to Board turn
    return (t) ? 1 : 2;
  }

  static cvtTurnBd2Gm(t) { //cvt Board turn to Game turn
    const hash = { "0":null, "1":true, "2":false };
    return hash[t];
  }

  static cvtTurnGm2Xg(t) { //cvt Game turn to Xgid turn
    return (t) ? 1 : -1;
  }

  static cvtTurnXg2Gm(t) { //cvt Xgid turn to Game turn
    const hash = { "0":null, "1":true, "-1":false };
    return hash[t];
  }

  static getBdOppo(t) { //get Opponent turn number (BoardObj)
    const hash = { "0":0, "1":2, "2":1 };
    return hash[t];
  }

  static getXgOppo(t) { //get Opponent turn number (XgidObj)
    const hash = { "0":0, "1":-1, "-1":1 };
    return hash[t];
  }

  static getGmOppo(t) { //get Opponent turn number (GameObj)
    // true -> false, false -> true
    return !t;
  }

  //UserAgentを確認し、iOSか否かを判断する
  static isIOS() {
    const ua = window.navigator.userAgent.toLowerCase();
    return (ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1 || ua.indexOf('ipad') !== -1);
  }

  static findLine(ary, str) {
    let idx = 0;
    for (let n of ary) {
      if (n.indexOf(str) >= 0) { return idx; }
      idx++;
    }
    return -1;
  }

  static insertStr(str, idx, ins) {
    return str.slice(0, idx) + ins + str.slice(idx);
  }

  static replaceStr(str, idx, rpl) {
    return str.slice(0, idx) + rpl + str.slice(idx + rpl.length);
  }

  static isContain(str, tgt) {
    if (tgt === "") { return (str.trim() === ""); }
    if (str === "") { return false; }
    return (str.indexOf(tgt) >= 0);
  }

  static sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  static randomdice(dicemax = 6, openroll = false) {
    const random = (() => Math.floor( Math.random() * dicemax ) + 1);
    const d1 = random();
    let   d2 = random();
    if (openroll) { //オープニングロールでは同じ目を出さない
      while (d1 == d2) {
        d2 = random();
      }
    }
    const dicestr = String(d1) + String(d2);
    return [d1, d2, dicestr];
  }

  static getLeftTopHash(x, y) {
    return {left:x, top:y};
  }

  static getGametypeParam(gametype) {
    switch(gametype) {
      case "half" : return  [3,  8, 3]; //point num of quarter area, chequer num, dice pip max
      case "micro": return  [4, 10, 4];
      case "short": return  [5, 13, 5];
      case "long" : return  [7, 18, 7];
      case "sugo8": return  [6, 15, 8];
      default     : return  [6, 15, 6];
    }
  }

} //class BgUtil
