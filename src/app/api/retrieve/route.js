import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export async function GET(req){
  await connectDB();

  try { 
    const {email} = await req.json();
    console.log(email)
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
    console.log(tutors)
    return new Response(JSON.stringify({ tutors }),{status: 200});

  } catch (error) {
    console.error("Error fetching tutors:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
