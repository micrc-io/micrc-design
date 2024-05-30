
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import ContextProvider from '@/providers';

export default function MicrcApp(props: AppProps) {
  return <ContextProvider {...props} />;
}
