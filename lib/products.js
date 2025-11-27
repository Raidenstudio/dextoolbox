export const products = [
  {
    slug: 'meme-coin-launchpad',
    title: 'Meme coin launchpad (PumpFun-style)',
    tag: 'Launchpad',
    desc: 'A fast, fair-launch token engine for meme coins and community tokens.',
    icon: '/icons/launchpad.svg',
    whatItDoes: 'Automates bonding curve pricing, liquidity deployment, and anti-sniper protection so creators can launch quickly without custom coding. Works across popular chains.'
  },
  {
    slug: 'token-generator-factory',
    title: 'Token generator / factory',
    tag: 'Tokenomics',
    desc: 'One-click smart-contract creation with preset tokenomics.',
    icon: '/icons/token-generator.svg',
    whatItDoes: 'Produces standard or custom tokens—mintable, burnable, with tax or reflection options, LP-lock or vesting controls—ready to deploy with minimal setup.'
  },
  {
    slug: 'dex-frontend-fork',
    title: 'DEX frontend (Raydium-style fork)',
    tag: 'DEX',
    desc: 'A fully branded swap and liquidity platform for your ecosystem.',
    icon: '/icons/dex.svg',
    whatItDoes: 'Lets users swap tokens, add/remove liquidity, stake or farm, all under your brand. Built for easy theming, permissioning, and rapid launch.'
  },
  {
    slug: 'realtime-charting-dashboard',
    title: 'Real-time charting dashboard (DexScreener-style)',
    tag: 'Analytics',
    desc: 'Live charts, liquidity & volume tracking, and token discovery in one interface.',
    icon: '/icons/charts.svg',
    whatItDoes: 'Shows candles, trades, liquidity metrics, and trending pairs so communities and traders can watch activity in real time without leaving your site.'
  },
  {
    slug: 'volume-bot-system',
    title: 'Volume bot system',
    tag: 'Automation',
    desc: 'Automated, human-like trading activity to create early token traction.',
    icon: '/icons/bot.svg',
    whatItDoes: 'Runs configurable buy-sell patterns with randomized timing, multi-wallet support, and adjustable risk settings to seed volume and visibility in a controlled way.'
  },
  {
    slug: 'sniper-bot',
    title: 'Sniper bot',
    tag: 'Automation',
    desc: 'Instant, high-speed buys at launch with safety guards.',
    icon: '/icons/sniper.svg',
    whatItDoes: 'Detects liquidity, executes targeted buys, and applies anti-rug logic and slippage controls—useful for early-stage token acquisitions when timing is critical.'
  },
  {
    slug: 'multi-wallet-manager',
    title: 'Multi-wallet manager',
    tag: 'Operations',
    desc: 'Create and manage many wallets for campaigns, airdrops, or liquidity distribution.',
    icon: '/icons/wallets.svg',
    whatItDoes: 'Automates wallet creation, grouping, and mass transfers across chains; simplifies execution of holder distributions or marketing fund deployments.'
  },
  {
    slug: 'liquidity-locker',
    title: 'Liquidity locker',
    tag: 'Trust',
    desc: 'Securely lock LP tokens to build trust with your community.',
    icon: '/icons/lock.svg',
    whatItDoes: 'Holds liquidity for a set period, supports multiple LP pairs, and shows public lock info so investors can verify that liquidity won’t vanish prematurely.'
  },
  {
    slug: 'token-vesting-dashboard',
    title: 'Token vesting / team vest dashboard',
    tag: 'Compliance',
    desc: 'Transparent schedules for team or advisor allocations.',
    icon: '/icons/vesting.svg',
    whatItDoes: 'Sets cliffs, vesting timing, and allocation rules; provides public visibility on unlock timelines and allows on-chain verification where applicable.'
  },
  {
    slug: 'admin-analytics-dashboard',
    title: 'Admin analytics dashboard',
    tag: 'Admin',
    desc: 'Internal control center for project owners and admins.',
    icon: '/icons/admin.svg',
    whatItDoes: 'Shows holders, liquidity, volume, trade logs, and chain-wide insights; supports user or permission management and quick monitoring of ecosystem health.'
  },
  {
    slug: 'telegram-mini-apps',
    title: 'Telegram mini-apps and bots',
    tag: 'Community',
    desc: 'Community and operations tools directly in Telegram.',
    icon: '/icons/telegram.svg',
    whatItDoes: 'Delivers token info bots, auto-alerts on trades or launches, notification bots, and interactive mini apps to keep your community engaged on mobile.'
  },
  {
    slug: 'marketing-toolkit',
    title: 'Marketing toolkit',
    tag: 'Growth',
    desc: 'Built-in helpers to amplify new tokens and projects.',
    icon: '/icons/marketing.svg',
    whatItDoes: 'Provides trending trackers, shill or promo generators, press-release templates, and scheduling tools to streamline marketing across social and community channels.'
  },
  {
    slug: 'cross-chain-bridge',
    title: 'Cross-chain bridge (optional add-on)',
    tag: 'Add-on',
    desc: 'Move tokens across Solana, Sui, BNB, or EVM ecosystems.',
    icon: '/icons/bridge.svg',
    whatItDoes: 'Wraps and routes assets between chains, enabling broader liquidity and user access; supports secure methods and custom routing logic per project needs.'
  },
  {
    slug: 'launchpad-aggregator',
    title: 'Launchpad aggregator (optional)',
    tag: 'Discovery',
    desc: 'Showcase tokens from multiple launchpads in one place.',
    icon: '/icons/aggregator.svg',
    whatItDoes: 'Lists and categorizes newly launched or upcoming tokens across networks, helping users discover opportunities under your brand umbrella.'
  },
  {
    slug: 'nft-launchpad',
    title: 'NFT launchpad',
    tag: 'NFT',
    desc: 'Create, mint, and manage NFT collections with community controls.',
    icon: '/icons/nft.svg',
    whatItDoes: 'Supports whitelist or raffle mechanisms, timed drops, and simple minting flows; useful for projects that want both token and NFT strategies.'
  }
]

export function getProductBySlug(slug) {
  return products.find(product => product.slug === slug)
}
