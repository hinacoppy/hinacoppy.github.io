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
// 2023.2.2  touchイベントに対応
"use strict";

class FloatWindow {
  constructor(userOption) {
    const option = this.setOption(userOption);
    this.setDomNames(option);
    this.setFloatWindowStyle(option);
    this.setButtonEvent();
    this.setDragEvent(this.head, this.hover);
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
            height:   "300px",
            initshow: false,};
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
    this.hover.style.display = option.initshow ? "block" : "none"; //すべてを計算した後に表示/非表示にする
  }

  setDragEvent(target, container) {
    //下記イベントハンドラ内で使うローカル変数
    let draggingflg = false;
    let pagex;
    let pagey;
    let pos_left;
    let pos_top;

    const evfn_touchstart = ((evt) => {
      evt.preventDefault(); //touchstartの後に発火するマウス関連イベント(mousedown)を抑止する
      if (evt.target === this.closebtn || evt.target === this.maxbtn || evt.target === this.minbtn) {
        evt.target.click(); //preventDefault()でclickイベントが抑止されているため、改めてclickイベントを発火させる
        return;
      }

      //マウスイベントとタッチイベントの差異を吸収
      if (evt.type === "mousedown") {
        target.addEventListener("mousemove",  evfn_dragging);
        target.addEventListener("mouseup",    evfn_touchend);
        target.addEventListener("mouseleave", evfn_touchend);
        pagex = evt.pageX;
        pagey = evt.pageY;
      } else {
        target.addEventListener("touchmove",  evfn_dragging);
        target.addEventListener("touchend",   evfn_touchend);
        target.addEventListener("touchleave", evfn_touchend);
        pagex = evt.touches[0].pageX;
        pagey = evt.touches[0].pageY;
      }

      pos_left = parseInt(container.style.left); //20px -> 20
      pos_top = parseInt(container.style.top);
      container.style.opacity = 0.5;
      draggingflg = true; //移動開始
    });

    const evfn_dragging = ((evt) => {
      if (!draggingflg) { return; }
      //マウスイベントとタッチイベントの差異を吸収
      const e = (evt.type === "mousemove") ? evt : evt.touches[0];
      if (e.pageX == 0 && e.pageY == 0) { return; } //マウスを放したときに座標が0になるので、以下の計算をさせない
      pos_left += e.pageX - pagex; //移動量計算
      pos_top  += e.pageY - pagey;
      pagex = e.pageX;
      pagey = e.pageY;
      container.style.left = pos_left + "px"; //移動
      container.style.top = pos_top + "px";
    });

    const evfn_touchend = ((evt) => {
      evt.preventDefault(); //touchendの後に発火するマウス関連イベント(mouseup,click)を抑止する
      //イベント監視を止める (evfn_touchstartで登録しなかったイベントも止める)
      target.removeEventListener("mousemove",  evfn_dragging);
      target.removeEventListener("touchmove",  evfn_dragging);
      target.removeEventListener("mouseup",    evfn_touchend);
      target.removeEventListener("mouseleave", evfn_touchend);
      target.removeEventListener("touchend",   evfn_touchend);
      target.removeEventListener("touchleave", evfn_touchend);

      draggingflg = false; //移動終了
      container.style.opacity = 1;
    });

    //スタートイベントを登録
    target.addEventListener("mousedown",  evfn_touchstart);
    target.addEventListener("touchstart", evfn_touchstart);
  }

  setButtonEvent() {
    if (this.closebtn) this.closebtn.addEventListener("click", () => { this.hide(); });
    if (this.maxbtn) this.maxbtn.addEventListener("click", () => { this.max(); });
    if (this.minbtn) this.minbtn.addEventListener("click", () => { this.min(); });
  }

  show() {
    this.hover.style.height = this.max_height;
    this.hover.style.display = "block";
    this.body.style.display = "block"; //最小化時にも再表示
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
    this.body.style.display = "block";
  }
}
