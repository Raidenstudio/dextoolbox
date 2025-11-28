import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'
import ChatWidget from '../components/ChatWidget'

export default function App({ Component, pageProps }){
  const router = useRouter()
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

  const isAdminRoute = router.pathname.startsWith('/admin')

  useEffect(()=>{
    if(typeof window === 'undefined' || isAdminRoute) return
    const api = window.Tawk_API = window.Tawk_API || {}
    const previousOnLoad = api.onLoad
    const previousOnMinimized = api.onChatMinimized

    const hideBubble = () => {
      if(api.hideWidget){
        api.hideWidget()
      }
    }

    const handleLoad = () => {
      if(typeof previousOnLoad === 'function') previousOnLoad()
      hideBubble()
    }

    const handleMinimized = () => {
      if(typeof previousOnMinimized === 'function') previousOnMinimized()
      hideBubble()
    }

    api.onLoad = handleLoad
    api.onChatMinimized = handleMinimized

    return () => {
      if(api.onLoad === handleLoad) api.onLoad = previousOnLoad
      if(api.onChatMinimized === handleMinimized) api.onChatMinimized = previousOnMinimized
    }
  },[isAdminRoute])

  return (<>
    <DefaultSeo {...SEO} />
    {!isAdminRoute && (
      <Script id='tawk-live-chat' strategy='afterInteractive'>
        {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6929be02ec8ce71980fe6be6/1jb5gsepq';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
      </Script>
    )}
    <Component {...pageProps} />
    <ChatWidget />
  </>)
}
