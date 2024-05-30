
import NextFederationPlugin from '@module-federation/nextjs-mf';

const remotes = server => {
  const location = server ? 'ssr' : 'chunks';
  const remotes = process.env.REMOTES;
  return remotes?.trim().split(',').map(it => {
    const remote = it.trim().split('@');
    const host = remote[1].split('|');
    return {
      name: remote[0],
      host: server ? (host[1] ?? host[0]) : host[0],
    };
  }).reduce(
    (prev, curr) => Object.assign(prev, { [curr.name]: `${curr.name}@${curr.host}/_next/static/${location}/remoteEntry.js` }),
    {},
  );
};

export const mf = (config, options) => config.plugins.push(
  new NextFederationPlugin({
    name: 'host',
    filename: 'static/chunks/remoteEntry.js',
    remotes: remotes(options.isServer),
    exposes: {
    },
    shared: {
      'antd/lib/config-provider': {
        eager: false,
        requiredVersion: false,
        singleton: true,
        import: undefined,
      },
      '@ant-design/cssinjs/lib/StyleContext': {
        eager: false,
        requiredVersion: false,
        singleton: true,
        import: undefined,
      },
    },
    extraOptions: {
    },
  })
);

export default mf;
