export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className='bg-[#030b1d] border-t border-white/5 text-slate-400 text-sm'>
      <div className='w-full max-w-[1600px] mx-auto px-6 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='text-white font-semibold tracking-wide'>DexToolbox</div>
        <div className='flex flex-col md:flex-row md:items-center gap-2 text-xs uppercase tracking-[2px] text-slate-500'>
          <span>© {year}</span>
          <span className='hidden md:inline'>•</span>
          <span>hello@dextoolbox.com</span>
        </div>
      </div>
    </footer>
  )
}
