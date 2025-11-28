const baseUrl = 'https://dextoolbox.com'

const config = {
  title: 'Dextoolbox – Web3 Launchpad Suite | Meme Coin Launchpad, DEX, Bots & Analytics',
  description:
    'Dextoolbox provides enterprise-grade launchpads, DEX frontends, volume bots, wallets, analytics dashboards, and automation tools for Solana, Sui, BNB & EVM ecosystems.',
  canonical: baseUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    site_name: 'Dextoolbox',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Dextoolbox Web3 Ecosystem'
      }
    ]
  },
  twitter: {
    handle: '@dextoolbox',
    site: '@dextoolbox',
    cardType: 'summary_large_image'
  }
}

export default config
