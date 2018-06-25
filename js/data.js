'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var HOURS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var NUMBERS_FOR_AVATARS = [1, 2, 3, 4, 5, 6, 7, 8];
  var SIMILAR_ADS_QUANTITY = 8;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 5;
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 130;
  var MAX_Y = 630;

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

  var makeFeaturesList = function (array) {
    var adFeatures = [];
    var featuresListLength = getRandomNumber(1, array.length);
    var shuffledFeatures = shuffleArray(FEATURES);
    for (var i = 0; i < featuresListLength; i++) {
      adFeatures[i] = ' ' + shuffledFeatures[i];
    }
    return adFeatures;
  };

  var makeAdsList = function () {
    var similarAds = [];
    var shuffledNumbers = shuffleArray(NUMBERS_FOR_AVATARS);
    var shuffledTitles = shuffleArray(TITLES);
    var adTitle;
    for (var i = 0; i < SIMILAR_ADS_QUANTITY; i++) {
      adTitle = shuffledTitles[i];
      var smallPinPointX = getRandomNumber(MIN_X, MAX_X);
      var smallPinPointY = getRandomNumber(MIN_Y, MAX_Y);
      similarAds[i] = {
        author: {
          avatar: 'img/avatars/user0' + shuffledNumbers[i] + '.png'
        },

        offer: {
          title: adTitle,
          address: smallPinPointX + ', ' + smallPinPointY,
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
          x: smallPinPointX,
          y: smallPinPointY
        }
      };
    }
    return similarAds;
  };

  window.adsList = makeAdsList();
})();
