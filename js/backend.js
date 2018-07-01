'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var MESSAGE_LOAD = 'Похожие объявления не загрузились. ';
  var MESSAGE_UPLOAD = 'Ваше объявление не отправлено. ';
  var MESSAGE_UNSUCCESS = 'Статус ответа: ';
  var MESSAGE_ERROR = 'Произошла ошибка соединения';
  var MESSAGE_TIMEOUT = 'Запрос не успел выполниться за ';
  var TIME = 'мс';

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(MESSAGE_LOAD + MESSAGE_UNSUCCESS + xhr.status + ' ' + xhr.statusText);
          console.log(xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError(MESSAGE_LOAD + MESSAGE_ERROR);
      });
      xhr.addEventListener('timeout', function () {
        onError(MESSAGE_LOAD + MESSAGE_TIMEOUT + xhr.timeout + TIME);
      });

      xhr.timeout = 10000;

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(MESSAGE_UPLOAD + MESSAGE_UNSUCCESS + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError(MESSAGE_UPLOAD + MESSAGE_ERROR);
      });
      xhr.addEventListener('timeout', function () {
        onError(MESSAGE_UPLOAD + MESSAGE_TIMEOUT + xhr.timeout + TIME);
      });

      xhr.timeout = 10000;

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
