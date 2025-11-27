import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { verifyAdmin } from '../../../lib/admin'

const contentDir = path.join(process.cwd(),'content')

export default function handler(req,res){
  if(!verifyAdmin(req)) return res.status(401).json({error:'Unauthorized'})

  if(req.method === 'GET'){
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'))
    const posts = files.map(file => {
      const slug = file.replace('.md','')
      const raw = fs.readFileSync(path.join(contentDir,file),'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        description: data.description || ''
      }
    })
    return res.status(200).json({ posts })
  }

  if(req.method === 'POST'){
    const { title, description = '', content = '', tags = [], thumbnail = '', date = new Date().toISOString(), slug: providedSlug } = req.body || {}
    if(!title) return res.status(400).json({error:'Title required'})
    const slug = (providedSlug || title.toLowerCase().replace(/[^a-z0-9]+/g,'-')).replace(/^-+|-+$/g,'')
    const filePath = path.join(contentDir, `${slug}.md`)
    if(fs.existsSync(filePath)) return res.status(409).json({error:'Post already exists'})
    const frontmatter = matter.stringify(content, {
      title,
      description,
      date,
      tags,
      thumbnail
    })
    fs.writeFileSync(filePath, frontmatter)
    return res.status(201).json({ok:true,slug})
  }

  if(req.method === 'DELETE'){
    const { slug } = req.query
    if(!slug) return res.status(400).json({error:'Slug required'})
    const filePath = path.join(contentDir, `${slug}.md`)
    if(!fs.existsSync(filePath)) return res.status(404).json({error:'Not found'})
    fs.unlinkSync(filePath)
    return res.status(200).json({ok:true})
  }

  return res.status(405).json({error:'Method not allowed'})
}
