//TableOperator_class.js
"use strict";

//bootstrap-tableの主要機能(列描画・ソート・チェックボックス選択・ページネーション・
//セル単体更新・行フィルタ・列表示切替・スクロール制御)を、jQuery/bootstrap-tableに依存せず
//素のDOMで再実装した汎用テーブルコンポーネント。外部仕様は末尾のコメントを参照。
class TableOperator {
  constructor(tableElement, columns, options = {}) {
    this.table = tableElement;
    this.columns = columns;
    this.clickToSelect = !!options.clickToSelect;
    this.singleSelect = !!options.singleSelect; //trueの場合、行選択は常に単一行のみ(選択すると他は自動解除)
    this.onRowSelect = options.onRowSelect ?? null; //ユーザー操作(クリック/チェックボックス)で行が選択されたときに呼ばれる (row, index) => {}
    this.pageSize = (options.pageSize > 0) ? options.pageSize : null; //未指定ならページネーション無効
    this.data = [];
    this.filter = null; //filterBy()で設定される絞り込み条件。load()しても保持される
    this.currentPageData = [];
    this.sortField = null;
    this.sortOrder = "asc";
    this.currentPage = 1;
    this.selectedRows = new Set(); //行オブジェクトの参照で選択状態を管理(ページ・ソート・フィルタをまたいでも保持される)

    this.table.innerHTML = "";
    this.table.classList.add("table-operator"); //呼び出し側のid/classに依存せず、自身でスタイルフックとなるクラスを付与する
    this.thead = document.createElement("thead");
    this.thead.className = "table-operator-thead";
    this.tbody = document.createElement("tbody");
    this.tfoot = document.createElement("tfoot");
    this.table.appendChild(this.thead);
    this.table.appendChild(this.tbody);
    this.table.appendChild(this.tfoot);

    this.wrapper = null;
    if (options.height) { //指定時はtable全体を固定高さのスクロール領域に包み、ヘッダーをsticky表示する
      //スクロール(overflow-y)・ヘッダーのsticky化はcss/TableOperator.cssの.table-operator-scrollが担う。
      //JS側はインスタンスごとに異なる高さ(options.height)だけをインラインで設定する
      this.wrapper = document.createElement("div");
      this.wrapper.className = "table-operator-scroll";
      this.wrapper.style.maxHeight = /^\d+$/.test(options.height) ? (options.height + "px") : options.height;
      this.table.parentNode.insertBefore(this.wrapper, this.table);
      this.wrapper.appendChild(this.table);
    }

    this.renderHeader();
    this.setEventHandler();
    this.bindColumnEvents();
  }

  setEventHandler() {
    if (!this.clickToSelect) return;
    //行内のボタン等以外をクリックしたときにチェックボックスをトグルする
    this.tbody.addEventListener("click", (e) => {
      if (e.target.closest("button, a, input")) return;
      const tr = e.target.closest("tr");
      if (!tr) return;
      const row = this.currentPageData[Number(tr.dataset.index)];
      if (!row) return;
      //singleSelect時はクリックで常にその行が選択状態になる(トグルではない)
      const selected = this.singleSelect ? true : !this.selectedRows.has(row);
      this.applySelection(row, selected, tr);
    });
  }

  //列定義のevents(bootstrap-tableの{ "click .edit": handler, ... }相当)をtbodyへのイベント委譲で処理する
  bindColumnEvents() {
    const eventTypes = new Set();
    for (const col of this.columns) {
      if (!col.events) continue;
      for (const key of Object.keys(col.events)) {
        eventTypes.add(key.split(" ")[0]);
      }
    }
    for (const type of eventTypes) {
      this.tbody.addEventListener(type, (e) => {
        const tr = e.target.closest("tr");
        if (!tr) return;
        const index = Number(tr.dataset.index);
        const row = this.currentPageData[index];
        if (!row) return;
        for (const col of this.columns) {
          if (!col.events) continue;
          for (const [key, handler] of Object.entries(col.events)) {
            const [evType, selector] = key.split(" ");
            if (evType !== type) continue;
            const hit = e.target.closest(selector);
            if (hit && tr.contains(hit)) {
              const value = col.field ? row[col.field] : undefined;
              handler(e, value, row, index);
              return;
            }
          }
        }
      });
    }
  }

