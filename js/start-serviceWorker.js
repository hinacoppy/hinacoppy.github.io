// start-serviceWorker.js
// serviceWorkerを起動する
// 参考：https://qiita.com/satamame/items/fb176c65132f5ddd668b
'use strict';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
  .getRegistration()
  .then((registration) => {
    const firstRegistration = (registration === undefined); //登録されたSWがなければ初回登録である
                                                            //初回登録時にはconfirm()を実行させない
    navigator.serviceWorker
    .register("./serviceWorker.js") //ServiceWorkerを登録する
    .then((registration) => {
      if (!firstRegistration) { //初回登録でなければ更新があるかどうかをチェックする
        registration.onupdatefound = () => { //updatefoundイベントが発生するのはSWの更新があるとき
          const installingWorker = registration.installing;
          if (installingWorker != null) { //新しいバージョンがあれば
            installingWorker.onstatechange = (e) => { //ステータスがinstalledになるのを待って
              if (e.target.state == "installed") { //OKを押させて更新させる
                const foundNewVersion = confirm("Found New Version App.  Click OK to Update.");
                if (foundNewVersion) {
                  location.reload(); //新バージョンを起動
                }
              }
            };
          }
        };
      }
    })
  });
}
