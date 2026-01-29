import { connectDB } from "../lib/db.js";
import Service from "../lib/models/Service.js";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

// Simple slugify function without external dependencies
function slugify(text) {
  const result = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

  if (!result) {
    throw new Error(`Unable to generate slug from: "${text}"`);
  }
  return result;
}

async function generateSlugs() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find all services without slugs
    const services = await Service.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Found ${services.length} services without slugs`);

    for (const service of services) {
      // Generate slug from name
      const baseSlug = slugify(service.name);

      // Check if slug already exists
      let slug = baseSlug;
      let counter = 1;

      while (await Service.findOne({ slug, _id: { $ne: service._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Update the service with the slug
      await Service.findByIdAndUpdate(service._id, { slug });
      console.log(`Updated service "${service.name}" with slug: ${slug}`);
    }

    console.log('Slug generation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error generating slugs:', error);
    process.exit(1);
  }
}

generateSlugs();
