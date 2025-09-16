import React, { useState, useEffect } from "react";
import { Navigation, MapPin, Building, Home, Factory } from "lucide-react";

// Define the structure for project locations
interface ProjectLocation {
  id: number;
  name: string;
  region: string;
  type: "residential" | "office" | "industrial";
  x: number; // SVG X coordinate
  y: number; // SVG Y coordinate
  projects: number;
  icon: React.ElementType; // Lucide React icon component
}

// Data for project locations across the Philippines
const projectLocations: ProjectLocation[] = [
  // Luzon
  {
    id: 1,
    name: "Claveria",
    region: "Northern Luzon",
    type: "residential",
    x: 180,
    y: 60,
    projects: 6,
    icon: Home,
  },
  {
    id: 2,
    name: "Tuguegarao",
    region: "Northern Luzon",
    type: "office",
    x: 195,
    y: 50,
    projects: 8,
    icon: Building,
  },
  {
    id: 11,
    name: "Manila",
    region: "Northern Luzon",
    type: "office",
    x: 170,
    y: 150,
    projects: 25,
    icon: Building,
  },
  {
    id: 12,
    name: "Baguio",
    region: "Northern Luzon",
    type: "residential",
    x: 160,
    y: 100,
    projects: 7,
    icon: Home,
  },

  // Central Visayas
  {
    id: 3,
    name: "Cebu",
    region: "Central Visayas",
    type: "office",
    x: 210,
    y: 220,
    projects: 12,
    icon: Building,
  },
  {
    id: 4,
    name: "Bohol",
    region: "Central Visayas",
    type: "residential",
    x: 235,
    y: 235,
    projects: 5,
    icon: Home,
  },
  {
    id: 13,
    name: "Iloilo",
    region: "Central Visayas",
    type: "industrial",
    x: 175,
    y: 210,
    projects: 9,
    icon: Factory,
  },
  {
    id: 14,
    name: "Boracay",
    region: "Central Visayas",
    type: "residential",
    x: 160,
    y: 190,
    projects: 3,
    icon: Home,
  },

  // Mindanao
  {
    id: 5,
    name: "Cagayan de Oro",
    region: "Mindanao",
    type: "industrial",
    x: 210,
    y: 270,
    projects: 10,
    icon: Factory,
  }, // <--- Target for special pulse
  {
    id: 6,
    name: "Iligan",
    region: "Mindanao",
    type: "industrial",
    x: 200,
    y: 265,
    projects: 7,
    icon: Factory,
  },
  {
    id: 7,
    name: "Agusan",
    region: "Mindanao",
    type: "residential",
    x: 250,
    y: 285,
    projects: 4,
    icon: Home,
  },
  {
    id: 8,
    name: "Bukidnon",
    region: "Mindanao",
    type: "residential",
    x: 220,
    y: 290,
    projects: 6,
    icon: Home,
  },
  {
    id: 9,
    name: "General Santos",
    region: "Mindanao",
    type: "office",
    x: 210,
    y: 350,
    projects: 8,
    icon: Building,
  },
  {
    id: 10,
    name: "Zamboanga",
    region: "Mindanao",
    type: "industrial",
    x: 180,
    y: 320,
    projects: 9,
    icon: Factory,
  },
  {
    id: 15,
    name: "Davao",
    region: "Mindanao",
    type: "office",
    x: 240,
    y: 320,
    projects: 15,
    icon: Building,
  },
];

