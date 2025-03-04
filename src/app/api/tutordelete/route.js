import mongoose from "mongoose";
import Tutor from "@/lib/models/tutorSchema";
import connectDB from "@/lib/db/mongodb";

export const DELETE = async (req, res) => {
    await connectDB();
    try {
        const { postid } = await req.json();
        const result = await Tutor.findByIdAndDelete({ _id: postid });
        return new Response(JSON.stringify(result), { status: 200 }, {message: "Successfully deleted"});
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
}
}