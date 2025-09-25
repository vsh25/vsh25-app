// app/providers/Query.tsx
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,          // считаем данные актуальными 30 сек
      refetchOnWindowFocus: false,   // не дёргаем запросы при возврате в приложение
      retry: 1,                      // чуть аккуратнее с ретраями в мобилке
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}