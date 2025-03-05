import connectDB from "@/lib/db/mongodb";
import Hod from "@/lib/models/hodSchema";

export const POST = async (req) => {
  await connectDB();
  try {
    const body = await req.json();
    console.log(body)
    const { studentName, studentRegNo, studentEmail, year, academicYear, tutorName, inchargeName, reason, fatherName } = body;
    if (!studentName || !studentRegNo || !studentEmail || !tutorName || !inchargeName || !reason) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newRequest = await Hod.create({
      studentName,
      studentRegNo,
      studentEmail,
      year,
      academicYear,
      tutorName,
      inchargeName,
      reason,
      fatherName
    });

    return new Response(JSON.stringify(newRequest), { status: 200 });
  } catch (error) {
    console.error("Error in /api/hod:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
