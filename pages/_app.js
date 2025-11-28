import '../styles/globals.css'
import { useEffect } from 'react'
import ChatWidget from '../components/ChatWidget'

export default function App({ Component, pageProps }){
  useEffect(()=>{
    const t = localStorage.getItem('DT_THEME') || 'dark'
    document.documentElement.setAttribute('data-theme', t)
  },[])

  useEffect(()=>{
    if(typeof window === 'undefined') return
    if(window.location.pathname.startsWith('/admin')) return
    let cleanupNodes = []
    fetch('/api/settings')
      .then(res => res.json())
      .then(({ trackingScripts }) => {
        if(trackingScripts){
          const wrapper = document.createElement('div')
          wrapper.setAttribute('data-dt-tracking','true')
          wrapper.innerHTML = trackingScripts
          document.body.appendChild(wrapper)
          cleanupNodes.push(wrapper)
        }
      }).catch(() => {})
    return () => {
      cleanupNodes.forEach(node => node.remove())
      cleanupNodes = []
    }
  },[])

  return (<>
    <Component {...pageProps} />
    <ChatWidget />
  </>)
}
