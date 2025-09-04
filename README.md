# VSH25 Monorepo

В этом репозитории хранятся проекты VSH25. Сейчас подключено мобильное приложение (Expo React Native).

## Структура
```
apps/
└─ mobile/        # Мобильное приложение (Expo RN, Expo Go / EAS)
```

## Требования (локальная разработка)
- Node.js LTS (18/20)
- Git
- Android Studio + SDK + AVD (эмулятор)
- Expo CLI и EAS CLI:
```bash
npm i -g expo-cli eas-cli
```

## Быстрый старт (мобильное)
```bash
cd apps/mobile
npm install
npm run start:tunnel
```
Открой ссылку из консоли в Expo Go (эмулятор/устройство).

Если используете localhost, пробросьте порты:
```bash
adb reverse tcp:8081  tcp:8081
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001
```

## Скрипты (apps/mobile/package.json)
```json
{
  "scripts": {
    "start:tunnel": "expo start --tunnel",
    "start:local": "expo start --localhost",
    "android": "expo run:android",
    "eas:build:android": "eas build -p android --profile preview"
  }
}
```

## Сборка Android (через EAS)
Войти в Expo:
```bash
eas login
```
Инициализировать проект (один раз):
```bash
eas init
```
Запустить облачную сборку:
```bash
cd apps/mobile
npm run eas:build:android
```
При первом запуске выберите **Let EAS handle it** (или загрузите свой keystore).  
В `apps/mobile/app.json` должен быть уникальный пакет:
```json
"android": { "package": "net.vsh25.app" }
```

## Git-процесс (минимум)
- Основная ветка: `main`
- Фичи: `feat/<имя>`, багфиксы: `fix/<имя>`
- Пример: `feat(mobile): add OTP flow`

## Полезно
- `--tunnel` стабильно работает за NAT/VPN
- Если Expo Go пишет *Something went wrong* — очистите кэш приложения и перезапустите `expo start -c`
