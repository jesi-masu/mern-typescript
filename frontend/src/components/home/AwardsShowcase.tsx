import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Medal, Sparkles, Crown, Zap } from 'lucide-react';

const StunningAwardsShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAward, setActiveAward] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveAward(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const awards = [
    {
      id: 1,
      title: "Excellence in Service Award",
      year: "2024",
      organization: "Industry Leaders Association",
      description: "Recognized for outstanding customer service and satisfaction ratings exceeding 98%",
      icon: Trophy,
      color: "from-amber-400 via-yellow-500 to-orange-500",
      shadowColor: "shadow-amber-500/30",
      glowColor: "drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]",
      bgPattern: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      id: 2,
      title: "Innovation Excellence",
      year: "2023",
      organization: "Tech Innovation Council",
      description: "Awarded for groundbreaking solutions and technological advancement in the industry",
      icon: Zap,
      color: "from-blue-400 via-cyan-500 to-teal-500",
      shadowColor: "shadow-blue-500/30",
      glowColor: "drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]",
      bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      id: 3,
      title: "Best Company Culture",
      year: "2023",
      organization: "Workplace Excellence Institute",
      description: "Honored for fostering an inclusive, collaborative, and growth-oriented work environment",
      icon: Crown,
      color: "from-purple-400 via-violet-500 to-indigo-500",
      shadowColor: "shadow-purple-500/30",
      glowColor: "drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]",
      bgPattern: "bg-gradient-to-br from-purple-50 to-indigo-50"
    },
    {
      id: 4,
      title: "Sustainability Leadership",
      year: "2022",
      organization: "Green Business Alliance",
      description: "Recognized for implementing eco-friendly practices and sustainable business operations",
      icon: Medal,
      color: "from-emerald-400 via-green-500 to-teal-500",
      shadowColor: "shadow-emerald-500/30",
      glowColor: "drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-10 h-10 text-white filter drop-shadow-lg" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
            </div>
          </div>

          <h2 className="text-6xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent mb-6 tracking-tight">
            Recognition & Awards
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Our relentless pursuit of excellence has earned recognition from the world's most prestigious organizations
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
            <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Premium Awards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {awards.map((award, index) => {
            const IconComponent = award.icon;
            const isActive = activeAward === index;
            
            return (
              <div
                key={award.id}
                className={`group relative transform transition-all duration-700 hover:scale-105 cursor-pointer ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                } ${isActive ? 'scale-105' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Outer Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${award.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500 ${isActive ? 'opacity-10' : ''}`}></div>
                
                {/* Main Card */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                  {/* Premium Background Pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
                  </div>

                  <div className="relative p-10">
                    {/* Award Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="relative">
                        {/* Icon Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${award.color} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
                        <div className={`relative w-20 h-20 bg-gradient-to-r ${award.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-10 h-10 text-white filter drop-shadow-lg" />
                        </div>
                        {/* Floating Sparkles */}
                        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${award.color} text-white text-lg font-bold rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {award.year}
                        </div>
                      </div>
                    </div>

                    {/* Award Content */}
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-yellow-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {award.title}
                      </h3>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 bg-gradient-to-r ${award.color} rounded-full animate-pulse`}></div>
                        <p className="text-yellow-200 font-semibold text-lg">
                          {award.organization}
                        </p>
                      </div>

                      <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                        {award.description}
                      </p>
                    </div>

                    {/* Premium Footer */}
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-5 h-5 text-yellow-400 fill-current filter drop-shadow-sm animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${award.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-lg`}>
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Subtle Border Highlight */}
                  <div className={`absolute inset-0 rounded-3xl border-2 border-gradient-to-r ${award.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                       style={{
                         background: `linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)) padding-box, 
                                     linear-gradient(135deg, 
                                       ${award.color.includes('amber') ? 'rgba(245,158,11,0.3)' : 
                                         award.color.includes('blue') ? 'rgba(59,130,246,0.3)' : 
                                         award.color.includes('purple') ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.3)'}, 
                                       transparent, 
                                       ${award.color.includes('amber') ? 'rgba(245,158,11,0.3)' : 
                                         award.color.includes('blue') ? 'rgba(59,130,246,0.3)' : 
                                         award.color.includes('purple') ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.3)'}) border-box`,
                         borderRadius: '1.5rem'
                       }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Bottom Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-xl px-8 py-4 rounded-full border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-4">
                <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                <span className="text-white font-bold text-xl">
                  Trusted by industry leaders since 2020
                </span>
                <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDelay: '100ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .group:hover .animate-pulse {
          animation-play-state: paused;
        }

        /* Performance optimizations */
        .group {
          will-change: transform;
        }

        .group:hover {
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
};

export default StunningAwardsShowcase;