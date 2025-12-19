// Footer.js
import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { name: 'Anal escorts', href: '/anal-escorts' },
    { name: 'Czech escorts', href: '/czech-escorts' },
    { name: 'Russian escorts', href: '/russian-escorts' },
    { name: 'Indian escorts', href: '/indian-escorts' },
    { name: 'Arabian escorts', href: '/arabian-escorts' },
    { name: 'Brazilian escorts', href: '/brazilian-escorts' },
    { name: 'African escorts', href: '/african-escorts' },
    { name: 'Asian escorts', href: '/asian-escorts' },
    { name: 'European escorts', href: '/european-escorts' },
    { name: 'Shemale escorts', href: '/shemale-escorts' },
    { name: 'Brunette escorts', href: '/brunette-escorts' },
    { name: 'Blonde escorts', href: '/blonde-escorts' },
    { name: 'Cheap escorts', href: '/cheap-escorts' },
    { name: 'Erotic Massage', href: '/erotic-massage' },
    { name: 'Outcall Escorts', href: '/outcall-escorts' },
    { name: 'Polish escorts', href: '/polish-escorts' },
    { name: 'Romanian escorts', href: '/romanian-escorts' },
    { name: 'Iranian escorts', href: '/iranian-escorts' },
    { name: 'Moroccan escorts', href: '/moroccan-escorts' },
    { name: 'Ukrainian escorts', href: '/ukrainian-escorts' },
    { name: 'Latvian escorts', href: '/latvian-escorts' },
    { name: 'Lebanese escorts', href: '/lebanese-escorts' },
    { name: 'Tunisian escorts', href: '/tunisian-escorts' },
    { name: 'Dubai Marina escorts', href: '/dubai-marina-escorts' },
    { name: 'Downtown Dubai escorts', href: '/downtown-dubai-escorts' },
    { name: 'Deira escorts', href: '/deira-escorts' },
    { name: 'Bur Dubai escorts', href: '/bur-dubai-escorts' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <footer className="bg-linear-to-br from-[#2d1b3d] to-[#1a0f27] rounded-xl px-8 py-10 md:m-10">
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

      {/* Copyright Section */}
      <div className="text-[#999999] text-sm">
        © 2025 All rights reserved.
      </div>
    </footer>
  );
}