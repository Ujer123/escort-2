import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, role } = body;

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...body,
      password: hashedPassword,
      role: role || "visitor",
    });

    await user.save();

    return new Response(JSON.stringify({ message: "User registered" }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}