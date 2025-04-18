import connectDB from "@/lib/db/mongodb";
import Incharge from "@/lib/models/inchargeSchema";

export const DELETE = async (req, res) => {
    await connectDB();
    try {
        const { postid } = await req.json();
        const result = await Incharge.findByIdAndDelete({ _id: postid });
        return new Response(JSON.stringify(result), { status: 200 }, {message: "Successfully deleted"});
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
}
}