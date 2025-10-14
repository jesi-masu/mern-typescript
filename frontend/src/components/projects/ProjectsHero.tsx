import { Building2, CheckCircle2, Layers } from "lucide-react";

type Stats = {
  totalProjects: number;
  completedProjects: number;
  totalModules: number;
};

interface ProjectsHeroProps {
  stats: Stats;
  scrollY: number;
}

const ProjectsHero = ({ stats, scrollY }: ProjectsHeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
            animationDelay: "1s",
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-gradient">
              Our Distinguished
            </span>
            <br />
            <span className="text-blue-200">Projects</span>
          </h1>
          <p
            className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Explore our portfolio of successfully completed projects, showcasing
            our commitment to quality, innovation, and excellence in
            prefabricated construction.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                  {stats.totalProjects}+
                </div>
                <Building2 className="w-10 h-10 text-indigo-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                Total Projects
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                  {stats.completedProjects}
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                Completed
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                  {stats.totalModules}
                </div>
                <Layers className="w-10 h-10 text-purple-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                Modules Deployed
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-gray-50 dark:text-gray-900"
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
    </section>
  );
};

export default ProjectsHero;
