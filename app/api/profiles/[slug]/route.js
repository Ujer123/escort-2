import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service";
import User from "@/lib/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const service = await Service.findOne({ createdBy: slug }).populate('createdBy');
    
    if (!service) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify(service), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
