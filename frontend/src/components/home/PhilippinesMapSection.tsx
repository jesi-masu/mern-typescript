import React, { useState } from "react";
import { Navigation, MapPin, Building, Home, Factory } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectLocation {
  id: number;
  name: string;
  region: string;
  type: "residential" | "commercial" | "industrial";
  projects: number;
  icon: React.ElementType;
}

const projectLocations: ProjectLocation[] = [
  // Luzon
  {
    id: 1,
    name: "Claveria",
    region: "Northern Luzon",
    type: "residential",
    projects: 2,
    icon: Home,
  },
  {
    id: 2,
    name: "Tuguegarao",
    region: "Northern Luzon",
    type: "commercial",
    projects: 3,
    icon: Building,
  },
  {
    id: 11,
    name: "Manila",
    region: "Northern Luzon",
    type: "commercial",
    projects: 5,
    icon: Building,
  },
  {
    id: 12,
    name: "Baguio",
    region: "Northern Luzon",
    type: "residential",
    projects: 7,
    icon: Home,
  },
  // Central Visayas
  {
    id: 3,
    name: "Cebu",
    region: "Central Visayas",
    type: "commercial",
    projects: 4,
    icon: Building,
  },
  {
    id: 4,
    name: "Bohol",
    region: "Central Visayas",
    type: "residential",
    projects: 6,
    icon: Home,
  },
  {
    id: 13,
    name: "Iloilo",
    region: "Central Visayas",
    type: "industrial",
    projects: 9,
    icon: Factory,
  },
  {
    id: 14,
    name: "Boracay",
    region: "Central Visayas",
    type: "residential",
    projects: 3,
    icon: Home,
  },
  // Mindanao
  {
    id: 5,
    name: "Cagayan de Oro",
    region: "Mindanao",
    type: "industrial",
    projects: 12,
    icon: Factory,
  },
  {
    id: 6,
    name: "Iligan",
    region: "Mindanao",
    type: "industrial",
    projects: 7,
    icon: Factory,
  },
  {
    id: 7,
    name: "Agusan",
    region: "Mindanao",
    type: "residential",
    projects: 4,
    icon: Home,
  },
  {
    id: 8,
    name: "Bukidnon",
    region: "Mindanao",
    type: "residential",
    projects: 6,
    icon: Home,
  },
  {
    id: 9,
    name: "General Santos",
    region: "Mindanao",
    type: "commercial",
    projects: 8,
    icon: Building,
  },
  {
    id: 10,
    name: "Zamboanga",
    region: "Mindanao",
    type: "industrial",
    projects: 4,
    icon: Factory,
  },
  {
    id: 15,
    name: "Davao",
    region: "Mindanao",
    type: "commercial",
    projects: 15,
    icon: Building,
  },
  {
    id: 16,
    name: "Dinagat Island",
    region: "Mindanao",
    type: "residential",
    projects: 4,
    icon: Home,
  },
];

// City marker positions (percentage-based for responsive positioning)
interface CityMarker {
  city: string;
  top: string;
  left: string;
  type: "residential" | "commercial" | "industrial";
}

const cityMarkers: CityMarker[] = [
  // Northern Luzon - Positioned next to circles on the map, not covering text
  { city: "Claveria", top: "12%", left: "58%", type: "residential" }, // Green circle - upper right
  { city: "Tuguegarao", top: "20%", left: "54%", type: "commercial" }, // Blue circle - below Claveria

  // Visayas - Positioned next to circles on the left side
  { city: "Cebu", top: "38%", left: "35%", type: "commercial" }, // Blue circle - left side
  { city: "Bohol", top: "51%", left: "35%", type: "residential" }, // Orange circle - left side below Cebu

  // Mindanao - Positioned next to circles, avoiding text labels
  { city: "Dinagat Island", top: "63%", left: "72%", type: "residential" }, // Green circle - positioned beside circle and label
  { city: "Cagayan de Oro", top: "73%", left: "60%", type: "industrial" }, // Orange circle - center
  { city: "Iligan", top: "76%", left: "50%", type: "industrial" }, // Orange circle - left center
  { city: "Agusan", top: "77%", left: "80%", type: "residential" }, // Green circle - right side
  { city: "Bukidnon", top: "83%", left: "72%", type: "residential" }, // Orange circle - positioned beside BUKIDNON text
  { city: "Zamboanga", top: "85%", left: "40%", type: "industrial" }, // Green circle - positioned beside circle on left side
  { city: "General Santos", top: "92%", left: "65%", type: "commercial" }, // Gray circle - bottom center
];

