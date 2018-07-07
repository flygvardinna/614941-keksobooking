'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var MESSAGE_LOAD = 'Похожие объявления не загрузились. ';
  var MESSAGE_UPLOAD = 'Ваше объявление не отправлено. ';
  var MESSAGE_UNSUCCESS = 'Статус ответа: ';
  var MESSAGE_ERROR = 'Произошла ошибка соединения';
  var MESSAGE_TIMEOUT = 'Запрос не успел выполниться за ';
  var TIME = 'мс';

  var checkIfSuccess = function (xhr, onLoad, onError, message) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(message + MESSAGE_UNSUCCESS + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(message + MESSAGE_ERROR);
    });
    xhr.addEventListener('timeout', function () {
      onError(message + MESSAGE_TIMEOUT + xhr.timeout + TIME);
    });
    xhr.timeout = 10000;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      checkIfSuccess (xhr, onLoad, onError, MESSAGE_LOAD);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      checkIfSuccess (xhr, onLoad, onError, MESSAGE_UPLOAD);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
