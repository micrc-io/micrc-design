/**
 * app/.env  return HandleBars.compile(tmpl)(data);
 */
import type { ClientendContextData } from '../../_parser';

export function appEnvFile(data: ClientendContextData) {
  return `
APP_ENV=default
NEXT_PUBLIC_APP_ENV=default

NEXT_PUBLIC_MOCK_DELAY=3000
NEXT_PUBLIC_LOGIN_PAGE_URI=${data.intro.loginPageUri}

LOGIN_URI=/api/security/security/bslg000046
SERVER_TOKEN_POINTER=/auth_token
`;
}
