'use strict';

(function () {
  var MAX_PINS_QUANTITY = 5;

  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var features = filtersContainer.querySelector('.map__features');
  var popup = window.blocks.map.querySelector('.popup');

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
        window.blocks.map.removeChild(popup);
        popup = false;
      }
    }
  };

  var disableFilters = function () {
    Array.from(filters).forEach(function (filter) {
      filter.removeAttribute('disabled');
    });
    features.removeAttribute('disabled');
  };

  var onMapPinClick = function (evt) {
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
    var target = evt.target;
    if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
      return;
    }
    var activePin = window.blocks.pinsContainer.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    evt.target.classList.add('map__pin--active');
    var alt = target.querySelector('img').alt;
    window.map.closePopup();
    window.pinsList.some(function (pin) {
      if (pin.offer.title === alt) {
        var fragment = document.createDocumentFragment();
        popup = fragment.appendChild(window.renderAd(pin));
        window.blocks.map.insertBefore(fragment, filtersContainer);
        var popupClose = popup.querySelector('.popup__close');
        document.addEventListener('keydown', onPopupEscPress);
        popupClose.addEventListener('click', onPopupCloseClick);
      }
    });
  };

  window.blocks.pinsContainer.addEventListener('click', onMapPinClick);
})();
