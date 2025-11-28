import Link from 'next/link'
import { fetchBlogEntries } from '../../lib/blogService'

export default function BlogIndex({ posts }){
  return (
    <main className='container py-16'>
      <h1 className='text-4xl font-semibold'>Blog</h1>
      <ul className='mt-6 space-y-3'>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className='text-cyan-500 hover:underline'>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export async function getStaticProps(){
  const posts = await fetchBlogEntries({ limit: 100 })
  const simplified = posts.map(post => ({ slug: post.slug, title: post.title }))
  return { props:{ posts: simplified } }
}
