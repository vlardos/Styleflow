# StyleFlow — AI Fashion Store

A backend-driven fashion store prototype built with Next.js App Router. The core of the project is an AI stylist that handles natural language requests — finding products, building outfits, checking real-time weather, and placing mock orders — all through a single `/api/chat` endpoint powered by Groq (LLaMA 3.3 70B) with tool calling.

## Features

- **Conversational AI stylist** — natural language interface backed by a real LLM (Groq / LLaMA 3.3 70b)
- **Tool calling loop** — LLM decides which tools to invoke; results are fed back for a grounded final response
- **Intent-based routing** — search, outfit recommendation, weather-aware suggestions, order placement
- **Weather-aware outfits** — integrates Open-Meteo (no API key required) by city name or GPS coordinates
- **Product catalog** — JSON-based catalog with filtering by category, season, weather, style, and tags
- **Mock order flow** — validates items, calculates total, returns a structured order summary
- **Execution trace** — every response includes `toolCalls` showing exactly which tools were used and what they returned
- **Health endpoint** — `/api/health` for quick status checks in demos and CI

## Architecture

Request flow through `/api/chat`:

```
User message (+ optional GPS coords)
  │
  ▼
POST /api/chat
  │  Zod validation (ChatRequestSchema)
  ▼
ai.service → chatWithTools()
  │
  ├─ [Round 1] Groq LLM (llama-3.3-70b-versatile)
  │    tool_choice: auto
  │    Decides: which tools to call, with what args
  │
  ├─ Tool execution (lib/tools/index.ts)
  │    ├── get_products / search_products  → product.service
  │    ├── get_product_by_id              → product.service
  │    ├── get_weather / get_weather_by_coords → weather.service (Open-Meteo)
  │    └── create_order                  → order.service
  │
  └─ [Round 2] Groq LLM
       Receives tool results, generates final natural-language response
  │
  ▼
Response: { message, toolCalls, products }
```

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | Next.js 16 (App Router)             |
| Language         | TypeScript                          |
| LLM Provider     | Groq — LLaMA 3.3 70B Versatile      |
| Tool Calling     | Groq native function calling        |
| Weather API      | Open-Meteo (free, no key required)  |
| Validation       | Zod                                 |
| Data Layer       | JSON flat files (no database)       |
| Styling (UI)     | Tailwind CSS v4                     |

## API Endpoints

| Method | Path                        | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/api/health`               | Service status and environment check             |
| POST   | `/api/chat`                 | Main AI stylist endpoint (tool calling loop)     |
| GET    | `/api/products`             | Full product catalog                             |
| GET    | `/api/products/:id`         | Single product by ID                             |
| GET    | `/api/weather-fit?city=...` | Weather-based outfit suggestions by city         |
| POST   | `/api/recommend`            | Outfit recommendations with optional filters     |
| POST   | `/api/order`                | Place a mock order                               |

### POST /api/chat — request body

```json
{
  "message": "What should I wear today?",
  "coords": { "lat": 52.23, "lon": 21.01 }
}
```

`coords` is optional. When provided, the LLM uses GPS-based weather lookup instead of asking for a city.

### POST /api/chat — response

```json
{
  "message": "It's 12°C and overcast in Warsaw — the chunky knit sweater over slim-fit jeans works well today. Add the trench coat if you're heading out in the evening.",
  "products": [ { "id": "p2", "name": "Chunky Knit Sweater", "price": 79.99, "..." } ],
  "toolCalls": [
    {
      "tool": "get_weather_by_coords",
      "args": { "lat": 52.23, "lon": 21.01 },
      "result": { "city": "Warsaw", "temp": 12, "condition": "Overcast", "category": "cold" }
    },
    {
      "tool": "search_products",
      "args": { "query": "cold weather" },
      "result": [ "..." ]
    }
  ]
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
git clone https://github.com/your-username/styleflow.git
cd styleflow
npm install
cp .env.example .env.local
# Add your key to .env.local:
# GROQ_API_KEY=gsk_...
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Verify services are up:

```bash
curl http://localhost:3000/api/health
```

## Project Structure

```
app/
  api/
    chat/           # POST /api/chat — main AI entry point
    health/         # GET  /api/health — status check
    products/       # GET  /api/products (+ /[id])
    recommend/      # POST /api/recommend
    weather-fit/    # GET  /api/weather-fit
    order/          # POST /api/order
lib/
  services/
    ai.service.ts       # Groq client, tool calling loop (2-round LLM flow)
    product.service.ts  # Catalog queries: getAll, search, getById
    weather.service.ts  # Open-Meteo integration, city + coords
    order.service.ts    # Mock order creation and validation
  tools/
    index.ts            # Tool definitions (schema) + executeTool dispatcher
  schemas/
    chat.schema.ts      # Zod schema for /api/chat request body
  data/
    products.json       # Product catalog (flat JSON, no DB)
  utils/
    response.ts         # ok() / err() response helpers
```

## Demo Scenarios

Send these to `POST /api/chat` as the `message` field to see the full tool calling loop in action.

**Outfit recommendation with budget**
```
"Put together a casual spring outfit under $100"
```

**Weather-aware suggestion (city)**
```
"What should I wear today in Berlin?"
```

**Weather-aware suggestion (GPS coords)**
```json
{ "message": "What should I wear?", "coords": { "lat": 48.85, "lon": 2.35 } }
```

**Product search**
```
"Show me formal shirts"
```

**Style-based browsing**
```
"Do you have anything bohemian?"
```

**Place an order**
```
"Order p1 and p5 for Alex"
```

**General fashion help**
```
"How do I style a chunky knit sweater?"
```

Each response includes a `toolCalls` array showing the exact tool execution trace — useful for understanding how the LLM reasons through a request.
