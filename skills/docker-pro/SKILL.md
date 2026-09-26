---
name: docker-pro
description: Docker guidance — Dockerfile best practices, multi-stage builds, Compose, networking, volumes, and image security.
category: development
---

## Overview

Docker packages applications and their dependencies into portable images that run identically anywhere the Docker runtime exists. Containers are the unit of deployment for modern infrastructure — understanding images, layers, networking, and volumes is prerequisite knowledge for Kubernetes, CI/CD, and cloud platforms.

The common failure mode is treating Dockerfiles as an afterthought: bloated images, leaked secrets, and containers that work on a laptop but die in production. This skill covers writing production-grade Dockerfiles, using Compose for local development, and the security and operational practices that matter.

## When to use

- Writing or reviewing Dockerfiles for any language.
- Shrinking image sizes and speeding up builds (multi-stage, layer caching).
- Setting up Docker Compose for local development environments.
- Debugging container networking, volumes, and permissions.
- Securing images (non-root users, secret handling, base image choice).
- Choosing between Docker, Podman, and other runtimes.
- Preparing images for Kubernetes or any orchestrator.

## Core concepts

- **Images are layered.** Each Dockerfile instruction creates a layer; layers cache and reuse. Order instructions from least-frequently-changed (base image, system deps) to most-frequently-changed (app code) to maximize cache hits.
- **Multi-stage builds.** Build in one stage (compilers, node_modules), copy artifacts into a slim runtime stage. This is the single biggest image-size win — a Go or Java build can drop from 1GB to 50MB.
- **Small base images.** `alpine`, `distroless`, or `-slim` variants over full OS images. Smaller images pull faster, have fewer CVEs, and reduce attack surface. Distroless goes further: no shell, no package manager.
- **`.dockerignore`.** Like `.gitignore` for the build context — exclude `.git`, `node_modules`, build artifacts, secrets. A bloated context slows every build and can leak files into images.
- **Run as non-root.** Create a user and `USER` it. Root-in-container is still root-adjacent on the host if there's a breakout; non-root is cheap defense in depth.
- **One process per container.** The container's PID 1 should be your app (use `exec` form `CMD` so signals propagate). Sidecars and init systems are orchestrator concerns, not image concerns.
- **Layer caching in CI.** Cache layers between builds (registry cache, BuildKit cache mounts) — `RUN --mount=type=cache` for package managers avoids re-downloading dependencies every build.
- **BuildKit.** The modern builder: parallel builds, cache mounts, secrets mounts (`--mount=type=secret`), SSH mounts. Enable it; the legacy builder is obsolete.
- **Secrets never in layers.** `COPY .env` or `ARG` secrets persist in image history. Use BuildKit secret mounts or multi-stage builds that don't copy secrets into the final stage.
- **Networking.** Bridge (default, isolated), host (no isolation, max perf), none, and user-defined networks for inter-container DNS. In Compose, services reach each other by service name automatically.
- **Volumes vs bind mounts.** Named volumes for persistent data (databases), bind mounts for development (live code reload). Volumes survive container recreation; container filesystems don't.
- **Healthchecks.** `HEALTHCHECK` instruction so orchestrators know when the app is actually ready — not just when the process started.
- **Compose for dev.** Multi-service local environments (app + db + cache) in one YAML file. Profiles, overrides, and `.env` support keep dev/prod parity without production complexity.
- **Image tagging.** Immutable tags per build (git SHA), mutable tags (`latest`) only for convenience. Deployments should reference immutable digests or SHA tags — `latest` in production is undebuggable.
- **Scanning.** Scan images for CVEs in CI (Trivy, Grype, Docker Scout). Base images accumulate vulnerabilities; rebuild regularly, don't just rescan old images.

## Practical workflow

1. **Write the Dockerfile in cache order.** Base image → system deps → language deps (lockfile first) → app code → runtime config. Each step ordered by change frequency.
   ```dockerfile
   FROM node:22-slim AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN --mount=type=cache,target=/root/.npm npm ci
   ```
2. **Use multi-stage builds.** Separate `build` and `runtime` stages; copy only artifacts forward; final stage minimal.
   ```dockerfile
   FROM deps AS build
   COPY . .
   RUN npm run build
   FROM node:22-slim AS runtime
   WORKDIR /app
   COPY --from=build /app/dist ./dist
   COPY --from=deps /app/node_modules ./node_modules
   RUN useradd -r app && chown -R app:app /app
   USER app
   CMD ["node", "dist/index.js"]
   ```
3. **Add `.dockerignore`.** Exclude `.git`, `node_modules`, `*.md`, local env files, and test artifacts — everything not needed at runtime.
4. **Handle secrets with mounts.** `RUN --mount=type=secret,id=npmrc npm ci` keeps tokens out of layers; never `COPY` credential files.
5. **Define healthchecks.** So orchestrators and Compose can gate on actual readiness:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
   ```
6. **Compose the dev environment.** App + dependencies in `compose.yaml`; named volumes for databases; bind mounts for code; override files for local tweaks.
   ```yaml
   services:
     app:
       build: .
       ports: ["3000:3000"]
       volumes: ["./src:/app/src"]
       depends_on: { db: { condition: service_healthy } }
     db:
       image: postgres:16
       volumes: ["pgdata:/var/lib/postgresql/data"]
   volumes: { pgdata: {} }
   ```
7. **Scan and tag in CI.** Build with BuildKit, scan with Trivy/Grype (fail on critical), tag with git SHA, push immutable tags.
8. **Run production-ready.** Resource limits, restart policies, log drivers with rotation, read-only filesystems where possible, and no `--privileged` without justification.

## Common pitfalls

- **Secrets in image layers** — `COPY .env` or `ARG` credentials persist in history; use secret mounts.
- **Running as root** — default user is root; create and use a non-root user.
- **Huge images** — full OS bases and build tools in the final stage; multi-stage + slim bases.
- **Cache-busting order** — `COPY .` before `npm ci` invalidates the dependency layer on every code change; copy lockfiles first.
- **Missing `.dockerignore`** — slow builds and leaked files; always define it.
- **Shell-form CMD** — `CMD npm start` wraps in sh, breaking signal propagation; use exec form `["npm", "start"]`.
- **No healthcheck** — orchestrator thinks the container is ready when the process merely started; define one.
- **`latest` in production** — undebuggable deploys; pin immutable tags or digests.
- **Unbounded logs** — json-file logs filling disks; configure log rotation.
- **Writable root filesystem** — unnecessary attack surface; `--read-only` with tmpfs for scratch space.
- **Ignoring scans** — CVEs accumulating in base images; scan in CI and rebuild regularly.
- **Bind mounts in production** — host-path coupling; use named volumes or object storage.
- **No resource limits** — one container starving the host; set memory/CPU limits.
