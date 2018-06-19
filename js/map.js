'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NUMBERS_FOR_AVATARS = [1, 2, 3, 4, 5, 6, 7, 8];
var SIMILAR_ADS_QUANTITY = 8;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 5;
var MAP_PIN_HALF_WIDTH = 50 / 2;
var MAP_PIN_HEIGHT = 70;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var pointX;
var pointY;
var optionsList;
var map = document.querySelector('.map');
var pinsElement = map.querySelector('.map__pins');
var mapPinMuffin = map.querySelector('.map__pin--main');
var nextAfterAdsElement = map.querySelector('.map__filters-container');
var form = document.querySelector('.ad-form');
var formReset = form.querySelector('.ad-form__reset');
var formSubmit = form.querySelector('.ad-form__submit');
var fieldsets = form.querySelectorAll('fieldset');
var typeOfAccomodation = form.querySelector('#type');
var pricePerNight = form.querySelector('#price');
var timeCheckin = form.querySelector('#timein');
var timeCheckout = form.querySelector('#timeout');
var roomsNumber = form.querySelector('#room_number');
var guestsNumber = form.querySelector('#capacity');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var adTemplate = template.content.querySelector('.map__card');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

var getAdType = function (title) {
  switch (title) {
    case 'Большая уютная квартира':
    case 'Маленькая неуютная квартира':
      return 'flat';
    case 'Огромный прекрасный дворец':
    case 'Маленький ужасный дворец':
      return 'palace';
    case 'Красивый гостевой домик':
    case 'Некрасивый негостеприимный домик':
      return 'house';
    default:
      return 'bungalo';
  }
};

var insertCorrectType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'palace':
      return 'Дворец';
    case 'house':
      return 'Дом';
    default:
      return 'Бунгало';
  }
};

var makeFeaturesList = function (array) {
  var adFeatures = [];
  var featuresListLength = getRandomNumber(1, array.length);
  var shuffledFeatures = shuffleArray(FEATURES);
  for (var i = 0; i < featuresListLength; i++) {
    adFeatures[i] = ' ' + shuffledFeatures[i];
  }
  return adFeatures;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var mapPinTopLeftX = pin.location.x - MAP_PIN_HALF_WIDTH;
  var mapPinTopLeftY = pin.location.y - MAP_PIN_HEIGHT;

  pinElement.style = 'left: ' + mapPinTopLeftX + 'px; top: ' + mapPinTopLeftY + 'px;';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

var renderAd = function (ad) {
  var adElement = adTemplate.cloneNode(true);
  var photoTemplate = adElement.querySelector('.popup__photo');
  var adType = ad.offer.type;

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 1; i < photos.length; i++) {
      var photoElement = photoTemplate.cloneNode(true);
      photoElement.src = photos[i];
      fragment.appendChild(photoElement);
    }
    return fragment;
  };

  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = insertCorrectType(adType);
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelector('.popup__features').textContent = ad.offer.features;
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;
  photoTemplate.src = ad.offer.photos[0];
  adElement.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
  return adElement;
};

var disableFieldsets = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', 'disabled');
  }
};

var makeAdsList = function () {
  var similarAds = [];
  var shuffledNumbers = shuffleArray(NUMBERS_FOR_AVATARS);
  var shuffledTitles = shuffleArray(TITLES);
  var adTitle;
  for (var i = 0; i < SIMILAR_ADS_QUANTITY; i++) {
    adTitle = shuffledTitles[i];
    pointX = getRandomNumber(MIN_X, MAX_X);
    pointY = getRandomNumber(MIN_Y, MAX_Y);
    similarAds[i] = {
      author: {
        avatar: 'img/avatars/user0' + shuffledNumbers[i] + '.png'
      },

      offer: {
        title: adTitle,
        address: pointX + ', ' + pointY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getAdType(adTitle),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomElement(HOURS),
        checkout: getRandomElement(HOURS),
        features: makeFeaturesList(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS)
      },

      location: {
        x: pointX,
        y: pointY
      }
    };
  }
  return similarAds;
};

var renderPinsList = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderPin(pins[i]));
  }
  pinsElement.appendChild(fragment);
};

var makePageActive = function () {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }
};

