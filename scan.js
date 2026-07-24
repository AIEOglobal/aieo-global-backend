// AIEO Diagnostic — backend scan endpoint
// Deploy this on Vercel. It fetches the target site's HTML, robots.txt,
// and llms.txt on the SERVER (not the visitor's browser), so it isn't
// subject to browser CORS restrictions and doesn't depend on a public
// proxy service.

export default async function handler(req, res) {
  // Allow your Systeme.io page (or any page) to call this endpoint.
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
      const timeout = setTimeout(() => controller.abort(), 9000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          // Identify honestly as a diagnostic tool, and look enough like
          // a normal client that ordinary sites don't reject the request.
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

  try {
    const [html, robots, llms] = await Promise.all([
      fetchSafe(parsed.href),
      fetchSafe(parsed.origin + '/robots.txt'),
      fetchSafe(parsed.origin + '/llms.txt'),
    ]);

    if (html === null) {
      res.status(502).json({ error: 'Could not reach that site.' });
      return;
    }

    res.status(200).json({ html, robots, llms });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error while scanning.' });
  }
}
