"use client"
import { PhoneCall } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '../lib/utils';

export default function ProfileCard({ data, isFavorite, onFavoriteToggle }) {
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden relative">
      <Link href={`/profile/${slugify(data.name)}`} className="block">
        <div className="relative w-full aspect-[3/4]"> {/* portrait ratio—adjust to fit your images */}
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            style={{ objectFit: 'cover' }} // fills container, crops if needed, no gap
            priority
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1">{data.name}</h2>
          <p className="text-pink-400 text-xs mb-2">{data.nationality}</p>
          <p className="mb-3 text-sm">{data.description}</p>
          <div className="flex items-center mb-2">
            <PhoneCall className="w-4 h-4 text-pink-500 mr-2" />
            <span className="text-base">{data.phone}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-pink-400">1 hour:</span>
            <span className="text-white">{data.price}</span>
          </div>
        </div>
      </Link>
      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => onFavoriteToggle(data)}
        className={`absolute top-3 right-3 rounded-full h-8 w-8 shadow-lg transition ${
          isFavorite ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-red-500 hover:bg-red-600'
        }`}
        type="button"
      >
        <span className="text-white text-lg select-none">★</span>
      </button>
    </div>
  );
}
