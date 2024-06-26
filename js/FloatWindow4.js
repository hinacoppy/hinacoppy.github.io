//FloatWindow4.js
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
// 2023.6.6  draggableに移行
// 2023.6.9  touchイベントにも対応
// 2023.8.26 ボタンクリック時に stopPropagation() を実行
"use strict";

class FloatWindow {
  constructor(userOption) {
    const option = this.setOption(userOption);
    this.setDomNames(option);
    this.setFloatWindowStyle(option);
    this.setButtonEvent();
    this.setDragEvent(this.hover);
    this.setTouchEvent(this.hover, this.head);
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
            width:    "auto",
            height:   "auto",
            initshow: false,};
    const option = Object.assign({}, defaultOption, userOption);
    return option;
  }

  setDomNames(option) {
    this.hover    = document.querySelector(option.hoverid);
    this.head     = document.querySelector(option.headid);
    this.body     = document.querySelector(option.bodyid);
    this.maxbtn   = document.querySelector(option.maxbtn);
    this.minbtn   = document.querySelector(option.minbtn);
    this.closebtn = document.querySelector(option.closebtn);
  }

  setFloatWindowStyle(option) {
    this.hover.style.width = option.width;
    this.hover.style.height = option.height;

    const pos_left = option.left ? parseInt(option.left) : (window.innerWidth / 2) - (this.hover.clientWidth / 2); //画面中央
    const pos_top = option.top ? parseInt(option.top) : (window.innerHeight / 2) - (this.hover.clientHeight / 2);
    this.hover.style.left = pos_left + "px";
    this.hover.style.top = pos_top + "px";

    this.max_height = this.hover.clientHeight + "px";
    this.min_height = this.head.clientHeight + "px";
    this.hover.style.display = option.initshow ? "block" : "none"; //すべてを計算した後に表示/非表示にする
  }

  setDragEvent(container) {
    let mouseX, mouseY; //どこをつかんで移動を開始したかを保持

    container.addEventListener("dragstart", (evt) => {
      mouseX = container.offsetLeft - evt.pageX;
      mouseY = container.offsetTop  - evt.pageY;
      container.style.opacity = 0.5;
    });

    container.addEventListener("drag", (evt) => {
      if (evt.x === 0 && evt.y === 0) { return; }
      container.style.left = (evt.pageX + mouseX) + "px";
      container.style.top  = (evt.pageY + mouseY) + "px";
    });

    container.addEventListener("dragend", (evt) => {
      evt.preventDefault(); //以降のイベントを無視する
      container.style.opacity = 1;
    });
  }

  setTouchEvent(container, dragtarget) {
    let touchX, touchY;

    dragtarget.addEventListener("touchstart", (evt) => {
      evt.preventDefault(); //touchstartの後に発火するマウス関連イベント(mousedown)を抑止する
      if (evt.target === this.closebtn || evt.target === this.maxbtn || evt.target === this.minbtn) {
        evt.target.click(); //preventDefault()でclickイベントが抑止されているため、改めてclickイベントを発火させる
        return;
      }
      touchX = container.offsetLeft - evt.touches[0].pageX;
      touchY = container.offsetTop  - evt.touches[0].pageY;
      container.style.opacity = 0.5;
    });

    dragtarget.addEventListener("touchmove", (evt) => {
      if (evt.x === 0 && evt.y === 0) { return; }
      container.style.left = (evt.touches[0].pageX + touchX) + "px";
      container.style.top  = (evt.touches[0].pageY + touchY) + "px";
    });

    dragtarget.addEventListener("touchend", (evt) => {
      evt.preventDefault();
      container.style.opacity = 1;
    });
  }

  setButtonEvent() {
    if (this.closebtn) this.closebtn.addEventListener("click", (e) => { e.stopPropagation(); this.hide(); });
    if (this.maxbtn)   this.maxbtn.addEventListener("click",   (e) => { e.stopPropagation(); this.max(); });
    if (this.minbtn)   this.minbtn.addEventListener("click",   (e) => { e.stopPropagation(); this.min(); });
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
