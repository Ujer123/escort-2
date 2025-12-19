import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service";

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    
    // Find all services and match by slugified name
    const services = await Service.find()
      .populate('createdBy', 'email')
      .lean();
    
    const service = services.find(s => slugify(s.name) === slug);
    
    if (!service) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
    }
    
    // Add cache headers
    return new Response(JSON.stringify(service), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
