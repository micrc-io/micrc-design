import React, { useContext } from 'react';

import type { DocumentContext, DocumentProps } from 'next/document';

import Document, { Html, Head, Main, NextScript } from "next/document";
import { revalidate, FlushedChunks, flushChunks } from '@module-federation/nextjs-mf/utils';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs/lib';
import StyleContext from '@ant-design/cssinjs/lib/StyleContext';

type MicrcDocumentProps = { chunks: any };

export default function MicrcDocument(props: DocumentProps & MicrcDocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex" />
        <FlushedChunks chunks={props.chunks} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MicrcDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const original = ctx.renderPage;
  ctx.renderPage = () => original({
    enhanceApp: (App) => (props) => {
      const context = {
        ...useContext(StyleContext),
        cache,
        layer: true,
      };
      return (
        <StyleProvider {...context}>
          <App {...props} />
        </StyleProvider>
      );
    },
  });

  if (process.env.NODE_ENV === 'development' && !ctx.req?.url?.includes('_next')) {
    await revalidate().then((reload) => {
      if (reload) {
        ctx.res?.writeHead(302, { Location: ctx.req?.url });
      }
    });
  } else {
    ctx.res?.on('finish', () => revalidate());
  }

  const initialProps = await Document.getInitialProps(ctx);
  const chunks = await flushChunks();
  return {
    ...initialProps,
    chunks,
    styles: (
      <>
        {initialProps.styles}
        {/* @ts-ignore */}
        <style dangerouslySetInnerHTML={{ __html: cache.ttt }} />
        <style dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
      </>
    ),
  };
}
