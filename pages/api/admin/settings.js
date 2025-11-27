import { verifyAdmin } from '../../../lib/admin'
import { readJson, writeJson } from '../../../lib/storage'

export default function handler(req,res){
  if(!verifyAdmin(req)) return res.status(401).json({error:'Unauthorized'})

  if(req.method === 'GET'){
    const settings = readJson('settings.json', { trackingScripts: '' })
    return res.status(200).json({ settings })
  }

  if(req.method === 'POST'){
    const { trackingScripts = '' } = req.body || {}
    writeJson('settings.json', { trackingScripts })
    return res.status(200).json({ ok:true })
  }

  return res.status(405).json({error:'Method not allowed'})
}
