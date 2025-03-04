import Incharge from "@/lib/models/inchargeSchema";
import connectDB from "@/lib/db/mongodb";


export const POST = async (req, res) => {
    await connectDB();
    try {
        const {studentName, studentRegNo, studentEmail, tutorName, inchargeName, inchargeEmail, reason} = await req.json();
        const newRequest = await Incharge.create( {
            studentName,
            studentRegNo,
            studentEmail,
            tutorName,
            inchargeName,
            inchargeEmail,
            reason
        });
        await newRequest.save();
        return new Response(JSON.stringify(newRequest), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}