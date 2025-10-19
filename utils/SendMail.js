import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartmesss.dev2025@gmail.com',
    pass: 'qkyz uigc vqlx imsw', // the 16-char app password
  },
});



export async function sendEmailVerificationOtp(to, userName = 'User' , otp) {
    

  const mailOptions = {
    from: 'smartmesss.dev2025@gmail.com',
    to,
    subject: 'Verify Account',
    // text: `Hi ${userName},\n\nYour OTP is ${otp}. It is valid for 10 minutes.\n\nIf you didn't request this, please ignore.`,
    // subject: '[Your App Name] - Verify Your Email Address',
   text: `Hi ${userName},\n\nThank you for registering with Smart Mess Platform.\n\nTo complete your registration and secure your account, please enter the following verification code:\n\n${otp}\n\nThis code will expire in 10 minutes. For your security, please do not share it with anyone.\n\nIf you did not create an account, you can safely disregard this message.\n\nBest regards,\nThe Smart Mess Platform Team`
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






