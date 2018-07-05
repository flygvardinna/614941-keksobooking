'use strict';

(function () {
  var adTemplate = window.blocks.template.content.querySelector('.map__card');
  var ClassToFeature = {
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
    var adType = ad.offer.type;
    var featuresList = adCard.querySelector('.popup__features');
    var photosContainer = adCard.querySelector('.popup__photos');
    var photoTemplate = photosContainer.querySelector('.popup__photo');
    var popupTitle = adCard.querySelector('.popup__title');
    var popupAddress = adCard.querySelector('.popup__text--address');
    var popupPrice = adCard.querySelector('.popup__text--price');
    var popupType = adCard.querySelector('.popup__type');
    var popupRoomsAndGuests = adCard.querySelector('.popup__text--capacity');
    var popupTime = adCard.querySelector('.popup__text--time');
    var popupDescription = adCard.querySelector('.popup__description');
    var popupAvatar = adCard.querySelector('.popup__avatar');

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
      if (ad.offer.features.length === 0) {
        adCard.removeChild(featuresList);
      } else {
        ad.offer.features.forEach(function (feature) {
          features += '<li class="popup__feature ' + ClassToFeature[feature] + '"></li>';
        });
      }
      return features;
    };

    if (ad.offer.title === '') {
      adCard.removeChild(popupTitle);
    } else {
      popupTitle.textContent = ad.offer.title;
    }
    if (ad.offer.address === '') {
      adCard.removeChild(popupAddress);
    } else {
      popupAddress.textContent = ad.offer.address;
    }
    if (!ad.offer.price) {
      adCard.removeChild(popupPrice);
    } else {
      popupPrice.textContent = ad.offer.price + '₽/ночь';
    }
    if (adType === '') {
      adCard.removeChild(popupType);
    } else {
      popupType.textContent = insertCorrectType(adType);
    }
    if (isNaN(ad.offer.rooms) || isNaN(ad.offer.guests)) {
      adCard.removeChild(popupRoomsAndGuests);
    } else {
      popupRoomsAndGuests.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    }
    if (!ad.offer.checkin || !ad.offer.checkout) {
      adCard.removeChild(popupTime);
    } else {
      popupTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    }
    featuresList.innerHTML = setFeatures();
    if (ad.offer.description === '') {
      adCard.removeChild(popupDescription);
    } else {
      popupDescription.textContent = ad.offer.description;
    }
    if (ad.author.avatar === '') {
      adCard.removeChild(popupAvatar);
    } else {
      popupAvatar.src = ad.author.avatar;
    }
    if (ad.offer.photos.length === 0) {
      adCard.removeChild(photosContainer);
    } else {
      photoTemplate.src = ad.offer.photos[0];
      photosContainer.appendChild(renderPhotos(ad.offer.photos));
    }
    return adCard;
  };
})();
