'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var typeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomsNumberFilter = document.querySelector('#housing-rooms');
  var guestsNumberFilter = document.querySelector('#housing-guests');
  var wifiFilter = document.querySelector('#filter-wifi');
  var dishwasherFilter = document.querySelector('#filter-dishwasher');
  var parkingFilter = document.querySelector('#filter-parking');
  var washerFilter = document.querySelector('#filter-washer');
  var elevatorFilter = document.querySelector('#filter-elevator');
  var conditionerFilter = document.querySelector('#filter-conditioner');
  var selectedFilters = 0;
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

  var debounce = function (filterFunction) {
    var lastTimeout = null;

    return function () {
      var timeoutAruments = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        filterFunction.apply(null, timeoutAruments);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var getRank = function (pin) {
    var rank = 0;
    var pinPrice = function () {
      if (pin.offer.price <= 10000) {
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
    window.closePopup();
    window.map.removePins();
    var similarAds = window.pinsList.filter(function (pin) {
      return getRank(pin) === selectedFilters;
    });
    window.map.renderPinsList(similarAds.sort(function (left, right) {
      var rankDiff = titlesComparator(left.offer.title, right.offer.title);
      return rankDiff;
    }));
  };

  var checkAnyValue = function (evt) {
    if (evt.target.value === 'any') {
      selectedFilters -= 1;
    }
  };

  var countTypeAndPriceFilters = function (filterValue) {
    if (!filterValue || filterValue === 'any') {
      selectedFilters += 1;
    }
  };

  var countRoomsAndGuestsFilters = function (filterValue) {
    if (isNaN(filterValue)) {
      selectedFilters += 1;
    }
  };

  var onTypeFilterChange = debounce(function (evt) {
    countTypeAndPriceFilters(selectedType);
    selectedType = evt.target.value;
    checkAnyValue(evt);
    updatePins();
  });

  var onPriceFilterChange = debounce(function (evt) {
    countTypeAndPriceFilters(selectedPrice);
    selectedPrice = evt.target.value;
    checkAnyValue(evt);
    updatePins();
  });

  var onRoomsNumberFilterChange = debounce(function (evt) {
    countRoomsAndGuestsFilters(selectedRoomsNumber);
    selectedRoomsNumber = parseInt(evt.target.value, 10);
    checkAnyValue(evt);
    updatePins();
  });

  var onGuestsNumberFilterChange = debounce(function (evt) {
    countRoomsAndGuestsFilters(selectedGuestsNumber);
    selectedGuestsNumber = parseInt(evt.target.value, 10);
    checkAnyValue(evt);
    updatePins();
  });

  var toggleWifiFilter = function () {
    if (!isWifiChecked) {
      isWifiChecked = true;
      selectedFilters += 1;
    } else {
      isWifiChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var toggleDishwasherFilter = function () {
    if (!isDishwasherChecked) {
      isDishwasherChecked = true;
      selectedFilters += 1;
    } else {
      isDishwasherChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var toggleParkingFilter = function () {
    if (!isParkingChecked) {
      isParkingChecked = true;
      selectedFilters += 1;
    } else {
      isParkingChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var toggleWasheriFilter = function () {
    if (!isWasherChecked) {
      isWasherChecked = true;
      selectedFilters += 1;
    } else {
      isWasherChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var toggleElevatorFilter = function () {
    if (!isElevatorChecked) {
      isElevatorChecked = true;
      selectedFilters += 1;
    } else {
      isElevatorChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var toggleConditionerFilter = function () {
    if (!isConditionerChecked) {
      isConditionerChecked = true;
      selectedFilters += 1;
    } else {
      isConditionerChecked = false;
      selectedFilters -= 1;
    }
    updatePins();
  };

  var onWifiFilterClick = function () {
    toggleWifiFilter();
  };

  var onDishwasherFilterClick = function () {
    toggleDishwasherFilter();
  };

  var onParkingFilterClick = function () {
    toggleParkingFilter();
  };

  var onWasheriFilterClick = function () {
    toggleWasheriFilter();
  };

  var onElevatorFilterClick = function () {
    toggleElevatorFilter();
  };

  var onConditionerFilterClick = function () {
    toggleConditionerFilter();
  };

  var onWifiFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!wifiFilter.checked) {
        wifiFilter.checked = true;
      } else {
        wifiFilter.checked = false;
      }
      toggleWifiFilter();
    }
  };

  var onDishwasherFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!dishwasherFilter.checked) {
        dishwasherFilter.checked = true;
      } else {
        dishwasherFilter.checked = false;
      }
      toggleDishwasherFilter();
    }
  };

  var onParkingFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!parkingFilter.checked) {
        parkingFilter.checked = true;
      } else {
        parkingFilter.checked = false;
      }
      toggleParkingFilter();
    }
  };

  var onWasherFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!washerFilter.checked) {
        washerFilter.checked = true;
      } else {
        washerFilter.checked = false;
      }
      toggleWasheriFilter();
    }
  };

  var onElevatorFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!elevatorFilter.checked) {
        elevatorFilter.checked = true;
      } else {
        elevatorFilter.checked = false;
      }
      toggleElevatorFilter();
    }
  };

  var onConditionerFilterEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!conditionerFilter.checked) {
        conditionerFilter.checked = true;
      } else {
        conditionerFilter.checked = false;
      }
      toggleConditionerFilter();
    }
  };

  typeFilter.addEventListener('change', onTypeFilterChange);
  priceFilter.addEventListener('change', onPriceFilterChange);
  roomsNumberFilter.addEventListener('change', onRoomsNumberFilterChange);
  guestsNumberFilter.addEventListener('change', onGuestsNumberFilterChange);
  wifiFilter.addEventListener('click', onWifiFilterClick);
  wifiFilter.addEventListener('keydown', onWifiFilterEnterPress);
  dishwasherFilter.addEventListener('click', onDishwasherFilterClick);
  dishwasherFilter.addEventListener('keydown', onDishwasherFilterEnterPress);
  parkingFilter.addEventListener('click', onParkingFilterClick);
  parkingFilter.addEventListener('keydown', onParkingFilterEnterPress);
  washerFilter.addEventListener('click', onWasheriFilterClick);
  washerFilter.addEventListener('keydown', onWasherFilterEnterPress);
  elevatorFilter.addEventListener('click', onElevatorFilterClick);
  elevatorFilter.addEventListener('keydown', onElevatorFilterEnterPress);
  conditionerFilter.addEventListener('click', onConditionerFilterClick);
  conditionerFilter.addEventListener('keydown', onConditionerFilterEnterPress);
})();