var setAddress = function () {
  pointX = getRandomNumber(MIN_X, MAX_X); // позже надо заменить
  pointY = getRandomNumber(MIN_Y, MAX_Y); // позже надо заменить
  form.querySelector('input[name=address]').value = pointX + ', ' + pointY;
  // размер метки (квадрат) 62*62 + острый конец 10*22. То есть высота метки 84 а ширина или 62 или 65 (ширина button)
  // Также непонятно, откуда будут браться координаты острого конца метки после перетаскивания, где они будут записаны.
  // И где надо прописывать ограничения для X и Y
};

var onMapPinClick = function (evt) {
  var closePopup = function () {
    map.removeChild(popup);
    document.removeEventListener('keydown', onPopupEscPress);
  };
  var onPopupEscPress = function (eventObj) {
    if (eventObj.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };
  var target = evt.target;
  if (target.tagName !== 'BUTTON') {
    return;
  }
  var alt = target.querySelector('img').alt;
  for (var j = 0; j < adsList.length; j++) {
    if (adsList[j].offer.title === alt) {
      var currentAd = adsList[j];
      var fragment = document.createDocumentFragment();
      fragment.appendChild(renderAd(currentAd));
      map.insertBefore(fragment, nextAfterAdsElement);
      var popup = map.querySelector('.popup');
      var popupClose = map.querySelector('.popup__close');
      document.addEventListener('keydown', onPopupEscPress);
      popupClose.addEventListener('click', function () {
        closePopup();
      });
      popupClose.addEventListener('keydown', function (eventObject) {
        if (eventObject.keyCode === ENTER_KEYCODE) {
          closePopup();
        }
      });
    }
  }
};

var onTypeChange = function (evt) {
  var target = evt.target;
  var selectedType = target.value;
  var setType = function () {
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
    var minPrice = setType();
    pricePerNight.min = minPrice;
    pricePerNight.placeholder = minPrice;
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

var onRoomsNumberChange = function (evt) {
  // проблема в том, что если выбираешь, например, 100 комнат, а потом Не для гостей, то уже никак
  // без перезагрузки страницы или нажатия на Очистить нельзя выбрать другие варианты
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
};

var onGuestsNumberChange = function (evt) {
  var target = evt.target;
  var selectedGuestsNumber = target.value;
  var setRoomsNumber = function () {
    if (selectedGuestsNumber === '2') {
      bringAllOptionsBack();
      optionsList[0].classList.add('hidden');
      optionsList[3].classList.add('hidden');
    } else if (selectedGuestsNumber === '1') {
      bringAllOptionsBack();
      optionsList[3].classList.add('hidden');
    } else if (selectedGuestsNumber === '0') {
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
  optionsList = roomsNumber.options;
  setRoomsNumber();
};

var onFormSubmitClick = function () {
  var selectedRoomsNumber = roomsNumber.value;
  var selectedGuestsNumber = guestsNumber.value;
  var isGuestsNumberCorrect;
  switch (selectedRoomsNumber) {
    case '1':
      switch (selectedGuestsNumber) {
        case '1':
        isGuestsNumberCorrect = true;
        break;
        default:
        isGuestsNumberCorrect = false;
      }
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
    break;
    case '100':
      switch (selectedGuestsNumber) {
        case '0':
        isGuestsNumberCorrect = true;
        break;
        default:
        isGuestsNumberCorrect = false;
      }
  }
  if (!isGuestsNumberCorrect) {
    guestsNumber.setCustomValidity('Пожалуйста, выберите подходящее количество гостей из списка.');
  } else {
    guestsNumber.setCustomValidity('');
  }
};

disableFieldsets();
var adsList = makeAdsList();

mapPinMuffin.addEventListener('mouseup', function () {
  makePageActive();
  setAddress();
  renderPinsList(adsList);
});

pinsElement.addEventListener('click', onMapPinClick);
typeOfAccomodation.addEventListener('change', onTypeChange);
timeCheckin.addEventListener('change', onTimeCheckinChange);
timeCheckout.addEventListener('change', onTimeCheckoutChange);
roomsNumber.addEventListener('change', onRoomsNumberChange);
guestsNumber.addEventListener('change', onGuestsNumberChange);
formReset.addEventListener('click', function () {
  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
  pricePerNight.placeholder = '1000';
  var popup = map.querySelector('.popup');
  map.removeChild(popup);
});
formSubmit.addEventListener('click', onFormSubmitClick);
