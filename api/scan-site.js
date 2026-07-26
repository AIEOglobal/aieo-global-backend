<!-- ============================================================
     ALRID DIAGNOSTIC — site-wide scanner (standalone tool)
     Paste into a Custom HTML block on its own Systeme.io page.
     Requires the companion backend endpoint: /api/scan-site.js
     deployed alongside your existing /api/scan.js on Vercel.
     ============================================================ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  .alrid-tool-scope {
    --a-bg: #0A1626;
    --a-bg-deep: #060D18;
    --a-panel: #101F33;
    --a-panel-line: rgba(234, 242, 251, 0.09);
    --a-grid: rgba(234, 242, 251, 0.04);
    --a-text: #EAF2FB;
    --a-muted: #8B98A8;
    --a-pass: #6FCF97;
    --a-warn: #F2B84B;
    --a-fail: #EF6C55;
    --a-accent: #AEBAC8;
    --a-chrome-1: #FFFFFF;
    --a-chrome-2: #A6B1BE;

    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
    color: var(--a-text);
    background:
      linear-gradient(var(--a-grid) 1px, transparent 1px) 0 0 / 32px 32px,
      linear-gradient(90deg, var(--a-grid) 1px, transparent 1px) 0 0 / 32px 32px,
      var(--a-bg-deep);
    padding: 88px 24px 96px 24px;
  }
  .alrid-tool-scope * { box-sizing: border-box; }
  .alrid-tool-scope a { color: inherit; }

  .alrid-hero { max-width: 880px; margin: 0 auto; text-align: center; }
  .alrid-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--a-accent);
    margin: 0 0 20px 0;
  }
  .alrid-hero h1 {
    font-size: clamp(34px, 4.6vw, 58px);
    line-height: 1.12;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0 0 24px 0;
  }
  .alrid-sub2 {
    font-size: 16px;
    color: var(--a-muted);
    line-height: 1.7;
    margin: 0 auto;
    max-width: 640px;
  }
  .alrid-sub3 {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13.5px;
    color: var(--a-accent);
    letter-spacing: 0.05em;
    margin: 26px 0 48px 0;
  }

  .alrid-search-bar {
    display: flex;
    gap: 8px;
    background: var(--a-panel);
    border: 1px solid var(--a-panel-line);
    border-radius: 50px;
    padding: 6px 6px 6px 22px;
    align-items: center;
    max-width: 560px;
    margin: 0 auto;
  }
  .alrid-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 12px 0;
    color: var(--a-text);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    outline: none;
    min-width: 0;
  }
  .alrid-input::placeholder { color: #5C6C7E; }
  .alrid-btn {
    background: linear-gradient(135deg, var(--a-chrome-1), var(--a-chrome-2));
    color: #0A1626;
    border: none;
    border-radius: 50px;
    padding: 13px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: filter 0.15s ease;
    flex-shrink: 0;
  }
  .alrid-btn:hover { filter: brightness(1.08); }
  .alrid-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .alrid-hint { font-size: 12px; color: var(--a-muted); margin: 12px 0 0 0; }

  .alrid-console {
    display: none;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    color: var(--a-muted);
    background: var(--a-panel);
    border: 1px solid var(--a-panel-line);
    border-radius: 8px;
    padding: 14px 16px;
    margin: 20px 0 0 0;
    position: relative;
    overflow: hidden;
    min-height: 90px;
  }
  .alrid-console.alrid-active { display: block; }
  .alrid-console-line { opacity: 0; animation: alrid-fade-in 0.3s ease forwards; margin: 2px 0; }
  .alrid-console-line.alrid-ok { color: var(--a-pass); }
  @keyframes alrid-fade-in { to { opacity: 1; } }
  .alrid-scanline {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--a-accent), transparent);
    animation: alrid-sweep 1.4s linear infinite;
    opacity: 0.7;
  }
  @keyframes alrid-sweep { 0% { top: 0%; } 100% { top: 100%; } }

  .alrid-error {
    display: none;
    text-align: left;
    background: rgba(239,108,85,0.1);
    border: 1px solid rgba(239,108,85,0.3);
    color: var(--a-fail);
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 13px;
    margin: 20px 0 0 0;
  }
  .alrid-error.alrid-active { display: block; }

  .alrid-results { display: none; text-align: left; margin-top: 24px; position: relative; }
  .alrid-results.alrid-active { display: block; }

  .alrid-close-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: var(--a-muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0 0 14px 0;
  }
  .alrid-close-btn:hover { color: var(--a-text); }

  .alrid-verdict-block { text-align: center; border-radius: 8px; padding: 34px 20px 28px 20px; }
  .alrid-verdict-block.alrid-v-fail { background: rgba(239,108,85,0.12); border: 1px solid rgba(239,108,85,0.4); }
  .alrid-verdict-block.alrid-v-warn { background: rgba(242,184,74,0.12); border: 1px solid rgba(242,184,74,0.4); }
  .alrid-verdict-block.alrid-v-pass { background: rgba(111,207,151,0.12); border: 1px solid rgba(111,207,151,0.4); }
  .alrid-verdict-score {
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 700;
    font-size: 72px;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .alrid-verdict-score-suffix { font-size: 24px; opacity: 0.55; margin-left: 4px; }
  .alrid-v-fail .alrid-verdict-score, .alrid-v-fail .alrid-verdict-headline { color: var(--a-fail); }
  .alrid-v-warn .alrid-verdict-score, .alrid-v-warn .alrid-verdict-headline { color: var(--a-warn); }
  .alrid-v-pass .alrid-verdict-score, .alrid-v-pass .alrid-verdict-headline { color: var(--a-pass); }
  .alrid-verdict-headline { font-size: 21px; font-weight: 700; margin: 10px 0 8px 0; letter-spacing: 0.01em; }
  .alrid-verdict-sentence { font-size: 14px; color: var(--a-muted); max-width: 460px; margin: 0 auto; line-height: 1.55; }
  .alrid-verdict-meta { font-size: 12px; color: var(--a-muted); margin: 14px 0 0 0; font-family: 'IBM Plex Mono', monospace; }
  .alrid-flash { display: inline-block; animation: alrid-blink 0.9s steps(1, start) infinite; }
  @keyframes alrid-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }

  .alrid-cta-wrap { text-align: center; margin-top: 28px; }
  .alrid-tool-scope a.alrid-cta-btn {
    display: inline-block;
    background: linear-gradient(135deg, var(--a-chrome-1), var(--a-chrome-2));
    color: #0A1626;
    border: none;
    border-radius: 5px;
    padding: 15px 34px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: filter 0.15s ease;
  }
  .alrid-tool-scope a.alrid-cta-btn:hover { filter: brightness(1.08); }

  .alrid-footnote { font-size: 11.5px; color: var(--a-muted); margin-top: 18px; line-height: 1.5; text-align: center; }

  @media (max-width: 480px) {
    .alrid-hero h1 { font-size: 28px; }
    .alrid-tool-scope { padding: 44px 16px 56px 16px; }
    .alrid-search-bar { flex-direction: column; border-radius: 16px; padding: 14px; }
    .alrid-input { width: 100%; padding: 8px 4px; }
    .alrid-btn { width: 100%; }
  }
