import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
export default function WalletConnect(){
  const [account,setAccount] = useState(null)
  useEffect(()=>{
    if(typeof window !== 'undefined' && window.ethereum){
      window.ethereum.on('accountsChanged', (accs)=> setAccount(accs[0]||null))
    }
  },[])
  async function connect(){
    if(!window.ethereum){ alert('Install MetaMask'); return }
    try{ const provider = new ethers.BrowserProvider(window.ethereum); const accs = await provider.send('eth_requestAccounts', []); setAccount(accs[0]) }catch(e){ console.error(e); alert('connect failed') }
  }
  return account ? <div className='card'><div className='muted'>Connected</div><div style={{fontWeight:800}}>{account.slice(0,6)}...{account.slice(-4)}</div></div> : <button className='btn-neon' onClick={connect}>Connect Wallet</button>
}
