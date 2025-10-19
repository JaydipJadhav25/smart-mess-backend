import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartmesss.dev2025@gmail.com',
    pass: 'qkyz uigc vqlx imsw', // the 16-char app password
  },
});



export async function sendEmailVerificationOtp(to, userName = 'User' , otp) {
    

  // const mailOptions = {
  //   from: 'smartmesss.dev2025@gmail.com',
  //   to,
  //   subject: 'Verify Account',
  //   // text: `Hi ${userName},\n\nYour OTP is ${otp}. It is valid for 10 minutes.\n\nIf you didn't request this, please ignore.`,
  //   // subject: '[Your App Name] - Verify Your Email Address',
  //  text: `Hi ${userName},\n\nThank you for registering with Smart Mess Platform.\n\nTo complete your registration and secure your account, please enter the following verification code:\n\n${otp}\n\nThis code will expire in 10 minutes. For your security, please do not share it with anyone.\n\nIf you did not create an account, you can safely disregard this message.\n\nBest regards,\nThe Smart Mess Platform Team`
  // };

  const mailOptions = {
  from: "smartmesss.dev2025@gmail.com",
  to,
  subject: "Verify Your Smart Mess Account",
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f4f4f7;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-top:30px;">

      <!-- Header / Navbar -->
      <tr>
        <td align="center" bgcolor="#4f46e5" style="padding: 16px 0;">
          <h2 style="color:#ffffff; margin:0; font-size:24px;">Smart Mess Platform</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 32px 40px; color:#333333;">
          <h3 style="margin-top:0;">Hi ${userName},</h3>
          <p style="font-size:16px; line-height:1.6;">
            Thank you for registering with <strong>Smart Mess Platform</strong>.
            To complete your registration and secure your account, please enter the following verification code:
          </p>

          <!-- OTP Highlight -->
          <div style="text-align:center; margin: 30px 0;">
            <div style="display:inline-block; background:#4f46e5; color:#ffffff; padding:12px 24px; border-radius:8px; font-size:24px; letter-spacing:3px; font-weight:bold;">
              ${otp}
            </div>
          </div>

          <p style="font-size:15px; line-height:1.6;">
            This code will expire in <strong>10 minutes</strong>.
            For your security, please do not share it with anyone.
          </p>

          <p style="font-size:15px; line-height:1.6;">
            If you did not create an account, you can safely ignore this message.
          </p>

          <p style="margin-top:30px;">Best regards,<br><strong>The Smart Mess Platform Team</strong></p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td bgcolor="#f3f4f6" align="center" style="padding:16px; font-size:13px; color:#6b7280;">
          © ${new Date().getFullYear()} Smart Mess Platform. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
};

  

  try {

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return { success: true, otp };

  } catch (error) {

    console.error('Send error:', error);

    return { success: false, error: error.message };
  }
}