</style>

<div class="alrid-tool-scope">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ALRID Diagnostic",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Site-wide diagnostic that scans multiple pages of a website's title, meta description, meta keywords, image alt text, image filenames, video filenames, and URL slugs for ALRID structural pattern presence.",
    "provider": { "@type": "Organization", "name": "AIEO.global" }
  }
  </script>

  <section class="alrid-hero" aria-label="ALRID Diagnostic">
    <p class="alrid-eyebrow">AIEO</p>
    <h1>Artificial Intelligence Engine Optimization</h1>
    <p class="alrid-sub2">AI doesn't read a page the way a person does — it looks for mathematical patterns, not just text or HTML. ALRID (Archive Ledger Registry ID) was created to give AI a consistent structural pattern to recognize, across a site's metadata, filenames, and URLs.</p>
    <p class="alrid-sub3">ALRID.global</p>

    <div class="alrid-search-bar">
      <input type="text" class="alrid-input" id="alrid-url-input" placeholder="Enter your domain to check ALRID structure" autocomplete="off">
      <button class="alrid-btn" id="alrid-run-btn">Run Diagnostic</button>
    </div>
    <p class="alrid-hint">Public pages only. Nothing is stored.</p>
    <p class="alrid-hint">ALRID diagnostic tools vary by methodology — results are a directional signal, not a certification.</p>

    <div class="alrid-console" id="alrid-console">
      <div class="alrid-scanline"></div>
    </div>

    <div class="alrid-error" id="alrid-error"></div>

    <div class="alrid-results" id="alrid-results">
      <button class="alrid-close-btn" id="alrid-close-btn">✕ Close Results</button>

      <div class="alrid-verdict-block" id="alrid-verdict-block">
        <div class="alrid-verdict-score"><span id="alrid-verdict-score">0</span><span class="alrid-verdict-score-suffix">/100</span></div>
        <p class="alrid-verdict-headline" id="alrid-verdict-headline"></p>
        <p class="alrid-verdict-sentence" id="alrid-verdict-sentence"></p>
        <p class="alrid-verdict-meta" id="alrid-verdict-meta"></p>
      </div>

      <div class="alrid-cta-wrap">
        <a href="https://www.alrid.global" class="alrid-cta-btn">Visit ALRID.global</a>
      </div>

      <p class="alrid-footnote">Scans run through a dedicated scan server for reliable results. If a scan times out, wait a moment and try again.</p>
    </div>
  </section>
