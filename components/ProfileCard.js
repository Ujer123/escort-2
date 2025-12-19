"use client"
import { PhoneCall, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '../lib/utils';

export default function ProfileCard({ data, isFavorite, onFavoriteToggle }) {
  return (
    <>
    <div className="relative">
      <Link href={`/profile/${slugify(data.name)}`} className="block">
        <div className="relative w-full aspect-[3/4]"> {/* portrait ratio—adjust to fit your images */}
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: 'cover' }} // fills container, crops if needed, no gap
            loading="lazy"
            className="rounded-lg"
          />
        </div>
        <div className="">
          <h2 className="text-xl font-semibold mb-1">{data.name}</h2>
          <p className="text-pink-400 text-xs mb-2">{data.nationality}</p>
          <p className="mb-3 text-xs">{data.description}</p>
        </div>
      </Link>
      <div className="pt-2 flex items-center space-x-2">
        <a href={`tel:${data.phone}`} className="text-pink-500 hover:text-pink-600">
          <PhoneCall className="w-4 h-4" />
        </a>
        <a href={`https://wa.me/${data.phone}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
          <MessageCircle className="w-4 h-4" />
        </a>
          <div className="flex items-center justify-between text-sm w-full font-semibold">
            <span className="text-pink-400">1 hour:</span>
            <span className="text-white">{data.price}</span>
          </div>
      </div>
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
    </>
  );
}