  renderHeader() {
    const tr = document.createElement("tr");
    for (const col of this.columns) {
      if (col.visible === false) continue;
      const th = document.createElement("th");
      th.innerHTML = col.title ?? "";
      if (col.align) th.style.textAlign = col.halign ?? col.align;
      if (col.width) th.style.width = col.width + (col.widthUnit ?? "px");
      //sticky化(スクロール時にヘッダーを追従させる)・sortable時のcursor:pointerは
      //どちらもインスタンスに依存しない固定スタイルなので、css/TableOperator.cssの
      //.table-operator-scroll .table-operator-thead th / .table-operator-sortable に任せる
      if (col.sortable) {
        th.classList.add("table-operator-sortable");
        th.addEventListener("click", () => this.sortBy(col.field));
      }
      tr.appendChild(th);
    }
    this.thead.innerHTML = "";
    this.thead.appendChild(tr);
  }

  sortBy(field) {
    this.sortOrder = (this.sortField === field && this.sortOrder === "asc") ? "desc" : "asc";
    this.sortField = field;
    const dir = (this.sortOrder === "asc") ? 1 : -1;
    this.data.sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    this.currentPage = 1; //ソートし直したら1ページ目に戻す
    this.render();
  }

  //データをテーブルに差し込む(bootstrapTable("load", data)相当)。filterBy()で設定した絞り込みは維持される
  load(data) {
    this.data = data;
    this.sortField = null;
    this.selectedRows.clear(); //新しいデータでは選択状態をリセット
    this.currentPage = 1;
    this.render();
  }

  //filterフィールドで絞り込んだ後のデータ配列を返す。以降の全ての「index」はこの配列上の位置を指す
  getFilteredData() {
    if (!this.filter) return this.data;
    return this.data.filter((row) =>
      Object.entries(this.filter).every(([field, allowed]) => allowed.includes(row[field]))
    );
  }

  //表示するデータを絞り込む(bootstrapTable("filterBy", {field: [値, ...]})相当)。
  //filterObjが空/nullの場合は絞り込み解除。load()し直しても設定は保持される
  filterBy(filterObj) {
    this.filter = (filterObj && Object.keys(filterObj).length > 0) ? filterObj : null;
    this.currentPage = 1;
    this.render();
  }

  render() {
    this.renderBody();
    this.renderFooter();
  }

  totalPages() {
    return this.pageSize ? Math.max(1, Math.ceil(this.getFilteredData().length / this.pageSize)) : 1;
  }

