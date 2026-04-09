/* SYTĚ SYTĚ — script.js */

(async function () {

  // ── Helper functions ───────────────────────────────────────

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function attrJson(obj) {
    return JSON.stringify(obj)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function isNounWord(word, nounWords) {
    const norm = word.toLowerCase().replace(/[.,;:!?()\-]/g, '');
    return nounWords.includes(norm);
  }

  function getRepKey(word, repetitions) {
    const norm = word.toLowerCase().replace(/[.,;:!?()\-]/g, '');
    for (const key of Object.keys(repetitions)) {
      const variants = key.split('/').map(v => v.trim().toLowerCase());
      if (variants.includes(norm)) return key;
    }
    return null;
  }

  // Delay after showing word at index idx (before showing idx+1)
  function typeDelay(idx, n) {
    if (n <= 1) return 0;
    if (idx === n - 2) return 200; // pause before last word (noun)
    const t = idx / Math.max(n - 2, 1);
    return Math.round(300 * Math.pow(0.1, t));
  }

  function renderStatic(words, nounWords, repetitions) {
    const repTrack = {};
    return words.map((word, idx) => {
      const noun = isNounWord(word, nounWords);
      const isLast = idx === words.length - 1;
      const repKey = getRepKey(word, repetitions);
      let repCount = 0;
      if (repKey) {
        repTrack[repKey] = (repTrack[repKey] || 0) + 1;
        repCount = repTrack[repKey];
      }
      const cls = 'word' + (noun ? ' word-noun' : '') + (noun && isLast ? ' word-noun-final' : '');
      const sup = repCount > 1 ? `<sup class="rep-count">${repCount}</sup>` : '';
      return `<span class="${cls}">${escHtml(word)}${sup}</span> `;
    }).join('');
  }

  // ── Fetch data ─────────────────────────────────────────────

  let data;
  try {
    const r = await fetch('psycho-llm-data.json');
    data = await r.json();
  } catch (e) {
    document.body.innerHTML =
      '<p style="padding:3rem;font-family:Helvetica,sans-serif;font-weight:700">Chyba: nepodařilo se načíst psycho-llm-data.json.<br>Spusťte lokální server: python -m http.server</p>';
    return;
  }

  // ── State ──────────────────────────────────────────────────

  const entries = [...data.entries].sort((a, b) => a.id.localeCompare(b.id));
  const TOTAL = entries.length;           // 9
  const TOTAL_STR = String(TOTAL).padStart(2, '0'); // "09"

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



  // ── Build hero ─────────────────────────────────────────────

  const hero = document.getElementById('hero');
  hero.innerHTML = `
    <div class="hero-inner">
      <h1 class="hero-title">SYTĚ<br>SYTĚ</h1>
      <p class="hero-subtitle">${escHtml(data.subtitle)}</p>
      <div class="hero-meta">
        <span class="hero-count">${TOTAL_STR} ZÁZNAMŮ</span>
        <span class="hero-scroll" aria-hidden="true">↓</span>
      </div>
    </div>`;

  // ── Build entry sections ───────────────────────────────────

  const container = document.getElementById('entries');

  entries.forEach(entry => {
    const isParallax = entry.id === '05';
    const section = document.createElement('section');
    section.id = `section-${entry.id}`;
    section.className = `section-entry${isParallax ? ' section-parallax' : ''}`;
    section.setAttribute('role', 'listitem');
    section.setAttribute('aria-label', `Záznam ${entry.id}: ${entry.noun}`);

    const words = entry.text.split(/\s+/).filter(Boolean);
    const nounWords = entry.noun.toLowerCase().split(/\s+/).filter(Boolean);

    const catStr = entry.medal
      ? `${entry.medal} — ${entry.category.toUpperCase()}`
      : entry.category.toUpperCase();

    const headerHTML = `
      <div class="entry-header">
        <div class="entry-number-line">
          <span class="entry-num">${entry.id}</span>
        </div>
        <div class="entry-meta">
          <span class="entry-adj-count">${entry.adjective_count} PŘÍVLASTKŮ</span>
        </div>
        <h2 class="entry-noun">${escHtml(entry.noun)}</h2>
      </div>`;

    if (isParallax) {
      // Section 05: text visible immediately, parallax scroll instead of typewriter
      section.innerHTML = `
        <div class="section-sticky">
          ${headerHTML}
          <div class="entry-text-wrap">
            <div class="parallax-text entry-text">${renderStatic(words, nounWords, entry.repetitions)}</div>
          </div>
        </div>`;
    } else {
      section.innerHTML = `
        <div class="section-inner">
          ${headerHTML}
          <div class="entry-text-wrap">
            <div class="entry-text"
                 data-words="${attrJson(words)}"
                 data-nouns="${attrJson(nounWords)}"
                 data-reps="${attrJson(entry.repetitions)}"
                 data-adj="${entry.adjective_count}"
                 data-id="${entry.id}">
            </div>
          </div>
        </div>`;
    }

    container.appendChild(section);
  });

  // ── Build colophon ─────────────────────────────────────────

  const kolEl = document.getElementById('kolofon');
  const col = data.colophon;
  kolEl.innerHTML = `
    <div class="section-inner">
      <div class="kolofon-body">
        <p>${escHtml(col.editor)}</p>
        <p>${escHtml(col.year)}</p>
        <p>${escHtml(col.context)}</p>
        <p>Edice: ${escHtml(col.edition)}</p>
      </div>
      <div class="kolofon-links">
        <p><a href="https://github.com/Themolx/syte-syte" target="_blank" rel="noopener">github.com/Themolx/syte-syte</a></p>
      </div>
    </div>`;

  // ── Typewriter ─────────────────────────────────────────────

  const typed = new Set();

  function runTypewriter(section) {
    if (typed.has(section.id)) return;
    typed.add(section.id);

    const textEl = section.querySelector('.entry-text[data-words]');
    if (!textEl) return;

    const words = JSON.parse(textEl.dataset.words);
    const nounWords = JSON.parse(textEl.dataset.nouns);
    const repetitions = JSON.parse(textEl.dataset.reps);
    const adjCount = parseInt(textEl.dataset.adj);
    const sectionId = textEl.dataset.id;

    // Reduced motion: show all immediately
    if (prefersReduced) {
      textEl.innerHTML = renderStatic(words, nounWords, repetitions);
      return;
    }

    const repTrack = {};
    let i = 0;

    function next() {
      if (i >= words.length) return;

      const word = words[i];
      const noun = isNounWord(word, nounWords);
      const repKey = getRepKey(word, repetitions);
      let repCount = 0;
      if (repKey) {
        repTrack[repKey] = (repTrack[repKey] || 0) + 1;
        repCount = repTrack[repKey];
      }

      // Build word span
      const isLast = (i === words.length - 1);
      const span = document.createElement('span');
      span.className = 'word' + (noun ? ' word-noun' : '') + (noun && isLast ? ' word-noun-final' : '');
      span.appendChild(document.createTextNode(word));
      if (repCount > 1) {
        const sup = document.createElement('sup');
        sup.className = 'rep-count';
        sup.textContent = repCount;
        span.appendChild(sup);
      }
      textEl.appendChild(span);
      textEl.appendChild(document.createTextNode(' '));


      const delay = typeDelay(i, words.length);
      i++;
      setTimeout(next, delay);
    }

    next();
  }

  // ── IntersectionObserver — typewriter trigger ──────────────

  const twObserver = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (e.isIntersecting) runTypewriter(e.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section-entry:not(.section-parallax)').forEach(s => {
    twObserver.observe(s);
  });

  // ── Parallax — section 05 ──────────────────────────────────

  const p05 = document.getElementById('section-05');
  const p05Entry = entries.find(e => e.id === '05');

  function updateParallax() {
    if (!p05 || !p05Entry) return;

    const rect = p05.getBoundingClientRect();
    const sectionH = p05.offsetHeight;
    // progress 0 = top of section at bottom of viewport; 1 = bottom of section at top
    const raw = (window.innerHeight - rect.top) / sectionH;
    const clamped = Math.max(0, Math.min(1, raw));

    // Text translation inside sticky container
    const textWrap = p05.querySelector('.entry-text-wrap');
    const textEl = p05.querySelector('.parallax-text');
    if (textWrap && textEl) {
      const maxScroll = Math.max(0, textEl.scrollHeight - textWrap.clientHeight);
      textEl.style.transform = `translateY(${-clamped * maxScroll}px)`;
    }
  }

  if (!prefersReduced) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  const allSections = [
    document.getElementById('hero'),
    ...entries.map(e => document.getElementById(`section-${e.id}`)),
    document.getElementById('kolofon')
  ].filter(Boolean);

  const navObserver = new IntersectionObserver((ents) => {
    // Find the entry with largest intersection ratio
    let best = null;
    ents.forEach(e => {
      if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
        best = e;
      }
    });
  }, {
    threshold: [0.3, 0.6]
  });

  allSections.forEach(s => navObserver.observe(s));

  // ── Keyboard navigation ────────────────────────────────────

  let currentIdx = 0;

  // Track current section index on scroll
  window.addEventListener('scroll', () => {
    const mid = window.scrollY + window.innerHeight * 0.4;
    allSections.forEach((el, i) => {
      if (el.offsetTop <= mid) currentIdx = i;
    });
  }, { passive: true });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const next = allSections[Math.min(currentIdx + 1, allSections.length - 1)];
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prev = allSections[Math.max(currentIdx - 1, 0)];
      if (prev) prev.scrollIntoView({ behavior: 'smooth' });
    }
  });

})();
