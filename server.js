const express = require('express');
const http = require('http');
const app = express();
const PORT = 3000;
const SERVER_ID = process.env.SERVER_ID || 'unknown';

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
  version: '1.0',
  server: SERVER_ID
};

app.get('/api/data', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.set('Vary', 'Accept-Encoding'); // Cache varies by compression
  res.json(apiData); // Returns same data each time
});

// Purge all Varnish instances endpoint
app.post('/purge-all/:path(*)', (req, res) => {
  const path = req.params.path;
  const varnishInstances = [
    { host: 'varnish1', port: 80 },
    { host: 'varnish2', port: 80 }
  ];
  
  const results = [];
  let completed = 0;
  
  varnishInstances.forEach(instance => {
    const options = {
      hostname: instance.host,
      port: instance.port,
      path: `/${path}`,
      method: 'PURGE'
    };
    
    const req = http.request(options, (response) => {
      results.push({
        instance: `${instance.host}:${instance.port}`,
        status: response.statusCode,
        success: response.statusCode === 200
      });
      
      completed++;
      if (completed === varnishInstances.length) {
        res.json({
          message: `Purged ${path} from all Varnish instances`,
          results
        });
      }
    });
    
    req.on('error', (error) => {
      results.push({
        instance: `${instance.host}:${instance.port}`,
        error: error.message,
        success: false
      });
      
      completed++;
      if (completed === varnishInstances.length) {
        res.json({
          message: `Purged ${path} from all Varnish instances`,
          results
        });
      }
    });
    
    req.end();
  });
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
