export function verifyAdmin(req){
  const headerKey = req.headers['x-admin-key'] || req.headers['X-Admin-Key']
  const queryKey = req.query?.key
  const adminKey = process.env.ADMIN_KEY || '123456'
  if(headerKey && headerKey === adminKey) return true
  if(queryKey && queryKey === adminKey) return true
  return false
}
