import { connectDB } from '../lib/db.js';
import Service from '../lib/models/Service.js';

async function updateProfile() {
  try {
    await connectDB();
    const result = await Service.findByIdAndUpdate(
      '68bb556210c176ed588ff75d',
      { status: 'Active', visibility: 'Visible' },
      { new: true }
    );
    console.log('Profile updated:', result);
  } catch (error) {
    console.error('Error updating profile:', error);
  } finally {
    process.exit();
  }
}

updateProfile();
