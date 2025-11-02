# Redis Application Cache

## What It Does

Redis sits behind Express apps and caches external API responses, database queries, and computed results.

## Architecture

```
HAProxy → Varnish → Express → Redis → External APIs
```

## Cache-Aside Pattern

```javascript
// Check Redis cache first
const cached = await redisClient.get('widgets');
if (cached) {
  return res.json({ ...JSON.parse(cached), source: 'redis-cache' });
}

// Cache miss - fetch from external API
const widgets = await fetchExternalAPI();
await redisClient.setEx('widgets', 300, JSON.stringify(widgets));
res.json({ ...widgets, source: 'external-api' });
```

## Testing Redis Caching

```bash
# First request (cache miss)
curl http://localhost:8082/api/widgets
# Response: "source": "external-api"

# Second request (cache hit)  
curl http://localhost:8082/api/widgets
# Response: "source": "redis-cache"
```

## Multi-Layer Cache Complexity

**Observed behavior:** Alternating between `external-api` and `redis-cache` responses.

**Root cause:** Both Varnish (HTTP cache) and Redis (application cache) are caching the same content with different TTLs.

**Solution:** Coordinated cache invalidation across all layers.

## Cache Invalidation Endpoints

```bash
# Clear only Redis cache
curl -X POST http://localhost:8082/purge-redis/widgets

# Clear both Varnish AND Redis
curl -X POST http://localhost:8082/purge-everything/api/widgets
```

## Production Benefits

* **Performance** - 200ms external API calls → 5ms Redis lookups
* **Cost reduction** - Fewer external API calls
* **Reliability** - Cached responses during external service outages
* **Scalability** - Shared cache across multiple app instances

## AWS Equivalent

This pattern maps to **ElastiCache for Redis** behind your application servers, providing the same cache-aside functionality at scale.
