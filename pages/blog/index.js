import fs from 'fs'
import path from 'path'
import Link from 'next/link'
export default function BlogIndex({ posts }){
  return (<main className='container'><h1>Blog</h1><ul className='mt-4'>{posts.map(p=>(<li key={p}><Link href={'/blog/'+p.replace('.md','')}>{p.replace('.md','').replace(/-/g,' ')}</Link></li>))}</ul></main>)
}
export async function getStaticProps(){ const dir = path.join(process.cwd(),'content'); const files = fs.readdirSync(dir).filter(f=>f.endsWith('.md')); return { props:{ posts: files } } }
