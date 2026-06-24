'use strict';
(function () {
  var cfg = window.APP_HEADER || {};
  var el  = document.getElementById('site-header');
  if (!el) return;

  var tutorialLink = cfg.hideTutorial ? '' :
    '<a href="#" id="hdr-tutorial" class="header-tutorial">Tutorial</a>';

  el.innerHTML =
    '<div class="hdr-left">' +
      '<h1>' + (cfg.h1 || 'AI Law') + '</h1>' +
      '<p class="byline">by <a href="https://www.paulohm.com/">Paul Ohm</a> using Claude Code</p>' +
    '</div>' +
    '<nav class="header-nav">' +
      tutorialLink +
      '<a href="' + (cfg.root || '../') + '" class="header-back">All Apps</a>' +
    '</nav>';

  var tutorialEl = document.getElementById('hdr-tutorial');
  if (tutorialEl) {
    tutorialEl.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof window.restartTutorial === 'function') window.restartTutorial();
    });
  }
}());
