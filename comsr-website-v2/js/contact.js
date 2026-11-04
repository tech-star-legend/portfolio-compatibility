/* =====================================================
   COM SR INFOTECH — CONTACT CARD SCRIPT (/contact)
   Welcome typewriter only. Theme toggle, wave transition,
   logo switching and theme saving all live in main.js, so
   nothing here touches (or reacts to) the theme.
   ===================================================== */
(function () {
  "use strict";

  var el = document.getElementById('typewriter');
  if (!el) return;

  // Reduced motion: show the complete sentence (already in the markup), no animation.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('tw-on');
    return;
  }

  var BRAND = 'Com SR Infotech';
  var full = 'Hi, ' + BRAND + ' Welcomes You!';
  var brandStart = full.indexOf(BRAND);
  var brandEnd = brandStart + BRAND.length;

  // HTML for characters [from, to) of the sentence, keeping the brand highlight.
  function render(from, to) {
    var out = '';
    var i = from;
    while (i < to) {
      var inBrand = i >= brandStart && i < brandEnd;
      var stop = inBrand ? Math.min(to, brandEnd) : Math.min(to, i < brandStart ? brandStart : full.length);
      var chunk = full.slice(i, stop);
      out += inBrand ? '<span class="tw-brand">' + chunk + '</span>' : chunk;
      i = stop;
    }
    return out;
  }

  var typed = document.createElement('span');
  var cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  var rest = document.createElement('span');   // untyped remainder: reserves layout, invisible
  rest.className = 'rest';
  el.textContent = '';
  el.appendChild(typed);
  el.appendChild(cursor);
  el.appendChild(rest);
  rest.innerHTML = render(0, full.length);
  el.classList.add('tw-on');                   // reveal (empty) line box; typing starts below

  var n = 0;
  var SPEED = 55;    // ms per character
  var START = 450;   // ms before typing begins

  function tick() {
    n++;
    typed.innerHTML = render(0, n);
    rest.innerHTML = render(n, full.length);
    if (n < full.length) {
      setTimeout(tick, SPEED + (full.charAt(n - 1) === ',' ? 160 : 0));
    } else {
      cursor.classList.add('done');
    }
  }
  setTimeout(tick, START);
})();
