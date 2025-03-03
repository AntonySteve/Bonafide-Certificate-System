import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export const POST = async (req, res) => {
    await connectDB();
    try {
        const data  = await req.json();
        const newRequest = await Tutor.create({
            studentName : data.studentName,
            studentRegNo : data.regNo,
            tutorName : data.tutor,
            tutorEmail : data.tutorEmail,
            year : data.year,
            department : data.department,
            academicYear : data.academicYear,
            reason : data.reason,
        });
        await newRequest.save();
        return new Response(JSON.stringify(newRequest), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
}