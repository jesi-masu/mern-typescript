import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

export const ContactHero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // --- MODIFIED: Gradient, Padding (pt-16 pb-24) ---
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white pt-16 pb-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          // --- MODIFIED: Blur color ---
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          // --- MODIFIED: Blur color ---
          className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
            animationDelay: "1s",
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZHRoPSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      {/* Main Content */}
      {/* --- MODIFIED: Added mb-12 for wave spacing --- */}
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 shadow-xl animate-fade-in-down hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: "0.2s" }}
          >
            <MessageCircle className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              We're Here to Help
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-gradient">
              Get in Touch
            </span>
            <br />
            {/* --- MODIFIED: Text color to match FAQ --- */}
            <span className="text-blue-300">With Our Team</span>
          </h1>

          {/* Paragraph */}
          <p
            // --- MODIFIED: Text color to match FAQ ---
            className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Have questions about our prefab solutions or need help with your
            project? Our dedicated team is ready to bring your vision to life.
          </p>

          {/* Info Section */}
          <div
            className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              {/* --- MODIFIED: Text color --- */}
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Support Available
              </div>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                &lt;24h
              </div>
              {/* --- MODIFIED: Text color --- */}
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Response Time
              </div>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              {/* --- MODIFIED: Text color --- */}
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADDED SVG WAVE DIV --- */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-gray-50 dark:text-gray-900" // Adjust color if needed
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* --- END OF ADDED DIV --- */}
    </section>
  );
};
