import { Wind, Layers, DollarSign, Clock, Gauge, Construction, Ruler } from "lucide-react";

const TechnicalDataSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-900 text-white overflow-hidden">
      <style jsx>{`
        @keyframes slide-horizontal {
          0%, 100% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(10px);
          }
        }
        .animate-slide-horizontal {
          animation: slide-horizontal 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase bg-blue-400/20 px-4 py-2 rounded-full border border-blue-300/30">
              Specifications
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            TECHNICAL DATA
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Our prefabricated containers offer superior specifications designed for 
            <span className="text-white font-semibold"> durability</span>, 
            <span className="text-white font-semibold"> efficiency</span>, and 
            <span className="text-white font-semibold"> customization</span>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Stackable, Window, Wind, Switch */}
          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-300/30 rounded-xl mr-4 group-hover:bg-blue-300/40 transition-colors duration-300">
                  <img src="/photos/Technicaldata/home_icon-removebg-preview.png" alt="Customizable Stackable" className="w-12 h-10" />
                </div>
                <h3 className="text-xl font-bold">CUSTOMIZABLE STACKABLE</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">Modular design allows for vertical and horizontal expansion</p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-300/30 rounded-xl mr-4 group-hover:bg-blue-300/40 transition-colors duration-300">
                  <Layers className="w-8 h-8 text-blue-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">DOUBLE GLASS</h3>
                  <p className="text-blue-100 text-sm font-medium">PVC WINDOW</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-300/30 rounded-xl mr-4 group-hover:bg-blue-300/40 transition-colors duration-300">
                  <Wind className="w-8 h-8 text-blue-100" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">100KM/H</h3>
                  <p className="text-blue-100 text-sm">WIND RESISTANCE</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="flex items-center p-3 bg-blue-300/30 rounded-xl mr-4 group-hover:bg-blue-300/40 transition-colors duration-300">
                  <img src="/photos/Technicaldata/switch_icon-removebg-preview.png" alt="Switch" className="w-8 h-8 mr-2" />
                  <img src="/photos/Technicaldata/outlet_icon-removebg-preview.png" alt="Outlet" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SWITCH + OUTLET</h3>
                  <p className="text-yellow-200 text-sm font-medium">DELUXE SERIES *ADD-ON</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2: Speed, Container Diagram, Load */}
          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-green-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-5xl font-bold text-green-300">10<sup className="text-2xl">X</sup></h3>
                  <p className="text-xl font-semibold">FASTER</p>
                </div>
                <div className="text-right bg-blue-800/40 p-4 rounded-xl">
                  <p className="text-lg text-blue-200">VS</p>
                  <p className="text-lg font-medium">REGULAR<br/>CONSTRUCTION</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-10 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="animate-slide-horizontal">
                  <img 
                    src="/photos/Technicaldata/prefab_container_icon-removebg-preview.png" 
                    alt="Prefab Container" 
                    className="w-full h-auto filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                {/* Floating animation elements around container */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-200/80 rounded-full animate-bounce delay-300"></div>
                <div className="absolute -top-1 -right-3 w-3 h-3 bg-blue-100/80 rounded-full animate-bounce delay-500"></div>
                <div className="absolute -bottom-2 left-1/4 w-2 h-2 bg-blue-300/80 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-0 right-1/3 w-3 h-3 bg-white/60 rounded-full animate-bounce delay-1000"></div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium italic text-blue-100 bg-blue-800/40 px-4 py-2 rounded-lg animate-pulse">
                  @Camco Mega Sales Corp.
                </p>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-orange-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-300/30 rounded-xl mr-4 group-hover:bg-orange-300/40 transition-colors duration-300">
                  <Construction className="w-8 h-8 text-orange-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-200">UP TO 150KG</h3>
                  <p className="text-blue-100 text-sm">AISLE LOAD / SQM</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 3: Assembly, Cost, Insulation, Dimensions */}
          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-purple-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-300/30 rounded-xl mr-4 group-hover:bg-purple-300/40 transition-colors duration-300">
                  <Clock className="w-8 h-8 text-purple-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-200">2 DAYS</h3>
                  <p className="text-blue-100 text-sm">ASSEMBLY</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-emerald-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-300/30 rounded-xl mr-4 group-hover:bg-emerald-300/40 transition-colors duration-300">
                  <DollarSign className="w-8 h-8 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-200">COST</h3>
                  <p className="text-blue-100 text-sm">EFFECTIVE</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
              <h3 className="text-xl font-bold mb-3">INSULATED EPS WALL</h3>
              <div className="flex items-center space-x-2">
                <span className="bg-red-300/30 text-red-100 px-3 py-1 rounded-full text-sm font-medium">TERMITE PROOF</span>
                <span className="text-blue-200">+</span>
                <span className="bg-blue-300/30 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">WATER PROOF</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-6 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-cyan-300/50 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-cyan-200 mb-4">FLOOR AREA</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-xl">18.00<small className="text-sm ml-1">SQM</small></p>
                    <p className="text-xs text-blue-200">EXTERIOR</p>
                  </div>
                  <div>
                    <p className="font-bold text-xl">16.50<small className="text-sm ml-1">SQM</small></p>
                    <p className="text-xs text-blue-200">INTERIOR</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-6 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-yellow-300/50 transition-all duration-500">
                <div className="flex items-center mb-4">
                  <Ruler className="w-5 h-5 text-yellow-200 mr-2" />
                  <h3 className="text-lg font-bold text-yellow-200">HEIGHT</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-xl">2.80M</p>
                    <p className="text-xs text-blue-200">EXTERIOR</p>
                  </div>
                  <div>
                    <p className="font-bold text-xl">2.40M</p>
                    <p className="text-xs text-blue-200">INTERIOR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-indigo-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-300/30 rounded-xl mr-4 group-hover:bg-indigo-300/40 transition-colors duration-300">
                <img src="/photos/Technicaldata/flooring_load_icon-removebg-preview.png" alt="Flooring Load" className="w-10 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-200">150KG</h3>
                <p className="text-blue-100 text-sm">FLOORING LOAD / SQM</p>
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-teal-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/30">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-teal-300/30 rounded-xl mr-4 group-hover:bg-teal-300/40 transition-colors duration-300">
                <Layers className="w-8 h-8 text-teal-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-teal-200">18MM MGO FLOOR</h3>
                <p className="text-blue-100 text-sm">STRONGER &gt; FIBER CEMENT</p>
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-blue-400/80 to-blue-600/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-300/20 hover:border-rose-300/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/30">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-rose-300/30 rounded-xl mr-4 group-hover:bg-rose-300/40 transition-colors duration-300">
                <Gauge className="w-8 h-8 text-rose-200" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-rose-200">1.25 TONS</h3>
                <p className="text-blue-100 text-sm">GROSS WEIGHT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalDataSection;