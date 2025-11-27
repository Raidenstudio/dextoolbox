import { useEffect, useState } from 'react'

const tabs = ['enquiries','blog','settings']

export default function Admin(){
	const [selected,setSelected] = useState('enquiries')
	const [adminKey,setAdminKey] = useState('')
	const [keySaved,setKeySaved] = useState(false)
	const [enquiries,setEnquiries] = useState([])
	const [posts,setPosts] = useState([])
	const [settings,setSettings] = useState({ trackingScripts: '' })
	const [blogForm,setBlogForm] = useState({ title:'', description:'', content:'', tags:'', thumbnail:'', date:'' })
	const [loading,setLoading] = useState(false)
	const [message,setMessage] = useState('')

	useEffect(()=>{
		const stored = localStorage.getItem('DT_ADMIN_KEY')
		if(stored){
			setAdminKey(stored)
			setKeySaved(true)
		}
	},[])

	useEffect(()=>{
		if(keySaved){
			refreshData(selected)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[keySaved, selected])

	async function refreshData(context){
		setLoading(true)
		setMessage('')
		try{
			if(context==='enquiries'){
				const res = await fetch('/api/admin/enquiries',{ headers:{'x-admin-key':adminKey}})
				if(!res.ok) throw new Error('Failed to load enquiries')
				const data = await res.json()
				setEnquiries(data.enquiries || [])
			}
			if(context==='blog'){
				const res = await fetch('/api/admin/blog',{ headers:{'x-admin-key':adminKey}})
				if(!res.ok) throw new Error('Failed to load posts')
				const data = await res.json()
				setPosts(data.posts || [])
			}
			if(context==='settings'){
				const res = await fetch('/api/admin/settings',{ headers:{'x-admin-key':adminKey}})
				if(!res.ok) throw new Error('Failed to load settings')
				const data = await res.json()
				setSettings(data.settings || { trackingScripts:'' })
			}
		}catch(err){
			setMessage(err.message)
		}finally{
			setLoading(false)
		}
	}

	function handleSaveKey(){
		if(!adminKey) return
		localStorage.setItem('DT_ADMIN_KEY', adminKey)
		setKeySaved(true)
		refreshData(selected)
	}

	async function handleAddBlog(e){
		e.preventDefault()
		setLoading(true)
		setMessage('')
		try{
			const payload = {
				...blogForm,
				tags: blogForm.tags ? blogForm.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
			}
			const res = await fetch('/api/admin/blog',{
				method:'POST',
				headers:{'Content-Type':'application/json','x-admin-key':adminKey},
				body: JSON.stringify(payload)
			})
			if(!res.ok) throw new Error('Failed to add blog post')
			setBlogForm({ title:'', description:'', content:'', tags:'', thumbnail:'', date:'' })
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
			const res = await fetch(`/api/admin/blog?slug=${slug}`,{
				method:'DELETE',
				headers:{'x-admin-key':adminKey}
			})
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
			const res = await fetch('/api/admin/settings',{
				method:'POST',
				headers:{'Content-Type':'application/json','x-admin-key':adminKey},
				body: JSON.stringify(settings)
			})
			if(!res.ok) throw new Error('Failed to update settings')
			setMessage('Settings saved')
		}catch(err){
			setMessage(err.message)
		}finally{ setLoading(false) }
	}

	const keySection = (
		<div className='bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3'>
			<label className='text-sm text-slate-300'>Admin API key</label>
			<input value={adminKey} onChange={e=>setAdminKey(e.target.value)} className='form-input' placeholder='Enter admin key' type='password' />
			<button className='btn-neon w-full' onClick={handleSaveKey}>Save key</button>
		</div>
	)

	const tabButtons = (
		<div className='flex gap-4 mt-8 mb-6'>
			{tabs.map(tab=>(
				<button key={tab} onClick={()=>setSelected(tab)} className={`px-4 py-2 rounded-full text-sm font-semibold ${selected===tab ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}>
					{tab.charAt(0).toUpperCase()+tab.slice(1)}
				</button>
			))}
		</div>
	)

	return (
		<main className='min-h-screen bg-[#01030b] text-white py-16'>
			<div className='max-w-5xl mx-auto px-6'>
				<h1 className='text-4xl font-semibold'>DexToolbox Admin</h1>
				<p className='muted mt-2'>Manage enquiries, blog content, and tracking scripts.</p>
				{keySection}
				{tabButtons}
				{message && <p className='text-sm text-amber-400 mb-4'>{message}</p>}
				{loading && <p className='text-sm text-slate-300 mb-4'>Loading…</p>}
				{!keySaved ? (
					<p className='text-slate-300 mt-6'>Enter your admin key to access dashboard tools.</p>
				) : (
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
										<input className='form-input' placeholder='Description' value={blogForm.description} onChange={e=>setBlogForm({...blogForm,description:e.target.value})} />
										<input className='form-input' placeholder='Thumbnail URL (optional)' value={blogForm.thumbnail} onChange={e=>setBlogForm({...blogForm,thumbnail:e.target.value})} />
										<input className='form-input' placeholder='Tags (comma separated)' value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} />
										<textarea className='form-input' rows='6' placeholder='Markdown content' value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} required />
										<input className='form-input' placeholder='Publish date (YYYY-MM-DD)' value={blogForm.date} onChange={e=>setBlogForm({...blogForm,date:e.target.value})} />
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
				)}
			</div>
		</main>
	)
}