const PhilippinesMapSection: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Define colors using Tailwind classes for consistency
  const projectTypeColors = {
    residential: "text-emerald-500",
    office: "text-blue-500",
    industrial: "text-amber-500",
  };

  const projectTypeBgColors = {
    residential: "bg-emerald-500",
    office: "bg-blue-500",
    industrial: "bg-amber-500",
  };

  const regionColors = {
    "Northern Luzon": "text-red-500",
    "Central Visayas": "text-purple-500",
    Mindanao: "text-cyan-500",
  };

  // Helper functions to get Tailwind color classes
  const getProjectTypeColorClass = (type: string) =>
    projectTypeColors[type as keyof typeof projectTypeColors] ||
    "text-gray-500";
  const getProjectTypeBgColorClass = (type: string) =>
    projectTypeBgColors[type as keyof typeof projectTypeBgColors] ||
    "bg-gray-500";
  const getRegionColorClass = (region: string) =>
    regionColors[region as keyof typeof regionColors] || "text-gray-500";

  // Calculate totals for the stats cards
  const totalProjects = projectLocations.reduce(
    (sum, loc) => sum + loc.projects,
    0
  );
  const totalCities = new Set(projectLocations.map((loc) => loc.name)).size;
  const totalRegions = new Set(projectLocations.map((loc) => loc.region)).size;

  // Calculate regional project counts for the overview
  const regionalProjectCounts = projectLocations.reduce((acc, loc) => {
    acc[loc.region] = (acc[loc.region] || 0) + loc.projects;
    return acc;
  }, {} as Record<string, number>);

  // Find Cagayan de Oro for its specific pulse animation
  const cagayanDeOro = projectLocations.find(
    (loc) => loc.name === "Cagayan de Oro"
  );

  // Coordinates for water ripples (can be randomized or strategically placed)
  const waterRippleOrigins = [
    { cx: 50, cy: 100, delay: 0 },
    { cx: 150, cy: 300, delay: 1.5 },
    { cx: 250, cy: 150, delay: 3 },
    { cx: 100, cy: 350, delay: 4.5 },
    { cx: 200, cy: 50, delay: 6 },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden font-inter">
      {/* Background blobs for dynamism */}
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

            {/* Project Stats - Enhanced Cards */}
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

            {/* Regional Overview - Refined List */}
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
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold">
                <Navigation className="h-5 w-5 mr-1" />
                View All Projects
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold">
                Contact Our Team
              </button>
            </div>
          </div>

          <div className="flex justify-center order-1 lg:order-2 relative">
            <div className="relative w-full max-w-lg p-4 bg-white/50 rounded-3xl shadow-2xl backdrop-blur-md border border-gray-200">
              {/* Philippines Map SVG - Retained the more accurate shape from your provided code */}
              <svg
                viewBox="0 0 300 400"
                className="w-full h-auto drop-shadow-2xl"
              >
                <defs>
                  {/* Water gradient */}
                  <radialGradient id="waterGradient" cx="0.5" cy="0.5" r="0.8">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="50%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </radialGradient>

                  {/* Luzon gradient */}
                  <linearGradient
                    id="luzonGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#A7F3D0" />
                    <stop offset="50%" stopColor="#6EE7B7" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  {/* Visayas gradient */}
                  <linearGradient
                    id="visayasGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#DDD6FE" />
                    <stop offset="50%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>

                  {/* Mindanao gradient */}
                  <linearGradient
                    id="mindanaoGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#CFFAFE" />
                    <stop offset="50%" stopColor="#67E8F9" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>

                  {/* Animated wave pattern - Enhanced */}
                  <pattern
                    id="waves"
                    patternUnits="userSpaceOnUse"
                    width="40"
                    height="40"
                    patternTransform="rotate(45)"
                  >
                    <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.1)">
                      <animate
                        attributeName="r"
                        values="2;4;2"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </pattern>

                  {/* Glow effects for markers and hovered islands */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Drop shadow for islands - Enhanced */}
                  <filter
                    id="dropshadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="4"
                      stdDeviation="4"
                      floodColor="#000000"
                      floodOpacity="0.35"
                    />
                  </filter>
                </defs>

                {/* Ocean background with waves */}
                <rect width="300" height="400" fill="url(#waterGradient)" />
                <rect
                  width="300"
                  height="400"
                  fill="url(#waves)"
                  opacity="0.4"
                />

                {/* NEW: Gentle Ripples over the water - More dynamic */}
                {waterRippleOrigins.map((ripple, i) => (
                  <circle
                    key={`water-ripple-${i}`}
                    cx={ripple.cx}
                    cy={ripple.cy}
                    r="0" // Start radius at 0
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)" // White/light blue stroke
                    strokeWidth="3"
                    className="animate-water-ripple"
                    style={{
                      animationDelay: `${ripple.delay}s`, // Stagger ripples
                      animationDuration: "8s", // Slow, long animation
                      transformOrigin: "center center",
                    }}
                  />
                ))}

                {/* LUZON - Main northern island with accurate shape */}
                <path
                  d="M 140 20 
                    C 150 18, 160 20, 170 25
                    C 185 30, 200 35, 210 45
                    C 215 55, 218 65, 220 75
                    C 225 85, 230 95, 228 105
                    C 225 115, 220 125, 215 135
                    C 210 145, 205 155, 200 165
                    C 195 175, 185 180, 175 178
                    C 165 176, 155 170, 150 160
                    C 145 150, 142 140, 140 130
                    C 138 120, 135 110, 133 100
                    C 130 90, 128 80, 125 70
                    C 122 60, 125 50, 130 40
                    C 135 30, 140 25, 140 20 Z"
                  fill="url(#luzonGradient)"
                  stroke="#059669"
                  strokeWidth="2"
                  // Fix: Construct filter string more robustly
                  filter={`url(#dropshadow) ${
                    hoveredRegion === "Northern Luzon" ? "url(#glow)" : ""
                  }`.trim()}
                  className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                    hoveredRegion === "Northern Luzon"
                      ? "brightness-120 scale-[1.02]"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredRegion("Northern Luzon")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* VISAYAS - Central islands group */}
                <g>
                  {/* Panay */}
                  <path
                    d="M 170 200 C 185 195, 195 205, 190 220 C 185 235, 175 240, 165 235 C 160 225, 165 210, 170 200 Z"
                    fill="url(#visayasGradient)"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    // Fix: Construct filter string more robustly
                    filter={`url(#dropshadow) ${
                      hoveredRegion === "Central Visayas" ? "url(#glow)" : ""
                    }`.trim()}
                    className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                      hoveredRegion === "Central Visayas"
                        ? "brightness-120 scale-[1.02]"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredRegion("Central Visayas")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />

                  {/* Cebu */}
                  <path
                    d="M 200 210 C 215 205, 225 215, 220 230 C 215 245, 205 250, 195 245 C 190 235, 195 220, 200 210 Z"
                    fill="url(#visayasGradient)"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    // Fix: Construct filter string more robustly
                    filter={`url(#dropshadow) ${
                      hoveredRegion === "Central Visayas" ? "url(#glow)" : ""
                    }`.trim()}
                    className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                      hoveredRegion === "Central Visayas"
                        ? "brightness-120 scale-[1.02]"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredRegion("Central Visayas")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />

                  {/* Bohol */}
                  <ellipse
                    cx="235"
                    cy="235"
                    rx="15"
                    ry="10"
                    fill="url(#visayasGradient)"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    // Fix: Construct filter string more robustly
                    filter={`url(#dropshadow) ${
                      hoveredRegion === "Central Visayas" ? "url(#glow)" : ""
                    }`.trim()}
                    className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                      hoveredRegion === "Central Visayas"
                        ? "brightness-120 scale-[1.02]"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredRegion("Central Visayas")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />

                  {/* Leyte and Samar (Simplified for SVG representation) */}
                  <path
                    d="M 240 200 C 255 195, 265 205, 260 220 C 255 235, 245 240, 235 235 C 230 225, 235 210, 240 200 Z"
                    fill="url(#visayasGradient)"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    // Fix: Construct filter string more robustly
                    filter={`url(#dropshadow) ${
                      hoveredRegion === "Central Visayas" ? "url(#glow)" : ""
                    }`.trim()}
                    className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                      hoveredRegion === "Central Visayas"
                        ? "brightness-120 scale-[1.02]"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredRegion("Central Visayas")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                </g>

                {/* MINDANAO - Southern large island with accurate shape */}
                <path
                  d="M 150 260
                    C 170 255, 190 258, 210 265
                    C 230 270, 250 280, 260 300
                    C 265 320, 260 340, 250 355
                    C 240 370, 225 375, 210 370
                    C 195 365, 180 360, 170 350
                    C 160 340, 155 325, 150 310
                    C 145 295, 147 280, 150 260 Z"
                  fill="url(#mindanaoGradient)"
                  stroke="#0891B2"
                  strokeWidth="2"
                  // Fix: Construct filter string more robustly
                  filter={`url(#dropshadow) ${
                    hoveredRegion === "Mindanao" ? "url(#glow)" : ""
                  }`.trim()}
                  className={`transition-all duration-500 hover:brightness-110 cursor-pointer ${
                    hoveredRegion === "Mindanao"
                      ? "brightness-120 scale-[1.02]"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredRegion("Mindanao")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* Palawan - Western elongated island */}
                <path
                  d="M 120 180 C 125 178, 130 185, 128 195 C 126 205, 120 215, 115 225 C 110 235, 108 245, 106 255 C 104 265, 102 275, 100 285 C 98 295, 96 305, 95 315 C 94 325, 96 335, 100 340 C 105 345, 110 342, 115 335 C 120 328, 118 320, 116 312 C 114 304, 112 296, 114 288 C 116 280, 118 272, 120 264 C 122 256, 124 248, 126 240 C 128 232, 130 224, 132 216 C 134 208, 132 200, 128 192 C 124 184, 120 180, 120 180 Z"
                  fill="url(#luzonGradient)"
                  stroke="#059669"
                  strokeWidth="1.5"
                  filter="url(#dropshadow)"
                  className="transition-all duration-500 hover:brightness-110 cursor-pointer"
                />

                {/* Animated connection lines between projects */}
                {projectLocations.map((location, index) => {
                  if (index === 0) return null; // No line for the first location
                  const prevLocation = projectLocations[index - 1];
                  return (
                    <line
                      key={`connection-${location.id}`}
                      x1={prevLocation.x}
                      y1={prevLocation.y}
                      x2={location.x}
                      y2={location.y}
                      stroke="rgba(59, 130, 246, 0.4)" // Slightly stronger blue for visibility
                      strokeWidth="1.5" // Thicker line
                      strokeDasharray="5,5" // More prominent dash
                      className="animate-dash-flow" // Custom animation for flow
                      style={{
                        animationDelay: `${index * 0.2}s`, // Staggered animation
                        animationDuration: "4s", // Slower, more elegant flow
                        animationIterationCount: "infinite",
                      }}
                    />
                  );
                })}

                {/* Project location markers */}
                {projectLocations.map((location) => {
                  const IconComponent = location.icon;
                  const isActive = activeLocation === location.id;

                  return (
                    <g
                      key={location.id}
                      onMouseEnter={() => setActiveLocation(location.id)}
                      onMouseLeave={() => setActiveLocation(null)}
                      className="cursor-pointer"
                    >
                      {/* Animated ripple effect - More subtle and larger */}
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r={isActive ? "18" : "15"} // Bigger ripple on active
                        fill="none"
                        stroke={getProjectTypeBgColorClass(
                          location.type
                        ).replace("bg-", "")}
                        strokeWidth="2"
                        opacity="0.4"
                        className={`transition-all duration-300 ${
                          isActive
                            ? "animate-ping-strong"
                            : "animate-ping-subtle"
                        }`}
                      />

                      {/* Main marker */}
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r={isActive ? "9" : "8"} // Slightly larger when active
                        fill={getProjectTypeBgColorClass(location.type).replace(
                          "bg-",
                          ""
                        )}
                        stroke="white"
                        strokeWidth="2"
                        filter="url(#glow)"
                        className={`transition-all duration-300 ${
                          isActive ? "scale-125" : "scale-100"
                        } drop-shadow-lg`}
                      />

                      {/* Icon inside the marker */}
                      <g
                        transform={`translate(${location.x - 6}, ${
                          location.y - 6
                        })`}
                        fill="white"
                        className="pointer-events-none" // Prevent icon from interfering with hover
                      >
                        <IconComponent className="h-3 w-3" />
                      </g>

                      {/* Project count badge - Smaller, more integrated */}
                      <circle
                        cx={location.x + 8}
                        cy={location.y - 8}
                        r="6"
                        fill="white"
                        stroke={getProjectTypeBgColorClass(
                          location.type
                        ).replace("bg-", "")}
                        strokeWidth="1.5"
                        filter="url(#dropshadow)"
                        className={`transition-all duration-300 ${
                          isActive ? "scale-110" : "scale-100"
                        } origin-center`}
                      />
                      <text
                        x={location.x + 8}
                        y={location.y - 8}
                        textAnchor="middle"
                        dy="0.3em"
                        fontSize="7" // Smaller font size
                        fill={getProjectTypeBgColorClass(location.type).replace(
                          "bg-",
                          ""
                        )}
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {location.projects}
                      </text>

                      {/* Enhanced tooltip - Appears on hover */}
                      {activeLocation === location.id && (
                        <g className="animate-fade-in-up">
                          <rect
                            x={location.x - 55} // Adjusted for better centering
                            y={location.y - 60} // Position above marker
                            width="110" // Wider tooltip
                            height="55" // Taller tooltip
                            fill="rgba(255,255,255,0.98)" // More opaque white
                            stroke={getProjectTypeBgColorClass(
                              location.type
                            ).replace("bg-", "")}
                            strokeWidth="2"
                            rx="8" // More rounded corners
                            filter="url(#dropshadow)"
                          />
                          {/* Triangle pointer */}
                          <polygon
                            points={`${location.x},${location.y - 5} ${
                              location.x - 5
                            },${location.y + 15} ${location.x + 5},${
                              location.y + 15
                            }`}
                            fill="white"
                            stroke={getProjectTypeBgColorClass(
                              location.type
                            ).replace("bg-", "")}
                            strokeWidth="1.5"
                            className="drop-shadow-sm"
                            transform={`translate(0, ${
                              location.y - 5
                            }) rotate(180 ${location.x} ${location.y + 10})`} // Rotate to point downwards from tooltip
                          />
                          <text
                            x={location.x}
                            y={location.y - 45} // Adjusted text position
                            textAnchor="middle"
                            fontSize="11"
                            fill="#1F2937"
                            fontWeight="bold"
                          >
                            {location.name}
                          </text>
                          <text
                            x={location.x}
                            y={location.y - 32} // Adjusted text position
                            textAnchor="middle"
                            fontSize="8"
                            fill="#6B7280"
                          >
                            {location.region}
                          </text>
                          <text
                            x={location.x}
                            y={location.y - 20} // Adjusted text position
                            textAnchor="middle"
                            fontSize="9"
                            fill={getProjectTypeBgColorClass(
                              location.type
                            ).replace("bg-", "")}
                            fontWeight="600"
                          >
                            {location.projects} projects ({location.type})
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* NEW: Cagayan de Oro specific pulse */}
                {cagayanDeOro && (
                  <circle
                    cx={cagayanDeOro.x}
                    cy={cagayanDeOro.y}
                    r="5" // Start small
                    fill="rgba(255, 255, 255, 0.7)" // White/light color
                    stroke={getProjectTypeBgColorClass(
                      cagayanDeOro.type
                    ).replace("bg-", "")} // Match project type color
                    strokeWidth="2"
                    className="animate-cdo-pulse"
                  />
                )}
              </svg>

              {/* Enhanced Legend - Positioned better */}
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm bg-opacity-90">
                <div className="text-base font-bold text-gray-800 mb-4">
                  Map Legend
                </div>

                {/* Project Types */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">
                    Project Types:
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(projectTypeColors).map(
                      ([type, colorClass]) => (
                        <div
                          key={type}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${colorClass.replace(
                              "text-",
                              "bg-"
                            )} shadow-sm`}
                          ></div>
                          <span className="text-gray-700 capitalize">
                            {type}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">
                    Regions:
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(regionColors).map(
                      ([region, colorClass]) => (
                        <div
                          key={region}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${colorClass.replace(
                              "text-",
                              "bg-"
                            )} shadow-sm`}
                          ></div>
                          <span className="text-gray-700">{region}</span>
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
      <style jsx>{`
        /* Keyframes for animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ping-strong {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          70% {
            transform: scale(1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes ping-subtle {
          0% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          70% {
            transform: scale(1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes dash-flow {
          0% {
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        /* NEW: Cagayan de Oro Pulse Animation */
        @keyframes cdo-pulse {
          0% {
            r: 5;
            opacity: 0.8;
            stroke-width: 2;
          }
          50% {
            r: 25; /* Expand radius */
            opacity: 0.2; /* Fade out */
            stroke-width: 0.5; /* Thinner stroke as it expands */
          }
          100% {
            r: 5;
            opacity: 0.8;
            stroke-width: 2;
          }
        }

        /* NEW: Gentle Water Ripple Animation - More varied */
        @keyframes water-ripple {
          0% {
            r: 0;
            opacity: 0;
            stroke-width: 3;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            r: 200; /* Expand far across the map */
            opacity: 0;
            stroke-width: 0.5;
          }
        }

        /* Apply animations */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        .animate-ping-strong {
          animation: ping-strong 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-subtle {
          animation: ping-subtle 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-dash-flow {
          animation: dash-flow 4s linear infinite;
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* NEW: Apply specific animations */
        .animate-cdo-pulse {
          animation: cdo-pulse 2.5s ease-out infinite; /* Continuous, gentle pulse */
        }

        .animate-water-ripple {
          animation: water-ripple 8s linear infinite; /* Slow, continuous ripple */
        }
      `}</style>
    </section>
  );
};

export default PhilippinesMapSection;
