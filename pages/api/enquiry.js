import nodemailer from 'nodemailer'
import { readJson, writeJson } from '../../lib/storage'

const DATA_FILE = 'enquiries.json'

const formatNotification = payload => {
	const lines = [
		'📩 New enquiry received',
		payload.name && `Name: ${payload.name}`,
		payload.email && `Email: ${payload.email}`,
		payload.phone && `Phone: ${payload.phone}`,
		payload.telegram && `Telegram: ${payload.telegram}`,
		payload.company && `Company: ${payload.company}`,
		payload.budget && `Budget: ${payload.budget}`,
		payload.source && `Source: ${payload.source}`,
		payload.message && '',
		payload.message && payload.message,
		'',
		`Captured: ${payload.time}`
	]
	return lines.filter(Boolean).join('\n')
}

const safeExecute = async (channel, handler) => {
	try{
		const status = await handler()
		return { channel, status }
	}catch(err){
		console.error(`[enquiry] ${channel} step failed`, err)
		return { channel, status:'failed', error: err.message }
	}
}

async function persistEnquiry(payload){
	const enquiries = readJson(DATA_FILE, [])
	enquiries.unshift(payload)
	if(enquiries.length > 500){
		enquiries.length = 500
	}
	writeJson(DATA_FILE, enquiries)
	return 'saved'
}

async function forwardToFormEndpoint(originalPayload){
	const endpoint = process.env.FORM_ENDPOINT
	if(!endpoint) return 'skipped'
	const response = await fetch(endpoint,{
		method:'POST',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify(originalPayload)
	})
	if(!response.ok){
		const text = await response.text().catch(()=> '')
		throw new Error(text || `Forward failed (${response.status})`)
	}
	return 'forwarded'
}

const parseRecipients = () => (
	process.env.ENQUIRY_NOTIFY_EMAIL
		?.split(',')
		.map(email => email.trim())
		.filter(Boolean)
	|| []
)

function buildMailTransport(recipients){
	const host = process.env.SMTP_HOST
	if(!host || recipients.length === 0) return null
	const port = Number(process.env.SMTP_PORT || 465)
	const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465
	const authUser = process.env.SMTP_USERNAME
	const authPass = process.env.SMTP_PASSWORD
	const transporter = nodemailer.createTransport({
		host,
		port,
		secure,
		auth: authUser && authPass ? { user: authUser, pass: authPass } : undefined
	})
	return {
		transporter,
		from: process.env.SMTP_FROM || authUser || 'notifications@dextoolbox.com'
	}
}

async function sendBrevoEmail(recipients, payload){
	const apiKey = process.env.BREVO_API_KEY
	const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'notifications@dextoolbox.com'
	if(!apiKey || !senderEmail || recipients.length === 0) return 'skipped'
	const senderName = process.env.BREVO_SENDER_NAME || senderEmail.split('@')[0]
	const subject = `New enquiry from ${payload.name || 'DexToolbox site visitor'}`
	const textContent = formatNotification(payload)
	const htmlContent = textContent.replace(/\n/g,'<br />')
	const response = await fetch('https://api.brevo.com/v3/smtp/email',{
		method:'POST',
		headers:{
			'Content-Type':'application/json',
			'api-key': apiKey
		},
		body: JSON.stringify({
			sender:{ name: senderName, email: senderEmail },
			to: recipients.map(email => ({ email })),
			subject,
			textContent,
			htmlContent
		})
	})
	const data = await response.json().catch(()=>null)
	if(!response.ok){
		throw new Error(data?.message || data?.error || 'Brevo API request failed')
	}
	return 'sent'
}

async function sendEmailNotification(payload){
	const recipients = parseRecipients()
	if(recipients.length === 0) return 'skipped'
	const subject = `New enquiry from ${payload.name || 'DexToolbox site visitor'}`
	const text = formatNotification(payload)
	const html = text.replace(/\n/g,'<br />')
	if(process.env.BREVO_API_KEY){
		try{
			return await sendBrevoEmail(recipients, payload)
		}catch(err){
			console.error('[enquiry] Brevo API send failed, falling back to SMTP', err)
		}
	}
	const config = buildMailTransport(recipients)
	if(!config) return 'skipped'
	const { transporter, from } = config
	await transporter.sendMail({ from, to: recipients, subject, text, html })
	return 'sent'
}

async function sendWhatsAppNotification(payload){
	const token = process.env.WHATSAPP_TOKEN
	const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
	const toRaw = process.env.WHATSAPP_NOTIFY_NUMBER || process.env.WHATSAPP_TO_NUMBER || '+919884036062'
	if(!token || !phoneNumberId || !toRaw) return 'skipped'
	const to = toRaw.replace(/[^\d]/g,'')
	if(!to) return 'skipped'
	const message = formatNotification(payload).slice(0, 4096)
	const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,{
		method:'POST',
		headers:{
			'Authorization': `Bearer ${token}`,
			'Content-Type':'application/json'
		},
		body: JSON.stringify({
			messaging_product:'whatsapp',
			to,
			type:'text',
			text:{ body: message }
		})
	})
	const data = await response.json().catch(()=>null)
	if(!response.ok){
		throw new Error(data?.error?.message || 'WhatsApp API request failed')
	}
	return 'sent'
}

async function sendTelegramNotification(payload){
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_HANDLE || '@Raidenstudios'
	if(!botToken || !chatId) return 'skipped'
	const message = formatNotification(payload).slice(0, 4096)
	const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,{
		method:'POST',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify({ chat_id: chatId, text: message })
	})
	const data = await response.json().catch(()=>null)
	if(!response.ok || !data?.ok){
		throw new Error(data?.description || 'Telegram API request failed')
	}
	return 'sent'
}

export default async function handler(req,res){
	if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
	const submission = (req.body && typeof req.body === 'object') ? req.body : {}
	const enquiry = {
		...submission,
		name: submission.name?.trim() || submission.fullName?.trim() || submission.contactName?.trim() || '',
		email: submission.email?.trim() || submission.workEmail?.trim() || '',
		phone: submission.phone?.trim() || submission.whatsapp?.trim() || '',
		telegram: submission.telegram?.trim() || submission.telegramHandle?.trim() || '',
		message: submission.message?.trim() || submission.description?.trim() || '',
		source: submission.source || 'website',
		time: new Date().toISOString()
	}
	const steps = await Promise.all([
		safeExecute('store', () => persistEnquiry(enquiry)),
		safeExecute('forward', () => forwardToFormEndpoint(submission)),
		safeExecute('email', () => sendEmailNotification(enquiry)),
		safeExecute('whatsapp', () => sendWhatsAppNotification(enquiry)),
		safeExecute('telegram', () => sendTelegramNotification(enquiry))
	])
	const failed = steps.some(step => step.status === 'failed')
	return res.status(failed ? 207 : 200).json({ ok: !failed, results: steps })
}
