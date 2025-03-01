import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export const GET = async (req) => {
  try {
    await connectDB(); 
    const email = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }
    const tutors = await Tutor.find({ tutorEmail: email });

    if (!tutors.length) {
      return new Response(JSON.stringify({ message: "No tutors found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ tutors }),{status: 200});

  } catch (error) {
    console.error("Error fetching tutors:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
