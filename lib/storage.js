import fs from 'fs'
import path from 'path'

export function getDataPath(file){
  return path.join(process.cwd(),'data',file)
}

export function readJson(file, fallback){
  const filePath = getDataPath(file)
  if(!fs.existsSync(filePath)) return fallback
  const raw = fs.readFileSync(filePath,'utf8')
  try{ return JSON.parse(raw) }catch(err){
    console.error('Failed to parse',file,err)
    return fallback
  }
}

export function writeJson(file, data){
  const filePath = getDataPath(file)
  const dir = path.dirname(filePath)
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data,null,2))
}
