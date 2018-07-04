'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

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
  var selectedOptions = {
    selectedPrice: priceFilter.value,
    selectedType: typeFilter.value,
    selectedRoomsNumber: roomsNumberFilter.value,
    selectedGuestsNumber: guestsNumberFilter.value
  };

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

  var titlesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    }
    return 0;
  };

  var updatePins = function () {
    var featuresConditions = [wifiFilter.checked, dishwasherFilter.checked, parkingFilter.checked, washerFilter.checked, elevatorFilter.checked, conditionerFilter.checked];
    var filters = Object.values(selectedOptions);

    var getRank = function (pin) {
      var rank = 0;
      var pinDetails = [pin.offer.price, pin.offer.type, pin.offer.rooms, pin.offer.guests];
      var pinPrice = function () {
        if (pin.offer.price <= 10000) {
          return 'low';
        } else if (pin.offer.price > 10000 && pin.offer.price < 50000) {
          return 'middle';
        }
        return 'high';
      };

      if (pinPrice() === selectedOptions.selectedPrice) {
        rank += 1;
      }
      for (var i = 1; i < filters.length; i++) {
        if (pinDetails[i] === filters[i]) {
          rank += 1;
        }
      }
      for (var j = 0; j < FEATURES.length; j++) {
        if (pin.offer.features.includes(FEATURES[j]) && featuresConditions[j]) {
          rank += 1;
        }
      }
      return rank;
    };

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
    if (filterValue === 'any') {
      selectedFilters += 1;
    }
  };

  var countRoomsAndGuestsFilters = function (filterValue) {
    if (isNaN(filterValue)) {
      selectedFilters += 1;
    }
  };

  var onTypeFilterChange = debounce(function (evt) {
    countTypeAndPriceFilters(selectedOptions.selectedType);
    selectedOptions.selectedType = evt.target.value;
    checkAnyValue(evt);
    updatePins();
  });

  var onPriceFilterChange = debounce(function (evt) {
    countTypeAndPriceFilters(selectedOptions.selectedPrice);
    selectedOptions.selectedPrice = evt.target.value;
    checkAnyValue(evt);
    updatePins();
  });

  var onRoomsNumberFilterChange = debounce(function (evt) {
    countRoomsAndGuestsFilters(selectedOptions.selectedRoomsNumber);
    selectedOptions.selectedRoomsNumber = parseInt(evt.target.value, 10);
    checkAnyValue(evt);
    updatePins();
  });

  var onGuestsNumberFilterChange = debounce(function (evt) {
    countRoomsAndGuestsFilters(selectedOptions.selectedGuestsNumber);
    selectedOptions.selectedGuestsNumber = parseInt(evt.target.value, 10);
    checkAnyValue(evt);
    updatePins();
  });

  var countFeatureFilter = function (filter) {
    if (filter.checked) {
      selectedFilters += 1;
    } else {
      selectedFilters -= 1;
    }
    updatePins();
  };

  var onWifiFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var onDishwasherFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var onParkingFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var onWasheriFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var onElevatorFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var onConditionerFilterClick = function (evt) {
    countFeatureFilter(evt.target);
  };

  var toggleFilterFromKeyboard = function (filter) {
    if (!filter.checked) {
      filter.checked = true;
    } else {
      filter.checked = false;
    }
  };

  var countFeatureFilterIfKeyboard = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      toggleFilterFromKeyboard(evt.target);
      countFeatureFilter(evt.target);
    }
  };

  var onWifiFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
  };

  var onDishwasherFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
  };

  var onParkingFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
  };

  var onWasherFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
  };

  var onElevatorFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
  };

  var onConditionerFilterEnterPress = function (evt) {
    countFeatureFilterIfKeyboard(evt);
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
