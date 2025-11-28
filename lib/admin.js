import crypto from 'crypto'

const SESSION_TTL = parseInt(process.env.ADMIN_SESSION_TTL || '', 10) || 1000 * 60 * 60 * 12
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dextoolbox-session'

export function getAdminCredentials(){
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
}

function signPayload(username, issued){
  return crypto.createHmac('sha256', SESSION_SECRET).update(`${username}:${issued}`).digest('hex')
}

export function issueAdminToken(username){
  const issued = Date.now()
  const signature = signPayload(username, issued)
  return Buffer.from(JSON.stringify({ username, issued, signature })).toString('base64')
}

function decodeToken(token){
  try{
    return JSON.parse(Buffer.from(token,'base64').toString('utf8'))
  }catch(err){
    return null
  }
}

function extractToken(req){
  const headerToken = req.headers['x-admin-token'] || req.headers['X-Admin-Token']
  if(headerToken) return headerToken
  const authHeader = req.headers.authorization || req.headers.Authorization
  if(authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')){
    return authHeader.split(' ')[1]
  }
  if(req.query?.token) return req.query.token
  return null
}

export function verifyAdmin(req){
  const token = extractToken(req)
  if(!token) return false
  const parsed = decodeToken(token)
  if(!parsed) return false
  const { username, issued, signature } = parsed
  if(!username || !issued || !signature) return false
  const expectedSignature = signPayload(username, issued)
  if(signature !== expectedSignature) return false
  if(Date.now() - Number(issued) > SESSION_TTL) return false
  const { username: expectedUser } = getAdminCredentials()
  return username === expectedUser
}
