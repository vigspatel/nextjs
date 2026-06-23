"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          MyBrand
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {["About", "Services", "Portfolio", "Events", "Testimonials", "Contact"].map(
            (item) => {
              const route = `/${item.toLowerCase()}`;
              const isActive = pathname === route || pathname.startsWith(route + "/");
              return (
                <Link
                  key={item}
                  href={route}
                  className={`transition-colors ${isActive ? "text-indigo-600 font-bold" : "text-gray-600 hover:text-indigo-600"}`}>
                  {item}
                </Link>
              );
            }
          )}
        </div>
        <Link
          href="/contact"
          className="bg-indigo-600 text-white text-sm px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors">
          Contact Us
        </Link>
      </div>
    </nav>
  );
}
