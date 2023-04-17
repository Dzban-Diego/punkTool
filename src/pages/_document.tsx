import { Html, Main, Head, NextScript } from "next/document";
import React from "react";

export default function _document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Szybka apka do śledzenia odjazdów Zditm"
        />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/logo.png" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Zaraz Będę" />
        <meta name="keywords" content="Keywords" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
