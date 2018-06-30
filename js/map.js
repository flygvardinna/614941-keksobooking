'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var typeFilter = filtersContainer.querySelector('#housing-type');
  var priceFilter = filtersContainer.querySelector('#housing-price');
  var roomsNumberFilter = filtersContainer.querySelector('#housing-rooms');
  var guestsNumberFilter = filtersContainer.querySelector('#housing-guests');
  var features = filtersContainer.querySelector('.map__features');
  var wifiFilter = features.querySelector('#filter-wifi');
  var dishwasherFilter = features.querySelector('#filter-dishwasher');
  var parkingFilter = features.querySelector('#filter-parking');
  var washerFilter = features.querySelector('#filter-washer');
  var elevatorFilter = features.querySelector('#filter-elevator');
  var conditionerFilter = features.querySelector('#filter-conditioner');
  var isWifiChecked;
  var isDishwasherChecked;
  var isParkingChecked;
  var isWasherChecked;
  var isElevatorChecked;
  var isConditionerChecked;
  var selectedType;
  var selectedPrice;
  var selectedRoomsNumber;
  var selectedGuestsNumber;
  var pinsList = [];
  var popup = window.blocks.map.querySelector('.popup');

  window.map = {
    onLoad: function (pins) {
      window.pinsList = pins;
      renderPinsList(pins);
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
    removePins: function () {
      Array.from(window.blocks.pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)')).forEach(function (pin) {
        pin.remove();
      });
    }
  };

  var disableFilters = function () {
    Array.from(filters).forEach(function (filter) {
      filter.removeAttribute('disabled');
    });
    features.removeAttribute('disabled');
  };

  var renderPinsList = function (pins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 5; i++) {
      fragment.appendChild(window.renderPin(pins[i]));
    }
    window.blocks.pinsContainer.appendChild(fragment);
    //console.log(pins);
  };

  var getRank = function (pin) {
    var rank = 0;
    var pinPrice = function () {
      if (pin.offer.price < 10000) {
        return 'low';
      } else if (pin.offer.price > 10000 && pin.offer.price < 50000) {
        return 'middle';
      } else {
        return 'high';
      }
    };

    if (pin.offer.type === selectedType) {
      rank += 1;
    }
    if (pinPrice() === selectedPrice) {
      rank += 1;
    }
    if (pin.offer.rooms === selectedRoomsNumber) {
      rank += 1;
    }
    if (pin.offer.guests === selectedGuestsNumber) {
      rank += 1;
    }
    if (pin.offer.features.includes('wifi') && isWifiChecked) {
      rank += 1;
    }
    if (pin.offer.features.includes('dishwasher') && isDishwasherChecked) {
      rank += 1;
    }
    if (pin.offer.features.includes('parking') && isParkingChecked) {
      rank += 1;
    }
    if (pin.offer.features.includes('washer') && isWasherChecked) {
      rank += 1;
    }
    if (pin.offer.features.includes('elevator') && isElevatorChecked) {
      rank += 1;
    }
    if (pin.offer.features.includes('conditioner') && isConditionerChecked) {
      rank += 1;
    }
    return rank;
  };

  var titlesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  var updatePins = function () {
    window.map.removePins();
    renderPinsList(window.pinsList.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      if (rankDiff === 0) {
        rankDiff = titlesComparator(left.offer.title, right.offer.title);
      }
      return rankDiff;
    }));
  };

  var onMapPinClick = function (evt) {
    window.closePopup = function () {
      if (popup) {
        window.blocks.map.removeChild(popup);
        popup = false;
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };
    var onPopupEscPress = function (eventObj) {
      if (eventObj.keyCode === ESC_KEYCODE) {
        closePopup();
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
    closePopup();
    for (var j = 0; j < window.pinsList.length; j++) {
      if (window.pinsList[j].offer.title === alt) {
        var currentAd = window.pinsList[j];
        var fragment = document.createDocumentFragment();
        popup = fragment.appendChild(window.renderAd(currentAd));
        window.blocks.map.insertBefore(fragment, filtersContainer);
        var popupClose = popup.querySelector('.popup__close');
        document.addEventListener('keydown', onPopupEscPress);
        popupClose.addEventListener('click', function () {
          closePopup();
        });
      }
    }
  };

  /*var closePopupIfOpened = function () {
    if (popup) {
      window.closePopup();
    }
  };*/

  var onTypeFilterChange = function (evt) {
    selectedType = evt.target.value;
    window.closePopup();
    updatePins();
  };

  var onPriceFilterChange = function (evt) {
    selectedPrice = evt.target.value;
    window.closePopup();
    updatePins();
  };

  var onRoomsNumberFilterChange = function (evt) {
    selectedRoomsNumber = parseInt(evt.target.value, 10);
    window.closePopup();
    updatePins();
  };

  var onGuestsNumberFilterChange = function (evt) {
    selectedGuestsNumber = parseInt(evt.target.value, 10);
    window.closePopup();
    updatePins();
  };

  var onWifiFilterClick = function () {
    if (wifiFilter.checked) {
      isWifiChecked = true;
    } else {
      isWifiChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  var onDishwasherFilterClick = function () {
    if (dishwasherFilter.checked) {
      isDishwasherChecked = true;
    } else {
      isDishwasherChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  var onParkingFilterClick = function () {
    if (parkingFilter.checked) {
      isParkingChecked = true;
    } else {
      isParkingChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  var onWasheriFilterClick = function () {
    if (washerFilter.checked) {
      isWasherChecked = true;
    } else {
      isWasherChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  var onElevatorFilterClick = function () {
    if (elevatorFilter.checked) {
      isElevatorChecked = true;
    } else {
      isElevatorChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  var onConditionerFilterClick = function () {
    if (conditionerFilter.checked) {
      isConditionerChecked = true;
    } else {
      isConditionerChecked = false;
    }
    window.closePopup();
    updatePins();
  };

  window.blocks.pinsContainer.addEventListener('click', onMapPinClick);
  typeFilter.addEventListener('change', onTypeFilterChange);
  priceFilter.addEventListener('change', onPriceFilterChange);
  roomsNumberFilter.addEventListener('change', onRoomsNumberFilterChange);
  guestsNumberFilter.addEventListener('change', onGuestsNumberFilterChange);
  wifiFilter.addEventListener('click', onWifiFilterClick);
  dishwasherFilter.addEventListener('click', onDishwasherFilterClick);
  parkingFilter.addEventListener('click', onParkingFilterClick);
  washerFilter.addEventListener('click', onWasheriFilterClick);
  elevatorFilter.addEventListener('click', onElevatorFilterClick);
  conditionerFilter.addEventListener('click', onConditionerFilterClick);
})();
