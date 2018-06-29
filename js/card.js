'use strict';

(function () {
  var adTemplate = window.blocks.template.content.querySelector('.map__card');
  var classToFeature = {
    'wifi': 'popup__feature--wifi',
    'dishwasher': 'popup__feature--dishwasher',
    'parking': 'popup__feature--parking',
    'washer': 'popup__feature--washer',
    'elevator': 'popup__feature--elevator',
    'conditioner': 'popup__feature--conditioner'
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

  window.renderAd = function (ad) {
    var adCard = adTemplate.cloneNode(true);
    var featuresList = adCard.querySelector('.popup__features');
    var photoTemplate = adCard.querySelector('.popup__photo');
    var adType = ad.offer.type;

    var renderPhotos = function (photos) {
      var fragment = document.createDocumentFragment();
      for (var i = 1; i < photos.length; i++) {
        var photo = photoTemplate.cloneNode(true);
        photo.src = photos[i];
        fragment.appendChild(photo);
      }
      return fragment;
    };

    var setFeatures = function () {
      var features = '';
      for (var k = 0; k < ad.offer.features.length; k++) {
        features += '<li class="popup__feature ' + classToFeature[ad.offer.features[k]] + '"></li>';
      }
      return features;
    };

    adCard.querySelector('.popup__title').textContent = ad.offer.title;
    adCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    adCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    adCard.querySelector('.popup__type').textContent = insertCorrectType(adType);
    adCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    featuresList.innerHTML = setFeatures();
    adCard.querySelector('.popup__description').textContent = ad.offer.description;
    adCard.querySelector('.popup__avatar').src = ad.author.avatar;
    photoTemplate.src = ad.offer.photos[0];
    adCard.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
    return adCard;
  };
})();
