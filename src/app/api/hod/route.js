import connectDB from "@/lib/db/mongodb";
import Hod from "@/lib/models/hodSchema";


export const POST = async (req, res) => {
    await connectDB();
    try {
        const {studentName, regNo, tutorName, inchargeName, reason} = await req.json();
        const newRequest = await Hod.create({
            studentName,
            regNo,
            tutorName,
            inchargeName,
            reason
        });
        await newRequest.save()
        return new Response(JSON.stringify(newRequest), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}