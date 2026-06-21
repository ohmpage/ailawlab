'use strict';
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML =
    '<p>AI Law Tools created by <a href="https://www.paulohm.com/">Paul Ohm</a> using Claude Code.</p>' +
    '<p>Released (as an independent project) in conjunction with the publication<br>' +
    'by Margot Kaminski, Paul Ohm, and Andrew Selbst of ' +
    '<a href="https://aila.ws/"><em>Artificial Intelligence Law</em></a> ' +
    '(<a href="https://faculty.westacademic.com/Book/Detail?id=358012">Foundation Press University Casebook Series 2026</a>).</p>' +
    '<p><a href="https://github.com/ohmpage/ailawlab">GitHub repo</a></p>' +
    '<p>Comments: <a href="mailto:ohm@law.georgetown.edu">ohm@law.georgetown.edu</a></p>';
}());
