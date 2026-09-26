---
name: llamaindex-pro
description: LlamaIndex guidance — data ingestion, indexing, query engines, agents, evaluation, and RAG optimization.
category: development
---

## Overview

LlamaIndex is the data framework for LLM applications: connectors that ingest your documents, indexes that structure them for retrieval, query engines that reason over them, and agents that act on them. Where LangChain is the general LLM app framework, LlamaIndex goes deep on the data side — ingestion, indexing strategies, and retrieval quality.

This skill covers the LlamaIndex workflow: loading and transforming documents, choosing index structures, building query engines and routers, adding agents, and evaluating retrieval quality.

## When to use

- Building RAG over documents, databases, or APIs.
- Ingesting messy real-world data (PDFs, wikis, tickets).
- Choosing index structures (vector, tree, keyword, knowledge graph).
- Composing query engines (routers, sub-question, multi-step).
- Evaluating retrieval and answer quality.
- Choosing between LlamaIndex and LangChain.

## Core concepts

- **Documents and nodes.** `Document` (source unit) → parsed into `Node` chunks (text + metadata + relationships). Node parsing (sentence splitters, semantic chunking, hierarchical nodes) determines retrieval granularity — the highest-leverage decision in RAG.
- **Readers/connectors (LlamaHub).** 300+ data loaders: PDFs, Notion, Slack, GitHub, databases, APIs. Ingestion is where real projects live or die — connector quality and metadata extraction matter more than the LLM.
- **VectorStoreIndex.** The default: embed nodes, store in a vector DB, top-k similarity retrieval. Simple, effective, and the baseline every fancier index must beat.
- **Index structures.** Beyond vectors: `SummaryIndex` (tree summarization for "summarize everything" queries), `KeywordTableIndex` (exact term matching), `KnowledgeGraphIndex` (entities/relationships for multi-hop reasoning), `DocumentSummaryIndex` (per-doc summaries + detail). Match the index to the question types.
- **Query engines.** `as_query_engine` wraps an index with response synthesis; composable: routers (route to the right index), sub-question engines (decompose complex queries), multi-step (sequential reasoning). The query engine is where retrieval becomes answers.
- **Retrievers.** Lower-level than query engines: `as_retriever(similarity_top_k=...)` returns nodes without synthesis — for custom pipelines, reranking, or evaluation of retrieval alone.
- **Node postprocessors.** Rerankers (Cohere, cross-encoders), metadata filters, `LongContextReorder` (put best chunks where the LLM attends most) — applied between retrieval and synthesis. Reranking is usually the cheapest quality win.
- **Metadata.** Filters (`where` on document metadata), `MetadataMode` for what's embedded vs shown to the LLM — metadata turns a flat chunk pile into a queryable corpus (filter by date, source, department before similarity).
- **Response modes.** `refine` (iterative per-chunk), `compact` (stuff as many as fit), `tree_summarize` (hierarchical) — how retrieved context becomes an answer. `compact` is the strong default.
- **Agents.** ReAct and function-calling agents over query-engine tools — the LLM decides which index/tool to consult. More flexible than fixed query engines, with the usual agent cost/control tradeoffs.
- **Workflows.** The newer event-driven orchestration for multi-step LLM processes — explicit control flow for complex pipelines, replacing ad-hoc chaining.
- **Evaluation.** `RagEvaluatorPack`: faithfulness (is the answer grounded?), relevancy, context relevancy — plus retrieval metrics (hit rate, MRR) on labeled query sets. Evaluate retrieval and generation separately.
- **Ingestion pipelines.** `IngestionPipeline` with transformations (chunking, embedding) and caching — incremental updates without reprocessing everything; document management (deduplication, versioning) for changing corpora.
- **Observability.** Callback handlers, LangSmith/Arize integrations — trace retrieval (which nodes? what scores?) and synthesis. Debugging RAG without retrieval visibility is guesswork.

## Practical workflow

1. **Ingest with metadata.** Load documents with rich metadata (source, date, section, access level); the metadata is as important as the text:
   ```python
   from llama_index.core import SimpleDirectoryReader
   docs = SimpleDirectoryReader("docs/", recursive=True).load_data()
   ```
2. **Parse nodes deliberately.** Sentence-window or semantic chunking with overlap; hierarchical nodes (small chunks pointing to parent context) for detail + context:
   ```python
   from llama_index.core.node_parser import SentenceSplitter
   splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
   nodes = splitter.get_nodes_from_documents(docs)
   ```
3. **Index simply first.** `VectorStoreIndex(nodes)` as the baseline; add fancier indexes only for question types the baseline fails.
4. **Add postprocessing.** Reranker on top-k retrieval; metadata filters for scoped queries; `LongContextReorder` before synthesis.
   ```python
   from llama_index.core.query_engine import RetrieverQueryEngine
   from llama_index.core.postprocessor import LLMRerank
   engine = index.as_query_engine(
       similarity_top_k=20,
       node_postprocessors=[LLMRerank(top_n=5)],
       response_mode="compact",
   )
   ```
5. **Compose for complexity.** Routers for multi-corpus, sub-question engines for compound queries — only after the single-engine baseline is measured.
6. **Evaluate both layers.** Retrieval metrics (did we fetch the right chunks?) and answer metrics (faithfulness, relevancy) on a labeled set; the evaluator pack automates the answer side.
7. **Pipeline the ingestion.** `IngestionPipeline` with caching for incremental updates; handle document changes (updated/deleted docs) explicitly.
8. **Observe and iterate.** Trace which nodes feed each answer; the usual fixes are chunking, metadata, and reranking — in that order.

## Common pitfalls

- **Bad chunking** — arbitrary splits or no overlap; semantic boundaries + hierarchical nodes.
- **No metadata** — unfilterable chunk pile; extract source/date/section at ingestion.
- **Evaluating only end-to-end** — can't tell retrieval from generation failures; measure separately.
- **Skipping the vector baseline** — complex indexes before proving they beat simple similarity.
- **No reranking** — top-k raw similarity; rerankers are the cheapest quality win.
- **Ignoring ingestion quality** — garbage PDFs in, garbage answers out; clean and validate sources.
- **Stale indexes** — documents updated, index not; ingestion pipelines with change handling.
- **Over-agents** — ReAct agents where a query engine suffices; cost and unpredictability.
- **No access control** — all chunks retrievable by everyone; metadata-based filtering for sensitive corpora.
- **Response mode default blindness** — wrong synthesis strategy for the question type; choose deliberately.
- **Unbounded context stuffing** — more chunks ≠ better answers; top-n discipline + reranking.
- **No observability** — which nodes answered?; trace retrieval from day one.
- **Framework confusion** — LlamaIndex vs LangChain as rivals; they're complementary (data depth vs app breadth), and they interoperate.
