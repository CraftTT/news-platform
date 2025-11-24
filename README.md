# News Platform (Mobile + Web)

Комплексный проект: Expo React Native (mobile) + Next.js (web). MVP реализует новости, детали, избранное, веб‑вью, биометрию, пуши и работу с файлами.

## Установка зависимостей

- Установить зависимости для mobile:
  - `npm --prefix mobile install`
- Установить зависимости для web:
  - `npm --prefix web install`

## Запуск

- Mobile (Expo):
  - Dev сервер: `npm --prefix mobile run start`
  - iOS: `npm --prefix mobile run ios`
  - Android: `npm --prefix mobile run android`
  - Web: `npm --prefix mobile run web`

- Web (Next.js):
  - Dev: `npm --prefix web run dev`
  - Build: `npm --prefix web run build`
  - Prod: `npm --prefix web run start`

## Ключ NewsAPI

Мобильное приложение использует NewsAPI (`https://newsapi.org`). Ключ может быть задан:

- Через `mobile/app.json` → `expo.extra.NEWS_API_KEY`
- Либо через переменную окружения `NEWS_API_KEY`

Файл `mobile/src/shared/api/newsApi.ts` читает ключ так:

- `Constants.expoConfig?.extra?.NEWS_API_KEY`
- либо `process.env.NEWS_API_KEY`

Пример добавления в `app.json`:

```json
{
  "expo": {
    "extra": {
      "NEWS_API_KEY": "ваш_ключ"
    }
  }
}
```

## Пуш‑уведомления (Expo Notifications)

Кратко:

1. На старте инициализируем слушатели и запрашиваем разрешение: `mobile/App.tsx` → `initPushListeners()` + `requestPushPermissionAndToken()`.
2. Токен выводится в консоль (`Expo push token: ...`). Используйте его для отправки тестового пуша на `https://exp.host/--/api/v2/push/send`.
3. Обработчики:
   - При клике по пушу:
     - если `data.article` — откроется экран детали статьи;
     - иначе — откроется лента новостей.

Требования:

- Пуши корректно работают на реальном устройстве. В веб‑режиме пуши ограничены.
- Для EAS Build можно передавать `projectId` в `getExpoPushTokenAsync`.

## Биометрия (Expo Local Authentication)

Кратко:

1. Экран `Unlock` запрашивает биометрическую проверку.
2. Успешная проверка → `setAuthenticated(true)` и навигация на основную вкладку.
3. В `Settings` доступен `Logout`, который сбрасывает состояние и возвращает на `Unlock`.

Требования:

- Наличие биометрического датчика и настроенной биометрии на устройстве.
- В веб‑режиме биометрия недоступна.

## Архитектура

- FSD (Feature‑Sliced Design) упрощённая структура:
  - `app/` — навигация, стор, базовые слайсы.
  - `entities/` — доменные сущности (например, избранное, аутентификация).
  - `features/` — функциональные фичи.
  - `pages/` — экраны.
  - `shared/` — API, типы, утилиты, UI‑компоненты.
- Состояние:
  - Redux Toolkit (`configureStore`) + RTK Query (`newsApi`) для запросов к NewsAPI.
  - AsyncStorage для избранного.
  - Отдельный `auth` slice для биометрической аутентификации.

## Ошибки и пустые состояния

- Общие компоненты:
  - `ErrorState` — выводит сообщение об ошибке, с кнопкой «Повторить».
  - `EmptyState` — выводит заголовок и описание пустого состояния, опциональную кнопку.
- Используются на экранах лент и избранного.

## Тесты

- Jest для mobile:
  - Тесты для `favorites` и `auth` slices (редьюсеры и экшены).
  - Тесты для утилиты фильтрации новостей.
- Запуск: `npm --prefix mobile run test`.

## Code Style

- ESLint + Prettier:
  - Конфиги для mobile.
  - Скрипты `lint` и `format` в `package.json` (mobile и web).

## Полезные команды

- Линт мобильного проекта: `npm --prefix mobile run lint`
- Форматирование мобильного проекта: `npm --prefix mobile run format`
- Линт веб‑проекта: `npm --prefix web run lint`