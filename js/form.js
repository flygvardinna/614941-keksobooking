'use strict';

(function () {
  var MAIN_MAP_PIN_HALF_WIDTH = Math.floor(65 / 2);
  var MAIN_MAP_PIN_DISABLED_MIDDLE = Math.floor(65 / 2);
  var MAIN_MAP_PIN_HEIGHT = 65 + 22;
  var START_MAIN_PIN_LEFT = 570;
  var START_MAIN_PIN_TOP = 375;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var ESC_KEYCODE = 27; // повторяется на странице map

  var optionsList;
  var pointX = START_MAIN_PIN_LEFT + MAIN_MAP_PIN_DISABLED_MIDDLE;
  var pointY = START_MAIN_PIN_TOP + MAIN_MAP_PIN_DISABLED_MIDDLE;
  var mainMapPin = window.blocks.map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var formReset = form.querySelector('.ad-form__reset');
  var formSubmit = form.querySelector('.ad-form__submit');
  var formSuccess = document.querySelector('.success');
  var fieldsets = form.querySelectorAll('fieldset');
  var title = form.querySelector('#title');
  var address = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var timeCheckin = form.querySelector('#timein');
  var timeCheckout = form.querySelector('#timeout');
  var roomsNumber = form.querySelector('#room_number');
  var guestsNumber = form.querySelector('#capacity');
  var description = form.querySelector('#description');
  var features = form.querySelector('.features');

  var disableFieldsets = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', 'disabled');
    }
  };

  var setAddress = function () {
    address.value = pointX + ', ' + pointY;
    return address.value;
  };

  var makePageActive = function () {
    window.blocks.map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
  };

  var onTypeChange = function (evt) {
    var target = evt.target;
    var selectedType = target.value;
    var setPrice = function () {
      switch (selectedType) {
        case 'bungalo':
          return '0';
        case 'house':
          return '5000';
        case 'palace':
          return '10000';
        default:
          return '1000';
      }
    };
    var setMinPrice = function () {
      var minPrice = setPrice();
      price.min = minPrice;
      price.placeholder = minPrice;
    };
    setMinPrice();
  };

  var onTimeCheckinChange = function (evt) {
    timeCheckout.value = evt.target.value;
  };

  var onTimeCheckoutChange = function (evt) {
    timeCheckin.value = evt.target.value;
  };

  var bringAllOptionsBack = function () {
    for (var i = 0; i < optionsList.length; i++) {
      optionsList[i].classList.remove('hidden');
    }
  };

  var checkRoomsAndGuests = function () {
    var selectedRoomsNumber = roomsNumber.value;
    var selectedGuestsNumber = guestsNumber.value;
    var isGuestsNumberCorrect;
    var availableGuestsNumber;
    switch (selectedRoomsNumber) {
      case '1':
        switch (selectedGuestsNumber) {
          case '1':
            isGuestsNumberCorrect = true;
            break;
          default:
            isGuestsNumberCorrect = false;
        }
        availableGuestsNumber = 'для 1 гостя';
        break;
      case '2':
        switch (selectedGuestsNumber) {
          case '1':
          case '2':
            isGuestsNumberCorrect = true;
            break;
          default:
            isGuestsNumberCorrect = false;
        }
        availableGuestsNumber = 'для 1 или 2 гостей';
        break;
      case '3':
        switch (selectedGuestsNumber) {
          case '1':
          case '2':
          case '3':
            isGuestsNumberCorrect = true;
            break;
          default:
            isGuestsNumberCorrect = false;
        }
        availableGuestsNumber = 'для 1, 2 или 3 гостей';
        break;
      case '100':
        switch (selectedGuestsNumber) {
          case '0':
            isGuestsNumberCorrect = true;
            break;
          default:
            isGuestsNumberCorrect = false;
        }
        availableGuestsNumber = 'не для гостей';
    }
    showErrorMessage(isGuestsNumberCorrect, availableGuestsNumber);
    return isGuestsNumberCorrect;
  };

  var onRoomsNumberChange = function (evt) {
    var target = evt.target;
    var selectedRoomsNumber = target.value;
    var setGuestsNumber = function () {
      if (selectedRoomsNumber === '2') {
        bringAllOptionsBack();
        optionsList[0].classList.add('hidden');
        optionsList[3].classList.add('hidden');
      } else if (selectedRoomsNumber === '3') {
        bringAllOptionsBack();
        optionsList[3].classList.add('hidden');
      } else if (selectedRoomsNumber === '100') {
        bringAllOptionsBack();
        optionsList[0].classList.add('hidden');
        optionsList[1].classList.add('hidden');
        optionsList[2].classList.add('hidden');
      } else {
        bringAllOptionsBack();
        optionsList[0].classList.add('hidden');
        optionsList[1].classList.add('hidden');
        optionsList[3].classList.add('hidden');
      }
    };
    optionsList = guestsNumber.options;
    setGuestsNumber();
    checkRoomsAndGuests();
  };

  var showErrorMessage = function (isGuestsNumberCorrect, availableGuestsNumber) {
    if (!isGuestsNumberCorrect) {
      guestsNumber.setCustomValidity('Выбранное количество комнат подходит только ' + availableGuestsNumber);
    } else {
      guestsNumber.setCustomValidity('');
    }
  };

  var onGuestsNumberChange = function () {
    checkRoomsAndGuests();
  };

  var disablePage = function () {
    window.blocks.map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    var popup = window.blocks.map.querySelector('.popup');
    if (popup) {
      window.blocks.map.removeChild(popup);
    }
    Array.from(window.blocks.pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)')).forEach(function (pin) {
      pin.remove();
    });
    mainMapPin.style.left = START_MAIN_PIN_LEFT + 'px';
    mainMapPin.style.top = START_MAIN_PIN_TOP + 'px';
    title.value = '';
    address.value = startAddress;
    type.value = 'flat';
    price.value = '';
    price.placeholder = '1000';
    timeCheckin.value = '12:00';
    timeCheckout.value = '12:00';
    roomsNumber.value = '1';
    guestsNumber.value = '1';
    description.value = '';
    Array.from(features.querySelectorAll('.feature__checkbox')).forEach(function (feature) {
      feature.checked = false;
    });
    disableFieldsets();
  };

  window.form = {
    onLoad: function () {
      var closeSuccess = function () {
        formSuccess.classList.add('hidden');
        document.removeEventListener('keydown', onSuccessEscPress);
        document.removeEventListener('click', onSuccessClick);
      };
      var onSuccessEscPress = function (eventObj) {
        if (eventObj.keyCode === ESC_KEYCODE) {
          closeSuccess();
        }
      };
      var onSuccessClick = function () {
        closeSuccess();
      };
      disablePage();
      formSuccess.classList.remove('hidden');
      document.addEventListener('keydown', onSuccessEscPress);
      document.addEventListener('click', onSuccessClick);
    },
    onError: function (errorMessage) {
      var closeError = function () {
        document.body.removeChild(node);
      };
      var onErrorFiveSecTimeout = function () {
        closeError();
      };
      var onErrorEscPress = function (eventObj) {
        if (eventObj.keyCode === ESC_KEYCODE) {
          closeError();
        }
      };
      var node = document.createElement('div');
      node.classList.add('error-popup');
      node.innerHTML = '<button type="button" class="error-popup__close"></button><p>';
      var text = node.querySelector('p');
      text.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
      setTimeout(onErrorFiveSecTimeout, 5000);
      var errorClose = document.querySelector('.error-popup__close');
      errorClose.addEventListener('click', function () {
        closeError();
      });
      document.addEventListener('keydown', onErrorEscPress);
    }
  };

  var onFormSubmit = function (evt) {
    window.backend.upload(new FormData(form), window.form.onLoad, window.form.onError);
    evt.preventDefault();
  };

  var onFormResetClick = function () {
    disablePage();
  };

  var onMainMapPinMousedown = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      var minMainPinTop = MIN_Y - MAIN_MAP_PIN_HEIGHT;
      var maxMainPinTop = MAX_Y - MAIN_MAP_PIN_HEIGHT;

      var shift = {
        x: startPoints.x - moveEvt.clientX,
        y: startPoints.y - moveEvt.clientY
      };

      startPoints = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinLeft = mainMapPin.offsetLeft - shift.x;
      var mainPinTop = mainMapPin.offsetTop - shift.y;

      if (mainPinTop < minMainPinTop) {
        mainPinTop = minMainPinTop;
      } else if (mainPinTop > maxMainPinTop) {
        mainPinTop = maxMainPinTop;
      }

      mainMapPin.style.left = mainPinLeft + 'px';
      mainMapPin.style.top = mainPinTop + 'px';

      pointX = mainPinLeft + MAIN_MAP_PIN_HALF_WIDTH;
      pointY = mainPinTop + MAIN_MAP_PIN_HEIGHT;
      setAddress();
    };

    var onMouseUp = function () {
      makePageActive();
      setAddress();
      window.backend.load(window.map.onLoad, window.map.onError);

      window.blocks.pinsContainer.removeEventListener('mousemove', onMouseMove);
      window.blocks.pinsContainer.removeEventListener('mouseup', onMouseUp);
    };

    window.blocks.pinsContainer.addEventListener('mousemove', onMouseMove);
    window.blocks.pinsContainer.addEventListener('mouseup', onMouseUp);
  };

  mainMapPin.addEventListener('mousedown', onMainMapPinMousedown);
  type.addEventListener('change', onTypeChange);
  timeCheckin.addEventListener('change', onTimeCheckinChange);
  timeCheckout.addEventListener('change', onTimeCheckoutChange);
  roomsNumber.addEventListener('change', onRoomsNumberChange);
  guestsNumber.addEventListener('change', onGuestsNumberChange);
  form.addEventListener('submit', onFormSubmit);
  formReset.addEventListener('click', onFormResetClick);

  disableFieldsets();
  var startAddress = setAddress();
})();
