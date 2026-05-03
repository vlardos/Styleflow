import { cookies } from 'next/headers';

const COOKIE_NAME = 'styleflow_cart_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Reads (or creates) the guest session ID from the request cookie.
 * If the cookie doesn't exist it is set on the response.
 * Safe to call from any Next.js Route Handler.
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return sessionId;
}
