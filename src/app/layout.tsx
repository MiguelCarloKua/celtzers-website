import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CeLTZers",
  description: "A Digest Generator Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#31255e] text-white">
        <header className="bg-[#41327e] shadow-md">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">CeLTZers</Link>
            <ul className="flex gap-6 text-white font-medium">
              <li><Link href="/about" className="hover:text-[#978bc4]">About Us</Link></li>
              <li><Link href="/generator" className="hover:text-[#978bc4]">Generate</Link></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}