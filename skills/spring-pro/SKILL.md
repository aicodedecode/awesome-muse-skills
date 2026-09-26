---
name: spring-pro
description: Spring Boot guidance — DI, data access, security, testing, and production-ready Java services.
category: development
---

## Overview

Spring Boot is the dominant Java framework for backend services: dependency injection, auto-configuration, and a vast ecosystem (Data, Security, Cloud, Batch) let teams build enterprise-grade services with relatively little boilerplate. Its opinions are strong but escape hatches exist everywhere. This skill covers building Spring Boot services correctly — bean design, data access with Spring Data, security configuration, and the operational details (profiles, actuators, graceful shutdown) that production demands.

## When to use

- Building a Java/Kotlin backend service or microservice.
- Structuring Spring Boot apps (layers, beans, configuration).
- Securing APIs with Spring Security (JWT, OAuth2).
- Tuning data access (JPA/Hibernate pitfalls, transactions).
- Preparing Spring Boot for production (profiles, observability, containers).
- Migrating Spring Boot across major versions.
- Choosing between Spring MVC and WebFlux.

## Core concepts

- **IoC and dependency injection.** The container wires `@Component`/`@Service`/`@Repository` beans; prefer constructor injection (final fields, testable, no reflection magic). Understand bean scopes — singleton is the default; request/session scopes exist for web contexts.
- **Auto-configuration.** Starters (`spring-boot-starter-web`, `-data-jpa`) configure sensible defaults. Override via `application.yml` and `@ConditionalOn*` beans; use `@ConfigurationProperties` with validation for typed config instead of scattered `@Value`.
- **Spring Data JPA.** Repositories give CRUD + derived queries (`findByEmail`) for free. Know the Hibernate underneath: lazy loading, the N+1 problem (`@EntityGraph` / fetch joins fix it), and why `OpenSessionInView` is usually better disabled.
- **Transactions.** `@Transactional` boundaries belong at the service layer. Remember: self-invocation bypasses proxies (no transaction applied), checked exceptions don't trigger rollback by default, and long transactions hold connections.
- **Spring Security.** Filter-chain based; modern config uses `SecurityFilterChain` beans, not `WebSecurityConfigurerAdapter` (removed). For APIs: stateless JWT or OAuth2 resource server; never roll your own password hashing (use the provided encoders).
- **Profiles and config.** `application-{profile}.yml` per environment; secrets from env vars or a secret store, never in the repo. Fail fast on missing required properties.
- **Actuator.** Production-ready endpoints (`/actuator/health`, `/metrics`, `/info`) — expose selectively, secure them, and wire health checks to your orchestrator.
- **MVC vs WebFlux.** MVC (Servlet, blocking) is the default and right for most apps; WebFlux (reactive, non-blocking) suits high-concurrency I/O with reactive data stores. Don't adopt WebFlux for "performance" without a reactive stack end-to-end — mixed blocking/reactive is the worst of both.
- **Validation.** Bean Validation (`@NotNull`, `@Size`) on DTOs with `@Valid` at the controller boundary; custom validators for domain rules; consistent error responses via `@ControllerAdvice`.
- **Scheduling and async.** `@Scheduled` for cron-like tasks (with a distributed lock like ShedLock in multi-instance deploys); `@Async` for fire-and-forget — with a properly sized thread pool, not the default unbounded one.

## Practical workflow

1. **Bootstrap.** Use Spring Initializr (or the CLI) with the starters you need; prefer Gradle or Maven wrapper committed to the repo; target an LTS Java version.
2. **Layer the app.** `controller` (HTTP only) → `service` (`@Transactional` business logic) → `repository` (data access); DTOs at the boundary, entities never leaked to clients.
   ```java
   @Service
   @RequiredArgsConstructor
   public class OrderService {
       private final OrderRepository orders;
       @Transactional
       public OrderDto placeOrder(PlaceOrderCommand cmd) { ... }
   }
   ```
3. **Configure data access.** Connection pool (HikariCP is default — size it: pool ≈ (2 × cores) + spindles for typical workloads), Flyway/Liquibase for migrations (never `ddl-auto: update` in prod), indexes for query patterns.
4. **Secure the API.** `SecurityFilterChain` with stateless sessions, JWT validation, method security (`@PreAuthorize`) for authorization, CORS locked to known origins.
   ```java
   @Bean
   SecurityFilterChain api(HttpSecurity http) throws Exception {
       return http.csrf(csrf -> csrf.disable())
           .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
           .authorizeHttpRequests(a -> a.requestMatchers("/actuator/health").permitAll()
               .anyRequest().authenticated())
           .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
           .build();
   }
   ```
5. **Test in slices.** `@WebMvcTest` for controllers, `@DataJpaTest` for repositories, Testcontainers for integration tests against real Postgres/Redis/Kafka — not mocks of infrastructure.
6. **Handle errors consistently.** `@ControllerAdvice` mapping domain exceptions to RFC 9457 problem-details responses; log with correlation IDs; never leak stack traces.
7. **Observe.** Micrometer metrics to Prometheus/Datadog, structured logging (logstash encoder), distributed tracing via OpenTelemetry; dashboards on golden signals per service.
8. **Ship.** Build a layered container image (Spring Boot's buildpacks or a multi-stage Dockerfile), enable graceful shutdown (`server.shutdown=graceful`), expose actuator health, and set JVM memory flags to respect container limits (`-XX:MaxRAMPercentage`).

   ```java
   @RestControllerAdvice
   public class ApiExceptionHandler {
       @ExceptionHandler(OrderNotFoundException.class)
       ProblemDetail handleNotFound(OrderNotFoundException ex) {
           ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
           pd.setTitle("Order not found");
           return pd;
       }
   }
   ```

## Common pitfalls

- **N+1 queries via lazy loading** — especially serialized to JSON; use entity graphs or DTO projections.
- **`@Transactional` self-invocation** — calling another `@Transactional` method on `this` skips the proxy; extract to another bean.
- **Field injection** — hides dependencies, breaks immutability, complicates tests; use constructor injection.
- **`ddl-auto: update` in production** — can drop or corrupt data; use Flyway/Liquibase migrations.
- **Exposing all actuator endpoints** — `/env` and `/heapdump` leak secrets; expose only health/info/metrics and secure them.
- **Ignoring graceful shutdown** — in-flight requests get killed on deploy; enable it and give the orchestrator a proper termination grace period.
- **Oversized Hikari pools** — more connections ≠ more throughput; oversized pools cause DB contention and latency spikes.
- **OpenSessionInView left on** — lazy loading during view rendering causing surprise queries; disable and fetch explicitly.
- **`@Async` with default executor** — unbounded thread creation under load; define a bounded `TaskExecutor`.
- **Catching exceptions inside `@Transactional`** — swallowing the exception that should trigger rollback; rethrow or mark rollback-only.
- **Blocking calls in WebFlux handlers** — one blocking call stalls the whole event loop; offload with `publishOn(Schedulers.boundedElastic())` or stay on MVC.
- **Fat `@Configuration` classes** — hundreds of bean definitions in one file; split configuration by domain like any other code.
