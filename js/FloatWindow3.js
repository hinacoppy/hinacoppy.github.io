//FloatWindow2.js
//疑似ウィンドウ表示クラス
//参考： http://webnonotes.com/javascript-2/fake-window/
//上記で提供されている機能に対して、
// ・モーダル機能を削除
// ・最大化・最小化ボタンを追加
// ・ES6 の構文に修正
// ・コードリファクタリング
// ・クラス化
// 2021.8.2 hinacoppy
// 2023.1.21 脱jQuery
"use strict";

class FloatWindow {
  constructor(userOption) {
    const option = this.setOption(userOption);
    this.setDomNames(option);
    this.setFloatWindowStyle(option);
    this.setButtonEvent();
    this.setDragEvent();
  }

  setOption(userOption) {
    const defaultOption = {
            hoverid:  "#dmy",
            headid:   "#dmy",
            bodyid:   "#dmy",
            maxbtn:   "#dmy",
            minbtn:   "#dmy",
            closebtn: "#dmy",
            left:     null,
            top:      null,
            width:    "300px",
            height:   "300px"};
    const option = Object.assign({}, defaultOption, userOption);
    return option;
  }

  setDomNames(option) {
    this.hover    = document.querySelector(option.hoverid);
    this.head     = document.querySelector(option.headid);
    this.body     = document.querySelector(option.bodyid);
    this.closebtn = document.querySelector(option.closebtn);
    this.maxbtn   = document.querySelector(option.maxbtn);
    this.minbtn   = document.querySelector(option.minbtn);
  }

  setFloatWindowStyle(option) {
    this.hover.style.width = option.width;
    this.hover.style.height = option.height;

    const pos_left = option.left ?  parseInt(option.left) : (window.innerWidth / 2) - (this.hover.clientWidth / 2); //画面中央
    const pos_top = option.top ?  parseInt(option.top) : (window.innerHeight / 2) - (this.hover.clientHeight / 2);
    this.hover.style.left = pos_left + "px";
    this.hover.style.top = pos_top + "px";

    this.max_height = this.hover.clientHeight + "px";
    this.min_height = this.head.clientHeight + "px";
    this.hover.style.display = "none"; //すべてを計算した後に非表示にする
  }

  setDragEvent() {
    //下記イベントハンドラ内で使うローカル変数
    let draggingflg = false;
    let pagex;
    let pagey;
    let pos_left;
    let pos_top;

    this.hover.addEventListener("dragstart", (e) => {
      draggingflg = true; //移動開始
      pagex = e.pageX;
      pagey = e.pageY;
      pos_left = parseInt(this.hover.style.left); //20px -> 20
      pos_top = parseInt(this.hover.style.top);
      this.hover.style.opacity = 0.5;
    });

    this.hover.addEventListener("drag", (e) => {
      if (!draggingflg) { return; }
      if (e.pageX == 0 && e.pageY == 0) { return; } //マウスを放したときに座標が0になるので、以下の計算をさせない
      pos_left += e.pageX - pagex; //移動量計算
      pos_top  += e.pageY - pagey;
      pagex = e.pageX;
      pagey = e.pageY;
      this.hover.style.left = pos_left + "px"; //移動
      this.hover.style.top = pos_top + "px";
    });

    this.hover.addEventListener("dragend", () => {
      draggingflg = false; //移動終了
      this.hover.style.opacity = 1;
    });
  }

  setButtonEvent() {
    this.closebtn.addEventListener("click", () => { this.hide(); });
    this.maxbtn.addEventListener("click", () => { this.max(); });
    this.minbtn.addEventListener("click", () => { this.min(); });
  }

  show() {
    this.hover.style.height = this.max_height;
    this.hover.style.display = "";
    this.body.style.display = ""; //最小化時にも再表示
  }

  hide() {
    this.hover.style.display = "none";
  }

  min() {
    this.hover.style.height = this.min_height;
    this.body.style.display = "none";
  }

  max() {
    this.hover.style.height = this.max_height;
    this.body.style.display = "";
  }
}
