# CDN Cache Behavior Analysis

## Universal Cache Instructions

**Key Concept:** `Cache-Control: public, max-age=300` is a **universal instruction** from your server to the entire caching ecosystem:

✅ **Browser**: "Keep this for 5 minutes"  
✅ **CDN (CloudFront)**: "Store at edge locations for 5 minutes"  
✅ **Proxy (Varnish)**: "Cache this for 5 minutes"  
✅ **Any cache layer**: "This content is cacheable for 5 minutes"

Your server sets **one policy** that every cache in the request path respects automatically.

## Scenario: Geographic Caching

**Setup:**
- Server: us-east-1 (Virginia)
- CDN Edge: Los Angeles
- Cache-Control: `public, max-age=300` (5 minutes)

## Request Flow Timeline

### T=0: First Request (Cold Cache)
```
You → LA Edge (MISS) → Virginia Server
```
- **Latency**: ~70ms (cross-country)
- **Result**: Both LA Edge and browser cache content for 5 minutes

### T=1min: Your Refresh (Browser Cache Hit)
```
You → Browser Cache (HIT) ✋ STOPS HERE
```
- **Latency**: <1ms (local)
- **Result**: Never hits CDN or origin server

### T=6min: Cache Expired, But Others Used Site

**If other LA users hit the site at T=4min:**
```
Other users → LA Edge (HIT) → Cache TTL refreshed
Your request → LA Edge (HIT) ✋ STOPS AT CDN
```
- **Latency**: ~5ms (local CDN)
- **Result**: CDN cache "warmed" by other users

**If no other users:**
```
You → LA Edge (MISS) → Virginia Server
```
- **Latency**: ~70ms (cross-country)
- **Result**: Fresh content from origin

## Key Insights

* **Cache warming effect**: Other users extend CDN cache lifetime
* **Geographic benefit**: CDN reduces latency from 70ms to 5ms
* **Browser cache**: Most effective (0ms), but user-specific
* **CDN cache**: Shared benefit across all users in region
