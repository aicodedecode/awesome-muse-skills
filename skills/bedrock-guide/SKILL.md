---
name: bedrock-guide
description: Build on AWS with Amazon Bedrock — managed foundation models, agents, knowledge bases, and guardrails.
category: ai-research
---

## Overview

Amazon Bedrock is AWS's managed service for foundation models: access models
from multiple providers (Anthropic, Meta, Mistral, Amazon's own, and others)
through a unified AWS API, with managed capabilities for agents, knowledge
bases (RAG), and guardrails — all inside your AWS account with IAM, VPC,
CloudWatch, and regional controls. The pitch is enterprise GenAI on AWS terms:
your data stays in your account boundary, access is IAM-governed, and billing
flows through AWS.

For AWS-centric organizations, Bedrock is usually the default starting point —
not necessarily because it's the best model API, but because it inherits your
existing security, compliance, networking, and procurement posture. The models
are good; the enterprise integration is the point.

The mental model: Bedrock brings foundation models into the AWS control plane.
Evaluate it as AWS infrastructure with model capabilities, not as a model lab
with AWS hosting.

## When to use

- AWS-centric organizations building GenAI features (leverage existing IAM,
  VPC, compliance).
- Applications needing data to stay within your AWS account/region boundary.
- Managed RAG via Knowledge Bases (OpenSearch/Aurora-backed retrieval without
  building it).
- Managed agents with action groups for AWS-integrated tool use.
- Guardrails for content filtering and PII redaction as a managed layer.
- Procurement through AWS (enterprise agreements, private pricing).

## Core concepts

- **Foundation models on Bedrock**: multiple providers' models behind one API
  (Converse API for chat). Model access must be enabled per region — check
  availability in your operating regions first.
- **Cross-region inference**: some models support routing across regions for
  throughput. Understand the data-residency implications for your compliance
  requirements.
- **Knowledge Bases**: managed RAG — connect S3/data sources, Bedrock handles
  chunking, embeddings, and retrieval against OpenSearch Serverless or Aurora.
  The fastest compliant RAG on AWS.
- **Agents for Bedrock**: managed agent orchestration with action groups (Lambda
  or OpenAPI-defined tools). Useful when your tools are already AWS-native.
- **Guardrails**: managed content filters, denied topics, PII redaction, and
  grounding checks. A policy layer independent of the model — configure per
  use case.
- **IAM and VPC**: model invocation governed by IAM policies; VPC endpoints
  keep traffic off the public internet. This is the enterprise control story —
  use it fully.
- **Provisioned Throughput**: reserved model capacity for latency/throughput
  guarantees. For production SLOs beyond on-demand variability.
- **Model evaluation**: managed eval jobs (automatic metrics + human workflows)
  for comparing models and prompts on your data.

## Practical workflow

1. **Confirm regional availability.** Check model availability in your required
   regions — Bedrock's catalog varies by region, and compliance may pin you to
   specific ones.
2. **Set up IAM properly.** Least-privilege policies for model invocation,
   scoped per application. Use VPC endpoints where network isolation matters.
3. **Benchmark candidate models.** Same eval set across Bedrock's model options
   via the Converse API. Include Amazon's own models — they're often
   cost-competitive.
4. **Build RAG with Knowledge Bases.** For document-grounded apps: connect data
   sources, configure chunking, evaluate retrieval quality before building agents
   on top.
5. **Configure guardrails per use case.** Content filters, PII handling, denied
   topics — tuned to the application's risk profile, not one-size-fits-all.
6. **Use agents where tools are AWS-native.** If actions are Lambda functions
   and APIs in your AWS environment, Bedrock Agents reduce integration work.
7. **Evaluate and monitor.** Run Bedrock eval jobs on model/prompt changes;
   monitor invocation metrics, guardrail interventions, and costs in CloudWatch.

Checklist for Bedrock production:
- Model availability confirmed in operating regions.
- IAM least-privilege; VPC endpoints where needed.
- Knowledge Base retrieval quality evaluated.
- Guardrails configured per use case.
- Provisioned throughput sized if SLOs require it.

## Common pitfalls

- **Region availability assumptions.** Designing around a model unavailable in
  your compliance-required region. Check first, always.
- **Cross-region inference vs. data residency.** Throughput routing across
  regions may violate data-residency requirements. Understand where data goes.
- **IAM over-permissioning.** Broad `bedrock:*` policies. Scope invocation
  permissions per application and model.
- **Knowledge Base as magic.** Expecting managed RAG to work without evaluating
  chunking and retrieval quality on your documents. Test retrieval first.
- **Guardrails as the only safety.** Managed filters help; they don't replace
  application-level validation, prompt design, and human oversight where needed.
- **On-demand for strict SLOs.** Shared on-demand capacity has variability.
  Provisioned throughput exists for guarantees — use it when SLOs demand.
- **Cost opacity.** Bedrock usage across many models/apps without tagging and
  attribution. Tag resources; monitor per-application spend.
- **Treating Bedrock as model-agnostic.** Models differ meaningfully; "we use
  Bedrock" isn't a model choice. Benchmark and choose deliberately.
