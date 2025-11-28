import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import {
  getDeliveryClient,
  getPreviewClient,
  hasDeliveryCredentials,
  hasPreviewCredentials
} from './contentful'

const BLOG_CONTENT_TYPE = 'blogPost'
const FALLBACK_CONTENT_DIR = path.join(process.cwd(), 'content')
const DEFAULT_THUMBNAIL = '/og-image.png'
const DEFAULT_AUTHOR = 'DexToolbox Research'

let fallbackPostsPromise
const markdownProcessor = remark().use(html)

const markdownToHtml = async markdown => {
  const processed = await markdownProcessor.process(markdown || '')
  return processed.toString()
}

const extractPlainText = markdown =>
  (markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const deriveTitle = (frontMatter, markdown, slug) => {
  if (frontMatter?.title) return frontMatter.title
  const headingMatch = markdown?.match(/^#\s+(.+)/m)
  if (headingMatch) return headingMatch[1].trim()
  return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

const readFallbackPosts = async () => {
  if (fallbackPostsPromise) return fallbackPostsPromise

  fallbackPostsPromise = (async () => {
    if (!fs.existsSync(FALLBACK_CONTENT_DIR)) return []
    const files = fs.readdirSync(FALLBACK_CONTENT_DIR).filter(file => file.endsWith('.md'))
    const posts = await Promise.all(
      files.map(async file => {
        try {
          const slug = file.replace(/\.md$/i, '')
          const fullPath = path.join(FALLBACK_CONTENT_DIR, file)
          const raw = fs.readFileSync(fullPath, 'utf8')
          const { content, data } = matter(raw)
          const body = await markdownToHtml(content)
          const plain = extractPlainText(content)
          const excerptSource = data?.excerpt || data?.description || plain
          const excerpt = excerptSource?.split(/(?<=\.)\s+/).slice(0, 2).join(' ').trim() || plain
          const estimatedReadTime = data?.readTime || `${Math.max(1, Math.ceil((plain.split(/\s+/).filter(Boolean).length || 0) / 220))} min read`

          return {
            slug,
            title: deriveTitle(data, content, slug),
            excerpt,
            description: data?.description || excerpt,
            body,
            tags: data?.tags || [],
            thumbnail: data?.thumbnail || DEFAULT_THUMBNAIL,
            ogImage: data?.ogImage || data?.thumbnail || DEFAULT_THUMBNAIL,
            publishedDate: data?.date || null,
            author: data?.author || DEFAULT_AUTHOR,
            readTime: estimatedReadTime
          }
        } catch (err) {
          console.error('Failed to read fallback blog', file, err)
          return null
        }
      })
    )

    return posts
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
        if (dateA === dateB) return a.slug.localeCompare(b.slug)
        return dateB - dateA
      })
  })()

  return fallbackPostsPromise
}

const fallbackEntries = async limit => {
  const posts = await readFallbackPosts()
  return typeof limit === 'number' ? posts.slice(0, limit) : posts
}

const fallbackBySlug = async slug => {
  const posts = await readFallbackPosts()
  return posts.find(post => post.slug === slug) || null
}

const shouldUseContentful = preview => (preview ? hasPreviewCredentials() : hasDeliveryCredentials())

const safeContentfulCall = async (preview, handler) => {
  if (!shouldUseContentful(preview)) return null
  try {
    return await handler()
  } catch (err) {
    console.error('Contentful blog fetch failed, falling back to markdown content.', err)
    return null
  }
}

const assetUrl = asset => {
  if (!asset) return null
  if (typeof asset === 'string') return asset
  if (!asset?.fields?.file?.url) return null
  const url = asset.fields.file.url
  return url.startsWith('http') ? url : `https:${url}`
}

const richTextToHtml = doc => (doc ? documentToHtmlString(doc) : '')
const richTextToText = doc => (doc ? documentToPlainTextString(doc) : '')

export const normalizeBlogEntry = entry => {
  const fields = entry?.fields || {}
  const thumbnail = assetUrl(fields.thumbnail)
  const ogImage = assetUrl(fields.ogImage) || thumbnail || 'https://dextoolbox.com/og-image.png'
  const contentHtml = richTextToHtml(fields.body)
  const plain = richTextToText(fields.body)
  const estimatedReadTime = fields.readTime || `${Math.max(1, Math.ceil(plain.split(/\s+/).length / 220))} min read`
  return {
    slug: fields.slug,
    title: fields.title,
    excerpt: fields.excerpt || fields.seoDescription || '',
    description: fields.seoDescription || fields.excerpt || '',
    body: contentHtml,
    tags: fields.tags || [],
    thumbnail: thumbnail || '/og-image.png',
    ogImage,
    publishedDate: fields.publishedDate || entry?.sys?.firstPublishedAt || entry?.sys?.createdAt || null,
    author: fields.author || 'DexToolbox Research',
    readTime: estimatedReadTime
  }
}

const resolveClient = preview => (preview ? getPreviewClient() : getDeliveryClient())

export async function fetchBlogEntries({ limit = 100, preview = false } = {}) {
  const result = await safeContentfulCall(preview, async () => {
    const client = resolveClient(preview)
    const { items } = await client.getEntries({
      content_type: BLOG_CONTENT_TYPE,
      order: '-fields.publishedDate,-sys.createdAt',
      limit
    })
    return items.map(normalizeBlogEntry)
  })

  if (result) return result
  return fallbackEntries(limit)
}

export async function fetchBlogSlugs() {
  const result = await safeContentfulCall(false, async () => {
    const client = getDeliveryClient()
    const { items } = await client.getEntries({
      content_type: BLOG_CONTENT_TYPE,
      select: 'fields.slug',
      limit: 1000
    })
    return items.map(item => item.fields.slug).filter(Boolean)
  })

  if (result) return result
  const posts = await fallbackEntries()
  return posts.map(post => post.slug)
}

export async function fetchBlogBySlug(slug, { preview = false } = {}) {
  if (!slug) return null
  const result = await safeContentfulCall(preview, async () => {
    const client = resolveClient(preview)
    const { items } = await client.getEntries({
      content_type: BLOG_CONTENT_TYPE,
      limit: 1,
      'fields.slug': slug
    })
    if (!items?.length) return null
    return normalizeBlogEntry(items[0])
  })

  if (result) return result
  return fallbackBySlug(slug)
}
