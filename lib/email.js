export const sendEmail = async (to, subject, text) => {
  // For development/testing: Log OTP to console instead of sending email
  console.log(`📧 EMAIL TO: ${to}`);
  console.log(`📧 SUBJECT: ${subject}`);
  console.log(`📧 MESSAGE: ${text}`);
  console.log('='.repeat(50));

  // In production, you can integrate a free service like:
  // - Resend (resend.com) - 100 emails/day free
  // - SendGrid free tier
  // - Ethereal Email for testing
  // - Or use nodemailer with Gmail (limited)

  // Uncomment and configure for actual email sending:
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransporter({
    // Your SMTP config here
  });
  await transporter.sendMail({ from: 'your@email.com', to, subject, text });
  */
};
