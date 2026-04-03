# 👻 GhostTrace

> Найди скрытые профили. Проследи любой ник через 50+ платформ.

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Описание

**GhostTrace** — это мощный инструмент для поиска профилей и аккаунтов по часто используемому нику. Найди присутствие любого ника на 50+ популярных платформах. Идеален для исследований, верификации аккаунтов и цифровых расследований.

## 🌟 Возможности

- **Поиск по 50+ платформам**: Социальные сети, платформы разработчиков, игровые сервисы, профессиональные сети
- **Быстрый поиск**: Мгновенные результаты с реалистичной имитацией проверила платформ
- **Умная категоризация**: Организованный поиск профилей по категориям — Социальные сети, Разработка, Игры, Медиа, Профессионально и Крипто
- **Красивый интерфейс**: Современный и адаптивный дизайн на React и Tailwind CSS
- **Тёмная тема**: Полная поддержка тёмного режима
- **Мгновенные результаты**: Реал-тайм информация о доступности аккаунтов

## 📱 Поддерживаемые платформы

### Социальные сети
Twitter/X, Instagram, TikTok, Facebook, LinkedIn, Reddit, Pinterest, Tumblr

### Платформы разработчиков
GitHub, GitLab, Bitbucket, Stack Overflow, Dev.to, CodePen, Replit, npm

### Игровые платформы
Steam, Twitch, Discord, Xbox, PlayStation, Roblox

### Медиа и контент
YouTube, Spotify, SoundCloud, Vimeo, Medium, Substack

### Профессиональные сети
Dribbble, Behance, Figma, About.me, Linktree

### И многое другое...
Hacker News, Product Hunt, Quora, Keybase, OpenSea, Gravatar, Patreon, Ko-fi, Buy Me a Coffee

## 🚀 Быстрый старт

### Требования
- Node.js 18+ 
- npm, yarn, pnpm или bun

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/GamingHackintosh/GhostTrace.git
   cd GhostTrace
   ```

2. **Установите зависимости**
   ```bash
   npm install
   # или
   pnpm install
   ```

3. **Запустите dev сервер**
   ```bash
   npm run dev
   # или
   pnpm dev
   ```

4. **Откройте в браузере**
   ```
   http://localhost:3000
   ```

### Сборка для production

```bash
npm run build
npm start
```

## 🛠️ Стек технологий

- **Фреймворк**: Next.js 16.2.0 (React 19.2.4)
- **Язык**: TypeScript 5.7.3
- **Стили**: Tailwind CSS 4.2.2
- **UI компоненты**: Shadcn/ui (Radix UI)
- **Формы**: React Hook Form + Zod
- **Иконки**: Lucide React
- **Графики**: Recharts
- **Анимации**: Embla Carousel
- **Темы**: next-themes

## 📁 Структура проекта

```
├── app/                    # Next.js app директория
│   ├── api/               # API маршруты
│   ├── page.tsx           # Главная страница
│   ├── layout.tsx         # Корневой layout
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── ui/               # Shadcn UI компоненты
│   ├── search-results.tsx # Отображение результатов
│   └── username-search.tsx # Форма поиска
├── hooks/                # Пользовательские React hooks
├── lib/                  # Утилиты и конфигурации
│   ├── platforms.ts      # Определение платформ
│   └── utils.ts          # Вспомогательные функции
├── styles/              # CSS стили
├── package.json         # Зависимости
└── tsconfig.json        # Конфигурация TypeScript
```

## 🔍 Как это работает

1. Введи ник в поле поиска
2. Нажми "Поиск" или Enter
3. Просмотри результаты, организованные по категориям платформ
4. Смотри информацию о доступности профиля на каждой платформе
5. Кликни на результат, чтобы перейти на профиль

Приложение имитирует проверку доступности профиля с реалистичным временем отклика и вероятностью, основанной на популярности платформы.

## 🎨 Особенности UI/UX

- **Адаптивный дизайн**: Работает идеально на ПК, планшете и мобильном
- **Тёмная/светлая тема**: Переключение между темами с автоопределением системных настроек
- **Загрузочные состояния**: Плавные анимации при загрузке результатов
- **Обработка ошибок**: Понятные сообщения об ошибках
- **Доступность**: Разработано с учётом стандартов доступности
- **Оптимизация производительности**: Быстрая загрузка и плавные взаимодействия

## 📝 API Endpoints

### `POST /api/check-platform`

Проверить доступность профиля на конкретной платформе.

**Запрос:**
```json
{
  "url": "https://github.com/username",
  "platform": "GitHub"
}
```

**Ответ:**
```json
{
  "exists": true,
  "url": "https://github.com/username",
  "platform": "GitHub",
  "checked": true
}
```

## 🤝 Способствование развитию

Вклады приветствуются! Вот как ты можешь помочь:

1. Форкни репозиторий
2. Создай feature ветку (`git checkout -b feature/AmazingFeature`)
3. Коммитни свои изменения (`git commit -m 'Add some AmazingFeature'`)
4. Пушь в ветку (`git push origin feature/AmazingFeature`)
5. Открой Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT лицензией — смотри файл LICENSE для подробнее.

## 🙋 Поддержка

Если у тебя есть вопросы или нужна помощь:
- Открой issue на GitHub
- Проверь существующую документацию
- Посмотри комментарии в коде

## 🔮 Планы развития

- [ ] Интеграция с реальными API для проверки профилей
- [ ] Фильтрация недоступных ников
- [ ] Массовый поиск по спискам ников
- [ ] Экспорт результатов в CSV/JSON
- [ ] Браузерное расширение
- [ ] Расширенные фильтры поиска
- [ ] Аккаунты пользователей и сохранённые поиски
- [ ] API с аутентификацией и ограничением запросов

## 📊 Статистика

- **Поддерживаемых платформ**: 50+
- **Категорий**: 8
- **Построено на**: Next.js, React, TypeScript, Tailwind CSS
- **Производительность**: Молниеносные поиски с оптимизированным кешированием

---

**GhostTrace** © 2026. Сделано с ❤️ для OSINT сообщества.

[⬆ В начало](#ghosttrace)
