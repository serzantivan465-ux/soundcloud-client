# SoundCloud Client — Project Brief

## Что за проект

Мобильное приложение для iOS (минимум iOS 12.0, целевое устройство iPod Touch 6) — альтернативный клиент SoundCloud. Аудио и треки берутся с SoundCloud через их API, но вся пользовательская логика (аккаунты, лайки, плейлисты, история) хранится на собственном бэкенде.

## Стек

### Фронтенд
- **React Native + Expo** (SDK 51+)
- **Expo Router** для навигации (file-based routing)
- **TypeScript**
- **react-native-track-player** для аудио (поддержка лок экрана, обложки, управление)
- **Zustand** для стейт менеджмента
- **axios** для HTTP запросов

### Бэкенд
- **Python + FastAPI**
- **SQLite** (через SQLAlchemy) — бесплатный хостинг не всегда даёт PostgreSQL
- **JWT** аутентификация (python-jose + passlib)
- Деплой на **Render.com** или **Railway.app** (бесплатный tier)

### Билд
- **EAS Build** (Expo Application Services) — облачная сборка IPA на маках Expo
- Финальный IPA ставится через **AltServer-Linux** + **ideviceinstaller**

---

## Структура фронтенда

```
soundcloud-client/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx        # логин через свой бэкенд
│   │   └── register.tsx     # регистрация
│   ├── (tabs)/
│   │   ├── feed.tsx         # лента треков с SC
│   │   ├── search.tsx       # поиск по SC
│   │   └── library.tsx      # плейлисты и лайки (свой бэк)
│   ├── player.tsx           # полноэкранный плеер
│   └── _layout.tsx
├── components/
│   ├── TrackCard.tsx        # карточка трека
│   ├── MiniPlayer.tsx       # мини плеер внизу
│   └── PlaylistCard.tsx
├── services/
│   ├── soundcloud.ts        # запросы к SC API (треки, поиск, стримы)
│   └── api.ts               # запросы к своему бэкенду
├── store/
│   ├── authStore.ts         # JWT токен, данные юзера
│   └── playerStore.ts       # текущий трек, очередь
├── app.json
└── eas.json
```

---

## Структура бэкенда

```
backend/
├── main.py
├── database.py
├── models.py               # User, Playlist, PlaylistTrack, Like
├── routes/
│   ├── auth.py             # POST /register, POST /login → JWT
│   ├── playlists.py        # CRUD плейлистов
│   └── likes.py            # лайки треков (хранится SC track_id)
├── schemas.py              # Pydantic схемы
├── requirements.txt
└── Procfile                # для Render/Railway
```

---

## API бэкенда

### Auth
- `POST /register` — `{username, email, password}` → `{token}`
- `POST /login` — `{email, password}` → `{token}`
- `GET /me` — данные текущего юзера (Bearer token)

### Плейлисты
- `GET /playlists` — список плейлистов юзера
- `POST /playlists` — создать плейлист `{name}`
- `DELETE /playlists/{id}` — удалить
- `POST /playlists/{id}/tracks` — добавить трек `{sc_track_id, title, artwork_url}`
- `DELETE /playlists/{id}/tracks/{sc_track_id}` — убрать трек

### Лайки
- `GET /likes` — лайкнутые треки юзера
- `POST /likes` — лайкнуть `{sc_track_id, title, artwork_url, duration}`
- `DELETE /likes/{sc_track_id}` — убрать лайк

---

## SoundCloud API

Используется публичный API с `client_id`. Client ID получается через:
1. Регистрация на soundcloud.com
2. soundcloud.com/you/apps → создать приложение → получить client_id

Основные эндпоинты:
```
GET https://api.soundcloud.com/tracks?q={query}&client_id={id}
GET https://api.soundcloud.com/tracks/{id}/stream?client_id={id}
GET https://api.soundcloud.com/users/{id}/tracks?client_id={id}
```

---

## Дизайн

- Тёмная тема, доминирующий цвет — оранжевый (#FF5500, фирменный SC цвет)
- Минималистичный UI, акцент на обложках треков
- Анимированный мини-плеер закреплён снизу
- Полноэкранный плеер с крупной обложкой, прогресс баром, управлением

---

## Текущий статус

- [x] Expo проект создан (`npx create-expo-app soundcloud-client`)
- [x] EAS аккаунт настроен
- [ ] Написать все компоненты и экраны
- [ ] Написать бэкенд
- [ ] EAS билд → IPA
- [ ] Установить через AltServer на iPod Touch 6 (iOS 12.5.7)

---

## Важные детали

- iOS минимум **12.0** — указать в `app.json` → `expo.ios.deploymentTarget: "12.0"`
- В `eas.json` использовать профиль `preview` для получения IPA без App Store
- Бэкенд деплоится бесплатно на Render.com, SQLite файл персистентен через disk
- AltServer установлен на Arch Linux, команда: `ALTSERVER_ANISETTE_SERVER=http://localhost:6969 /opt/altserver/AltServer -u {UDID} -a {apple_id} -p {password} app.ipa`
