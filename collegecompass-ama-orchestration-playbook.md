# CollegeCompass "Ask Me Anything" — Orchestration Playbook

**Goal:** Build an intelligent query layer that lets Claude decide, per question, whether to pull from MongoDB (structured facts), Pinecone (semantic/narrative content across multiple namespaces), or both — then synthesize a single grounded answer.

Hand this whole doc to Claude Code in VS Code and ask it to implement section by section.

---

## 0. Architecture Overview

```
User question
   │
   ▼
Express API endpoint (/api/ama)
   │
   ▼
Orchestrator (Claude with tool-use)
   │
   ├── decides which tool(s) to call
   │
   ├── query_mongo(filters)         → structured facts (SAT, tuition, acceptance rate, majors)
   ├── search_pinecone(namespace,q) → semantic/narrative content (essay advice, "what's X like")
   └── list_namespaces()            → lets Claude discover what's available if unsure
   │
   ▼
Claude synthesizes final answer, cites sources
   │
   ▼
Response returned to frontend (with source attribution)
```

Key principle: **Claude is the router.** Don't hand-build an intent classifier — give Claude well-described tools and let native tool-use decide what to call, including calling multiple tools in parallel when a question is mixed (e.g., "Is UCSD good for Cognitive Science, and what should I write about in my PIQ?").

---

## 1. Prerequisites / Inventory

Before writing orchestration code, have Claude Code do an audit:

1. List all Pinecone namespaces currently in use and what content type lives in each (essay guidance, school profiles, admissions strategy, etc.)
2. List MongoDB collections/fields relevant to structured queries (school stats, majors, CIP codes, etc.)
3. Confirm current embedding model used for Pinecone ingestion (needed so query-time embeddings match)

Output of this step: a short `data-inventory.md` mapping namespace/collection → content type → example query it answers.

---

## 2. Tag Your Pinecone Namespaces with Metadata

For each namespace, standardize metadata on every vector:

```json
{
  "content_type": "essay_guidance" | "school_profile" | "admissions_strategy" | "financial_aid",
  "school": "UC San Diego",
  "topic": "PIQ",
  "source_doc": "blog-post-uc-piq-strategy.md"
}
```

This turns namespace selection from "fuzzy guess" into a lookup Claude can reason over via the tool description (see Section 4).

---

## 3. Backend Tool Definitions (Express + Anthropic SDK)

Ask Claude Code to implement three tools as callable functions, then expose them to the Claude API via the `tools` parameter.

### 3.1 `query_mongo`
- Input: structured filters (school name(s), field(s) requested, numeric ranges)
- Output: small, filtered JSON — never dump full documents. Cap at ~10 records.

### 3.2 `search_pinecone`
- Input: `namespace` (or `namespaces: []`), `query` (natural language), `top_k` (default 3-5)
- Output: matched chunks + metadata (school, content_type, source_doc)
- Guardrail: cap total namespace fan-out to 2-3 per question to control latency/cost

### 3.3 `list_namespaces`
- Input: none
- Output: static or cached list of namespace → content_type mapping from Section 2
- Purpose: escape hatch when Claude isn't sure which namespace fits an ambiguous question

**Tool schema example (drop into VS Code Claude for exact implementation):**

```json
{
  "name": "search_pinecone",
  "description": "Search semantic/narrative content such as essay advice, admissions strategy, or 'what is X school like' style content. Use content_type and school metadata to pick the right namespace(s). Do NOT use for numeric facts like SAT ranges or tuition — use query_mongo for those.",
  "input_schema": {
    "type": "object",
    "properties": {
      "namespaces": { "type": "array", "items": { "type": "string" } },
      "query": { "type": "string" },
      "top_k": { "type": "integer", "default": 4 }
    },
    "required": ["namespaces", "query"]
  }
}
```

Have Claude Code write equivalent schemas for `query_mongo` and `list_namespaces`.

---

## 4. Orchestration Prompt (System Prompt for the Router)

Give the orchestrating Claude call a system prompt roughly like this — ask Claude Code to parameterize it with your actual namespace list:

```
You are the retrieval router for CollegeCompass. For each user question:
1. Decide whether it needs structured facts (query_mongo), narrative/semantic
   content (search_pinecone), or both.
2. If using search_pinecone, choose the 1-3 most relevant namespaces based on
   their content_type and school metadata — never search all namespaces.
3. If a question mixes structured and narrative needs, call both tools in the
   same turn.
4. If unsure which namespace applies, call list_namespaces first.
5. After receiving tool results, synthesize one grounded answer. Cite which
   source (school profile, blog post, Mongo record) backed each claim.
6. If retrieved data doesn't answer the question, say so plainly rather than
   guessing.
```

---

## 5. Express Endpoint Flow

Ask Claude Code to implement `/api/ama` with this flow:

1. Receive `{ question, conversationHistory? }`
2. Call Claude API with: system prompt (Section 4), tool definitions (Section 3), user question
3. Loop: if Claude returns `tool_use` blocks, execute corresponding backend function(s), return `tool_result` blocks, call Claude again — repeat until Claude returns a final text response
4. Return final answer + source list to frontend

This is a standard agentic tool-use loop — Claude Code will know the pattern from the Anthropic SDK docs, but explicitly ask it to implement the multi-turn loop, not a single-shot call, since Claude may need 2+ tool calls before synthesizing.

---

## 6. Guardrails & Cost Control

- **Fan-out cap:** max 2-3 Pinecone namespaces searched per question
- **Result size cap:** Mongo queries return ≤10 records; Pinecone returns top_k ≤5 per namespace
- **Caching:** cache common/repeated questions in-memory (you're already deferring Redis — fine for MVP)
- **Timeout/fallback:** if tool loop exceeds ~4 rounds without resolving, return a graceful "I don't have enough information" rather than looping indefinitely
- **Token budget:** truncate long Pinecone chunks before sending back to Claude as tool results

---

## 7. Source Attribution in the Response

Since this is a family-facing product, make answers trustworthy:
- Every synthesized answer should list which namespace(s)/collection(s) backed it
- If mixing sources, briefly note which claim came from where (e.g., "per UCSD's official profile data..." vs "based on our essay strategy guide...")

---

## 8. Testing Checklist

Have Claude Code build test cases across three question types:

| Type | Example | Expected routing |
|---|---|---|
| Structured only | "What's UCSD's average SAT range?" | query_mongo only |
| Semantic only | "How should I frame my PIQ if I'm in a new school's first graduating class?" | search_pinecone only |
| Mixed | "Is UCSD good for Cognitive Science, and what should my PIQ focus on?" | both, parallel |
| Ambiguous | "Tell me about UCSD" | list_namespaces → then targeted calls |

---

## 9. Build Order (Suggested Sequence for Claude Code)

1. Data inventory (Section 1)
2. Namespace metadata tagging pass (Section 2)
3. Implement the 3 backend tool functions (Section 3)
4. Wire up the Claude API tool-use loop in `/api/ama` (Section 5)
5. Add guardrails (Section 6)
6. Add source attribution to response formatting (Section 7)
7. Run test matrix (Section 8)
8. Add in-memory caching layer last, once correctness is confirmed
