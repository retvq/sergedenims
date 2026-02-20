"use client";

import { useState } from "react";

interface LandingPageProps {
  onOpenStudio: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "https://sergedenimes.co" },
  { label: "Lookbook", href: "https://sergedenimes.co/pages/lookbook" },
  { label: "Shop", href: "https://sergedenimes.co/collections", hasDropdown: true },
  { label: "Gallery", href: "https://sergedenimes.co/pages/gallery" },
  { label: "Revamp My Denim", href: "#", active: true },
  { label: "About Us", href: "https://sergedenimes.co/pages/about-us" },
  { label: "Contact", href: "https://sergedenimes.co/pages/contact" },
];

const SHOP_DROPDOWN = [
  "BEJEWELED WITH PEARLS",
  "BOTANICAL",
  "COUTURE",
  "DAZZLE IT UP!",
  "EMBROIDERED",
  "GenZ & Alpha",
  "HALF & HALF",
  "HOLIDAY SEASON",
  "MENSWEAR",
  "NEW ARRIVALS",
  "PATCHES",
  "PETS",
  "WE LOVE",
  "WEARABLE ART",
  "WEDDING EDIT",
];

function AISparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LandingPage({ onOpenStudio }: LandingPageProps) {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="bg-sdn-black text-white text-center text-xs py-2 tracking-wider font-light">
        FREE SHIPPING ON ORDERS ABOVE AED 500
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-sdn-gray-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <a href="https://sergedenimes.co" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://sergedenimes.co/cdn/shop/files/SDN_Logo_PNG_c2998de5-8bad-48e6-a6f2-2926ada1a44d.png?v=1746689512&width=600"
                alt="Serge De Nimes"
                className="h-14 w-auto"
              />
            </a>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <a href="https://sergedenimes.co/account/login" className="text-sm text-sdn-black hover:text-sdn-teal transition-colors hidden sm:block">
                Log in
              </a>
              <a href="https://sergedenimes.co/cart" className="relative">
                <svg className="w-6 h-6 text-sdn-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-8 pb-4 -mt-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
              >
                <a
                  href={link.href}
                  onClick={(e) => link.active && e.preventDefault()}
                  className={`text-sm tracking-wide transition-colors ${
                    link.active
                      ? "text-sdn-teal font-semibold"
                      : "text-sdn-black hover:text-sdn-teal"
                  }`}
                >
                  {link.label}
                </a>

                {/* Shop dropdown */}
                {link.hasDropdown && shopOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-sdn-gray-border shadow-lg py-3 min-w-[220px] z-50">
                    {SHOP_DROPDOWN.map((item) => (
                      <a
                        key={item}
                        href={`https://sergedenimes.co/collections/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="block px-5 py-1.5 text-xs tracking-wider text-sdn-black hover:text-sdn-teal hover:bg-sdn-gray transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sdn-gray-border bg-white">
            <nav className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.active) e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                  className={`block text-sm tracking-wide ${
                    link.active ? "text-sdn-teal font-semibold" : "text-sdn-black"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Title + CTA */}
        <section className="text-center py-10 sm:py-14 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-sdn-black tracking-wide">
            Revamp My Existing Denim Wear
          </h1>
          <p className="mt-3 text-lg text-sdn-black/60 italic font-light">
            Give your favorite denim a fresh, hand-painted twist
          </p>

          {/* AI Visualize Button — right under the title */}
          <button
            onClick={onOpenStudio}
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-sdn-teal text-white font-semibold tracking-wider uppercase text-sm hover:bg-sdn-teal/90 transition-colors"
          >
            
            Revamp Your Denim ✨
          </button>
        </section>

        {/* Hero Image */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://sergedenimes.co/cdn/shop/files/WhatsApp_Image_2025-07-25_at_11.25.59_AM.jpg?v=1753786813&width=1500"
            alt="Revamp your denim with custom hand-painted designs"
            className="w-full h-auto"
          />
        </section>

        {/* Description */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-sdn-black mb-6">
            Breathe New Life Into Your Denim
          </h2>
          <p className="text-sdn-black/70 leading-relaxed mb-4">
            Already own a denim piece you love? No problem.
          </p>
          <p className="text-sdn-black/70 leading-relaxed">
            Whether it&apos;s a jacket, jeans, or any other denim article, we offer custom
            hand-painted designs tailored to your vision. From bold motifs to subtle art,
            our artisans transform your favorite denim into a wearable masterpiece.
          </p>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <h2 className="text-2xl font-bold text-sdn-black text-center mb-8">
            Get In Touch
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm text-sdn-black mb-1">Name *</label>
              <input
                type="text"
                className="w-full border border-sdn-gray-border px-4 py-3 text-sm focus:outline-none focus:border-sdn-teal transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-sdn-black mb-1">Email *</label>
              <input
                type="email"
                className="w-full border border-sdn-gray-border px-4 py-3 text-sm focus:outline-none focus:border-sdn-teal transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-sdn-black mb-1">Phone number *</label>
              <input
                type="tel"
                className="w-full border border-sdn-gray-border px-4 py-3 text-sm focus:outline-none focus:border-sdn-teal transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-sdn-black mb-1">Comment *</label>
              <textarea
                rows={5}
                className="w-full border border-sdn-gray-border px-4 py-3 text-sm focus:outline-none focus:border-sdn-teal transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white border border-sdn-black text-sdn-black font-semibold tracking-wide uppercase text-sm hover:bg-sdn-black hover:text-white transition-colors"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sdn-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-lg tracking-wider mb-4">SERGE DE NIMES</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>+971 50 217 5413</p>
                <p>sergedenimes5ive@gmail.com</p>
                <p>Monday till Friday</p>
                <p>10 AM to 6 PM - Dubai Time</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm text-white/70">
                <a href="https://sergedenimes.co/policies/privacy-policy" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="https://sergedenimes.co/policies/shipping-policy" className="block hover:text-white transition-colors">Shipping &amp; Returns</a>
                <a href="https://sergedenimes.co/policies/terms-of-service" className="block hover:text-white transition-colors">Terms and Conditions</a>
              </div>
            </div>

            {/* Our Shop */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Our Shop</h3>
              <div className="space-y-2 text-sm text-white/70">
                <a href="https://sergedenimes.co" className="block hover:text-white transition-colors">Home</a>
                <a href="https://sergedenimes.co/collections" className="block hover:text-white transition-colors">Shop</a>
                <a href="https://sergedenimes.co/collections" className="block hover:text-white transition-colors">Collections</a>
                <a href="https://sergedenimes.co/pages/gallery" className="block hover:text-white transition-colors">Gallery</a>
                <a href="https://sergedenimes.co/pages/about-us" className="block hover:text-white transition-colors">About Us</a>
                <a href="https://sergedenimes.co/pages/contact" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Newsletter</h3>
              <p className="text-sm text-white/70 mb-4">
                Receive our weekly newsletter. For fashion insider and the best offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-transparent border border-white/30 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                />
                <button className="px-4 py-2 bg-white text-sdn-black text-sm font-semibold tracking-wide uppercase hover:bg-white/90 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Social + Copyright */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/sergedenimes" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://facebook.com/sergedenimes" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com/@sergedenimes" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://twitter.com/sergedenimes" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Serge De Nimes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
