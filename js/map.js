'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var filtersContainer = document.querySelector('.map__filters-container');

  window.renderPinsList = function (pins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.renderPin(pins[i]));
    }
    window.blocks.pinsContainer.appendChild(fragment);
  };

  var onMapPinClick = function (evt) {
    var closePopup = function () {
      window.blocks.map.removeChild(popup);
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
    for (var j = 0; j < window.adsList.length; j++) {
      if (window.adsList[j].offer.title === alt) {
        var currentAd = window.adsList[j];
        var fragment = document.createDocumentFragment();
        fragment.appendChild(window.renderAd(currentAd));
        window.blocks.map.insertBefore(fragment, filtersContainer);
        var popup = window.blocks.map.querySelector('.popup');
        var popupClose = popup.querySelector('.popup__close');
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

  window.blocks.pinsContainer.addEventListener('click', onMapPinClick);
})();
