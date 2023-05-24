// browser and node proxy mock
import { rest } from 'msw';

import { mock as protocols, useHandlers } from '../protocol';

const OpenAPISampler = require('openapi-sampler');

const handlers = protocols.map((proto) => {
  const path = (protocol) => {
    if (typeof window === 'undefined') {
      const hostSuffix = '.svc.cluster.local';
      const [ownerDomain, context, namespace] = protocol.host.split('.');
      return `http://${context}-service.${namespace}-${ownerDomain}-${process.env.APP_ENV}${hostSuffix}${protocol.url}${protocol.path}`;
      // return `${protocol.host}${protocol.url}${protocol.path}`;
    }
    return `${protocol.url}${protocol.path}`;
  };
  return rest[proto.method](
    path(proto),
    (req, res, ctx) => res(
      ctx.status(200),
      ctx.delay(3000),
      ctx.json(proto.mock || OpenAPISampler.sample(proto.schema)),
    ),
  );
});

useHandlers(handlers);
