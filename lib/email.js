import { Resend } from 'resend';

export async function sendEmail(to, subject, text) {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'; // Set a default or use env

    console.log('Resend Config:', {
      apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
      fromEmail: fromEmail,
    });

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is missing in environment variables');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      text: text,
    });

    console.log('Email sent via Resend:', result);
    return result;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
}
