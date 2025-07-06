import { redis } from '@/lib/redis';

export async function POST(req) {
  try {
    const { email: rawEmail, otp } = await req.json();
    const email = rawEmail.trim().toLowerCase();
    const stored = await redis.get(`otp:${email}`);

    if (!stored) {
      return new Response(JSON.stringify({ message: 'OTP expired' }), { status: 410 });
    }
    if (stored !== otp) {
      return new Response(JSON.stringify({ message: 'Your OTP is wrong' }), { status: 400 });
    }

    await redis.del(`otp:${email}`);
    return new Response(JSON.stringify({email: rawEmail}), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Failed to verify OTP' }), { status: 500 });
  }
}
