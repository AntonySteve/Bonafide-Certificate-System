import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export const POST = async (req) => {
    await connectDB();
    try {
        const data  = await req.json();
        console.log(data)
        const newRequest = await Tutor.create(data);
        await newRequest.save();
        return new Response(JSON.stringify(newRequest), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
}