  getCurrentPageData() {
    const data = this.getFilteredData();
    if (!this.pageSize) return data;
    const start = (this.currentPage - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  goToPage(page) {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages());
    this.render();
  }

  renderBody() {
    this.currentPageData = this.getCurrentPageData();
    this.tbody.innerHTML = "";
    this.currentPageData.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.dataset.index = index; //現在ページ内でのインデックス(選択トグル時の行特定用)
      for (const col of this.columns) {
        if (col.visible === false) continue;
        const td = document.createElement("td");
        if (col.align) td.style.textAlign = col.align;

        if (col.checkbox) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "table-operator-checkbox";
          checkbox.checked = this.selectedRows.has(row);
          checkbox.addEventListener("change", () => this.applySelection(row, checkbox.checked, tr));
          td.appendChild(checkbox);
        } else {
          const value = col.field ? row[col.field] : undefined;
          if (col.formatter) {
            td.innerHTML = (typeof col.formatter === "function") ? col.formatter(value, row, index, col.field) : col.formatter;
          } else {
            td.innerHTML = value ?? "";
          }
        }
        tr.appendChild(td);
      }
      this.tbody.appendChild(tr);
    });
  }

  //ページ送りボタンをtfootに描画する。ページが1ページしかない場合は何も表示しない
  renderFooter() {
    this.tfoot.innerHTML = "";
    const totalPages = this.totalPages();
    if (!this.pageSize || totalPages <= 1) return;

    const makeButton = (label, page, disabled) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = disabled;
      button.addEventListener("click", () => this.goToPage(page));
      return button;
    };

    const td = document.createElement("td");
    td.colSpan = this.columns.length;
    td.className = "table-operator-pagination";
    td.appendChild(makeButton("«", 1, this.currentPage === 1));
    td.appendChild(makeButton("‹", this.currentPage - 1, this.currentPage === 1));

    const info = document.createElement("span");
    info.className = "table-operator-pagination-info";
    info.textContent = `${this.currentPage} / ${totalPages}`;
    td.appendChild(info);

    td.appendChild(makeButton("›", this.currentPage + 1, this.currentPage === totalPages));
    td.appendChild(makeButton("»", totalPages, this.currentPage === totalPages));

    const tr = document.createElement("tr");
    tr.appendChild(td);
    this.tfoot.appendChild(tr);
  }

  setRowSelected(row, selected) {
    if (selected) {
      if (this.singleSelect) this.selectedRows.clear();
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
  }

  //ユーザー操作(行クリック/チェックボックス操作)による選択変更。
  //singleSelectでない限りは該当行のチェックボックスの見た目だけを更新する軽量な更新に留め、
  //テーブル全体の再描画(render())はしない。onRowSelectはselected===trueのときだけ呼ぶ
  applySelection(row, selected, tr) {
    this.setRowSelected(row, selected);
    if (this.singleSelect) {
      this.render(); //他行の選択状態も見た目に反映する必要があるため、この場合のみ全体を再描画する
    } else {
      const checkbox = tr.querySelector(".table-operator-checkbox");
      if (checkbox) checkbox.checked = this.selectedRows.has(row);
    }
    if (selected && this.onRowSelect) {
      const index = this.getFilteredData().indexOf(row);
      this.onRowSelect(row, index);
    }
  }

  //選択された行データを返す(bootstrapTable("getSelections")相当)。ページをまたいだ選択も含む
  getSelections() {
    return this.data.filter((row) => this.selectedRows.has(row));
  }

  //指定index(フィルタ適用後データ上の位置)の1セルだけを書き換える(bootstrapTable("updateCell", {...})相当)。
  //対象列がcheckbox列の場合はセルの値ではなく選択状態(チェック有無)を更新する
  updateCell({ index, field, value }) {
    const row = this.getFilteredData()[index];
    if (!row) return;
    const col = this.columns.find((c) => c.field === field);
    if (col && col.checkbox) {
      this.setRowSelected(row, !!value);
    } else {
      row[field] = value;
    }
    this.render();
  }

  //全行の選択を解除する(bootstrapTable("uncheckAll")相当)。onRowSelectは呼ばれない
  uncheckAll() {
    this.selectedRows.clear();
    this.render();
  }

  //指定列を表示/非表示にする(bootstrapTable("showColumn"/"hideColumn", field)相当)
  showColumn(field) { this.setColumnVisible(field, true); }
  hideColumn(field) { this.setColumnVisible(field, false); }
  setColumnVisible(field, visible) {
    const col = this.columns.find((c) => c.field === field);
    if (!col) return;
    col.visible = visible;
    this.renderHeader();
    this.render();
  }

  //テーブルをスクロールする(bootstrapTable("scrollTo", ...)相当)。
  //options.heightでラップされている場合のみ有効
  //指定行がwrapperの可視領域(sticky表示のヘッダーの下)に完全に収まるよう、最小限だけスクロールする。
  scrollTo(rowIndex) {
    if (!this.wrapper) return;

    const tr = this.tbody.children[rowIndex];
    if (!tr) return;
    const wrapperRect = this.wrapper.getBoundingClientRect();
    const trRect = tr.getBoundingClientRect();
    const theadHeight = this.thead.getBoundingClientRect().height; //ヘッダーはsticky top:0で常に可視領域上端を占有する
    const visibleTop = wrapperRect.top + this.wrapper.clientTop + theadHeight;
    const visibleBottom = wrapperRect.top + this.wrapper.clientTop + this.wrapper.clientHeight;
    if (trRect.top < visibleTop) {
      this.wrapper.scrollTop -= (visibleTop - trRect.top); //上にはみ出し → 行の上端を可視領域上端に合わせる
    } else if (trRect.bottom > visibleBottom) {
      this.wrapper.scrollTop += (trRect.bottom - visibleBottom); //下にはみ出し → 行の下端を可視領域下端に合わせる
    }
  }
}

