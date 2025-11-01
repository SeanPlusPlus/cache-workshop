# Varnish Cache Purge

## What is Cache Purging?

Manual cache invalidation - clearing specific cached content before TTL expires.

## Why Purge Cache?

- **Data changes** - content updated, need fresh version
- **Bug fixes** - cached response has errors
- **Immediate updates** - can't wait 5 minutes for TTL

## PURGE Method

```bash
# Clear specific cached content
curl -X PURGE http://localhost:8080/api/data
```

**Response:**
```html
<h1>Error 200 Purged</h1>
<p>Purged</p>
```

## Testing Cache Purge

```bash
# 1. Make request (cache miss)
curl -i http://localhost:8080/api/data
# X-Cache: MISS, Age: 0

# 2. Make request (cache hit)
curl -i http://localhost:8080/api/data  
# X-Cache: HIT, Age: 17

# 3. Purge cache
curl -X PURGE http://localhost:8080/api/data

# 4. Make request (cache miss again)
curl -i http://localhost:8080/api/data
# X-Cache: MISS, Age: 0, different server
```

## Production Use Cases

- **Content management** - editors publish new content
- **API updates** - data changes in database
- **Emergency fixes** - remove cached errors immediately
