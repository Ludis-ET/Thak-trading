import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, company, message, captchaToken } = await request.json();

    // 1. Verify ReCAPTCHA (Skip if Dev Mode)
    const bypassRecaptcha = process.env.NEXT_PUBLIC_BYPASS_RECAPTCHA === 'true';
    
    if (!bypassRecaptcha) {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
        return NextResponse.json({ success: false, error: 'ReCAPTCHA secret key not configured' }, { status: 500 });
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
        const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
        const recaptchaJson = await recaptchaRes.json();

        if (!recaptchaJson.success) {
        return NextResponse.json({ success: false, error: 'ReCAPTCHA verification failed' }, { status: 400 });
        }
    }

    // 2. Configure Transporter
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json({ success: false, error: 'Email credentials not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    // 3. Create Email Template
    const mailOptions = {
      from: user,
      to: user, // Send to yourself
      replyTo: email,
      subject: `New Inquiry from ${name} - ${company || 'Thak Trading Website'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
            .header { background-color: #f8f9fa; padding: 15px; text-align: center; border-bottom: 1px solid #eee; }
            .content { padding: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Website Inquiry</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="field">
                <span class="label">Company:</span> ${company || 'Not specified'}
              </div>
              <div class="field">
                <span class="label">Message:</span><br>
                <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Thak Trading website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
