/*eslint-disable*/
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const body = await req.json()
  const { to, subject, text, html } = body

  const transporter = nodemailer.createTransport({
    service: 'gmail', // 또는 naver, daum 등
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return NextResponse.json({ message: 'Email sent successfully', info })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 })
  }
}