/*
===============================================================================
TableOperator 外部仕様
===============================================================================

■ 概要
素の<table>要素に対して、以下の機能を提供する汎用コンポーネント。
jQuery/bootstrap-tableに依存せず、単体のJSファイルとしてどのページにも組み込める。
  ・列定義に基づくヘッダー/データ行の描画(列単位の表示/非表示に対応)
  ・列見出しクリックによるソート(昇順/降順トグル)
  ・チェックボックスによる複数行選択(行クリックでの選択、単一選択モードにも対応)
  ・ページネーション(1ページあたりの表示件数指定)
  ・行フィルタ(特定フィールドの値で表示行を絞り込み)
  ・セル単位の部分更新、固定高さでのスクロール制御
  ・列内のボタン等へのイベント委譲(bootstrap-tableのevents相当)

呼び出し側はテーブルの入れ物となる<table>要素を1つ用意するだけでよい。
id/class は本コンポーネントの動作・見た目には影響しない
(TableOperator自身が"table-operator"等のクラスを付与してスタイリングする)。

■ 依存ファイル
  ・/css/TableOperator.css
      本コンポーネントが付与するクラス(下記「スタイル用クラス」参照)の
      見た目(罫線・ヘッダー色・ホバー色・ページネーションUI・スクロール時の
      ヘッダーsticky表示・sortable列のカーソル)を定義している。
      TableOperator_class.jsとセットで読み込むこと。

■ 使い方(基本形)
  <table id="mytable"></table>

  <script src="js/TableOperator_class.js"></script>
  <script>
    const columns = [
      { title: "Name", field: "name", sortable: true },
      { title: "Size", field: "size", align: "right", sortable: true,
        formatter: (value, row, index, field) => value + " byte" },
      { title: "", field: "check", checkbox: true }, //選択用チェックボックス列
    ];

    const table = document.getElementById("mytable");
    const tableOperator = new TableOperator(table, columns, {
      clickToSelect: true,
      pageSize: 10,
    });

    tableOperator.load([
      { name: "a.txt", size: 100 },
      { name: "b.txt", size: 200 },
    ]);

    // 何らかの操作(ボタン等)で選択行を取得する
    const selectedRows = tableOperator.getSelections();
  </script>

■ コンストラクタ
  new TableOperator(tableElement, columns, options)

  ・tableElement : HTMLTableElement
      描画先の<table>要素。生成時に内部のHTML(既存のthead/tbody等)は
      破棄され、TableOperatorが自身でthead/tbody/tfootを構築する。

  ・columns : Array<ColumnDef>
      列の定義配列。表示順に指定する。ColumnDefの各プロパティは以下の通り。

        title      : string   見出しに表示するHTML文字列(省略時は空)
        field      : string   行データオブジェクトから値を取り出すキー名
                               (checkbox列や、formatterで独自に値を組み立てる
                                列では省略可。ただしupdateCell()でchecbox列を
                                指定する場合はfieldの指定が必要)
        align      : string   セル(td)の文字揃え。CSSの text-align に渡す値
                               (例: "left" / "right" / "center")
        halign     : string   見出し(th)の文字揃え。省略時はalignを流用
        width      : number   見出し(th)の幅
        widthUnit  : string   widthの単位。省略時は"px"(例: "vw"等も指定可)
        sortable   : boolean  trueの場合、見出しクリックでその列によるソートが
                               有効になる(同じ列を再クリックすると昇順/降順が
                               トグルする)
        visible    : boolean  falseを指定すると、その列を描画しない(初期非表示)。
                               showColumn()/hideColumn()で後から切り替え可能。
                               省略時はtrue扱い
        checkbox   : boolean  trueの場合、行選択用チェックボックスを表示する列
                               になる(formatter等は無視される)
        events     : object   列内の要素へのクリック等のイベント委譲。
                               { "イベント種別 CSSセレクタ": handler } の形式
                               (例: { "click .edit": (e, value, row, index) => {} })
                               セレクタは行(tr)内の要素に対してe.target.closest()で
                               判定される
        formatter  : function | string
                               セル内容を加工したいときに指定する。
                               関数の場合: (value, row, index, field) => string
                                 value : row[field]の値(fieldを指定した場合)
                                 row   : 行データオブジェクト全体
                                 index : 現在ページ内での行インデックス(0始まり)
                                 field : 指定したfield文字列
                               戻り値はセル(td)のinnerHTMLとして描画される。
                               文字列の場合: そのままinnerHTMLとして描画される
                               (全行共通の固定HTML、例えばボタンなどに使う)

  ・options : object (省略可)
      clickToSelect : boolean
          trueの場合、チェックボックス列以外の場所を行クリックしたときにも
          その行のチェックボックスをトグルする(bootstrap-tableのclickToSelect
          相当)。省略時はfalse(チェックボックスを直接クリックしたときのみ
          選択される)。

      singleSelect : boolean
          trueの場合、常に1行のみ選択可能になる(ある行を選択すると、それまで
          選択されていた行は自動的に解除される)。clickToSelectと併用した場合、
          行クリックは常にその行を選択状態にする(クリックしても選択解除には
          ならない)。省略時はfalse(複数行選択可能)。

      onRowSelect : function
          ユーザー操作(行クリックまたはチェックボックスの直接操作)によって
          行が選択されたときに呼ばれる。 (row, index) => {}
            row   : 選択された行データオブジェクト
            index : フィルタ適用後データ上でのその行のインデックス(0始まり)
          updateCell()/uncheckAll()等、プログラムからの選択状態変更では
          呼ばれない。

      pageSize : number
          1ページあたりの表示行数。正の数値を指定するとページネーションが
          有効になり、tfootにページ送りUI(«・‹・現在ページ/全ページ数・›・»)
          が描画される。全データが1ページに収まる場合はページ送りUI自体を
          表示しない。省略、または0以下の場合はページネーション無効
          (全件を1ページに表示)。

      height : number | string
          指定するとtable全体を固定高さのスクロール領域(overflow-y:auto)で
          包み、見出し行(thead)をposition:stickyで追従させる。数値または
          数字のみの文字列("200"等)を指定した場合は単位pxとして扱う。
          単位を明示したい場合は"200px"のように文字列で指定する。
          省略時はスクロールなし(通常のtable)。scrollTo()はこのオプションを
          指定した場合のみ動作する。

■ 公開メソッド
  load(data)
      表示するデータを設定し、再描画する。
        data : Array<object>  行データの配列。各要素がcolumnsのfieldで
                               参照されるプロパティを持つオブジェクト。
      呼び出すたびに、選択状態(チェックボックス)とページ位置は
      リセットされる(1ページ目・全選択解除)。filterBy()で設定した絞り込み
      条件は、load()し直しても保持される(明示的にfilterBy()で変更/解除する
      まで有効)。

  filterBy(filterObj)
      表示する行を、指定したフィールドの値で絞り込む。
        filterObj : object | null
          { フィールド名: [許可する値, ...] } の形式。複数フィールドを
          指定した場合はAND条件。null、または空オブジェクトを渡すと
          絞り込みを解除する。
      以降、getCurrentPageData()やupdateCell()/scrollTo()のindexは、
      この絞り込み後のデータ配列上の位置を指す。

  getSelections()
      チェックボックスで選択されている行データを配列で返す。
      ページ・フィルタを移動していても、それまでに選択した行はすべて
      含まれる(loadし直すまで選択状態は保持される)。
      戻り値の各要素は、load()に渡した行データオブジェクトそのものの参照。

  updateCell({index, field, value})
      フィルタ適用後データのindex番目の行について、指定fieldの値だけを
      書き換えて再描画する(行全体をloadし直さずに済む)。
        index : フィルタ適用後データ上でのインデックス(0始まり)
        field : 書き換える列のfield名
        value : 新しい値
      対象列がcheckbox:trueの列の場合、value(真偽値)はセルの値ではなく
      その行の選択状態(チェック有無)として扱われる。この呼び出し自体では
      onRowSelectは呼ばれない。

  uncheckAll()
      全行の選択状態を解除する。onRowSelectは呼ばれない。

  showColumn(field) / hideColumn(field)
      指定したfieldを持つ列を表示/非表示に切り替える。

  goToPage(page)
      指定したページ番号(1始まり)を表示する。範囲外の値を指定した場合は
      1ページ目または最終ページに丸められる。通常はページ送りUIのボタンから
      内部的に呼ばれるが、外部から任意のページへ移動する用途でも使用できる。

  scrollTo(rowIndex)
      options.heightでスクロール領域が作られている場合のみ動作する。
        rowIndex : フィルタ適用後データ上のindex番目の行が見える位置までスクロール

  sortBy(field)
      指定したfieldの値でデータをソートし、1ページ目を表示し直す。
      同じfieldを続けて指定すると昇順/降順がトグルする。
      通常はsortable:trueな列見出しのクリックで内部的に呼ばれるが、
      外部から明示的にソートを実行したい場合にも使用できる。

■ スタイル用クラス(TableOperator.cssが前提とするクラス名)
  呼び出し側でCSSを用意する必要はないが、見た目を独自にカスタマイズしたい
  場合は以下のクラスに対してスタイルを上書きする。

    table-operator                 本体の<table>要素に付与される
    table-operator-thead           <thead>要素に付与される(見出し行)
    table-operator-checkbox        選択用チェックボックスの<input>に付与される
    table-operator-pagination      ページネーションUIを内包する<td>に付与される
    table-operator-pagination-info "現在ページ / 全ページ数" のテキストを
                                    表示する<span>に付与される
    table-operator-scroll          options.height指定時に生成されるスクロール
                                    用ラッパー<div>に付与される(overflow-yや
                                    ヘッダーのsticky表示はこのクラス経由でCSSが
                                    担う。インスタンス毎に異なる高さのみJSが
                                    インラインstyleで設定する)
    table-operator-sortable        sortable:true な列の見出し(th)に付与される
                                    (cursor:pointerの表示に使う)

■ 制約・注意事項
  ・行データの一意性はオブジェクト参照で判定している。load()で毎回新しい
    配列/オブジェクトを渡す分には問題ないが、同一のデータをselectedRowsに
    残したまま参照だけ差し替える(オブジェクトの中身を書き換えて再度load
    しない、等)ような使い方は想定していない。
  ・ソートは文字列/数値の大小比較(< , >)で行うため、日付や特殊な形式の
    文字列を正しい順序でソートしたい場合は、あらかじめ比較可能な値
    (数値のtimestamp等)をfieldに持たせておくこと。
  ・pageSizeとfilterByを併用する場合、totalPages()等は絞り込み後のデータ
    件数を基準に計算される。
===============================================================================
*/
