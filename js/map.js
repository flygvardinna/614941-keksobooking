'use strict';

(function () {
  var MAX_PINS_QUANTITY = 5;

  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var features = filtersContainer.querySelector('.map__features');
  var popup;
  var popupClose;
  var activePin;

  window.map = {
    onLoad: function (pins) {
      window.pinsList = pins;
      window.map.renderPinsList(pins);
      filtersContainer.classList.remove('map__filters-container--disabled');
      disableFilters();
    },
    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; font-family: "Roboto", "Arial", sans-serif; color: white; background-color: #ff6d51';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '25px';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    },
    renderPinsList: function (pins) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < MAX_PINS_QUANTITY; i++) {
        if (pins[i]) {
          fragment.appendChild(window.renderPin(pins[i]));
        }
      }
      window.blocks.pinsContainer.appendChild(fragment);
    },
    removePins: function () {
      Array.from(window.blocks.pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)')).forEach(function (pin) {
        pin.remove();
      });
    },
    closePopup: function () {
      if (popup) {
        activePin.classList.remove('map__pin--active');
        popup.style = 'display: none;';
      }
    }
  };

  var disableFilters = function () {
    Array.from(filters).forEach(function (filter) {
      filter.removeAttribute('disabled');
    });
    features.removeAttribute('disabled');
  };

  var onPopupCloseClick = function () {
    window.map.closePopup();
    popupClose.removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (popupEvt) {
    if (popupEvt.keyCode === window.util.ESC_KEYCODE) {
      window.map.closePopup();
      popupClose.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var onMapPinClick = function (evt) {
    var target = evt.target;
    if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
      return;
    }
    var alt = target.querySelector('img').alt;
    if (!popup) {
      popup = window.card.adCard;
      window.blocks.map.insertBefore(popup, filtersContainer);
      popupClose = document.querySelector('.popup__close');
    } else {
      popup.style = 'display: block;';
      activePin.classList.remove('map__pin--active');
    }
    window.pinsList.some(function (pin) {
      if (pin.offer.title === alt) {
        window.card.renderAd(pin);
      }
    });
    evt.target.classList.add('map__pin--active');
    activePin = evt.target;
    document.addEventListener('keydown', onPopupEscPress);
    popupClose.addEventListener('click', onPopupCloseClick);
  };

  window.blocks.pinsContainer.addEventListener('click', onMapPinClick);
})();
