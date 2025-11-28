import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { fetchBlogBySlug, fetchBlogSlugs } from '../../lib/blogService'
import { blogSEO } from '../../lib/seoBlog'

const blogMetaConfig = {
	'dexscreener-architecture': {
		title: 'DexScreener Architecture Explained – Real-Time Multi-Chain Analytics',
		description: 'Deep dive into the architecture behind DexScreener-style charting and token analytics dashboards.'
	},
	'enterprise-launchpads': {
		title: 'Enterprise Launchpads – Modern Token Launch Infrastructure',
		description: 'Why enterprise-grade launchpads are powering the next generation of Web3 ecosystems.'
	},
	'meme-coin-launchpads': {
		title: 'How Meme Coin Launchpads Work – PumpFun-Style Systems Explained'
	},
	'multi-chain-strategy': {
		title: 'Multi-Chain Strategy for Web3 Projects – Solana, Sui, BNB & EVM'
	},
	'seo-for-launchpads': {
		title: 'SEO for Web3 Launchpads – Ranking in a Hyper-Competitive Market'
	},
	'volume-bots-safety': {
		title: 'Are Volume Bots Safe? A Technical Look at Web3 Trading Automation'
	}
}

export default function Post({ content, meta }){
	const formattedDate = meta.date ? new Date(meta.date).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' }) : null
	const articleUrl = `https://dextoolbox.com/blog/${meta.slug}`
	const seoOverride = blogMetaConfig[meta.slug] || {}
	const pageTitle = seoOverride.title || meta.title
	const summaryText = seoOverride.description || meta.description || meta.excerpt || 'DexToolbox editorial insights covering launchpads, analytics, bots, and automation.'
	const heroImage = meta.thumbnail || meta.ogImage
	const seoConfig = blogSEO(meta.slug, pageTitle, meta.excerpt || summaryText)
	if(meta.ogImage){
		seoConfig.openGraph = {
			...seoConfig.openGraph,
			images: [
				{
					url: meta.ogImage,
					width: 1200,
					height: 630,
					alt: pageTitle
				}
			]
		}
	}
	const shareTargets = [
		{ label: 'Share on X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(articleUrl)}` },
		{ label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}` }
	]
	return (
		<>
			<NextSeo {...seoConfig} />
			<Header />
			<main className='bg-[#020818] text-white'>
				<div className='container max-w-6xl mx-auto py-16 space-y-10'>
					<Link href='/#blog' className='inline-flex items-center text-xs font-semibold uppercase tracking-[3px] text-slate-400 hover:text-cyan-300 transition-colors'>← Back to insights</Link>
					<div className='grid gap-6 lg:grid-cols-[2fr,1fr] items-start'>
						<div className='rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-purple-500/20 p-10 shadow-[0_35px_120px_rgba(4,10,35,0.65)] relative overflow-hidden'>
							<div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_45%)]' />
							<div className='relative space-y-4'>
								<p className='kicker text-cyan-100/80'>DexToolbox editorial</p>
								<h1 className='section-title text-4xl md:text-5xl leading-tight'>{meta.title}</h1>
								{summaryText && <p className='muted text-base text-slate-200/90 max-w-3xl'>{summaryText}</p>}
								<div className='flex flex-wrap gap-4 text-sm text-slate-200/80'>
									{formattedDate && <span className='flex items-center gap-2'><span className='h-1.5 w-1.5 rounded-full bg-cyan-300/70' />{formattedDate}</span>}
									{meta.readTime && <span className='flex items-center gap-2'><span className='h-1.5 w-1.5 rounded-full bg-purple-300/70' />{meta.readTime}</span>}
									{meta.author && <span className='flex items-center gap-2'><span className='h-1.5 w-1.5 rounded-full bg-white/70' />{meta.author}</span>}
								</div>
								{meta.tags?.length > 0 && (
									<div className='flex flex-wrap gap-2 pt-2'>
										{meta.tags.map(tag => (
											<span key={tag} className='px-3 py-1 text-xs border border-white/20 rounded-full text-white/90 bg-white/5'>#{tag.replace(/\s+/g,'-')}</span>
										))}
									</div>
								)}
							</div>
						</div>
						<div className='space-y-4'>
							<div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 shadow-[0_25px_60px_rgba(2,10,25,0.4)]'>
								<p className='text-xs uppercase tracking-[3px] text-slate-400'>Snapshot</p>
								<div className='mt-4 space-y-3 text-sm text-slate-100'>
									{formattedDate && <div className='flex justify-between'><span>Published</span><span className='font-semibold text-white'>{formattedDate}</span></div>}
									{meta.readTime && <div className='flex justify-between'><span>Read time</span><span className='font-semibold text-white'>{meta.readTime}</span></div>}
									{meta.author && <div className='flex justify-between'><span>Author</span><span className='font-semibold text-white'>{meta.author}</span></div>}
								</div>
							</div>
							<div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 shadow-[0_25px_60px_rgba(2,10,25,0.35)]'>
								<p className='text-xs uppercase tracking-[3px] text-slate-400'>Share</p>
								<ul className='mt-4 space-y-3 text-sm'>
									{shareTargets.map(target => (
										<li key={target.label}>
											<a href={target.href} target='_blank' rel='noreferrer' className='flex justify-between items-center text-slate-200 hover:text-cyan-300 transition-colors'>
												<span>{target.label}</span>
												<span aria-hidden='true'>↗</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					{heroImage && (
						<div className='rounded-[32px] overflow-hidden border border-white/10 shadow-[0_35px_90px_rgba(3,8,20,0.7)]'>
							<img src={heroImage} alt={meta.title} className='w-full h-[420px] object-cover' />
						</div>
					)}
					<div className='rounded-[32px] border border-white/10 bg-[#050e26] p-10 shadow-[0_35px_110px_rgba(2,6,23,0.75)]'>
						<div className='article-body space-y-6 text-slate-100 leading-7 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-2xl [&_h3]:text-white [&_strong]:text-white [&_a]:text-cyan-300 [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-400 [&_blockquote]:pl-4 [&_blockquote]:text-slate-200' dangerouslySetInnerHTML={{ __html: content }} />
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}

export async function getStaticPaths(){
	const slugs = await fetchBlogSlugs()
	const paths = slugs.map(slug => ({ params: { slug } }))
	return { paths, fallback:false }
}

export async function getStaticProps({ params }){
	const post = await fetchBlogBySlug(params.slug)
	if(!post){
		return { notFound:true }
	}
	const meta = {
		title: post.title,
		description: post.description,
		excerpt: post.excerpt,
		date: post.publishedDate,
		tags: post.tags,
		thumbnail: post.thumbnail,
		readTime: post.readTime,
		author: post.author,
		slug: post.slug,
		ogImage: post.ogImage
	}
	return { props:{ content: post.body, meta } }
}
