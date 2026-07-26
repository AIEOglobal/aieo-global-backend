// ALRID Diagnostic — site-wide crawl endpoint
// Fetches the given page plus a handful of internal links from the
// same site, so the ALRID scan can check patterns across multiple
// webpages instead of just one.

const MAX_PAGES = 15; // home page + up to 14 discovered internal links
const FETCH_TIMEOUT_MS = 8000;

const SKIP_EXTENSIONS = /\.(pdf|jpg|jpeg|png|gif|svg|webp|css|js|json|xml|zip|mp4|mp3|ico|woff2?|ttf)(\?|#|$)/i;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: 'Missing "url" query parameter.' });
    return;
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch (e) {
    res.status(400).json({ error: 'Invalid URL.' });
    return;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    res.status(400).json({ error: 'URL must use http or https.' });
    return;
  }

  async function fetchSafe(url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AIEODiagnosticBot/1.0; +https://aieo.global)',
        },
        redirect: 'follow',
      });
      clearTimeout(timeout);
      if (!response.ok) return null;
      return await response.text();
    } catch (e) {
      return null;
    }
  }

  function extractInternalLinks(html, baseUrl) {
    const links = new Set();
    const hrefRegex = /<a\s+[^>]*href=["']([^"'#]+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      try {
        const resolved = new URL(match[1], baseUrl);
        if (resolved.origin !== new URL(baseUrl).origin) continue;
        if (SKIP_EXTENSIONS.test(resolved.pathname)) continue;
        resolved.hash = '';
        resolved.search = '';
        links.add(resolved.href);
      } catch (e) { /* ignore malformed hrefs */ }
    }
    return Array.from(links);
  }

  try {
    const homeHtml = await fetchSafe(parsed.href);
    if (homeHtml === null) {
      res.status(502).json({ error: 'Could not reach that site.' });
      return;
    }

    const discovered = extractInternalLinks(homeHtml, parsed.href)
      .filter(u => u !== parsed.href)
      .slice(0, MAX_PAGES - 1);

    const otherPages = await Promise.all(
      discovered.map(async (pageUrl) => {
        const html = await fetchSafe(pageUrl);
        return html !== null ? { url: pageUrl, html } : null;
      })
    );

    const pages = [{ url: parsed.href, html: homeHtml }, ...otherPages.filter(Boolean)];

    res.status(200).json({ pages, pagesFound: discovered.length + 1, pagesFetched: pages.length });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error while scanning.' });
  }
}
