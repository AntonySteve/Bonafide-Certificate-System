import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/Userschema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json(); 

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ message: "User not registered" }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Password is incorrect" }), {
        status: 401,
      });
    }
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );


    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { id: existingUser._id, email: existingUser.email },
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
