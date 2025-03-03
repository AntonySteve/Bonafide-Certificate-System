import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export async function GET(req) {
  await connectDB();

  try {
    // Extract email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fetching tutors for email:", email);
    const tutors = await Tutor.find({ tutorEmail: email });

    if (!tutors.length) {
      return new Response(JSON.stringify({ message: "No tutors found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ tutors }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching tutors:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
