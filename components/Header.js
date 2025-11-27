import Link from 'next/link'
export default function Header({ onOpen }){
  return (
    <header className="relative" style={{zIndex:100}}>
      <div className="container flex items-center justify-between py-6 relative" style={{zIndex:2}}>
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="DexToolbox" width="56" />
          <div>
            <div className="text-2xl font-extrabold">DexToolbox</div>
            <div className="text-xs muted">Enterprise Web3 Launch Suite</div>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="#products" className="text-sm muted hover:text-white">Products</Link>
          <Link href="#blog" className="text-sm muted hover:text-white">Blog</Link>
          <button className="btn-neon" onClick={onOpen}>Request Demo</button>
        </nav>
      </div>
    </header>
  )
}
