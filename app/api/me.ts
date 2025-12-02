// app/api/me.ts
// Обёртка над /wp-json/vsh25/v1/me

import { apiFetch } from './client';

export type UserProfile = {
  id: number;
  email: string;
  username: string;
  display_name: string;
  birth_date: string | null;
  gender: string | null;
  registration_date: string | null;
  initial_age_seconds: number | null;
  access: {
    type: string;
    expires: number | null;
  };
  subscription: {
    status: string | null;
    expires: number | null;
  };
};

export async function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/wp-json/vsh25/v1/me');
}
