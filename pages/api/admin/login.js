import { getAdminCredentials, issueAdminToken } from '../../../lib/admin'

const DEFAULT_TTL = parseInt(process.env.ADMIN_SESSION_TTL || '', 10) || 1000 * 60 * 60 * 12

export default function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { username, password } = req.body || {}
	if (!username || !password) {
		return res.status(400).json({ error: 'Username and password are required' })
	}

	const creds = getAdminCredentials()
	if (username !== creds.username || password !== creds.password) {
		return res.status(401).json({ error: 'Invalid username or password' })
	}

	const token = issueAdminToken(username)
	return res.status(200).json({ token, expiresIn: DEFAULT_TTL })
}