</div>

<script>
(function () {
  const els = {
    input: document.getElementById('alrid-url-input'),
    btn: document.getElementById('alrid-run-btn'),
    console: document.getElementById('alrid-console'),
    error: document.getElementById('alrid-error'),
    results: document.getElementById('alrid-results'),
    closeBtn: document.getElementById('alrid-close-btn'),
    verdictBlock: document.getElementById('alrid-verdict-block'),
    verdictScore: document.getElementById('alrid-verdict-score'),
    verdictHeadline: document.getElementById('alrid-verdict-headline'),
    verdictSentence: document.getElementById('alrid-verdict-sentence'),
    verdictMeta: document.getElementById('alrid-verdict-meta'),
  };

  // Site-wide crawl endpoint — separate from the AIEO tool's single-page endpoint.
  const SCAN_SITE_API = 'https://aieo-global-backend.vercel.app/api/scan-site';

  // Structural pattern: [prefix]-ALRID-[code] — length/characters of
  // prefix and code are flexible; only the three-part structure matters.
  const ALRID_PATTERN = /\b[a-z0-9]{1,24}-alrid-[a-z0-9]{1,24}\b/i;

  function normalizeUrl(raw) {
    let u = raw.trim();
    if (!u) return null;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { return new URL(u); } catch (e) { return null; }
  }

  async function fetchSiteData(targetUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch(SCAN_SITE_API + '?url=' + encodeURIComponent(targetUrl), { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      clearTimeout(timeout);
      return null;
    }
  }

  function logLine(text, ok) {
    const line = document.createElement('div');
    line.className = 'alrid-console-line' + (ok ? ' alrid-ok' : '');
    line.textContent = text;
    els.console.appendChild(line);
    els.console.scrollTop = els.console.scrollHeight;
  }

  function clearConsole() { els.console.innerHTML = '<div class="alrid-scanline"></div>'; }

  function filenameOf(src) {
    try {
      const u = new URL(src, 'https://placeholder.invalid/');
      const parts = u.pathname.split('/');
      return parts[parts.length - 1] || '';
    } catch (e) {
      const parts = String(src).split('/');
      return parts[parts.length - 1] || '';
    }
  }

  // Checks one page's HTML across all 7 category types.
  // Returns which categories matched on THIS page.
  function checkPage(pageUrl, html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const found = { title: false, description: false, keywords: false, imageAlt: false, imageFilename: false, videoFilename: false, urlSlug: false };

    const title = (doc.querySelector('title') ? doc.querySelector('title').textContent : '') || '';
    found.title = ALRID_PATTERN.test(title);

    const descTag = doc.querySelector('meta[name="description"]');
    found.description = ALRID_PATTERN.test(descTag ? (descTag.getAttribute('content') || '') : '');

    const kwTag = doc.querySelector('meta[name="keywords"]');
    found.keywords = ALRID_PATTERN.test(kwTag ? (kwTag.getAttribute('content') || '') : '');

    const imgs = Array.from(doc.querySelectorAll('img'));
    found.imageAlt = imgs.some(img => ALRID_PATTERN.test(img.getAttribute('alt') || ''));
    found.imageFilename = imgs.some(img => ALRID_PATTERN.test(filenameOf(img.getAttribute('src') || '')));

    const videoSrcs = Array.from(doc.querySelectorAll('video, video source')).map(el => el.getAttribute('src') || '');
    found.videoFilename = videoSrcs.some(src => ALRID_PATTERN.test(filenameOf(src)));

    try {
      found.urlSlug = ALRID_PATTERN.test(new URL(pageUrl).pathname);
    } catch (e) { found.urlSlug = false; }

    return found;
  }

  function aggregate(pages) {
    const categories = ['title', 'description', 'keywords', 'imageAlt', 'imageFilename', 'videoFilename', 'urlSlug'];
    const siteWide = {};
    categories.forEach(c => { siteWide[c] = false; });

    pages.forEach(p => {
      const result = checkPage(p.url, p.html);
      categories.forEach(c => { if (result[c]) siteWide[c] = true; });
    });

    const matchedCount = categories.filter(c => siteWide[c]).length;
    const pct = Math.round((matchedCount / categories.length) * 100);
    return pct;
  }

  function renderScore(pct, pagesFetched) {
    const riskPct = 100 - pct;
    els.verdictScore.textContent = pct;
    els.verdictBlock.classList.remove('alrid-v-fail', 'alrid-v-warn', 'alrid-v-pass');
    els.verdictMeta.textContent = pagesFetched + ' page' + (pagesFetched === 1 ? '' : 's') + ' scanned';

    if (pct >= 80) {
      els.verdictBlock.classList.add('alrid-v-pass');
      els.verdictHeadline.innerHTML = '✅ ALRID STRUCTURE DETECTED ✅';
      els.verdictSentence.textContent = 'This site carries a consistent ALRID structural pattern across its pages.';
    } else if (pct >= 40) {
      els.verdictBlock.classList.add('alrid-v-warn');
      els.verdictHeadline.innerHTML = '<span class="alrid-flash">⚠️⚠️</span> PARTIAL ALRID STRUCTURE — ACTION REQUIRED <span class="alrid-flash">⚠️⚠️</span>';
      els.verdictSentence.textContent = riskPct + '% of ALRID coverage is missing across this site.';
    } else {
      els.verdictBlock.classList.add('alrid-v-fail');
      els.verdictHeadline.innerHTML = '<span class="alrid-flash">⚠️⚠️</span> NO ALRID STRUCTURE FOUND — ACTION REQUIRED <span class="alrid-flash">⚠️⚠️</span>';
      els.verdictSentence.textContent = 'This site has no detectable ALRID structural pattern.';
    }
  }

  function closeResults() {
    els.results.classList.remove('alrid-active');
    els.error.classList.remove('alrid-active');
    els.input.value = '';
    els.input.focus();
  }

  async function runDiagnostic() {
    const parsed = normalizeUrl(els.input.value);
    els.error.classList.remove('alrid-active');
    els.results.classList.remove('alrid-active');

    if (!parsed) {
      els.error.textContent = 'Enter a valid website address, like yourdomain.com.';
      els.error.classList.add('alrid-active');
      return;
    }

    els.btn.disabled = true;
    els.btn.textContent = 'Scanning…';
    clearConsole();
    els.console.classList.add('alrid-active');
    logLine('Target: ' + parsed.origin);

    try {
      logLine('Discovering pages…');
      const data = await fetchSiteData(parsed.href);
      if (!data || !data.pages || data.pages.length === 0) throw new Error('unreachable');
      logLine(data.pages.length + ' page(s) fetched.', true);

      logLine('Scanning titles, descriptions, keywords…');
      logLine('Scanning image and video filenames…');
      logLine('Scanning URL structure…');
      const pct = aggregate(data.pages);
      logLine('Done.', true);

      renderScore(pct, data.pages.length);
      els.results.classList.add('alrid-active');
    } catch (e) {
      els.error.textContent = 'Could not reach that site. It may be blocking automated requests, or temporarily unavailable — try again in a moment.';
      els.error.classList.add('alrid-active');
    } finally {
      els.btn.disabled = false;
      els.btn.textContent = 'Run Diagnostic';
      els.console.classList.remove('alrid-active');
    }
  }

  els.btn.addEventListener('click', runDiagnostic);
  els.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') runDiagnostic(); });
  els.closeBtn.addEventListener('click', closeResults);
})();
</script>
