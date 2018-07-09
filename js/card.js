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

  window.card = {
    adCard: adTemplate.cloneNode(true),
    renderAd: function (ad) {
      var adType = ad.offer.type;
      var featuresList = window.card.adCard.querySelector('.popup__features');
      var photosContainer = window.card.adCard.querySelector('.popup__photos');
      var photoTemplate = window.card.adCard.querySelector('.popup__photo');
      var popupTitle = window.card.adCard.querySelector('.popup__title');
      var popupAddress = window.card.adCard.querySelector('.popup__text--address');
      var popupPrice = window.card.adCard.querySelector('.popup__text--price');
      var popupType = window.card.adCard.querySelector('.popup__type');
      var popupRoomsAndGuests = window.card.adCard.querySelector('.popup__text--capacity');
      var popupTime = window.card.adCard.querySelector('.popup__text--time');
      var popupDescription = window.card.adCard.querySelector('.popup__description');
      var popupAvatar = window.card.adCard.querySelector('.popup__avatar');

      var renderPhotos = function (photos) {
        var fragment = document.createDocumentFragment();
        photos.forEach(function (it) {
          var photo = photoTemplate.cloneNode(true);
          photo.src = it;
          fragment.appendChild(photo);
        });

        return fragment;
      };

      var setFeatures = function () {
        var features = '';
        ad.offer.features.forEach(function (feature) {
          features += '<li class="popup__feature ' + classToFeature[feature] + '"></li>';
        });
        return features;
      };

      popupTitle.textContent = ad.offer.title;
      popupAddress.textContent = ad.offer.address;
      popupType.textContent = insertCorrectType(adType);
      featuresList.innerHTML = setFeatures();
      popupDescription.textContent = ad.offer.description;

      if (!ad.offer.price) {
        popupPrice.style = 'display: none;';
      } else {
        popupPrice.style = 'display: block;';
        popupPrice.textContent = ad.offer.price + '₽/ночь';
      }
      if (isNaN(ad.offer.rooms) || isNaN(ad.offer.guests)) {
        popupRoomsAndGuests.style = 'display: none;';
      } else {
        popupRoomsAndGuests.style = 'display: block;';
        popupRoomsAndGuests.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      }
      if (!ad.offer.checkin || !ad.offer.checkout) {
        popupTime.style = 'display: none;';
      } else {
        popupTime.style = 'display: block;';
        popupTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      }
      if (ad.author.avatar === '') {
        popupAvatar.style = 'display: none;';
      } else {
        popupAvatar.style = 'display: block;';
        popupAvatar.src = ad.author.avatar;
      }
      if (ad.offer.photos.length === 0) {
        photosContainer.style = 'display: none;';
      } else {
        photosContainer.style = 'display: block;';
        photosContainer.innerHTML = '';
        photosContainer.appendChild(renderPhotos(ad.offer.photos));
      }
    }
  };
})();
