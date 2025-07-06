import nodemailer from 'nodemailer';
import { redis } from '@/lib/redis';

export async function POST(req) {
  const { email: rawEmail } = await req.json();
  const email = rawEmail.trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${email}`, otp, 'EX', 2 * 60);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: { name: "Bonafide Certificate", address: process.env.USER },
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { status: 200 });
  } catch (err) {
    console.error('Mail error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send OTP' }), { status: 500 });
  }
}
