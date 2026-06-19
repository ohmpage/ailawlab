'use strict';
(function () {
  var cfg = window.APP_HEADER || {};
  var el  = document.getElementById('site-header');
  if (!el) return;

  el.innerHTML =
    '<h1>' + (cfg.h1 || 'AI Law') + '</h1>' +
    '<nav class="header-nav">' +
      '<a href="' + (cfg.root || '../') + '" class="header-back">← Apps</a>' +
      '<a href="#" id="hdr-tutorial" class="header-tutorial">Tutorial</a>' +
      '<p class="byline">by <a href="https://www.paulohm.com/">Paul Ohm</a></p>' +
    '</nav>';

  document.getElementById('hdr-tutorial').addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof window.restartTutorial === 'function') window.restartTutorial();
  });
}());
