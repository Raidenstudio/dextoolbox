export default function ThemeToggle(){ 
  function toggle(){ const cur = document.documentElement.getAttribute('data-theme') || 'dark'; const next = cur==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('DT_THEME', next) }
  return (<button onClick={toggle} className='px-3 py-2 border rounded'>Toggle Theme</button>)
}
