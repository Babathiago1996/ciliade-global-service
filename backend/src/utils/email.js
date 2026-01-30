import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure env is loaded
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service instead of manual host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAcknowledgmentEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 600; color: #000; letter-spacing: 1px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CILIADE TAILORING COMPANY</div>
        </div>
        <div class="content">
          <h2>Thank you for contacting us, ${name}</h2>
          <p>We have received your message and will get back to you shortly.</p>
          <p>Our team of experts is reviewing your inquiry and will respond within 24-48 hours.</p>
          <p>In the meantime, feel free to explore our collections and services on our website.</p>
          <p>Best regards,<br>The Ciliade Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Ciliade Tailoring Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Thank you for contacting Ciliade Tailoring Company',
    html,
  });
};