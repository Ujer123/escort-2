import { connectDB } from "@/lib/db";
import SEO from "@/lib/models/SEO";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    
    await connectDB();
    
    if (page) {
      // Get specific page SEO
      const seoData = await SEO.findOne({ page });
      if (!seoData) {
        return new Response(JSON.stringify({ error: "SEO data not found" }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(seoData), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Get all SEO data
      const seoData = await SEO.find();
      return new Response(JSON.stringify(seoData), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("SEO GET error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No token provided" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Only allow admin to manage SEO
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { page, seotitle, seodescription, h1, content, metaKeywords, schema } = await req.json();

    await connectDB();

    // Check if SEO data already exists for this page
    const existingSEO = await SEO.findOne({ page });

    if (existingSEO) {
      // Update existing SEO
      existingSEO.seotitle = seotitle;
      existingSEO.seodescription = seodescription;
      existingSEO.h1 = h1;
      existingSEO.content = content;
      existingSEO.metaKeywords = metaKeywords;
      existingSEO.schema = schema;

      await existingSEO.save();
      return new Response(JSON.stringify({ message: "SEO updated successfully" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create new SEO
      const newSEO = new SEO({
        page,
        seotitle,
        seodescription,
        h1,
        content,
        metaKeywords,
        schema
      });

      await newSEO.save();
      return new Response(JSON.stringify({ message: "SEO created successfully" }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("SEO POST error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
