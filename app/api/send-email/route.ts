import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/nodemailer';

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await transporter.sendMail({
      ...mailOptions,
      to,
      subject,
      html,
    });
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
