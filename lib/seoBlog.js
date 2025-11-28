export const blogSEO = (slug, title, excerpt) => ({
  title: `${title} | Dextoolbox Blog`,
  description: excerpt || "Explore Web3 tutorials, tokenomics, meme coin insights and DEX engineering guides.",
  canonical: `https://dextoolbox.com/blog/${slug}`,
  openGraph: {
    title: `${title} | Dextoolbox Blog`,
    description: excerpt,
    url: `https://dextoolbox.com/blog/${slug}`,
    images: [
      {
        url: `https://dextoolbox.com/og-blog/${slug}.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
})

export default blogSEO
