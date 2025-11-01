const express = require('express');
const app = express();
const PORT = 3000;

// Static assets - aggressive caching strategy
// Use case: CSS, JS, images with versioned filenames
// Cache-Control: public (shareable), max-age=31536000 (1 year)
// Best for: immutable assets that change URLs when updated
app.get('/static/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  res.set('ETag', `"static-${Date.now()}"`); // Simple ETag for validation
  res.send(`Static asset: ${req.path}`);
});

// API data - moderate caching strategy  
// Use case: semi-dynamic content like user profiles, product catalogs
// Cache-Control: public (CDN cacheable), max-age=300 (5 minutes)
// Best for: data that changes infrequently but needs reasonable freshness
const apiData = {
  timestamp: new Date().toISOString(),
  data: 'Cached API response',
  version: '1.0'
};

app.get('/api/data', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.set('Vary', 'Accept-Encoding'); // Cache varies by compression
  res.json(apiData); // Returns same data each time
});

// Dynamic content - no caching strategy
// Use case: real-time data, personalized content, CSRF tokens
// Cache-Control: no-cache (validate before use), no-store (don't cache), must-revalidate
// Best for: user-specific or time-sensitive data
app.get('/dynamic', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache'); // HTTP/1.0 compatibility
  res.set('Expires', '0'); // Explicit expiration
  res.json({
    timestamp: new Date().toISOString(),
    random: Math.random()
  });
});

// Home page - demonstrates different cache strategies
// Shows links to test each caching pattern
app.get('/', (req, res) => {
  res.send(`
    <h1>Cache Workshop</h1>
    <p>Open browser dev tools (Network tab) to observe cache headers</p>
    <ul>
      <li><a href="/static/logo.png">Static Asset (1 year cache)</a> - Immutable content</li>
      <li><a href="/api/data">API Data (5 min cache)</a> - Semi-dynamic content</li>
      <li><a href="/dynamic">Dynamic Content (no cache)</a> - Real-time data</li>
    </ul>
    <h3>Testing Tips:</h3>
    <ul>
      <li>Refresh pages to see cache hits vs misses</li>
      <li>Check Response Headers for Cache-Control values</li>
      <li>Notice timestamp changes (or lack thereof)</li>
    </ul>
  `);
});

// Start server
// In production, this would sit behind Varnish → HAProxy → CloudFront
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Open browser dev tools to observe cache behavior');
});
