// ============================================================
//  PLAN DATA  — 26 weeks starting 2026-08-31
// ============================================================

const PLAN_START = new Date('2026-08-31'); // Monday

const PHASES = [
  { name: 'Типографика и вёрстка', weeks: 10, color: '#c4b5fd' },
  { name: 'Монтаж / DaVinci',       weeks: 6,  color: '#6ee7b7' },
  { name: 'Лендинги / Webflow',      weeks: 5,  color: '#fbbf24' },
  { name: 'After Effects',           weeks: 5,  color: '#f9a8d4' },
];

// Pre-built scheduled tasks per week (0-indexed)
// type: 'lecture' | 'mentor' | 'assignment' | 'custom'
// day: 0=Mon, 1=Tue, ..., 5=Sat, 6=Sun
const SCHEDULE = [
  // ── WEEK 1 (Sep 1) ──────────────────────────────────────
  { week:0, day:1, type:'lecture',    title:'Лекция: Правило внутреннего и внешнего',    meta:'Типографика и вёрстка · 36 мин' },
  { week:0, day:5, type:'lecture',    title:'Лекция: Модульность',                        meta:'Типографика и вёрстка · 15 мин' },
  { week:0, day:5, type:'assignment', title:'Задание: разобрать 1 рабочий макет',         meta:'Выписать 3 проблемы по вёрстке' },
  // ── WEEK 2 (Sep 8) ──────────────────────────────────────
  { week:1, day:1, type:'lecture',    title:'Лекция: Правило якорных объектов',           meta:'Типографика и вёрстка · 27 мин' },
  { week:1, day:3, type:'mentor',     title:'Сессия с ментором',                          meta:'~1 ч · Показать макет + вопросы' },
  { week:1, day:5, type:'lecture',    title:'Лекция: Формат и выбор полей',               meta:'Типографика и вёрстка · 15 мин' },
  { week:1, day:5, type:'assignment', title:'Подготовка к ментору: вопросы и материалы',  meta:'~2 ч' },
  // ── WEEK 3 (Sep 15) ─────────────────────────────────────
  { week:2, day:1, type:'lecture',    title:'Лекция: Эстетика таблички и маленьких форматов', meta:'Типографика и вёрстка · 7 мин' },
  { week:2, day:5, type:'lecture',    title:'Лекция: Контраст в вёрстке',                meta:'Типографика и вёрстка · 15 мин' },
  { week:2, day:5, type:'assignment', title:'Задание: 2 варианта контраста для поста',   meta:'Figma' },
  // ── WEEK 4 (Sep 22) ─────────────────────────────────────
  { week:3, day:1, type:'lecture',    title:'Лекция: Базовые геометрические примитивы',  meta:'Типографика и вёрстка · 15 мин' },
  { week:3, day:3, type:'mentor',     title:'Сессия с ментором',                          meta:'~1 ч' },
  { week:3, day:5, type:'lecture',    title:'Лекция: Выравнивание по вертикали / Смена ролей', meta:'Типографика и вёрстка · 22 мин' },
  { week:3, day:5, type:'assignment', title:'Подготовка к ментору: правки по заданию',   meta:'~2 ч' },
  // ── WEEK 5 (Sep 29) ─────────────────────────────────────
  { week:4, day:1, type:'lecture',    title:'Лекция: Базовый элемент: текст',            meta:'Типографика и вёрстка · 30 мин' },
  { week:4, day:5, type:'lecture',    title:'Шпаргалка: интерлиньяж, кернинг, трекинг', meta:'Типографика и вёрстка · 10 мин' },
  { week:4, day:5, type:'assignment', title:'Задание: типографический тест (2 варианта)', meta:'Figma · читабельный vs выразительный' },
  // ── WEEK 6 (Oct 6) ──────────────────────────────────────
  { week:5, day:1, type:'lecture',    title:'Лекция: Базовый элемент: заголовок',        meta:'Типографика и вёрстка · 12 мин' },
  { week:5, day:3, type:'mentor',     title:'Сессия с ментором',                          meta:'~1 ч' },
  { week:5, day:5, type:'lecture',    title:'Лекция: Базовый элемент: иллюстрация',      meta:'Типографика и вёрстка · 32 мин' },
  { week:5, day:5, type:'assignment', title:'Подготовка к ментору',                       meta:'~2 ч · Иерархия H1-H2-подпись' },
  // ── WEEK 7 (Oct 13) ─────────────────────────────────────
  { week:6, day:1, type:'lecture',    title:'Лекция: Базовый элемент: подпись / ссылка', meta:'Типографика и вёрстка · 43 мин' },
  { week:6, day:5, type:'lecture',    title:'Лекция: Элемент управления / Таблица',      meta:'Типографика и вёрстка · 29 мин' },
  { week:6, day:5, type:'assignment', title:'Задание: переработать заголовок в 1 кейсе', meta:'Figma · экспортировать PNG' },
  // ── WEEK 8 (Oct 20) ─────────────────────────────────────
  { week:7, day:1, type:'lecture',    title:'Лекция: Текстовые модули без иллюстраций',  meta:'Типографика и вёрстка · 23 мин' },
  { week:7, day:3, type:'mentor',     title:'Сессия с ментором',                          meta:'~1 ч' },
  { week:7, day:5, type:'lecture',    title:'Лекция: Модули с лентами / Текст+иллюстрация', meta:'Типографика и вёрстка · 32 мин' },
  { week:7, day:5, type:'assignment', title:'Подготовка к ментору',                       meta:'~2 ч · Модульная страница' },
  // ── WEEK 9 (Oct 27) ─────────────────────────────────────
  { week:8, day:1, type:'lecture',    title:'Лекция: Сетка / Мобильная и адаптивная вёрстка', meta:'Типографика и вёрстка · 49 мин' },
  { week:8, day:5, type:'lecture',    title:'Лекция: Шрифты — классификация, в тексте',  meta:'Типографика и вёрстка · 38 мин' },
  { week:8, day:5, type:'assignment', title:'Задание: подобрать шрифтовую пару для кейса', meta:'Figma' },
  // ── WEEK 10 (Nov 3) ─────────────────────────────────────
  { week:9, day:1, type:'lecture',    title:'Лекция: Стиль и настроение — Выразительность / Шрифт', meta:'Типографика и вёрстка · 48 мин' },
  { week:9, day:3, type:'mentor',     title:'Сессия с ментором',                          meta:'~1 ч · Итог фазы типографики' },
  { week:9, day:5, type:'lecture',    title:'Лекция: Сочетание шрифтов / Культурный поиск', meta:'Типографика и вёрстка · 42 мин' },
  { week:9, day:5, type:'assignment', title:'ИТОГ ФАЗЫ: Типографический редизайн кейса', meta:'Figma · Desktop + Mobile · описание' },
  // ── WEEK 11 (Nov 10) — Монтаж/DaVinci ──────────────────
  { week:10, day:1, type:'lecture',   title:'DaVinci: Интерфейс, основы, таймлайн',      meta:'Монтаж · Базовый курс Лекция 1' },
  { week:10, day:5, type:'lecture',   title:'DaVinci: Нарезка, трансформации, переходы', meta:'Монтаж · Базовый курс Лекция 2' },
  { week:10, day:5, type:'assignment',title:'Задание: смонтировать короткий ролик 30 сек',meta:'DaVinci Resolve' },
  { week:10, day:5, type:'assignment',title:'Задание: смонтировать 30-секундный ролик',   meta:'Из материалов агентства' },
  // ── WEEK 12 (Nov 17) ────────────────────────────────────
  { week:11, day:1, type:'lecture',   title:'DaVinci: Цветокоррекция — базовые ноды',    meta:'Монтаж · Углублённый курс' },
  { week:11, day:3, type:'mentor',    title:'Сессия с ментором',                          meta:'~1 ч · Промежуточный чекин' },
  { week:11, day:5, type:'lecture',   title:'DaVinci: Баланс белого, LUT, экспорт',      meta:'Монтаж · Углублённый курс' },
  { week:11, day:5, type:'assignment',title:'Подготовка к ментору / практика монтажа',   meta:'~2 ч' },
  // ── WEEK 13 (Nov 24) ────────────────────────────────────
  { week:12, day:1, type:'lecture',   title:'DaVinci: Работа со звуком, музыкой',        meta:'Монтаж · Углублённый курс' },
  { week:12, day:5, type:'lecture',   title:'DaVinci: Экспорт под разные платформы',     meta:'Монтаж · Финальная лекция' },
  { week:12, day:5, type:'assignment',title:'Задание: готовый ролик с цветокоррекцией',  meta:'MP4 + превью для портфолио' },
  // ── WEEK 14 (Dec 1) ─────────────────────────────────────
  { week:13, day:1, type:'lecture',   title:'DaVinci: Субтитры и текстовые элементы',    meta:'Монтаж · Практика' },
  { week:13, day:3, type:'mentor',    title:'Сессия с ментором',                          meta:'~1 ч · Итог монтажного блока' },
  { week:13, day:5, type:'assignment',title:'Подготовка к ментору / монтаж финализация', meta:'~2 ч' },
  { week:13, day:5, type:'lecture',   title:'DaVinci: Работа с шаблонами Fusion',        meta:'Монтаж · Бонусная практика' },
  // ── WEEK 15 (Dec 8) ─────────────────────────────────────
  { week:14, day:1, type:'lecture',   title:'DaVinci: Финальная практика и скорость',    meta:'Монтаж · Завершение блока' },
  { week:14, day:5, type:'assignment',title:'ИТОГ ФАЗЫ: Кейс «Монтаж» оформить в портфолио', meta:'Превью + описание + видео' },
  // ── WEEK 16 (Dec 15) ────────────────────────────────────
  { week:15, day:1, type:'lecture',   title:'DaVinci: Буфер — досмотреть / повторить',   meta:'Монтаж · Закрыть пробелы' },
  { week:15, day:3, type:'mentor',    title:'Сессия с ментором',                          meta:'~1 ч · Переход к лендингам' },
  { week:15, day:5, type:'assignment',title:'Подготовка к ментору',                       meta:'~2 ч' },
  // ── WEEK 17 (Dec 22) — Лендинги ─────────────────────────
  { week:16, day:1, type:'lecture',   title:'Лендинги: Обзор Webflow, структура сайта', meta:'Webflow University / курс' },
  { week:16, day:5, type:'lecture',   title:'Лендинги: Hero, Header, навигация',        meta:'Webflow · Урок 2' },
  { week:16, day:5, type:'assignment',title:'Задание: выбрать концепцию лендинга',       meta:'Figma набросок hero + структура' },
  // ── WEEK 18 (Dec 29) ────────────────────────────────────
  { week:17, day:1, type:'lecture',   title:'Лендинги: Figma → Webflow workflow',        meta:'Webflow · Урок 3' },
  { week:17, day:3, type:'mentor',    title:'Сессия с ментором',                          meta:'~1 ч · Новогодний чекин' },
  { week:17, day:5, type:'assignment',title:'Задание: макет Hero в Figma с ассетами',    meta:'Desktop + Mobile' },
  // ── WEEK 19 (Jan 5) ─────────────────────────────────────
  { week:18, day:1, type:'lecture',   title:'Лендинги: Адаптивность и сетки в Webflow',  meta:'Webflow · Урок 4' },
  { week:18, day:5, type:'lecture',   title:'Лендинги: Анимации и взаимодействия',       meta:'Webflow · Урок 5' },
  { week:18, day:5, type:'assignment',title:'Задание: верстать Hero + About в Webflow',  meta:'Рабочий прототип' },
  // ── WEEK 20 (Jan 12) ────────────────────────────────────
  { week:19, day:1, type:'lecture',   title:'Лендинги: CTA, формы, кнопки',              meta:'Webflow · Урок 6' },
  { week:19, day:3, type:'mentor',    title:'Сессия с ментором — последняя с ментором',  meta:'~1 ч · Финальная сессия' },
  { week:19, day:5, type:'lecture',   title:'Лендинги: SEO базовое, meta-теги, скорость', meta:'Webflow · Урок 7' },
  { week:19, day:5, type:'assignment',title:'Подготовка к ментору (итоговая)',            meta:'~2 ч' },
  // ── WEEK 21 (Jan 19) ────────────────────────────────────
  { week:20, day:1, type:'lecture',   title:'Лендинги: Публикация на Netlify / Webflow Hosting', meta:'Деплой' },
  { week:20, day:5, type:'assignment',title:'ИТОГ ФАЗЫ: Публикация лендинга + кейс',    meta:'Ссылка + описание + превью' },
  // ── WEEK 22 (Jan 26) — After Effects ────────────────────
  { week:21, day:1, type:'lecture',   title:'After Effects: Интерфейс, компоузинг, слои', meta:'AE · Урок 1' },
  { week:21, day:5, type:'lecture',   title:'After Effects: Ключевые кадры, easing',     meta:'AE · Урок 2' },
  { week:21, day:5, type:'assignment',title:'Задание: простая анимация текста + плашки', meta:'8-12 сек' },
  // ── WEEK 23 (Feb 2) ─────────────────────────────────────
  { week:22, day:1, type:'lecture',   title:'After Effects: Shape layers, masks, precomps', meta:'AE · Урок 3' },
  { week:22, day:5, type:'lecture',   title:'After Effects: Parenting, анимация иконок', meta:'AE · Урок 4' },
  { week:22, day:5, type:'assignment',title:'Задание: концепт нейровидео (1 сцена)',     meta:'20-30 сек' },
  // ── WEEK 24 (Feb 9) ─────────────────────────────────────
  { week:23, day:1, type:'lecture',   title:'After Effects: Динамическая типографика',   meta:'AE · Урок 5' },
  { week:23, day:5, type:'lecture',   title:'After Effects: Звук, экспорт для web/gif',  meta:'AE · Урок 6' },
  { week:23, day:5, type:'assignment',title:'Задание: финализировать нейровидео',        meta:'Экспорт mp4 + gif' },
  // ── WEEK 25 (Feb 16) ────────────────────────────────────
  { week:24, day:1, type:'lecture',   title:'After Effects: Оптимизация рендера',        meta:'AE · Практика' },
  { week:24, day:5, type:'assignment',title:'Портфолио: обновить все 3 кейса',           meta:'Описания + превью + видео' },
  // ── WEEK 26 (Feb 23) — Финал ────────────────────────────
  { week:25, day:1, type:'assignment',title:'Финализация портфолио: PDF + online',       meta:'Behance / личный сайт' },
  { week:25, day:3, type:'assignment',title:'Составить и отправить 5+ откликов',         meta:'Целевые бренды: Яндекс, Иви, МТС…' },
  { week:25, day:5, type:'assignment',title:'Подготовка к интервью: ответы на вопросы',  meta:'Mock-интервью' },
];

// Total schedulable tasks for progress calculation
const TOTAL_TASKS = SCHEDULE.length;
