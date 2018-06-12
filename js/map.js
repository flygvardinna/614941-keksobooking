'use strict';

var TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPES = ["palace", "flat", "house", "bungalo"];
var HOURS = ["12:00", "13:00", "14:00"];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
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

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinsElement = map.querySelector('.map__pins');
var nextAfterAdsElement = map.querySelector('map__filters-container');
var pinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');
var adTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

var getRandomNumber = function (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

var getAdType = function (title) {  //функция всегда возвращает flat (то есть первое, что указано в return)
  //независимо от того, что в title
  if (title === "Большая уютная квартира" || "Маленькая неуютная квартира") {
    return "flat";
  } else if (title === "Огромный прекрасный дворец" || "Маленький ужасный дворец") {
    return "palace";
  } else if (title === "Красивый гостевой домик" || "Некрасивый негостеприимный домик") {
    return "house";
  }
    return "bungalo";
};

var insertCorrectType = function (type) {
  if (type === "flat") {
    return "Квартира";
  } else if (type === "palace") {
    return "Дворец";
  } else if (type === "house") {
    return "Дом";
  }
    return "Бунгало";
  };

var makeFeaturesList = function (array) {
  var adFeatures = [];
  var featuresListLength = getRandomNumber(1, array.length);
  var shuffledFeatures = shuffleArray(FEATURES);
  for (var i = 0; i < featuresListLength; i++) {
    adFeatures[i] = " " + shuffledFeatures[i];
  }
  return adFeatures;
};

var makeAdsList = function () {
  var similarAds = [];
  var shuffledNumbers = shuffleArray(NUMBERS_FOR_AVATARS);
  var shuffledTitles = shuffleArray(TITLES);
  var adTitle;
  var pointX;
  var pointY;
  for (var i = 0; i < SIMILAR_ADS_QUANTITY; i++) {
    adTitle = shuffledTitles[i];
    pointX = getRandomNumber(MIN_X, MAX_X);
    pointY = getRandomNumber(MIN_Y, MAX_Y);
    similarAds[i] = {
      author: {
        avatar: "img/avatars/user0" + shuffledNumbers[i] + ".png"
      },

      offer: {
        title: adTitle,
        address: pointX + ", " + pointY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getAdType(adTitle), //всегда возвращает flat (то есть первое, что указано в return)
        // независимо от того, что в title
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomElement(HOURS),
        checkout: getRandomElement(HOURS),
        features: makeFeaturesList(FEATURES),
        description: "",
        photos: shuffleArray(PHOTOS) //во всех объявлениях получается один и тот же порядок фото
      },

      location: {
        x: pointX,
        y: pointY
      }
    };
  }
  return similarAds;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var mapPinTopLeftX = pin.location.x - MAP_PIN_HALF_WIDTH;
  var mapPinTopLeftY = pin.location.y - MAP_PIN_HEIGHT;

  pinElement.style = "left: " + mapPinTopLeftX + "px; top: " + mapPinTopLeftY + "px;";
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
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + "₽/ночь";
  //в разметке тут 5200&#x20bd;<span>/ночь</span></p> - надо ли делать innerHTML и копировать спец символ и спан?
  //в CSS есть .popup__price span {font-size: 16px;} но в html нет класса .popup__price только .popup__text--price
  adElement.querySelector('.popup__type').textContent = insertCorrectType(adType);
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + " комнаты для " + ad.offer.guests + " гостей";
  //нужна ли тут проверка, чтобы менялись окончания? 1 комнаТА или 5 комнаТ для 1 гостЯ или для 2 гостЕЙ
  adElement.querySelector('.popup__text--time').textContent = "Заезд после " + ad.offer.checkin + ", выезд до " + ad.offer.checkout;
  adElement.querySelector('.popup__features').textContent = ad.offer.features;
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;
  photoTemplate.src = ad.offer.photos[0];
  //нужна ли тут проверка, чтобы следуюший шаг выполнялся только в том случае, если длина массива больше 1?
  //Или это будет лишняя проверка по критериям?
  adElement.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
  return adElement;
};

var renderPinsList = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderPin(pins[i]));
  }
  pinsElement.appendChild(fragment);
};

var renderFirstAd = function (ads) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderAd(ads[0]));
  map.insertBefore(fragment, nextAfterAdsElement);
};

var adsList = makeAdsList();
renderPinsList(adsList);
renderFirstAd(adsList);
console.log(adsList);