const PhilippinesMapSection: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const projectTypeColors = {
    residential: "text-emerald-500",
    commercial: "text-blue-500",
    industrial: "text-amber-500",
  };

  const projectTypeBgColors = {
    residential: "bg-emerald-500",
    commercial: "bg-blue-500",
    industrial: "bg-amber-500",
  };

  const regionColors = {
    "Northern Luzon": "text-red-500",
    "Central Visayas": "text-purple-500",
    Mindanao: "text-cyan-500",
  };

  const getProjectTypeBgColorClass = (type: string) =>
    projectTypeBgColors[type as keyof typeof projectTypeBgColors] ||
    "bg-gray-500";

  const getRegionColorClass = (region: string) =>
    regionColors[region as keyof typeof regionColors] || "text-gray-500";

  const totalProjects = projectLocations.reduce(
    (sum, loc) => sum + loc.projects,
    0
  );
  const totalCities = new Set(projectLocations.map((loc) => loc.name)).size;
  const totalRegions = new Set(projectLocations.map((loc) => loc.region)).size;

  const regionalProjectCounts = projectLocations.reduce((acc, loc) => {
    acc[loc.region] = (acc[loc.region] || 0) + loc.projects;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Our Reach
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Delivering Excellence Across the Philippines
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Explore our diverse portfolio of completed prefabricated projects,
            showcasing our nationwide presence and commitment to quality,
            efficiency, and tailored solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              From the vibrant urban centers to the serene rural landscapes,
              Camco Prefab has left its mark. Our projects range from modular
              homes providing rapid housing solutions, to cutting-edge prefab
              offices fostering modern workspaces, and robust industrial
              facilities supporting vital industries. Each completed structure
              is a testament to our adaptability and precision, engineered to
              meet the unique demands of clients across the archipelago.
            </p>

            {/* Project Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-5xl font-extrabold text-green-600 mb-2 drop-shadow-md">
                  {totalProjects}+
                </div>
                <div className="text-md text-gray-700 font-semibold">
                  Total Projects
                </div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-5xl font-extrabold text-blue-600 mb-2 drop-shadow-md">
                  {totalCities}
                </div>
                <div className="text-md text-gray-700 font-semibold">
                  Cities Covered
                </div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-5xl font-extrabold text-purple-600 mb-2 drop-shadow-md">
                  {totalRegions}
                </div>
                <div className="text-md text-gray-700 font-semibold">
                  Key Regions
                </div>
              </div>
            </div>

            {/* Regional Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Regional Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(regionalProjectCounts).map(
                  ([region, count]) => (
                    <div
                      key={region}
                      className="flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${getRegionColorClass(
                            region
                          ).replace(
                            "text-",
                            "bg-"
                          )} shadow-sm group-hover:scale-110 transition-transform`}
                        ></div>
                        <span className="text-lg text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                          {region}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {count} projects
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/projects")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                <Navigation className="h-5 w-5 mr-1" />
                View All Projects
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                Contact Our Team
              </button>
            </div>
          </div>

          {/* Map Image */}
          <div className="flex justify-center order-1 lg:order-2 relative">
            <div className="relative w-full max-w-lg">
              <div className="relative p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
                <div className="relative">
                  <img
                    src="https://camcoprefabricatedstructures.com/wp-content/uploads/2024/08/5-32741-1-1024x1024.png"
                    alt="Philippines Project Locations Map"
                    className="w-full h-auto rounded-2xl"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23E5E7EB" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236B7280" font-size="18" font-family="sans-serif"%3EMap Image Placeholder%3C/text%3E%3Ctext x="50%25" y="55%25" text-anchor="middle" fill="%239CA3AF" font-size="12" font-family="sans-serif"%3EReplace with your map image%3C/text%3E%3C/svg%3E';
                    }}
                  />

                  {/* Interactive City Markers */}
                  {cityMarkers.map((marker) => {
                    const cityData = projectLocations.find(
                      (loc) => loc.name === marker.city
                    );
                    return (
                      <button
                        key={marker.city}
                        onClick={() => navigate("/projects")}
                        onMouseEnter={() => setHoveredCity(marker.city)}
                        onMouseLeave={() => setHoveredCity(null)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                        style={{ top: marker.top, left: marker.left }}
                        aria-label={`View projects in ${marker.city}`}
                      >
                        {/* Pulsing Ring Animation */}
                        <div
                          className={`absolute inset-0 rounded-full ${getProjectTypeBgColorClass(
                            marker.type
                          )} opacity-30 animate-ping`}
                        ></div>

                        {/* Main Marker Circle */}
                        <div
                          className={`relative w-6 h-6 rounded-full ${getProjectTypeBgColorClass(
                            marker.type
                          )} border-2 border-white shadow-lg transform transition-all duration-300 group-hover:scale-150 group-hover:shadow-2xl`}
                        >
                          {/* Inner Dot */}
                          <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"></div>
                        </div>

                        {/* Tooltip on Hover */}
                        {hoveredCity === marker.city && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-20 animate-fade-in">
                            <div className="text-center">
                              <div className="font-bold">{marker.city}</div>
                              {cityData && (
                                <div className="text-gray-300 text-xs">
                                  {cityData.projects} projects
                                </div>
                              )}
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-sm font-bold text-gray-800 mb-3">
                    Project Types
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(projectTypeColors).map(
                      ([type, colorClass]) => (
                        <div key={type} className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${colorClass.replace(
                              "text-",
                              "bg-"
                            )}`}
                          ></div>
                          <span className="text-xs text-gray-700 capitalize">
                            {type}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default PhilippinesMapSection;
