# VSH25 – API авторизации и прогресса (черновик)

Базовый URL:
- dev: https://dev.api.vsh25.net
- по IP: http://XXX.XXX.XXX.XXX:PORT  ← дописать, когда будет точный адрес

---

## 1. LOGIN (вход в систему)

**Назначение:** вход по email/имени пользователя + пароль (как на новом сайте).

- METHOD:             ← заполнить по файлам фронта/бэка (обычно POST)
- URL:                ← например: /api/auth/login или /wp-json/vsh25/v1/login
- HEADERS:            ← например: Content-Type: application/json
- BODY (ключи запроса):
  - login / email / username
  - password
- RESPONSE (ключи ответа):
  - accessToken / token
  - refreshToken
  - user { id, email, firstName, lastName, ... }

Пример BODY:
```json
{
  "login": "user@example.com",
  "password": "••••••••"
}
