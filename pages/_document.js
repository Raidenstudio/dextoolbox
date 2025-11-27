import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="DexToolbox — Enterprise Web3 product suite: launchpad, DEX, charts & bots. Multi-chain launches on SOL/SUI/BNB." />
          <meta property="og:site_name" content="DexToolbox" />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Organization",
            "name":"DexToolbox",
            "url":"https://dextoolbox.com",
            "logo":"https://dextoolbox.com/logo.svg"
          }) }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
