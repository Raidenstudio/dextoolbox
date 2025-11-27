import { useState } from 'react'

export default function ChatWidget(){
  const [open,setOpen] = useState(false)
  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 text-sm'>
      {open && (
        <div className='w-64 rounded-3xl bg-white text-slate-900 shadow-2xl shadow-emerald-500/20 border border-slate-200 p-4 space-y-3'>
          <div>
            <p className='text-xs uppercase tracking-[3px] text-emerald-500 font-semibold'>Talk to an expert</p>
            <p className='mt-1 text-sm text-slate-600'>Choose your channel and our launch desk will respond instantly.</p>
          </div>
          <div className='flex flex-col gap-2'>
            <a href='https://api.whatsapp.com/send?phone=15551234567&text=Hi%20DexToolbox%20team%2C%20we%20need%20a%20demo' target='_blank' rel='noreferrer' className='inline-flex items-center justify-between rounded-2xl border border-emerald-500 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors gap-3'>
              <span className='inline-flex items-center gap-2'>
                <span role='img' aria-label='WhatsApp'>💬</span>
                WhatsApp
              </span>
              <span aria-hidden='true'>↗</span>
            </a>
            <a href='https://t.me/dextoolbox' target='_blank' rel='noreferrer' className='inline-flex items-center justify-between rounded-2xl border border-sky-500 px-4 py-2 font-semibold text-sky-700 hover:bg-sky-50 transition-colors gap-3'>
              <span className='inline-flex items-center gap-2'>
                <span role='img' aria-label='Telegram'>📨</span>
                Telegram
              </span>
              <span aria-hidden='true'>↗</span>
            </a>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(!open)} className='rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 w-16 h-16 flex items-center justify-center text-2xl font-semibold hover:bg-emerald-600 transition-colors'>
        {open ? '×' : '🤖'}
      </button>
    </div>
  )
}
