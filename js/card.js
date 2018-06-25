'use strict';

(function () {
  var adTemplate = window.blocks.template.content.querySelector('.map__card');

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

    adCard.querySelector('.popup__title').textContent = ad.offer.title;
    adCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    adCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    adCard.querySelector('.popup__type').textContent = insertCorrectType(adType);
    adCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    adCard.querySelector('.popup__features').textContent = ad.offer.features;
    adCard.querySelector('.popup__description').textContent = ad.offer.description;
    adCard.querySelector('.popup__avatar').src = ad.author.avatar;
    photoTemplate.src = ad.offer.photos[0];
    adCard.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
    return adCard;
  };
})();
