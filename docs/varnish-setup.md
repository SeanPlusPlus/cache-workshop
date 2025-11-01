# Varnish HTTP Accelerator

## What It Does

Varnish sits in front of Express and caches responses based on `Cache-Control` headers.

## Architecture

```
Request → Varnish (port 8080) → Express (port 3000)
```

## Testing Cache Behavior

```bash
# Start services
docker-compose up

# Test through Varnish
curl -I http://localhost:8080/api/data
```

**Expected Results:**
- **First request**: `X-Cache: MISS` (fetches from Express)
- **Second request**: `X-Cache: HIT` (served from Varnish cache)
- **After 5 minutes**: `X-Cache: MISS` (cache expired, fetches fresh)

## Performance Impact

During cache TTL, Express receives **zero requests** for cached endpoints. Varnish handles everything, enabling thousands of requests per second.
