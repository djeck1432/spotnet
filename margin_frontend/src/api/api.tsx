import ky from 'ky';

export const api = ky.create({
  prefixUrl: (import.meta.env.VITE_APP_API_BASE_URL as string | undefined) ?? '',
});
