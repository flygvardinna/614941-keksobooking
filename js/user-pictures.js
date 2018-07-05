'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarFileChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__user-pic');
  var flatPhotosContainer = document.querySelector('.ad-form__photo-container');
  var imagesFileChooser = flatPhotosContainer.querySelector('#images');
  var imageContainer = flatPhotosContainer.querySelector('.ad-form__photo');
  var imagePreview;

  window.userPictures = {
    removeAvatar: function () {
      avatarPreview.src = 'img/muffin-grey.svg';
    },
    removeImages: function () {
      var firstPic = imageContainer.querySelector('img');
      if (firstPic) {
        imageContainer.removeChild(firstPic);
      }
      var otherPics = flatPhotosContainer.querySelector('img');
      if (otherPics) {
        var imagesContainers = Array.from(flatPhotosContainer.querySelectorAll('.ad-form__photo'));
        imagesContainers.shift();
        imagesContainers.forEach(function (image) {
          image.remove();
        });
        imagePreview = null;
      }
    }
  };

  var addPhoto = function () {
    var fragment = document.createDocumentFragment();
    var newImageContainer = imageContainer.cloneNode(true);
    imagePreview = newImageContainer.querySelector('.ad-form__housing-pic');
    fragment.appendChild(newImageContainer);
    return fragment;
  };

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  imagesFileChooser.addEventListener('change', function () {
    var file = imagesFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (!imagePreview) {
          imageContainer.innerHTML = '<img class= "ad-form__housing-pic" src="" alt="Фотография жилья" width="40" height="44">';
          imagePreview = imageContainer.querySelector('.ad-form__housing-pic');
          imagePreview.src = reader.result;
        } else {
          flatPhotosContainer.appendChild(addPhoto());
          imagePreview.src = reader.result;
        }
      });

      reader.readAsDataURL(file);
    }
  });
})();
