import { verifyAdmin } from '../../../lib/admin'
import { fetchBlogEntries } from '../../../lib/blogService'
import { getManagementClient, getSpaceConfig } from '../../../lib/contentful'

const { spaceId, environmentId, defaultLocale = 'en-US' } = getSpaceConfig()

const richTextDocument = content => ({
  nodeType: 'document',
  data: {},
  content: (content || '').split(/\n+/).map(line => ({
    nodeType: 'paragraph',
    data: {},
    content: [
      {
        nodeType: 'text',
        value: line,
        marks: [],
        data: {}
      }
    ]
  }))
})

async function getEnvironment(){
  const client = getManagementClient()
  const space = await client.getSpace(spaceId)
  return space.getEnvironment(environmentId)
}

const fieldValue = value => ({ [defaultLocale]: value })

export default async function handler(req,res){
  if(!verifyAdmin(req)) return res.status(401).json({error:'Unauthorized'})

  if(req.method === 'GET'){
    const posts = await fetchBlogEntries({ limit: 200 })
    return res.status(200).json({ posts: posts.map(post => ({ slug: post.slug, title: post.title, date: post.publishedDate, description: post.description })) })
  }

  if(req.method === 'POST'){
    const { title, description = '', content = '', tags = [], thumbnail = '', ogImage = '', date = new Date().toISOString(), slug: providedSlug, author = 'DexToolbox Research' } = req.body || {}
    if(!title || !content) return res.status(400).json({error:'Title and content are required'})
    const slug = (providedSlug || title.toLowerCase().replace(/[^a-z0-9]+/g,'-')).replace(/^-+|-+$/g,'')
    const env = await getEnvironment()
    const existing = await env.getEntries({ content_type: 'blogPost', 'fields.slug': slug, limit: 1 })
    if(existing?.items?.length) return res.status(409).json({error:'Post already exists'})

    const entry = await env.createEntry('blogPost', {
      fields: {
        title: fieldValue(title),
        slug: fieldValue(slug),
        excerpt: fieldValue(description),
        seoDescription: fieldValue(description),
        body: fieldValue(richTextDocument(content)),
        tags: fieldValue(tags),
        thumbnail: fieldValue(thumbnail),
        ogImage: fieldValue(ogImage),
        publishedDate: fieldValue(date),
        author: fieldValue(author),
        readTime: fieldValue(''),
      }
    })

    const published = await entry.publish()
    return res.status(201).json({ok:true, slug: published.fields.slug[defaultLocale]})
  }

  if(req.method === 'DELETE'){
    const { slug } = req.query
    if(!slug) return res.status(400).json({error:'Slug required'})
    const env = await getEnvironment()
    const { items } = await env.getEntries({ content_type: 'blogPost', 'fields.slug': slug, limit: 1 })
    if(!items?.length) return res.status(404).json({error:'Not found'})
    const entry = await env.getEntry(items[0].sys.id)
    if(entry.isPublished()){
      await entry.unpublish()
    }
    await entry.delete()
    return res.status(200).json({ok:true})
  }

  return res.status(405).json({error:'Method not allowed'})
}
