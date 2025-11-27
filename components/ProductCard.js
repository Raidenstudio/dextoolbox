export default function ProductCard({title,desc,tag,icon,index}){
  const paletteMap = {
    Launchpad: { tag: 'text-sky-600', title: 'text-sky-900', accent: 'text-sky-700' },
    Tokenomics: { tag: 'text-amber-600', title: 'text-amber-800', accent: 'text-amber-700' },
    DEX: { tag: 'text-violet-600', title: 'text-violet-900', accent: 'text-violet-800' },
    Analytics: { tag: 'text-indigo-600', title: 'text-indigo-900', accent: 'text-indigo-700' },
    Automation: { tag: 'text-teal-600', title: 'text-teal-900', accent: 'text-teal-700' },
    Operations: { tag: 'text-emerald-600', title: 'text-emerald-900', accent: 'text-emerald-700' },
    Trust: { tag: 'text-blue-600', title: 'text-blue-900', accent: 'text-blue-700' },
    Compliance: { tag: 'text-rose-600', title: 'text-rose-900', accent: 'text-rose-700' },
    Admin: { tag: 'text-purple-600', title: 'text-purple-900', accent: 'text-purple-700' },
    Community: { tag: 'text-cyan-600', title: 'text-cyan-900', accent: 'text-cyan-700' },
    Growth: { tag: 'text-orange-600', title: 'text-orange-900', accent: 'text-orange-700' },
    'Add-on': { tag: 'text-emerald-600', title: 'text-emerald-900', accent: 'text-emerald-700' },
    Discovery: { tag: 'text-fuchsia-600', title: 'text-fuchsia-900', accent: 'text-fuchsia-700' },
    NFT: { tag: 'text-indigo-600', title: 'text-indigo-900', accent: 'text-indigo-700' }
  }

  const palette = paletteMap[tag] || { tag: 'text-slate-500', title: 'text-slate-900', accent: 'text-slate-900' }

  return (
    <div className="card h-full w-full max-w-[260px] min-h-[240px] flex flex-col bg-white text-slate-900 border border-slate-200 group-hover:border-cyan-400/80 transition-all duration-300 shadow-[0_25px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4 flex-1">
        <div>
          <div className={`flex items-center gap-3 text-[11px] uppercase tracking-[3px] ${palette.tag}`}>
            <span className='font-semibold text-slate-700'>{String(index+1).padStart(2,'0')}</span>
            {tag && <span>{tag}</span>}
          </div>
          <div className={`mt-2 text-lg font-semibold leading-tight ${palette.title}`}>{title}</div>
          <div className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</div>
        </div>
        {icon && <img src={icon} alt='' className="w-9 h-9 object-contain flex-shrink-0" />}
      </div>
      <div className={`mt-5 text-xs flex items-center gap-2 font-semibold ${palette.accent}`}>
        <span>View details</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  )
}
