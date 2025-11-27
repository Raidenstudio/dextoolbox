export default function ProductCard({title,desc,tag,icon,index}){
  return (
    <div className="card h-full w-full max-w-[260px] min-h-[240px] flex flex-col bg-white text-slate-900 border border-slate-200 group-hover:border-cyan-400/80 transition-all duration-300 shadow-[0_25px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4 flex-1">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[3px] text-slate-500">
            <span className='font-semibold text-slate-700'>{String(index+1).padStart(2,'0')}</span>
            {tag && <span className='text-slate-600'>{tag}</span>}
          </div>
          <div className="mt-2 text-lg font-semibold leading-tight text-slate-900">{title}</div>
          <div className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</div>
        </div>
        {icon && <img src={icon} alt='' className="w-9 h-9 object-contain flex-shrink-0" />}
      </div>
      <div className="mt-5 text-xs text-slate-900 flex items-center gap-2 font-semibold">
        <span>View details</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  )
}
