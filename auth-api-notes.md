# VSH25 – API авторизации и прогресса (черновик)

Базовый URL:
- dev: https://dev.api.vsh25.net
- прод: https://vsh25.net

---

## 1. REQUEST CODE (OTP – отправка кода)

Назначение: отправить одноразовый код на email или телефон (экран «Вход. Введите email или телефон — отправим одноразовый код»).

Фактический запрос сайта (DevTools):

- METHOD: POST  
- URL: https://vsh25.net/wp-admin/admin-ajax.php  
- HEADERS: Content-Type: application/x-www-form-urlencoded

BODY (Form Data):
- action: handle_contact_submission
- contact: string — email или телефон
- contact_type: "email" | "phone"
- nonce: string — WP nonce (обязательно должен быть валиден)

Пример BODY:
```txt
action=handle_contact_submission&
contact=test@example.com&
contact_type=email&
nonce=8732c49fa9

## 2. VERIFY CODE (OTP – подтверждение кода)

Назначение: подтвердить 6-значный код (экран «Подтверждение») и получить токен/сессию.

Фактический запрос сайта (DevTools):

- METHOD: POST  
- URL: https://vsh25.net/wp-admin/admin-ajax.php  
- HEADERS: Content-Type: application/x-www-form-urlencoded

BODY (Form Data):
- action: handle_otp_verification
- otp: string — введённый код (6 цифр)
- registration_token: string — токен регистрации с первого шага
- nonce: string — WordPress nonce

Пример BODY:
```txt
action=handle_otp_verification&
otp=123456&
registration_token=60c4ffc0-8701-43b8-ba8d-0d67089883b7&
nonce=acc79a0156
