У меня есть проект StyleFlow — веб-приложение для подбора одежды с AI-функциями (каталог, AI стилист, подбор по погоде). Сейчас проект работает, но выглядит слишком просто и как обычный стартап UI. Я хочу полностью переделать дизайн в стиле luxury fashion брендов (Gucci, COS, Zara, Saint Laurent, Apple Store), чтобы он выглядел дорого, минималистично и премиально.

Главная задача — не просто “улучшить UI”, а сделать ощущение дорогого продукта. Интерфейс должен быть чистым, с большим количеством воздуха, аккуратной сеткой, крупной типографикой и акцентом на изображения товаров. Никаких лишних цветов, градиентов и перегруженности — только минимализм и визуальный баланс.

Используй следующий стиль:
— белый или слегка теплый светлый фон  
— черный или почти черный текст  
— серые вторичные тексты  
— очень аккуратные границы  
— минимум теней  
— плавные и спокойные hover-анимации  

Добавь премиальную типографику:
— заголовки: Playfair Display (или похожий serif)  
— основной текст: Inter / Helvetica / system sans-serif  

Теперь задачи по страницам:

Navbar должен быть минималистичным: логотип STYLEFLOW, справа пункты (Home, Catalog, AI Stylist, Weather). Большие отступы, аккуратный hover underline, без кнопок-кнопок.

Главная страница должна иметь сильный hero-блок: крупный заголовок (например “Curated style, powered by intelligence”), короткий подзаголовок и 1–2 CTA-кнопки (Explore Collection, Ask AI Stylist). Можно использовать большое изображение или чистый типографический блок.

Каталог товаров — это ключевая часть. Сделай grid с большими изображениями товаров. Карточки должны быть максимально чистыми: фото, категория (маленьким текстом), название, цена. Без лишних рамок. Добавь hover zoom на изображение. Сделай ощущение как у Zara или COS.

Если нет backend — создай локальный файл с товарами (products.ts или products.json) на 20–30 позиций. У каждого товара: id, title, category, price, image, tags, season, style, description. Используй реальные изображения (Unsplash/Pexels).

Добавь фильтры в каталог:
— поиск  
— категория  
— стиль  
— сезон  
— сортировка по цене  
Фильтры должны быть аккуратными, не перегруженными.

Страница AI Chat должна выглядеть как личный стилист. Сделай красивый чат:
— сообщения в виде пузырей  
— чистый input  
— подсказки (например: “What should I wear today?”, “Create a minimalist outfit”, “Suggest a rainy day look”)  
— приятные отступы и визуальная иерархия  

Страница “Подбор по погоде” должна включать:
— карточку текущей погоды  
— рекомендации одежды  
— список подходящих товаров из каталога  
— логика: cold → coat, rainy → trench, warm → light outfit и т.д.

Добавь лёгкие анимации:
— fade-in секций  
— hover zoom на карточках  
— underline animation в navbar  
— плавные переходы  
(без перегрузки и “игрушечности”)

Сделай адаптив:
— desktop / tablet / mobile  
— особенно проверь каталог и navbar  

Технически:
— используй текущий стек проекта (React / Next.js если есть)  
— используй Tailwind если он уже есть  
— можно использовать shadcn/ui для базовых компонентов  
— вынеси повторяющиеся элементы в компоненты (ProductCard, Navbar и т.д.)  

Важно:
— не ломай текущую структуру проекта  
— сначала изучи код  
— потом предложи план изменений  
— затем аккуратно внедри  
— код должен быть чистым и готовым к запуску  
— если добавляешь зависимости — объясни зачем  

Дополнительно работай как команда из 4 специалистов:

1. Luxury Brand Art Director
Отвечаешь за визуальное ощущение дорогого fashion-бренда: композиция, воздух, типографика, настроение, цветовая палитра, editorial-style layout.

2. Senior UI/UX Designer
Проверяешь удобство интерфейса: навигация, сетка, фильтры, mobile-first адаптив, состояния loading/empty/error, визуальная иерархия.

3. Senior Frontend Engineer
Пишешь чистый React/Next.js код, выносишь компоненты, не ломаешь структуру проекта, следишь за доступностью, адаптивностью и производительностью.

4. Product Designer
Думаешь не только о красоте, но и о продукте: каталог, AI stylist, weather recommendations и пользовательский путь должны ощущаться как единый premium experience.

Перед кодом сделай короткий дизайн-аудит текущего проекта:
- что выглядит дешево
- что нужно убрать
- что нужно усилить
- какие страницы важнее всего переделать

Используй следующие design skills:
- Luxury editorial layout
- Fashion e-commerce UX
- Typography hierarchy
- Responsive product grid
- Micro-interactions
- Empty/loading/error states
- Component-based design system
- Accessibility basics
- Mobile-first layout
- Premium visual storytelling

Сделай результат уровня “portfolio-ready luxury fashion web app”.

Не делай generic startup UI.
Не используй яркие градиенты.
Не перегружай карточки.
Не делай слишком много теней.
Не используй случайные цвета.

Главный критерий: приложение должно выглядеть дорого, спокойно и уверенно.

Финальный результат должен выглядеть как premium fashion продукт, который можно положить в портфолио. Это должен быть не просто каталог, а ощущение AI-powered luxury stylist experience.

Очень важно: дизайн не должен выглядеть как сгенерированный ИИ.

