# Web Application Caching Workshop

## Executive Summary

This workshop explores modern web application caching strategies through hands-on implementation with CloudFront, HAProxy, Varnish, and Node.js Express. We build a practical understanding of cache layers, invalidation strategies, and performance optimization patterns used in production systems.

**Current Architecture:** HAProxy → 2 Varnish instances → 3 Node.js apps with distributed cache purging

## Learning Objectives

* ✅ Understand the caching hierarchy: browser → CDN → reverse proxy → application cache
* ✅ Implement cache headers and invalidation strategies
* ⏳ Configure CloudFront for global content delivery
* ✅ Set up HAProxy for load balancing with cache-aware routing
* ✅ Deploy Varnish for high-performance HTTP acceleration
* ✅ Build cache-friendly Express.js APIs with proper headers

## Technology Stack

### CloudFront (CDN Layer) - Coming Next
* Global edge locations for static and dynamic content
* Cache behaviors and TTL configuration
* Origin request policies and cache key customization

### HAProxy (Load Balancer) - ✅ Implemented
* Layer 7 routing with cache considerations
* Health checks and failover strategies
* Load balancing across multiple Varnish instances

### Varnish (HTTP Accelerator) - ✅ Implemented
* VCL (Varnish Configuration Language) for custom logic
* Round-robin load balancing across backend applications
* Distributed cache purging strategies

### Node.js Express (Application Layer) - ✅ Implemented
* Cache-Control headers and ETag generation
* Distributed cache invalidation endpoints
* API response optimization with server identification

### Redis (Application Cache) - Next Implementation
* Cache-aside pattern for external API responses
* Session storage and computed result caching
* Integration with ElastiCache for production deployment

## Workshop Structure

### Phase 1: Fundamentals - ✅ Complete
- [x] Cache theory and HTTP headers deep dive
- [x] Browser caching behavior and developer tools
- [x] Cache invalidation patterns and trade-offs

### Phase 2: Reverse Proxy Layer - ✅ Complete
- [x] HAProxy configuration for load balancing across Varnish instances
- [x] Varnish setup with custom VCL rules and round-robin backends
- [x] Distributed cache purging across multiple Varnish instances
- [x] Performance testing and cache behavior observation

### Phase 3: Application Integration - ⏳ In Progress
- [x] Express server with intelligent cache headers
- [ ] Redis caching layer implementation
- [ ] End-to-end cache strategy validation

### Phase 4: CDN Implementation - 🔜 Upcoming
- [ ] CloudFront distribution setup and configuration
- [ ] Origin behaviors and cache policies
- [ ] Real-time monitoring and cache hit ratios

## Current Implementation

```bash
# Start complete architecture
docker-compose up -d

# Test through HAProxy (entry point)
curl http://localhost:8082/api/data

# Distributed cache purging
curl -X POST http://localhost:8082/purge-all/api/data
```

## Key Concepts Mastered

* **Cache Hierarchy**: Multi-layer caching with HAProxy → Varnish → Express
* **TTL Strategies**: Different expiration policies for different content types
* **Distributed Cache Invalidation**: Coordinated purging across multiple cache instances
* **Cache Fragmentation**: Independent cache states across multiple instances
* **Load Balancing**: Traffic distribution while maintaining cache efficiency

## Documentation

See [docs/README.md](./docs/README.md) for comprehensive guides covering:
- Docker Compose fundamentals
- CDN cache behavior analysis
- Varnish setup and configuration
- Load balancing strategies
- Cache purging techniques

*Documentation is actively being built out as we implement each component.*

## Success Metrics Achieved

* ✅ Implement distributed cache invalidation
* ✅ Demonstrate cache warming strategies across multiple instances
* ✅ Achieve observable cache hit/miss patterns
* ✅ Build production-ready caching patterns

## Next Steps

1. **Redis Integration** - Add application-level caching for external API responses
2. **CloudFront Deployment** - Implement real CDN with geographic distribution
3. **Performance Benchmarking** - Measure cache effectiveness across the full stack

---

*This workshop emphasizes production-ready patterns over academic theory. Each implementation includes monitoring, debugging, and optimization techniques used in high-traffic applications.*
