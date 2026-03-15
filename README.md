# Multi-Chain Wallet Dashboard

Одностраничное приложение для просмотра балансов и транзакций кошелька в разных сетях.

## Что реализовано по ТЗ

- **Выбор сети** — список сетей из `GET /api/chains`, показываются название и нативная валюта.
- **Ввод адреса** — поле + кнопка «Показать баланс», базовая валидация EVM/Solana.
- **Портфолио** — нативный баланс с USD, таблица токенов, общая стоимость портфеля.
- **Транзакции** — последние 10 операций из `GET /api/transactions/:address`.
- **Форматирование чисел** — rawBalance + decimals, максимум 6 знаков, группировка, USD с 2 знаками.
- **UX состояния** — загрузка, ошибки, пустые списки (не падаем на пустом ответе).
- **RxJS** — `switchMap`, `combineLatest`, `shareReplay` для кеширования.
- **TypeScript strict** — строгий режим, типы для API и моделей.
- **Адаптивная вёрстка** — Tailwind + grid/overflow для мобильных.

## Запуск

### Backend
```bash
cd backend
yarn install
yarn dev
```

### Frontend
```bash
yarn install
yarn start
```

Приложение доступно на `http://localhost:4200`.

API URL настраивается в `src/environments/environment.ts`.

> Если в окружении включен immutable installs для Yarn, используйте:
> `YARN_ENABLE_IMMUTABLE_INSTALLS=0 yarn install`

## Ключевые решения и почему

- **Standalone + feature-based архитектура** — проще для небольшого Angular приложения и быстрее для чтения.
- **Разделение smart/dumb** внутри `features/wallet-dashboard` — UI переиспользуемый, логика в контейнере.
- **Standalone компоненты Angular 17** — меньше бойлерплейта, проще DI и тесты.
- **RxJS потоки**: `switchMap` + `combineLatest` для синхронного получения портфолио и транзакций, `shareReplay` для кеширования списка сетей.
- **Форматирование через `rawBalance + decimals`** — без потери точности, с ограничением до 6 знаков и группировкой больших чисел.
- **Ошибки и UX** — отдельные состояния loading/error/empty, без падения приложения.
- **Tailwind CSS** — быстрый responsive UI без лишних CSS файлов.

## Бонусы

- Кеширование списка сетей через `shareReplay`.
- Unit-тест сервиса `ChainService`.

## Структура проекта

```
src/
  app/
    core/
      api/            # api-client/...
      config/         # api/...
      utils/          # address/, format/
    features/
      wallet-dashboard/
        components/   # chain-select/, address-input/ ...
        services/     # chain/, portfolio/, transaction/
        models/       # chain/, portfolio/, transaction/
        wallet-dashboard.component.*
    shared/
      components/     # loader/
      pipes/          # usd/
  assets/             # статика
  environments/       # environment.ts
```

## Тесты

Есть unit-тест на `ChainService` (кеширование и запрос списка сетей).
```bash
yarn test
```

## Biome

```bash
yarn lint
yarn format
yarn check
```
