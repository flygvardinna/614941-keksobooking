'use strict';

(function () {
  var MAP_PIN_HALF_WIDTH = 50 / 2;
  var MAP_PIN_HEIGHT = 70;

  var pinTemplate = window.blocks.template.content.querySelector('.map__pin');

  window.renderPin = function (pin) {
    var similarAdPin = pinTemplate.cloneNode(true);
    var mapPinTopLeftX = pin.location.x - MAP_PIN_HALF_WIDTH;
    var mapPinTopLeftY = pin.location.y - MAP_PIN_HEIGHT;

    similarAdPin.style = 'left: ' + mapPinTopLeftX + 'px; top: ' + mapPinTopLeftY + 'px;';
    similarAdPin.querySelector('img').src = pin.author.avatar;
    similarAdPin.querySelector('img').alt = pin.offer.title;

    return similarAdPin;
  };
})();
