import { useEffect, useState } from 'react'

const tabs = ['enquiries','blog','settings']
const contentfulEnvVars = [
	'CONTENTFUL_SPACE_ID',
	'CONTENTFUL_ENVIRONMENT',
	'CONTENTFUL_DELIVERY_TOKEN',
	'CONTENTFUL_PREVIEW_TOKEN',
	'CONTENTFUL_MANAGEMENT_TOKEN',
	'CONTENTFUL_LOCALE'
]

const DEFAULT_BLOG_FORM = {
	title:'',
	slug:'',
	description:'',
	content:'',
	tags:'',
	thumbnail:'',
	ogImage:'',
	date:'',
	author:''
}

export default function Admin(){
	const [selected,setSelected] = useState('enquiries')
	const [token,setToken] = useState('')
	const [enquiries,setEnquiries] = useState([])
	const [posts,setPosts] = useState([])
	const [settings,setSettings] = useState({ trackingScripts: '' })
	const [blogForm,setBlogForm] = useState({...DEFAULT_BLOG_FORM})
	const [loading,setLoading] = useState(false)
	const [message,setMessage] = useState('')
	const [loginForm,setLoginForm] = useState({ username:'', password:'' })
	const [loginLoading,setLoginLoading] = useState(false)
	const [loginError,setLoginError] = useState('')

	const isAuthed = Boolean(token)

	useEffect(()=>{
		if(typeof window === 'undefined') return
		const stored = localStorage.getItem('DT_ADMIN_TOKEN')
		if(stored){
			setToken(stored)
		}
	},[])

	useEffect(()=>{
		if(isAuthed){
			refreshData(selected)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[isAuthed, selected])

	function forceLogout(notice=''){ 
		if(typeof window !== 'undefined'){
			localStorage.removeItem('DT_ADMIN_TOKEN')
		}
		setToken('')
		setEnquiries([])
		setPosts([])
		setSettings({ trackingScripts: '' })
		if(notice) setMessage(notice)
	}

	async function authedFetch(url, options={}){
		if(!token) throw new Error('Not authenticated')
		const mergedHeaders = { ...(options.headers || {}), 'x-admin-token': token }
		const response = await fetch(url, { ...options, headers: mergedHeaders })
		if(response.status === 401){
			forceLogout('Session expired. Please login again.')
			throw new Error('Session expired. Please login again.')
		}
		return response
	}

	async function refreshData(context){
		if(!token) return
		setLoading(true)
		setMessage('')
		try{
			if(context==='enquiries'){
				const res = await authedFetch('/api/admin/enquiries')
				const data = await res.json()
				setEnquiries(data.enquiries || [])
			}
			if(context==='blog'){
				const res = await authedFetch('/api/admin/blog')
				const data = await res.json()
				setPosts(data.posts || [])
			}
			if(context==='settings'){
				const res = await authedFetch('/api/admin/settings')
				const data = await res.json()
				setSettings(data.settings || { trackingScripts:'' })
			}
		}catch(err){
			setMessage(err.message)
		}finally{
			setLoading(false)
		}
	}

	async function handleLogin(e){
		e.preventDefault()
		setLoginError('')
		setMessage('')
		setLoginLoading(true)
		try{
			const res = await fetch('/api/admin/login',{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body: JSON.stringify(loginForm)
			})
			const data = await res.json()
			if(!res.ok) throw new Error(data.error || 'Login failed')
			if(typeof window !== 'undefined'){
				localStorage.setItem('DT_ADMIN_TOKEN', data.token)
			}
			setToken(data.token)
			setLoginForm({ username:'', password:'' })
			setMessage('Signed in successfully.')
		}catch(err){
			setLoginError(err.message)
		}finally{
			setLoginLoading(false)
		}
	}

	function handleLogout(){
		forceLogout('You have been logged out.')
	}

	async function handleAddBlog(e){
		e.preventDefault()
		setLoading(true)
		setMessage('')
		try{
			const payload = {
				...blogForm,
				slug: blogForm.slug?.trim() || undefined,
				author: blogForm.author?.trim() || undefined,
				thumbnail: blogForm.thumbnail?.trim() || '',
				ogImage: blogForm.ogImage?.trim() || '',
				description: blogForm.description?.trim() || '',
				content: blogForm.content?.trim() || '',
				date: blogForm.date || new Date().toISOString(),
				tags: blogForm.tags ? blogForm.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
			}
			const res = await authedFetch('/api/admin/blog',{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body: JSON.stringify(payload)
			})
			const data = await res.json().catch(()=>({}))
			if(!res.ok) throw new Error(data.error || 'Failed to add blog post')
			setBlogForm({...DEFAULT_BLOG_FORM})
			refreshData('blog')
			setMessage('Blog post created')
		}catch(err){
			setMessage(err.message)
		}finally{ setLoading(false) }
	}

	async function handleDeletePost(slug){
		if(!confirm(`Delete ${slug}?`)) return
		setLoading(true)
		setMessage('')
		try{
			const res = await authedFetch(`/api/admin/blog?slug=${slug}`,{ method:'DELETE' })
			if(!res.ok) throw new Error('Failed to delete post')
			refreshData('blog')
			setMessage('Post deleted')
		}catch(err){
			setMessage(err.message)
		}finally{ setLoading(false) }
	}

	async function handleSaveSettings(e){
		e.preventDefault()
		setLoading(true)
		setMessage('')
		try{
			const res = await authedFetch('/api/admin/settings',{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body: JSON.stringify(settings)
			})
			if(!res.ok) throw new Error('Failed to update settings')
			setMessage('Settings saved')
		}catch(err){
			setMessage(err.message)
		}finally{ setLoading(false) }
	}

	const loginSection = (
		<section className='bg-white/5 border border-white/10 rounded-3xl p-8 mt-10 max-w-lg'>
			<h2 className='text-2xl font-semibold'>Admin login</h2>
			<p className='text-sm text-slate-300 mt-2'>Use your admin username and password to access the control center.</p>
			<form className='mt-6 space-y-4' onSubmit={handleLogin}>
				<div>
					<label className='text-xs uppercase tracking-[3px] text-slate-400 block mb-2'>Username</label>
					<input className='form-input w-full' value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username:e.target.value})} placeholder='admin@dextoolbox' autoComplete='username' required />
				</div>
				<div>
					<label className='text-xs uppercase tracking-[3px] text-slate-400 block mb-2'>Password</label>
					<input type='password' className='form-input w-full' value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} placeholder='••••••••' autoComplete='current-password' required />
				</div>
				{loginError && <p className='text-sm text-rose-300'>{loginError}</p>}
				<button type='submit' className='btn-neon w-full disabled:opacity-60 disabled:cursor-not-allowed' disabled={loginLoading}>
					{loginLoading ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
			<p className='text-xs text-slate-500 mt-4'>Tip: configure ADMIN_USERNAME and ADMIN_PASSWORD env vars for production.</p>
		</section>
	)

	const tabButtons = (
		<div className='flex flex-wrap items-center justify-between gap-4 mt-8 mb-6'>
			<div className='flex flex-wrap gap-3'>
				{tabs.map(tab=>(
					<button key={tab} onClick={()=>setSelected(tab)} className={`px-4 py-2 rounded-full text-sm font-semibold ${selected===tab ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}>
						{tab.charAt(0).toUpperCase()+tab.slice(1)}
					</button>
				))}
			</div>
			<button className='text-sm text-rose-200 hover:text-rose-100 underline-offset-4 underline' onClick={handleLogout}>Logout</button>
		</div>
	)

	return (
		<main className='min-h-screen bg-[#01030b] text-white py-16'>
			<div className='max-w-5xl mx-auto px-6'>
				<h1 className='text-4xl font-semibold'>DexToolbox Admin</h1>
				<p className='muted mt-2'>Manage enquiries, blog content, and tracking scripts.</p>
				{message && <p className='text-sm text-amber-400 mt-4'>{message}</p>}
				{loading && <p className='text-sm text-slate-300 mt-4'>Loading…</p>}
				{!isAuthed ? (
					loginSection
				) : (
					<>
						{tabButtons}
						<div className='space-y-10'>
							{selected==='enquiries' && (
								<section className='bg-white/5 border border-white/10 rounded-3xl p-6'>
									<h2 className='text-2xl font-semibold mb-4'>Enquiry leads</h2>
									{enquiries.length===0 ? <p className='text-slate-300'>No enquiries captured yet.</p> : (
										<div className='overflow-x-auto'>
											<table className='min-w-full text-sm'>
												<thead>
													<tr className='text-left text-slate-400'>
														<th className='py-2 pr-4'>Name</th>
														<th className='py-2 pr-4'>Email</th>
														<th className='py-2 pr-4'>Telegram</th>
														<th className='py-2 pr-4'>Phone</th>
														<th className='py-2 pr-4'>Message</th>
														<th className='py-2 pr-4'>Time</th>
													</tr>
												</thead>
												<tbody>
													{enquiries.map((item,idx)=>(
														<tr key={idx} className='border-t border-white/10'>
															<td className='py-2 pr-4'>{item.name}</td>
															<td className='py-2 pr-4'>{item.email}</td>
															<td className='py-2 pr-4'>{item.telegram || '-'}</td>
															<td className='py-2 pr-4'>{item.phone || '-'}</td>
															<td className='py-2 pr-4 max-w-xs'>{item.message}</td>
															<td className='py-2 pr-4'>{item.time ? new Date(item.time).toLocaleString() : '-'}</td>
														</tr>
														))}
													</tbody>
												</table>
											</div>
										)}
								</section>
							)}

							{selected==='blog' && (
								<section className='bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8'>
									<div>
										<h2 className='text-2xl font-semibold mb-2'>Add blog post</h2>
										<form className='grid gap-3' onSubmit={handleAddBlog}>
											<input className='form-input' placeholder='Title' value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} required />
											<input className='form-input' placeholder='Slug (optional, auto-generated from title)' value={blogForm.slug} onChange={e=>setBlogForm({...blogForm,slug:e.target.value})} />
											<input className='form-input' placeholder='SEO description / excerpt' value={blogForm.description} onChange={e=>setBlogForm({...blogForm,description:e.target.value})} />
											<div className='grid md:grid-cols-2 gap-3'>
												<input className='form-input' placeholder='Thumbnail URL' value={blogForm.thumbnail} onChange={e=>setBlogForm({...blogForm,thumbnail:e.target.value})} />
												<input className='form-input' placeholder='OG image URL (optional)' value={blogForm.ogImage} onChange={e=>setBlogForm({...blogForm,ogImage:e.target.value})} />
											</div>
											<div className='grid md:grid-cols-2 gap-3'>
												<input className='form-input' placeholder='Tags (comma separated)' value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} />
												<input className='form-input' placeholder='Author (optional)' value={blogForm.author} onChange={e=>setBlogForm({...blogForm,author:e.target.value})} />
											</div>
											<input className='form-input' placeholder='Publish date (YYYY-MM-DD or ISO)' value={blogForm.date} onChange={e=>setBlogForm({...blogForm,date:e.target.value})} />
											<textarea className='form-input' rows='6' placeholder='Article body (Markdown or plain text)' value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} required />
											<button type='submit' className='btn-neon'>Create post</button>
										</form>
									</div>
									<div>
										<h2 className='text-2xl font-semibold mb-4'>Existing posts</h2>
										{posts.length===0 ? <p className='text-slate-300'>No posts found.</p> : (
											<ul className='space-y-3'>
												{posts.map(post => (
													<li key={post.slug} className='flex items-center justify-between border border-white/10 rounded-2xl px-4 py-3'>
														<div>
															<p className='font-semibold'>{post.title}</p>
															<p className='text-xs text-slate-400'>{post.slug}</p>
															{post.date && <p className='text-[11px] text-slate-500'>Published {new Date(post.date).toLocaleDateString()}</p>}
														</div>
														<button className='text-sm text-rose-300 hover:text-rose-200' onClick={()=>handleDeletePost(post.slug)}>Delete</button>
													</li>
												))}
											</ul>
										)}
									</div>
								</section>
							)}

							{selected==='settings' && (
								<section className='bg-white/5 border border-white/10 rounded-3xl p-6'>
									<h2 className='text-2xl font-semibold mb-4'>Tracking scripts</h2>
									<form className='space-y-3' onSubmit={handleSaveSettings}>
										<label className='text-sm text-slate-300'>Paste Google Tag Manager, analytics, or plugin scripts below.</label>
										<textarea className='form-input text-sm' rows='8' value={settings.trackingScripts} onChange={e=>setSettings({...settings, trackingScripts:e.target.value})} placeholder='<script>/* code */</script>'></textarea>
										<button className='btn-neon' type='submit'>Save scripts</button>
									</form>
								</section>
							)}
						</div>
					</>
				)}
			</div>
		</main>
	)
}
