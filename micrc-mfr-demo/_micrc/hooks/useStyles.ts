import { useContext } from 'react';

import StyleContext from '@ant-design/cssinjs/lib/StyleContext';

type StyleType = {
  'micrc-cache-styles': string,
  [key: string]: any,
};

export default function useStyles(styles: StyleType) {
  const style = useContext(StyleContext);
  if (style?.cache) {
    const cache = style.cache as any;
    cache['micrc-cache-styles'] = styles['micrc-cache-styles'];
  }
}
