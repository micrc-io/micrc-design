/**
 * app/.env  return HandleBars.compile(tmpl)(data);
 */

export function appEnvFile() {
  return `
APP_ENV=default
NEXT_PUBLIC_APP_ENV=default

NEXT_PUBLIC_MOCK_DELAY=3000
NEXT_PUBLIC_LOGIN_PAGE_URI=/security/authc

LOGIN_URI=/api/security/security/authc
SERVER_TOKEN_POINTER=/auth_token
`;
}
