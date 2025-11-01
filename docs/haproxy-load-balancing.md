# HAProxy Load Balancing

## Architecture

```
HAProxy (port 8082) → varnish1 (8080), varnish2 (8081) → app1, app2, app3
```

## What HAProxy Does

- **Load balancing** - distributes requests between Varnish instances
- **Health checks** - monitors Varnish availability
- **Entry point** - single endpoint for all traffic

## Testing Load Balancing

```bash
# Test through HAProxy
curl -i http://localhost:8082/api/data
```

**Look for `Via` header:**
- `via: 1.1 787fa194e66b` = varnish2
- `via: 1.1 e7a2869366c6` = varnish1

## Cache Fragmentation

Each Varnish instance maintains **independent cache**:

```bash
# Request 1: hits varnish1 (MISS)
# Request 2: hits varnish2 (MISS) 
# Request 3: hits varnish1 (HIT)
```

Same URL cached separately on each Varnish instance.

## Cache Inconsistency Problem

**PURGE only affects one Varnish:**
```bash
curl -X PURGE http://localhost:8080/api/data  # purges varnish1 only
```

Result: varnish1 has fresh content, varnish2 has stale content.

## Distributed Cache Purging Solution

**Purge all Varnish instances with single endpoint:**
```bash
curl -X POST http://localhost:8082/purge-all/api/data
```

**Response:**
```json
{
  "message": "Purged api/data from all Varnish instances",
  "results": [
    {"instance": "varnish1:80", "status": 200, "success": true},
    {"instance": "varnish2:80", "status": 200, "success": true}
  ]
}
```

**How it works:**
- Express app receives `/purge-all` request
- Sends PURGE to both varnish1 and varnish2 directly
- Returns status for each instance
- Solves cache inconsistency problem

## AWS Equivalent

This mirrors: **ALB → CloudFront instances → ECS tasks**
