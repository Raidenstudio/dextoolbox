import { readJson } from '../../lib/storage'

export default function handler(req,res){
  const settings = readJson('settings.json', { trackingScripts: '' })
  return res.status(200).json({ trackingScripts: settings.trackingScripts || '' })
}
