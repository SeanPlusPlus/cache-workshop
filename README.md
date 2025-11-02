# Web Application Caching Workshop

## Overview

This is a weekend hack tutorial built with Amazon Q to develop a solid mental model for production caching strategies from first principles. Through hands-on implementation with HAProxy, Varnish, Redis, and Node.js Express, we explore the complete caching hierarchy used in modern web applications.

Starting with basic HTTP cache headers and building up to coordinated multi-layer invalidation, this workshop emphasizes practical understanding over academic theory. Each component demonstrates real-world patterns and challenges encountered in high-traffic production systems.

**Current Architecture:** HAProxy → 2 Varnish instances → 3 Node.js apps → Redis → External APIs

## Learning Objectives

* ✅ Understand the caching hierarchy: browser → CDN → reverse proxy → application cache
* ✅ Implement cache headers and invalidation strategies
* ✅ Set up HAProxy for load balancing with cache-aware routing
* ✅ Deploy Varnish for high-performance HTTP acceleration
* ✅ Build cache-friendly Express.js APIs with proper headers
* ✅ Implement Redis application caching with external API integration

## Technology Stack

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

### Redis (Application Cache) - ✅ Implemented
* Cache-aside pattern for external API responses
* Coordinated cache invalidation across multiple layers
* Production-ready caching patterns with ElastiCache compatibility

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

### Phase 3: Application Integration - ✅ Complete
- [x] Express server with intelligent cache headers
- [x] Redis caching layer implementation
- [x] Multi-layer cache coordination and invalidation
- [x] End-to-end cache strategy validation

## Current Implementation

```bash
# Start complete architecture
docker-compose up -d

# Test multi-layer caching
curl http://localhost:8082/api/widgets

# Coordinated cache purging
curl -X POST http://localhost:8082/purge-everything/api/widgets
```

## Key Concepts Mastered

* **Complete Cache Hierarchy**: HAProxy → Varnish → Express → Redis → External APIs
* **Multi-layer Cache Coordination**: Managing Varnish HTTP cache + Redis application cache
* **Cache-Aside Pattern**: External API integration with intelligent caching
* **Distributed Cache Invalidation**: Coordinated purging across all cache layers
* **Production-Ready Patterns**: Real-world caching challenges and solutions
* **Performance Optimization**: 200ms external calls → 5ms Redis lookups

## Documentation

See [docs/README.md](./docs/README.md) for comprehensive guides covering:
- Docker Compose fundamentals
- CDN cache behavior analysis (theoretical)
- Varnish setup and configuration
- Load balancing strategies
- Cache purging techniques
- Redis application caching patterns

*Complete documentation covers all implemented components and real-world caching challenges.*

## Success Metrics Achieved

* ✅ Implement complete multi-layer caching architecture
* ✅ Demonstrate coordinated cache invalidation across all layers
* ✅ Achieve observable cache hit/miss patterns at each layer
* ✅ Build production-ready caching patterns with external API integration
* ✅ Understand and solve multi-layer cache complexity

## CloudFront Considerations

While not implemented in this workshop, we explored CloudFront concepts theoretically:
- Global edge locations and geographic distribution
- Cache behaviors and TTL configuration
- How CDN patterns mirror the Varnish layer we built

The local architecture demonstrates all core CDN concepts without requiring AWS deployment.

---

*This workshop emphasizes production-ready patterns over academic theory. Each implementation includes monitoring, debugging, and optimization techniques used in high-traffic applications. The complete caching stack provides a solid foundation for understanding enterprise-scale web application performance optimization.*
