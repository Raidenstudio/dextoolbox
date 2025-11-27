import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Link from 'next/link'
import { useState } from 'react'
import fs from 'fs'
import path from 'path'
import { products as productCatalog } from '../lib/products'
import matter from 'gray-matter'

export default function Home({ posts = [] }){
  const [openDemo,setOpenDemo] = useState(false)
  const [formLoading,setFormLoading] = useState(false)
  const [modalLoading,setModalLoading] = useState(false)
  const [pageError,setPageError] = useState('')
  const [modalError,setModalError] = useState('')
  const [successNotice,setSuccessNotice] = useState(false)

  async function processEnquiry(event,setLoading,setError){
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    try {
      const res = await fetch('/api/enquiry',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      if(!res.ok) throw new Error('Failed to submit enquiry')
      form.reset()
      setSuccessNotice(true)
      setOpenDemo(false)
    } catch(err){
      setError(err.message || 'Unable to submit enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageFormSubmit = event => processEnquiry(event,setFormLoading,setPageError)
  const handleModalFormSubmit = event => processEnquiry(event,setModalLoading,setModalError)

  const handleSuccessClose = () => {
    setSuccessNotice(false)
    if(typeof window !== 'undefined'){
      window.location.href = '/'
    }
  }
  const heroStats = [
    { label: 'Launch modules', value: '16+' },
    { label: 'Chains supported', value: '4' },
    { label: 'Audit-ready contracts', value: '120+' }
  ]
  return (<>
    <div className='relative min-h-screen flex flex-col overflow-hidden bg-[#03091c]'>
      <video autoPlay muted loop playsInline className='absolute inset-0 w-full h-full object-cover opacity-30'>
        <source src="/your-video.mp4" type="video/mp4" />
      </video>
      <div className='absolute inset-0 bg-gradient-to-b from-[#01030b]/40 via-[#01030b]/80 to-[#020c2d]'></div>
      <Header onOpen={()=>setOpenDemo(true)} />
      <section className='relative z-10 flex-1 flex items-center py-16'>
        <div className='w-full max-w-5xl mx-auto px-6 text-center space-y-8'>
          <div className='text-xs uppercase tracking-[10px] text-cyan-200/80'>Enterprise web3 suite</div>
          <h1 className='text-4xl md:text-6xl font-semibold text-white leading-[1.1]'>Launch, grow, and govern token ecosystems with DexToolbox.</h1>
          <p className='text-lg md:text-xl text-slate-200/90 max-w-3xl mx-auto'>Modular launchpads, liquidity automation, compliance rails, and analytics crafted for exchanges, L2s, and fintech operators.</p>
          <div className='flex flex-wrap gap-4 mt-8 justify-center'>
            <button className='btn-neon px-8 py-3 text-base' onClick={()=>setOpenDemo(true)}>Request demo</button>
            <Link href='#products' className='inline-flex items-center px-8 py-3 rounded-full border border-white/30 text-white text-sm font-semibold uppercase tracking-[2px] hover:bg-white/10 transition-colors'>
              Explore products
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12'>
            {heroStats.map(stat => (
              <div key={stat.label} className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-6 py-5 text-center text-white'>
                <div className='text-3xl font-semibold'>{stat.value}</div>
                <p className='text-xs uppercase tracking-[3px] text-slate-200 mt-1'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <main>
      <section id='products' className='py-20 bg-slate-50 border-t border-slate-200'>
        <div className='w-full max-w-[1600px] mx-auto px-4 lg:px-10'>
          <div className='text-center max-w-3xl mx-auto space-y-3'>
            <p className='text-xs uppercase tracking-[6px] text-cyan-600 font-semibold'>Modular stack</p>
            <h2 className='section-title text-black'>DexToolbox product suite</h2>
            <p className='text-base text-slate-600'>Enterprise-ready modules covering launch, liquidity, analytics, automation, and growth. Mix and match any stack for your ecosystem.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-12 justify-items-center'>
            {productCatalog.map((product, index) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className='group flex justify-center w-full'>
                <ProductCard index={index} {...product} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id='blog' className='py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200'>
        <div className='w-full max-w-[1600px] mx-auto px-4 lg:px-10'>
          <div className='flex flex-col gap-3'>
            <p className='text-xs uppercase tracking-[6px] text-purple-500 font-semibold'>Editorial research</p>
            <h2 className='section-title text-black'>Insights</h2>
            <p className='text-base text-slate-600 max-w-3xl'>Signals, playbooks, and architecture breakdowns powering launchpads, liquidity, and compliance at scale.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10'>
            {posts.slice(0,8).map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className='group'>
                <article className='h-full flex flex-col rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] overflow-hidden hover:-translate-y-1 transition-transform'>
                  <div className='relative w-full h-40 overflow-hidden'>
                    <img src={post.thumbnail} alt={post.title} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' loading='lazy' />
                  </div>
                  <div className='p-6 flex-1 flex flex-col'>
                    <h3 className='font-semibold text-base capitalize leading-snug text-slate-900'>{post.title}</h3>
                    <p className='text-xs text-slate-900 mt-3 flex items-center gap-2 font-semibold'>Read article <span aria-hidden='true'>→</span></p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className='py-20 border-t border-slate-200 text-slate-900 bg-gradient-to-br from-[#fef3f2] via-[#fffaf3] to-[#ecf7ff]'>
        <div className='w-full max-w-[1600px] mx-auto px-4 lg:px-10 grid gap-12 lg:grid-cols-2 items-start'>
          <div>
            <p className='text-xs uppercase tracking-[3px] text-rose-500 font-semibold'>Talk to us</p>
            <h2 className='text-4xl font-semibold mt-3 text-slate-900'>Build your next launch experience</h2>
            <p className='text-base text-slate-600 mt-4'>Share your roadmap and our enterprise desk will reply within one business day with tailored launchpad, liquidity, and analytics recommendations.</p>
            <p className='text-base text-slate-600 mt-3'>From Rust and Move programs to Solidity modules, we align architecture, compliance, and automation against your performance KPIs so your team can focus on go-to-market.</p>
            <ul className='mt-6 space-y-3 text-sm text-slate-600'>
              <li className='flex items-start gap-3'>
                <span className='text-rose-400 mt-1'>•</span>
                White-glove onboarding across Solana, Sui, and EVM.
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-rose-400 mt-1'>•</span>
                Compliance-ready tokenomics, vesting, and reporting.
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-rose-400 mt-1'>•</span>
                Dedicated success pod for liquidity, growth, and monitoring.
              </li>
            </ul>
          </div>
          <form onSubmit={handlePageFormSubmit} className='bg-white/90 backdrop-blur rounded-3xl p-8 border border-white/60 shadow-[0_40px_90px_rgba(244,114,182,0.25)] space-y-4'>
            <div>
              <label className='text-sm text-slate-500 block mb-1'>Full name</label>
              <input name='name' className='form-input w-full !bg-white !border-slate-200 text-slate-900' placeholder='Jane Doe' required />
            </div>
            <div>
              <label className='text-sm text-slate-500 block mb-1'>Work email</label>
              <input type='email' name='email' className='form-input w-full !bg-white !border-slate-200 text-slate-900' placeholder='team@company.com' required />
            </div>
            <div>
              <label className='text-sm text-slate-500 block mb-1'>Telegram handle</label>
              <input name='telegram' className='form-input w-full !bg-white !border-slate-200 text-slate-900' placeholder='@dextoolbox' />
            </div>
            <div>
              <label className='text-sm text-slate-500 block mb-1'>Mobile number</label>
              <input name='phone' className='form-input w-full !bg-white !border-slate-200 text-slate-900' placeholder='+1 555 123 4567' />
            </div>
            <div>
              <label className='text-sm text-slate-500 block mb-1'>Project goals</label>
              <textarea name='message' rows='5' className='form-input w-full !bg-white !border-slate-200 text-slate-900' placeholder='Describe your launch timeline, chains, and KPIs' required></textarea>
            </div>
            {pageError && <p className='text-sm text-rose-500'>{pageError}</p>}
            <button type='submit' className='btn-neon w-full disabled:opacity-60 disabled:cursor-not-allowed' disabled={formLoading}>
              {formLoading ? 'Submitting…' : 'Submit enquiry'}
            </button>
          </form>
        </div>
      </section>
    </main>
    <Footer />
    {openDemo && (
      <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
        <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' onClick={()=>setOpenDemo(false)}></div>
        <div className='relative w-full max-w-sm bg-white text-slate-900 rounded-[18px] shadow-[0_25px_70px_rgba(15,23,42,0.45)] overflow-hidden border border-slate-100'>
          <div className='bg-gradient-to-r from-[#051947] via-[#0d2f75] to-[#1f51c4] text-white px-4 py-3 flex items-start justify-between'>
            <div>
              <p className='text-[10px] uppercase tracking-[4px] text-cyan-200 font-semibold'>Request demo</p>
              <h3 className='text-lg font-semibold leading-tight mt-1'>DexToolbox enterprise desk</h3>
              <p className='text-[10px] text-white/80 mt-0.5'>Share your launch scope for a guided walkthrough.</p>
            </div>
            <button type='button' onClick={()=>setOpenDemo(false)} className='text-white/80 hover:text-white text-lg leading-none'>✕</button>
          </div>
          <div className='p-4 sm:p-5'>
            <form onSubmit={handleModalFormSubmit} className='space-y-3'>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <label className='text-[11px] font-semibold text-slate-500 block mb-1'>Full name</label>
                  <input name='name' className='form-input w-full' placeholder='Jane Doe' required />
                </div>
                <div>
                  <label className='text-[11px] font-semibold text-slate-500 block mb-1'>Work email</label>
                  <input type='email' name='email' className='form-input w-full' placeholder='team@company.com' required />
                </div>
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <label className='text-[11px] font-semibold text-slate-500 block mb-1'>Telegram</label>
                  <input name='telegram' className='form-input w-full' placeholder='@launch-ops' />
                </div>
                <div>
                  <label className='text-[11px] font-semibold text-slate-500 block mb-1'>Phone</label>
                  <input name='phone' className='form-input w-full' placeholder='+1 555 123 4567' />
                </div>
              </div>
              <div>
                <label className='text-[11px] font-semibold text-slate-500 block mb-1'>Project goals</label>
                <textarea name='message' rows='2' className='form-input w-full' placeholder='Share launch scope, chains, timeline' required></textarea>
              </div>
              {modalError && <p className='text-xs text-rose-500'>{modalError}</p>}
              <div className='flex gap-3 pt-1 text-sm'>
                <button type='button' className='w-1/2 border border-slate-200 rounded-full py-2 font-semibold text-slate-600 hover:bg-slate-50' onClick={()=>setOpenDemo(false)}>Cancel</button>
                <button type='submit' className='w-1/2 btn-neon py-2 disabled:opacity-60 disabled:cursor-not-allowed' disabled={modalLoading}>
                  {modalLoading ? 'Sending…' : 'Book session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    {successNotice && (
      <div className='fixed inset-0 z-[60] flex items-center justify-center px-4'>
        <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' onClick={handleSuccessClose}></div>
        <div className='relative w-full max-w-sm bg-white text-slate-900 rounded-2xl shadow-[0_30px_80px_rgba(15,23,42,0.45)] p-6 text-center space-y-4'>
          <div className='w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-3xl'>✓</div>
          <div>
            <h3 className='text-2xl font-semibold'>Enquiry received</h3>
            <p className='text-sm text-slate-600 mt-2'>Our enterprise desk will reach out within one business day. Thank you for choosing DexToolbox.</p>
          </div>
          <button className='btn-neon w-full' onClick={handleSuccessClose}>Close &amp; return home</button>
        </div>
      </div>
    )}
  </>)
}

export async function getStaticProps(){
  const contentDir = path.join(process.cwd(), 'content')
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'))
  const thumbExtensions = ['jpg','jpeg','png','webp']

  const posts = files.map(file => {
    const slug = file.replace('.md','')
    const filePath = path.join(contentDir, file)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(raw)
    const title = data?.title || slug.replace(/-/g,' ')
    const frontmatterThumb = typeof data?.thumbnail === 'string' ? data.thumbnail : null

    const existingAsset = thumbExtensions
      .map(ext => ({ ext, fullPath: path.join(process.cwd(), 'public', 'blog', `${slug}.${ext}`) }))
      .find(({ fullPath }) => fs.existsSync(fullPath))

    const thumbnail = existingAsset
      ? `/blog/${slug}.${existingAsset.ext}`
      : frontmatterThumb || '/og-image.png'

    return { slug, title, thumbnail }
  })

  return { props: { posts } }
}
