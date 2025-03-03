import connectDB from "@/lib/db/mongodb";
import Hod from "@/lib/models/hodSchema";

export const GET = async (req, res) => {
    await connectDB();
    try {
        const hodRequests = await Hod.find();
        console.log(hodRequests);
        return new Response(JSON.stringify({ hod: hodRequests }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
};