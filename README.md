# Bitoracdn (NodeJS Version)

**Bitoracdn Node** is the first version of the Bitoracdn project — a learning-focused, open-source Content Delivery Network (CDN) built entirely with **Node.js and Express**.

The goal of this project is to deeply understand **how CDNs work under the hood** — by implementing caching, routing, rate limiting, geo-based edge distribution, and control-plane APIs step by step.

---

## Architecture Overview

````shell
User → Router → Edge Node(s) → Origin Server
````

- **Origin Server** → Serves original files  
- **Edge Servers** → Cache + serve content close to users  
- **Router** → Decides which edge to serve from  
- **Control API** → Manages purge, cache invalidation, and metrics  

---

## Project Goals

- Understand **edge caching** and **cache invalidation**
- Build **routing & geo-distribution** logic
- Implement **rate limiting** and **access control**
- Learn about **DNS resolution** and **reverse proxies**
- Explore **observability** with Prometheus and Grafana
- Practice **concurrency and scaling** in Node.js (cluster mode)

---

## Tech Stack

- **Node.js**, **Express.js**
- **Redis / FS caching**
- **Prometheus**, **Grafana**
- **Docker**, **Docker Compose**
- **MaxMind GeoLite2** (for location-based routing)

---

## Purpose

This version focuses on **learning the internals of CDN architecture** using NodeJS — a language you already know well — so the emphasis stays on *system design, not syntax*.

It sets the foundation for the second version:

[`bitoracdn-go`](https://github.com/kjxcodez/bitoracdn-go) — the Go-based rewrite focusing on concurrency and performance.

---

## License

MIT License © 2025 [Kapil Jangid](https://github.com/kjxcodez)

## Socials

![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/kjxcodez?style=social)