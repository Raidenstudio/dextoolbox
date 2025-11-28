const getWhatsAppLink = () => {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919884036062').replace(/[^\d]/g,'')
  if(!number) return 'https://wa.me/919884036062'
  const message = encodeURIComponent('Hi DexToolbox team, we need a demo')
  return `https://wa.me/${number}?text=${message}`
}

const getTelegramLink = () => {
  const handle = (process.env.NEXT_PUBLIC_TELEGRAM_HANDLE || 'Raidenstudios').replace(/^@/, '')
  return `https://t.me/${handle}`
}

const IconButton = ({ href, onClick, children, label, className }) => {
  const common = 'rounded-full border bg-white shadow-lg flex items-center justify-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  if(href){
    return (
      <a href={href} target='_blank' rel='noreferrer' className={`${common} ${className}`} aria-label={label}>
        {children}
      </a>
    )
  }
  return (
    <button type='button' onClick={onClick} className={`${common} ${className}`} aria-label={label}>
      {children}
    </button>
  )
}

const WhatsappIcon = () => (
  <svg width='22' height='22' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path d='M27 17.5c0 6-5 10.5-11 10.5-1.9 0-3.7-.5-5.3-1.4L4 28l1.5-6.1C4.6 20 4 18.3 4 16.5 4 10.5 9 6 15 6s12 4.5 12 11.5Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    <path d='M20.2 19.4c-.3-.2-1.6-.8-1.8-.9-.2-.1-.4-.2-.6.2-.2.3-.7.9-.8 1-.1.1-.3.2-.6.1s-1.2-.4-2.3-1.4c-.8-.7-1.4-1.5-1.6-1.7-.2-.3 0-.4.1-.6.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.1.1-.2 0-.3 0-.1-.6-1.5-.8-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.3 0-.4.2-.1.2-.5.6-.5 1.5s.5 1.7.6 1.8c.1.1 1 1.6 2.4 2.7 1.6 1.3 2.9 1.7 3.3 1.8.3.1.6.1.8.1.3 0 .8-.3.9-.6.1-.3.1-.5.1-.5s0-.1-.2-.2Z' fill='currentColor'/>
  </svg>
)

const TelegramIcon = () => (
  <svg width='22' height='22' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path d='M28 4 4.5 13.2c-1.3.5-1.2 2.4.1 2.8l6.6 2.3 2.7 7.3c.4 1.1 1.9 1.3 2.6.3l3.7-5 5.9 4.3c1 .7 2.4.1 2.5-1.1L30 5.9C30.1 4.5 29 3.7 28 4Z' stroke='currentColor' strokeWidth='2' strokeLinejoin='round'/>
    <path d='m11 17 4 3 5-7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
  </svg>
)

const LiveChatIcon = () => (
  <svg width='28' height='28' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path d='M6 9c0-1.7 1.4-3 3-3h16c1.6 0 3 1.3 3 3v9c0 1.7-1.4 3-3 3h-6l-5 5v-5H9c-1.6 0-3-1.3-3-3V9Z' stroke='currentColor' strokeWidth='2' strokeLinejoin='round'/>
    <circle cx='12' cy='13' r='1.5' fill='currentColor'/>
    <circle cx='16' cy='13' r='1.5' fill='currentColor'/>
    <circle cx='20' cy='13' r='1.5' fill='currentColor'/>
  </svg>
)

export default function ChatWidget(){
  const whatsappLink = getWhatsAppLink()
  const telegramLink = getTelegramLink()

  const triggerLiveChat = () => {
    if(typeof window === 'undefined') return
    if(window.Tawk_API?.showWidget){
      window.Tawk_API.showWidget()
    }
    if(window.Tawk_API?.maximize){
      window.Tawk_API.maximize()
    }else{
      alert('Live chat is loading, please try again in a moment.')
    }
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none'>
      <div className='flex flex-col gap-2 pointer-events-auto'>
        <IconButton href={whatsappLink} label='WhatsApp chat' className='w-12 h-12 border-emerald-200 text-emerald-600 shadow-emerald-200/60 hover:-translate-y-1'>
          <WhatsappIcon />
        </IconButton>
        <IconButton href={telegramLink} label='Telegram chat' className='w-12 h-12 border-sky-200 text-sky-600 shadow-sky-200/60 hover:-translate-y-1'>
          <TelegramIcon />
        </IconButton>
        <IconButton onClick={triggerLiveChat} label='Live chat' className='w-14 h-14 border-indigo-200 bg-indigo-500 text-white shadow-indigo-500/50 hover:bg-indigo-600'>
          <LiveChatIcon />
        </IconButton>
      </div>
    </div>
  )
}
