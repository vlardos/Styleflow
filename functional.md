# 🧠 AI Fashion Store (StyleFlow)

## 📌 Overview

AI Fashion Store — это backend-driven приложение интернет-магазина одежды с AI-ассистентом.

Система умеет:

* анализировать пользовательские запросы
* определять intent (намерение)
* роутить запросы в нужный workflow
* использовать AI для рекомендаций
* подключать внешние API (например погоду)
* (опционально) использовать MCP как слой инструментов

Главная цель проекта — показать:

* backend архитектуру
* routing logic
* интеграции с API
* работу с LLM
* структурированный код

---

## 🚀 Features

### Core Features

* 📦 Каталог товаров (JSON)
* 🧠 AI-ассистент (`/api/chat`)
* 🔀 Intent-based routing
* 👕 Рекомендации одежды (outfit generator)
* 🌦 Подбор по погоде
* 🛒 Mock оформление заказа

### Advanced (если успеешь)

* 🔌 MCP integration
* 📊 Execution trace (логи шагов)
* 🧾 Structured responses

---

## 🏗 Architecture

### Общая схема

User → `/api/chat`
→ Router (определяет intent)
→ нужный сервис
→ (AI / API / MCP / data)
→ response

---

### Основные слои

#### 1. Routes

Отвечают за HTTP API

* `/api/chat`
* `/api/products`
* `/api/order`
* `/api/weather-fit`

---

#### 2. Services

* `router.service.ts` → определяет intent
* `product.service.ts` → работа с каталогом
* `ai.service.ts` → работа с LLM
* `weather.service.ts` → внешний API
* `order.service.ts` → mock заказы
* `mcp.service.ts` → MCP инструменты

---

#### 3. Data

* `products.json` — каталог товаров

---

#### 4. Schemas

* Zod схемы для валидации запросов

---

## 🧠 Intent Routing

Система анализирует текст пользователя и определяет intent:

### Supported intents

* `search_products`
* `recommend_outfit`
* `weather_outfit`
* `create_order`
* `general_fashion_help`

---

### Пример логики

| Запрос               | Intent           |
| -------------------- | ---------------- |
| "покажи куртки"      | search_products  |
| "подбери образ"      | recommend_outfit |
| "что надеть сегодня" | weather_outfit   |
| "оформи заказ"       | create_order     |

---

## 🔄 Request Flow (/api/chat)

1. Получение запроса пользователя
2. Определение intent
3. Роутинг:

   * поиск товаров
   * рекомендации
   * weather flow
   * заказ
4. Вызов нужных сервисов
5. (опционально) вызов AI
6. Возврат ответа

---

## 🌦 Weather Flow

Запрос:
"что надеть сегодня?"

Flow:

1. Получаем погоду через API
2. Определяем категорию (cold / warm / rainy)
3. Фильтруем товары
4. Генерируем объяснение через AI

---

## 👕 Recommendation Flow

Запрос:
"подбери образ до 150$"

Flow:

1. Парсим intent
2. Определяем фильтры (price, style)
3. Выбираем товары
4. AI объясняет выбор

---

## 🛒 Order Flow

Запрос:
"хочу заказать эти вещи"

Flow:

1. Проверка товаров
2. Подсчёт стоимости
3. Генерация orderId
4. Возврат summary

---

## 🔌 MCP Integration (optional)

Используется как tool layer:

Возможности:

* читать каталог товаров
* читать preferences
* подключать внешние источники

Цель:
показать tool-based архитектуру

---

## 📡 API Endpoints

### Health

GET /health

---

### Products

GET /api/products
GET /api/products/:id

---

### Chat

POST /api/chat

Body:

```json
{
  "message": "подбери образ на лето"
}
```

---

### Recommend

POST /api/recommend

---

### Weather Outfit

GET /api/weather-fit?city=Warsaw

---

### Order

POST /api/order

Body:

```json
{
  "items": ["p1", "p2"],
  "customerName": "Alex"
}
```

---

## 🧾 Response Format

```json
{
  "intent": "recommend_outfit",
  "message": "Я подобрал образ...",
  "products": [],
  "meta": {}
}
```

---

## 📁 Project Structure

```txt
src/
  routes/
  services/
  schemas/
  data/
  utils/
```

---

## 🗓 Development Plan

### Day 1

* setup backend
* products.json
* /api/products

---

### Day 2

* /api/chat
* router logic
* filtering

---

### Day 3

* AI integration
* weather API

---

### Day 4

* order flow
* polish
* README

---

## 🎯 Demo Scenarios

### 1. Outfit recommendation

"подбери стиль на весну"

---

### 2. Weather-based outfit

"что надеть сегодня?"

---

### 3. Order flow

"оформи заказ"

---

##  Out of Scope

* auth
* платежи
* база данных
* админка

---

##  Future Improvements

* полноценная база данных
* user profiles
* AI stylist memory
* advanced MCP tools
* UI dashboard
* analytics

---

##  Key Idea

Это не просто магазин.

Это:
 AI + routing + API orchestration backend
