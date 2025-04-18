import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/Userschema";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const acceptedRequests = user.acceptedRequests || [];
    const rejectedRequests = user.rejectedRequests || [];

    console.log('Accepted requests:', acceptedRequests);
    console.log('Rejected requests:', rejectedRequests);

    return new Response(JSON.stringify({ acceptedRequests, rejectedRequests }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
