// Footer.js
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const footerLinks = [
    { name: 'Anal escorts', href: '/tags/anal' },
    { name: 'Czech escorts', href: '/tags/czech' },
    { name: 'Russian escorts', href: '/tags/russian' },
    { name: 'Indian escorts', href: '/tags/indian' },
    { name: 'Arabian escorts', href: '/tags/arabian' },
    { name: 'Brazilian escorts', href: '/tags/brazilian' },
    { name: 'African escorts', href: '/tags/african' },
    { name: 'Asian escorts', href: '/tags/asian' },
    { name: 'European escorts', href: '/tags/european' },
    { name: 'Shemale escorts', href: '/tags/shemale' },
    { name: 'Brunette escorts', href: '/tags/brunette' },
    { name: 'Blonde escorts', href: '/tags/blonde' },
    { name: 'Cheap escorts', href: '/tags/cheap' },
    { name: 'Erotic Massage', href: '/tags/erotic-massage' },
    { name: 'Outcall Escorts', href: '/tags/outcall' },
    { name: 'Polish escorts', href: '/tags/polish' },
    { name: 'Romanian escorts', href: '/tags/romanian' },
    { name: 'Iranian escorts', href: '/tags/iranian' },
    { name: 'Moroccan escorts', href: '/tags/moroccan' },
    { name: 'Ukrainian escorts', href: '/tags/ukrainian' },
    { name: 'Latvian escorts', href: '/tags/latvian' },
    { name: 'Lebanese escorts', href: '/tags/lebanese' },
    { name: 'Tunisian escorts', href: '/tags/tunisian' },
    { name: 'Dubai Marina escorts', href: '/tags/dubai-marina' },
    { name: 'Downtown Dubai escorts', href: '/tags/downtown-dubai' },
    { name: 'Deira escorts', href: '/tags/deira' },
    { name: 'Bur Dubai escorts', href: '/tags/bur-dubai' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <footer className="bg-[#33182c] rounded-xl px-8 py-10 md:m-10">
      {/* Administration Section */}
      <div className="mb-8">
        <p className="text-[#bb86fc] text-base font-medium">
          Administration:{' '}
          <a
            href="mailto:admin@mumbaiescortstars.com"
            className="text-[#cf6fff] hover:text-[#e0b3ff] transition-colors duration-300"
          >
            admin@mumbaiescortstars.com
          </a>
        </p>
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap gap-4 mb-8">
        {footerLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-[#e0e0e0] text-sm hover:text-[#bb86fc] transition-all duration-300 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bb86fc] after:transition-all after:duration-300 hover:after:w-full"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Popular Tags Section */}
      <div className="mb-8">
        <h3 className="text-[#bb86fc] text-base font-medium mb-4">Popular Tags:</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tags/${tag}`}
              className="bg-[#bb86fc]/10 text-[#bb86fc] text-sm px-3 py-1 rounded-full hover:bg-[#bb86fc]/20 transition-all duration-300 border border-[#bb86fc]/20"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-[#999999] text-sm">
        © 2025 All rights reserved.
      </div>
    </footer>
  );
}