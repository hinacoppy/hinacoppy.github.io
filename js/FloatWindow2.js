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
'use strict';

class FloatWindow {
  constructor(userOption) {
    const defaultOption = {
            hoverid:  '#dmy',
            headid:   '#dmy',
            bodyid:   '#dmy',
            maxbtn:   '#dmy',
            minbtn:   '#dmy',
            closebtn: '#dmy',
            left:     null,
            top:      null,
            width:    '300px',
            height:   '300px'};

    const option = $.extend(defaultOption, userOption);

    const $hover = $(option.hoverid);
    const $head  = $(option.headid);
    const $body  = $(option.bodyid);
    $hover.css({'width':option.width, 'height':option.height, 'z-index':99}).hide();

    let pos_left = option.left ?  parseInt(option.left) : (window.innerWidth / 2) - ($hover.width() / 2); //画面中央
    let pos_top = option.top ?  parseInt(option.top) : (window.innerHeight / 2) - ($hover.height() / 2);
    $hover.css({'position':'absolute', 'left':pos_left, 'top':pos_top});

    let down_flg = false;
    $head.on('mousedown', (e) => {
      down_flg = true; //移動開始
      let pagex = e.pageX;
      let pagey = e.pageY;
      $(document).on('mousemove', (e) => {
        if (!down_flg) return;
        pos_left += e.pageX - pagex; //移動量計算
        pos_top  += e.pageY - pagey;
        pagex = e.pageX;
        pagey = e.pageY;
        $hover.css({'left':pos_left, 'top':pos_top}); //移動
      }).on('mouseup', () => {
        $(document).off('mousemove');
        down_flg = false; //移動終了
      });
    });

    $(option.closebtn).on('click', () => {
      this.hide();
    });

    $(option.maxbtn).on('click', () => {
      this.max();
    });

    $(option.minbtn).on('click', () => {
      this.min();
    });

    this.hover = $hover;
    this.body = $body;
    this.max_height = option.height;
    this.min_height = $head.height() + 'px';
  }

  show() {
    this.hover.css('height', this.max_height).show();
    this.body.show(); //最小化時にも再表示
  }

  hide() {
    this.hover.fadeOut('fast');
  }

  min() {
    this.hover.css('height', this.min_height);
    this.body.slideUp('fast');
  }

  max() {
    this.hover.css('height', this.max_height);
    this.body.slideDown('fast');
  }

}
