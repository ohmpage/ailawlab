'use strict';
(function () {
  var cfg = window.APP_HEADER || {};
  var el  = document.getElementById('site-header');
  if (!el) return;

  el.innerHTML =
    '<div class="hdr-left">' +
      '<h1>' + (cfg.h1 || 'AI Law') + '</h1>' +
      '<p class="byline">by <a href="https://www.paulohm.com/">Paul Ohm</a></p>' +
    '</div>' +
    '<nav class="header-nav">' +
      '<a href="#" id="hdr-tutorial" class="header-tutorial">Tutorial</a>' +
      '<a href="' + (cfg.root || '../') + '" class="header-back">All Apps</a>' +
    '</nav>';

  document.getElementById('hdr-tutorial').addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof window.restartTutorial === 'function') window.restartTutorial();
  });
}());
