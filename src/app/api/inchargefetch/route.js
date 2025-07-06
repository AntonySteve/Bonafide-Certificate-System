
import connectDB from "@/lib/db/mongodb";
import Incharge from "@/lib/models/inchargeSchema";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("Fetching tutors for email:", email);
    const incharges = await Incharge.find({ inchargeEmail: email });
    return new Response(JSON.stringify({ incharges }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching tutors:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),{status: 500}
    );
  }
}