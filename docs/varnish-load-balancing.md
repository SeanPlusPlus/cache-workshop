# Varnish Load Balancing

## Architecture

```
Varnish (port 8080) → Round-robin → app1, app2, app3
```

## How It Works

Varnish performs **two functions**:
1. **HTTP caching** - stores responses in memory
2. **Load balancing** - distributes requests across backends

## Round-Robin Logic

**Cache HIT**: Varnish serves from memory (no backend hit)
**Cache MISS**: Varnish picks next backend in rotation

## Testing

```bash
# First request (cache miss)
curl http://localhost:8080/api/data
# Response: "server": "app1", X-Cache: MISS

# Second request (cache hit) 
curl http://localhost:8080/api/data
# Response: "server": "app1", X-Cache: HIT (same server)

# After cache expires (5+ minutes)
curl http://localhost:8080/api/data  
# Response: "server": "app2", X-Cache: MISS (next in rotation)
```

## Production Pattern

**1 Varnish** load balancing across **multiple Node.js instances** is a common pattern for high-performance applications.
