import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, link } = body;

    if (!to || !link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Interview Assistant" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Interview Invitation',
      html: `
        <p>Hello,</p>
        <p>You have been invited to attend an interview. Please use the link below to access it:</p>
        <a href="${link}" style="color: #2563eb;">Join Interview</a>
        <p>Best regards,<br/>Interview Assistant</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
