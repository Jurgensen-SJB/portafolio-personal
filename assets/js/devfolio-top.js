(function ($) {
  'use strict';

  var $nav = $('#mainNav');
  if (!$nav.length) {
    return;
  }

  var navHeight = $nav.outerHeight() || 70;

  function setNavbarState() {
    if ($(window).scrollTop() > 50) {
      $nav.addClass('navbar-reduce').removeClass('navbar-trans');
      if ($('body').hasClass('dark-mode')) {
        $nav.addClass('navbar-darkmode').removeClass('navbar-lightmode');
      } else {
        $nav.addClass('navbar-lightmode').removeClass('navbar-darkmode');
      }
    } else {
      $nav.addClass('navbar-trans').removeClass('navbar-reduce navbar-darkmode navbar-lightmode');
    }
  }

  setNavbarState();

  $('.navbar-toggler').on('click', function () {
    if (!$nav.hasClass('navbar-reduce')) {
      $nav.addClass('navbar-reduce').removeClass('navbar-trans');
    }
  });

  $(window).on('scroll', function () {
    setNavbarState();
  });

  document.addEventListener('themechange', function () {
    setNavbarState();
  });

  $('a.js-scroll[href^="#"]').on('click', function (event) {
    var target = $($(this).attr('href'));

    if (target.length) {
      event.preventDefault();
      $('html, body').animate(
        {
          scrollTop: target.offset().top - navHeight + 5
        },
        600
      );
      $('.navbar-collapse').collapse('hide');
    }
  });

  $('body').scrollspy({
    target: '#mainNav',
    offset: navHeight + 5
  });

  if ($('.text-slider').length && typeof Typed !== 'undefined') {
    var typedStrings = $('.text-slider-items').text();
    new Typed('.text-slider', {
      strings: typedStrings.split(','),
      typeSpeed: 80,
      loop: true,
      backDelay: 1100,
      backSpeed: 40
    });
  }
})(jQuery);

