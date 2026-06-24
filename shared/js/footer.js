'use strict';
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML =
    '<div class="footer-inner">' +
      '<div class="footer-left">' +
        '<p>AI Law Lab: Tools by <a href="https://www.paulohm.com/">Paul Ohm</a> using Claude Code.</p>' +
        '<p>Released as an independent project for use with ' +
        '<a href="https://aila.ws/"><em>Artificial Intelligence Law</em></a>, ' +
        'Kaminski, Ohm &amp; Selbst ' +
        '(<a href="https://faculty.westacademic.com/Book/Detail?id=358012">Foundation Press 2026</a>).</p>' +
      '</div>' +
      '<div class="footer-right">' +
        '<p><a href="https://github.com/ohmpage/ailawlab">github repo</a></p>' +
        '<p><a href="mailto:ohm@law.georgetown.edu">Suggestions?</a></p>' +
      '</div>' +
    '</div>';
}());
