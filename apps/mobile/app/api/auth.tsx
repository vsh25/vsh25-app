export async function requestOtp(identifier: string) {
    await new Promise((r) => setTimeout(r, 500));   // имитируем сеть
    if (!identifier.trim()) throw new Error('Введите email или телефон');
    return { delivery: identifier.includes('@') ? 'email' : 'sms' as const };
  }
  
  export async function verifyOtp(identifier: string, code: string) {
    await new Promise((r) => setTimeout(r, 500));
    // принимаем 000000 или 123456 как корректные коды
    if (code === '000000' || code === '123456') {
      return { token: `demo.${btoa(identifier)}`, user: { id: 'u1', identifier } };
    }
    throw new Error('Неверный код');
  }