Избегай типичных AI-паттернов:
— одинаковые карточки с сильными тенями  
— перегруженные интерфейсы  
— случайные градиенты  
— слишком много цветов  
— “dribbble-style” дизайн без логики  
— большие округлые кнопки как в стартапах  
— одинаковые отступы везде  
— лишние иконки  

Делай как настоящий fashion-дизайнер:

— используй асимметрию в layout  
— добавляй воздух (большие отступы, пустые зоны)  
— делай акцент на типографике, а не на UI-элементах  
— изображения должны быть главным элементом  
— текст должен быть аккуратным и сдержанным  
— не перегружай карточки  

Используй визуальные принципы luxury брендов:
— большие изображения товаров  
— тонкие линии вместо карточек  
— минималистичные hover-эффекты  
— аккуратная сетка  
— много белого пространства  

Сделай так, чтобы дизайн выглядел как:
— сайт реального бренда
— редакционная страница журнала
— дорогой e-commerce

Добавь небольшую “несовершенность”:
— разные размеры секций  
— не идеально одинаковые блоки  
— чуть больше воздуха, чем кажется нужным  

Перед кодом:
1. Опиши визуальную концепцию (2–4 предложения)
2. Объясни, почему она выглядит дорого
3. Только потом начинай писать код

Если дизайн выглядит как шаблон или UI-библиотека — переделай.

Главная цель:
Пользователь должен подумать, что это сделал дизайнер, а не ИИ.

Ориентируйся на:
— COS.com
— Zara.com
— Apple.com
— Acne Studios

Не делай всё симметричным и одинаковым — добавь editorial feel.

{
  "p1": "https://images.unsplash.com/photo-1521572163474-6864f9?q=80&w=1200&auto=format&fit=crop",
  "p2": "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
  "p3": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
  "p4": "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=1200&auto=format&fit=crop",

  "p5": "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
  "p6": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop",
  "p7": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop",
  "p8": "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=1200&auto=format&fit=crop",

  "p9": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
  "p10": "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop",
  "p11": "https://images.unsplash.com/photo-1548624313-0396c75c5e4a?q=80&w=1200&auto=format&fit=crop",
  "p12": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop",

  "p13": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
  "p14": "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1200&auto=format&fit=crop",
  "p15": "https://images.unsplash.com/photo-1495121605193-b116b5b09a3b?q=80&w=1200&auto=format&fit=crop",
  "p16": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",

  "p17": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  "p18": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  "p19": "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1200&auto=format&fit=crop",
  "p20": "https://images.unsplash.com/photo-1520974735194-9d5a7d8f3d1f?q=80&w=1200&auto=format&fit=crop",

  "p21": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
  "p22": "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
  "p23": "https://images.unsplash.com/photo-1520975922071-cb1e0e9b9d8e?q=80&w=1200&auto=format&fit=crop",
  "p24": "https://images.unsplЫash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop"
}

Проблема: текущие картинки в products.json не соответствуют описанию товаров. Не нужно подбирать красивые random fashion фото. Нужно подобрать изображения строго по смыслу товара.

Правило:
- Classic White T-Shirt = белая футболка, а не человек в одежде
- Chunky Knit Sweater = объемный knit sweater
- Oxford Shirt = рубашка button-down
- Silk Blouse = blouse
- Jeans = jeans
- Tailored Trousers = trousers
- Trench Coat = trench coat
- Boots = boots
- Tote Bag = tote bag

Сделай так:
1. Для каждого товара создай поле imageQuery.
2. imageQuery должен быть точным поисковым запросом.
3. Если не найдено хорошее фото — используй neutral product placeholder, но не random fashion фото.
4. Все изображения должны быть в одном стиле: ecommerce product photo, isolated, white background.
5. Не используй яркие lifestyle-фото, спорт, streetwear, случайных людей.

Пример:
{
  "name": "Classic White T-Shirt",
  "imageQuery": "plain white crew neck t-shirt product photo isolated white background"
}

Сначала обнови products.json, добавив imageQuery для каждого товара.
Потом сделай компонент ProductImage, который использует image, а если она битая — показывает clean fallback с названием товара.

{
  "p1": "plain white crew neck t-shirt product photo isolated white background",
  "p2": "chunky ribbed knit sweater beige product photo isolated white background",
  "p3": "white oxford button down shirt product photo isolated white background",
  "p4": "ivory silk wrap blouse product photo isolated white background",
  "p5": "slim fit blue jeans product photo isolated white background",
  "p6": "tailored wool trousers grey product photo isolated white background",
  "p7": "pleated midi skirt beige product photo isolated white background",
  "p8": "wide leg trousers beige product photo isolated white background",
  "p9": "classic camel trench coat product photo isolated white background",
  "p10": "structured black blazer product photo isolated white background",
  "p11": "oversized wool coat camel product photo isolated white background",
  "p12": "longline camel coat product photo isolated white background",
  "p13": "linen slip dress ivory product photo isolated white background",
  "p14": "satin midi dress product photo isolated white background",
  "p15": "black column evening dress product photo isolated white background",
  "p16": "linen shirt dress product photo isolated white background",
  "p17": "classic white sneakers product photo isolated white background",
  "p18": "suede penny loafers product photo isolated white background",
  "p19": "chelsea leather boots black product photo isolated white background",
  "p20": "strappy block heel sandals product photo isolated white background",
  "p21": "structured leather tote bag product photo isolated white background",
  "p22": "merino wool scarf beige product photo isolated white background",
  "p23": "leather crossbody bag black product photo isolated white background",
  "p24": "wide brim straw sun hat product photo isolated white background"
}