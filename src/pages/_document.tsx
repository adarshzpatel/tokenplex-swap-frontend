import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <body className="dark  bg-gradient-to-b text-default-foreground  from-default-50 border-t to-black border-default-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
