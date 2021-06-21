//jquery.funcHoverDiv2.js
//疑似ウィンドウ表示用 jQuery プラグイン
//参考： http://webnonotes.com/javascript-2/fake-window/
//上記で提供されている機能に対して、
// ・モーダル機能を削除
// ・最大化・最小化ボタンを追加
// ・ES6 の構文に修正
// ・コードリファクタリング
// 2021.6.17 hinacoppy
'use strict';

(function($){
  $.fn.funcHoverDiv = function(userOption){
    const defaultOption = {
            hoverid:  '#dmy',
            headid:   '#dmy',
            bodyid:   '#dmy',
            maxbtn:   '#dmy',
            minbtn:   '#dmy',
            closebtn: '#dmy',
            width:    '300px',
            height:   '300px'};

    const option = $.extend(defaultOption, userOption);

    const $hover = $(option.hoverid);
    const $head  = $(option.headid);
    const $body  = $(option.bodyid);
    $hover.css({'width':option.width, 'height':option.height, 'z-index':99}).hide();

    let default_pos_left = (window.innerWidth / 2) - ($hover.width() / 2); //画面中央
    let default_pos_top = (window.innerHeight / 2) - ($hover.height() / 2);
    $hover.css({'position':'absolute', 'left':default_pos_left, 'top':default_pos_top});

    const max_height = option.height;
    const min_height = $head.height() + 'px';

    $(this).on('click', () => {
      $hover.css('height', max_height).show();
      $body.show(); //最小化時にも再表示
    });

    let down_flg = false;
    $head.on('mousedown', (e) => {
      down_flg = true; //移動開始
      let pagex = e.pageX;
      let pagey = e.pageY;
      $(document).on('mousemove', (e) => {
        if (!down_flg) return;
        default_pos_left += e.pageX - pagex; //移動量計算
        default_pos_top  += e.pageY - pagey;
        pagex = e.pageX;
        pagey = e.pageY;
        $hover.css({'left':default_pos_left, 'top':default_pos_top}); //移動
      }).on('mouseup', () => {
        $(document).off('mousemove');
        down_flg = false; //移動終了
      });
    });

    $(option.closebtn).on('click', () => {
      $hover.fadeOut('fast');
    });

    $(option.maxbtn).on('click', () => {
      $hover.css('height', max_height);
      $body.slideDown('fast');
    });

    $(option.minbtn).on('click', () => {
      $hover.css('height', min_height);
      $body.slideUp('fast');
    });

    return(this);
  }

})(jQuery);
