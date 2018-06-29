'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';

  window.backend = {
    load: function (onLoad, onError) {
      var message = 'Похожие объявления не загрузились. '
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(message + 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError(message + 'Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError(message + 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var message = 'Ваше объявление не отправлено. '
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(message + 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError(message + 'Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError(message + 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
