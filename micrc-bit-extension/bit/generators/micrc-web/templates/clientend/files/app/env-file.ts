/**
 * app/.env
 */

export function appEnvFile() {
  return `
NEXT_PUBLIC_MOCK_DELAY=3000

PROXY_NO_HOST_400=http://localhost:4004/api/400
TOKEN_COOKIE_KEY=auth-token
LOGIN_URI=/api/v1/security/authc
SERVER_TOKEN_POINTER=/auth_token
`;
}
