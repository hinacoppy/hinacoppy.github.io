// BgChequer_class.js
'use strict';

class Chequer {
  constructor(player, idx) { //player = 1 or 2, idx = 0..14
    this._player = player;
    this._idx = idx;
    const _idsep = ["z", "w", "b"];
    this._domid = "p" + _idsep[player] + idx;
    const _turnclass = ["", "turncol1", "turncol2"];
    this._domhtml = '<div id="' + this._domid + '" class="chequer ' + _turnclass[player] + '"></div>';
    this._dom = null;
    this._point = 0;
    this._stack = 0;
    this._stackidx = 0;
  }

  //setter method
  set dom(x)      { this._dom = $("#" + this._domid); } //argument x is dummy
  set point(x)    { this._point = x; }
  set stack(x)    { this._stack = x; }
  set stackidx(x) { this._stackidx = x; }

  //getter method
  get idx()      { return this._idx; }
  get dom()      { return this._dom; }
  get domid()    { return this._domid; }
  get domhtml()  { return this._domhtml; }
  get point()    { return this._point; }
  get stack()    { return this._stack; }
  get stackidx() { return this._stackidx; }

} //class Chequer
