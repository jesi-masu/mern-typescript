import React from "react";
// Note: Link component removed for compatibility
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-prefab-50 py-16 transition-all duration-500 ease-in-out">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="transform transition-all duration-500 hover:scale-105">
            {/* CAMCO Logo Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* CAMCO Logo SVG */}
                  <svg width="200" height="120" viewBox="0 0 200 120" className="w-48 h-auto">
                    {/* Building Structure */}
                    <g stroke="#2c3e50" strokeWidth="2" fill="none">
                      {/* Back building outline */}
                      <rect x="60" y="20" width="40" height="50" fill="#e8f4fd" />
                      <rect x="105" y="15" width="35" height="55" fill="#e8f4fd" />
                      
                      {/* Front building main structure */}
                      <rect x="30" y="35" width="60" height="45" fill="#ffffff" stroke="#2c3e50" strokeWidth="2" />
                      
                      {/* Blue sections */}
                      <rect x="65" y="20" width="30" height="25" fill="#1e40af" />
                      <rect x="110" y="15" width="25" height="30" fill="#1e40af" />
                      <rect x="35" y="40" width="20" height="35" fill="#3b82f6" />
                      
                      {/* Windows and door details */}
                      <rect x="45" y="50" width="8" height="12" fill="#ffffff" stroke="#2c3e50" />
                      <rect x="55" y="50" width="8" height="12" fill="#ffffff" stroke="#2c3e50" />
                      <rect x="70" y="45" width="12" height="20" fill="#ffffff" stroke="#2c3e50" />
                      <rect x="115" y="35" width="8" height="12" fill="#ffffff" stroke="#2c3e50" />
                      <rect x="125" y="35" width="8" height="12" fill="#ffffff" stroke="#2c3e50" />
                      
                      {/* Door */}
                      <rect x="40" y="60" width="6" height="15" fill="#ffffff" stroke="#2c3e50" />
                      <circle cx="44" cy="67" r="0.5" fill="#2c3e50" />
                    </g>
                    
                    {/* Company Text */}
                    <text x="100" y="95" textAnchor="middle" className="fill-blue-700 font-bold text-lg">
                      CAMCO
                    </text>
                    <text x="100" y="110" textAnchor="middle" className="fill-blue-600 font-medium text-sm">
                      MEGA SALES CORP
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Build Your Future?
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Partner with CAMCO Mega Sales Corp for innovative prefabricated solutions 
                  that combine quality, efficiency, and modern design.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => {/* Add your contact logic here */}}
              >
                Get Started Today
              </Button>
              
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <img 
              src="https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Copy-of-For-Final-Website-3.png" 
              alt="3D Design Interface - CAMCO Prefabricated Structures" 
              className="w-full h-auto transition-transform duration-500 hover:scale-70"
            />
          </div>
        </div>
        
        {/* Additional Brand Elements */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Trusted by hundreds of clients nationwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;