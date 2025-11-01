# Docker Compose Introduction

## What is Docker Compose?

Docker Compose runs multiple containers together as one application using a single YAML file.

## Why We Need It

Our cache workshop needs three services talking to each other:
- Node.js app
- Varnish cache  
- HAProxy load balancer

Instead of starting each container manually, Compose starts them all with networking configured.

## Key Benefits

* **One command** - `docker-compose up` starts everything
* **Automatic networking** - containers find each other by name
* **Easy cleanup** - `docker-compose down` removes everything

## Our Setup

Traffic flows: `HAProxy → Varnish → Node.js`

Each service gets its own container, but they work together as one caching system.
