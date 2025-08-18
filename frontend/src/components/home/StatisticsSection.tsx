import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Users, Building, Award } from "lucide-react";

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: Building,
      number: 2500,
      suffix: "+",
      label: "Prefab Units Delivered",
      description: "Successfully installed!",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Users,
      number: 1200,
      suffix: "+",
      label: "Satisfied Customers",
      description: "Across the Philippines",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: TrendingUp,
      number: 98,
      suffix: "%",
      label: "Customer Satisfaction",
      description: "Based on post-delivery surveys",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Award,
      number: 15,
      suffix: "+",
      label: "Years Experience",
      description: "In prefab construction industry",
      color: "from-orange-600 to-red-600"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate numbers only once when first visible
      stats.forEach((stat, index) => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.number / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          current += increment;
          step++;
          
          if (step >= steps) {
            current = stat.number;
            clearInterval(timer);
          }

          setAnimatedNumbers(prev => {
            const newNumbers = [...prev];
            newNumbers[index] = Math.floor(current);
            return newNumbers;
          });
        }, duration / steps);
      });

      // Set up interval to refresh numbers every minute
      const refreshInterval = setInterval(() => {
        // Quick refresh animation
        stats.forEach((stat, index) => {
          const duration = 800;
          const steps = 20;
          const startValue = animatedNumbers[index];
          const increment = (stat.number - startValue) / steps;
          let current = startValue;
          let step = 0;

          const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
              current = stat.number;
              clearInterval(timer);
            }

            setAnimatedNumbers(prev => {
              const newNumbers = [...prev];
              newNumbers[index] = Math.floor(current);
              return newNumbers;
            });
          }, duration / steps);
        });
      }, 60000); // Refresh every minute

      return () => clearInterval(refreshInterval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20 mb-6">
            <span className="text-sm font-medium text-white text-opacity-90">Our Achievement</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white text-opacity-80 max-w-3xl mx-auto leading-relaxed">
            Our track record speaks for itself - delivering quality prefab solutions 
            that exceed expectations and transform communities across the Philippines.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-20 rounded-2xl blur-sm transition-opacity duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:border-white hover:border-opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full">
                  
                  {/* Icon with gradient background */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                      <stat.icon className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white opacity-60 rounded-full animate-ping"></div>
                    <div className="absolute top-2 -left-2 w-2 h-2 bg-white opacity-40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </div>

                  {/* Animated number */}
                  <div className="mb-4">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                      {animatedNumbers[index].toLocaleString()}{stat.suffix}
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-white to-transparent opacity-60 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-100 transition-colors">
                      {stat.label}
                    </h3>
                    <p className="text-white text-opacity-70 text-sm leading-relaxed group-hover:text-white group-hover:text-opacity-90 transition-colors">
                      {stat.description}
                    </p>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-b-2xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-full border border-white border-opacity-10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white text-opacity-80">Live statistics updated daily</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;