/**
 * app/pages/api/[...slug].ts
 */

const tmpl = `// @ts-nocheck
// api proxy.
// note: 这里仅处理请求代理转发, 不必负责启动msw, 各状态组件mock会自行处理
// note: 各组件处理mock是为了组件自包含, 端口不必强行了解协议等不必要的知识
import { NextApiRequest, NextApiResponse } from 'next';
import { ClientRequest, IncomingMessage } from 'http';
import { Request, Response } from "http-proxy-middleware/dist/types";

import url from 'url';
import Cookies from 'cookies';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { applyPatch, getValueByPointer } from 'fast-json-patch';

const NO_HOST_400 = process.env.PROXY_NO_HOST_400 || 'http://localhost:4004/api/400';
const TOKEN_COOKIE_KEY = process.env.TOKEN_COOKIE_KEY || 'auth-token';
const LOGIN_URI = process.env.LOGIN_URI || '/api/v1/security/authc';
const SERVER_TOKEN_POINTER = process.env.SERVER_TOKEN_POINTER || '/auth_token';
const GRAY = process.env.GRAY || '/profile';

const proxy = createProxyMiddleware({
  changeOrigin: true,
  selfHandleResponse:true,
  pathRewrite: (path: string, req: Request): string => {
    if (!req.headers['x-host']) { // 如果没有x-host, 重写为空, 以转发到400报错
      return '';
    }
    return path;
  },
  router: (req: Request): string => {
    if (!req.headers['x-host']) return NO_HOST_400; // 如果没有x-host头指定服务端地址, 则转发到400报错
    const hostSuffix = '.svc.cluster.local';
    const [namespace, ownerDomain, context] = req.headers['x-host'].split('.');
    return \`http://\${context}-service.\${namespace}-\${ownerDomain}-\${process.env.APP_ENV}\${hostSuffix}\`;
  },
  onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
    const cookies = new Cookies(req, res);
    const authToken = cookies.get(TOKEN_COOKIE_KEY);
    req.headers.cookie = '';
    if (authToken) {
      proxyReq.setHeader('Authorization', authToken);
      // req.headers.Authorization = \`Bearer \${authToken}\`
    }
  },
  onProxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
    const { pathname } = url.parse(req.url || '');
    const isLogin = pathname === LOGIN_URI;
    if (isLogin) {
      let apiResponseBody = '';
      proxyRes.on('data', (chunk) => {
        apiResponseBody += chunk;
      });
      proxyRes.on('end', () => {
        try {
          const respBody = JSON.parse(apiResponseBody);
          const authToken = getValueByPointer(respBody, SERVER_TOKEN_POINTER || '');
          const gray = getValueByPointer(respBody, GRAY || '');
          const cookies = new Cookies(req, res);
          cookies.set(TOKEN_COOKIE_KEY, authToken, {
            httpOnly: true,
            sameSite: 'lax'
          });
          cookies.set('profile', gray, {
            httpOnly: true,
            sameSite: 'lax'
          });
          applyPatch(
            respBody,
            [{op: 'replace', path: SERVER_TOKEN_POINTER, value: ''}],
            false,
            true,
          );
          applyPatch(
            respBody,
            [{op: 'replace', path: GRAY, value: ''}],
            false,
            true,
          );
          res.status(200).json(respBody);
        } catch (err) {
          res.status(500).end();
        }
      });
    } else {
      proxyRes.pipe(res);
    }
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  return proxy(req, res); // 代理请求发送后, msw会根据环境变量开启, 并拦截本来发往服务端的请求, fake数据响应
}

export const config = {
  api: {
    bodyParser: false, // enable POST requests
    externalResolver: true, // hide warning message
  },
};
`;

export function apiProxyFile() {
  return tmpl;
}
