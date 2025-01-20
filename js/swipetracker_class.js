// swipetracker_class.js
"use strict";

class SwipeTracker {
  constructor(target, direction = "tlrud", threshold = 200) {
    this.swipeTracker(target, direction, threshold);
  }

  swipeTracker(target, direction, threshold) {
    const thresholdX = threshold;
    const thresholdY = threshold;
    let startX;
    let startY;
    let moveX;
    let moveY;

    const evfn_touchstart = ((origevt) => {
      origevt.preventDefault(); //touchstartの後に発火するマウス関連イベント(mousedown)を抑止する
      //イベントハンドラを登録。tagetが広いとき(ex body)は {passive: false}が必要
      target.addEventListener("mousemove",  evfn_swiping);
      target.addEventListener("touchmove",  evfn_swiping);
      target.addEventListener("mouseup",    evfn_touchend);
      target.addEventListener("mouseleave", evfn_touchend);
      target.addEventListener("touchend",   evfn_touchend);
      target.addEventListener("touchleave", evfn_touchend);

      //マウスイベントとタッチイベントの差異を吸収
      const ev = (origevt.type === "mousedown") ? origevt : origevt.touches[0];
      //開始座標記録
      startX = ev.pageX;
      startY = ev.pageY;
      moveX = 0;
      moveY = 0;
    });

    const evfn_swiping = ((origevt) => {
      //マウスイベントとタッチイベントの差異を吸収
      const ev = (origevt.type === "mousemove") ? origevt : origevt.touches[0];
      //タッチ開始時からの差分
      moveX = ev.pageX - startX;
      moveY = ev.pageY - startY;
    });

    const evfn_touchend = ((origevt) => {
      origevt.preventDefault(); //touchendの後に発火するマウス関連イベント(mouseup,click)を抑止する
      //イベント監視を止める
      target.removeEventListener("mousemove",  evfn_swiping);
      target.removeEventListener("touchmove",  evfn_swiping);
      target.removeEventListener("mouseup",    evfn_touchend);
      target.removeEventListener("mouseleave", evfn_touchend);
      target.removeEventListener("touchend",   evfn_touchend);
      target.removeEventListener("touchleave", evfn_touchend);

      //イベントを判断し発火させる
      let eventtype = null;
      if      (direction.includes("l") && moveX < 0 && Math.abs(moveX) >= thresholdX) { eventtype = "swipeleft"; }
      else if (direction.includes("r") && moveX > 0 && Math.abs(moveX) >= thresholdX) { eventtype = "swiperight"; }
      else if (direction.includes("u") && moveY < 0 && Math.abs(moveY) >= thresholdY) { eventtype = "swipeup"; }
      else if (direction.includes("d") && moveY > 0 && Math.abs(moveY) >= thresholdY) { eventtype = "swipedown"; }
      else if (direction.includes("t"))                                               { eventtype = "mytap"; }
      if (eventtype) {
        target.dispatchEvent(new CustomEvent(eventtype)); //見張っているイベントだけ発火させる
      }
    });

    //スタートイベントを登録
    target.addEventListener("mousedown",  evfn_touchstart);
    target.addEventListener("touchstart", evfn_touchstart);
  }
}
