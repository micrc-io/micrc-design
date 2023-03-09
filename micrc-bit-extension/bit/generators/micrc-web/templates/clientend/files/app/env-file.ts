/**
 * app/.env
 */

export function appEnvFile() {
  return `
APP_ENV=default
NEXT_PUBLIC_APP_ENV=default

NEXT_PUBLIC_MOCK_DELAY=3000

TOKEN_COOKIE_KEY=auth-token
LOGIN_URI=/api/v1/security/authc
SERVER_TOKEN_POINTER=/auth_token
`;
}
