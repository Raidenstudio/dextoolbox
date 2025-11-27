import { verifyAdmin } from '../../../lib/admin'
import { readJson } from '../../../lib/storage'

export default function handler(req,res){
  if(!verifyAdmin(req)) return res.status(401).json({error:'Unauthorized'})
  if(req.method !== 'GET') return res.status(405).json({error:'Method not allowed'})
  const enquiries = readJson('enquiries.json', [])
  return res.status(200).json({enquiries})
}
