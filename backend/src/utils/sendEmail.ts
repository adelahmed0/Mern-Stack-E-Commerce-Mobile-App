import nodemailer, { Transporter } from "nodemailer";
import ENV from "../config/env.js";

/**
 * Interface for email delivery options
 */
interface EmailOptions {
  email: string; // Recipient email address
  subject: string; // Email subject line
  message: string; // Plain text message body
  html?: string; // Optional HTML content
}

/**
 * Utility to send emails via SMTP (configured for Resend by default)
 * Requires EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS environment variables.
 */
const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1) Configure the SMTP transporter
  const transporter: Transporter = nodemailer.createTransport({
    host: ENV.EMAIL.HOST,
    port: ENV.EMAIL.PORT,
    secure: ENV.EMAIL.SECURE,
    auth: {
      user: ENV.EMAIL.USER,
      pass: ENV.EMAIL.PASS,
    },
  });

  // 2) Construct the mail object
  const mailOptions = {
    // Dynamic 'from' address (note: Resend requires verified domains)
    from: `E-Commerce App <onboarding@resend.dev>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3) Execute the delivery
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
