import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/Userschema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const { username, email, password } = await req.json(); // Parse request body

    if(!username || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Username, email, and password are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: { id: newUser._id, username, email },
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
