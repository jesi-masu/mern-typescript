import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// For custom icons, consider using an icon library or SVG components
// For demonstration, I'll use placeholders or Lucide icons if suitable
// Example custom icon component (create this in a separate file, e.g., components/Icons.tsx)
const CubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M12.5 17.5L5.5 13L12.5 8.5L19.5 13L12.5 17.5Z" />
    <path d="M12.5 17.5L12.5 23.5" />
    <path d="M19.5 13L19.5 19L12.5 23.5" />
    <path d="M5.5 13L5.5 19L12.5 23.5" />
    <path d="M12.5 8.5L12.5 2.5L5.5 7L12.5 11.5L19.5 7L12.5 2.5Z" />
  </svg>
);

const BoltIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M13 3v7h6l-8 11v-7H5l8-11z" />
  </svg>
);

const FileCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);


const features = [
  {
    icon: <CubeIcon />, // Using a custom icon for better thematic representation
    title: "Intuitive 3D Visualization",
    description: "Experience your project in stunning 3D before a single component is ordered, ensuring every detail matches your vision.",
    link: "/features",
  },
  {
    icon: <BoltIcon />, // Using a custom icon
    title: "Streamlined Ordering Process",
    description: "Simplify component acquisition with transparent pricing, automated quantity calculations, and real-time availability.",
    link: "/features",
  },
  {
    icon: <FileCheckIcon />, // Using a custom icon
    title: "Seamless Project Tracking",
    description: "Monitor your order's journey from manufacturing to delivery with our comprehensive, easy-to-use tracking tools.",
    link: "/features",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-prefab-600 mb-2">
            Unleash Efficiency
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Why Camco Prefab is Your Premier Choice
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our innovative platform provides an end-to-end solution for your prefab construction projects, ensuring precision from initial design to final assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2
                         border border-gray-100 flex flex-col justify-between"
            >
              {/* Optional: Subtle background pattern for visual interest */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-prefab-500/10 text-prefab-600 rounded-full flex items-center justify-center mb-6
                                 group-hover:bg-prefab-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {feature.description}
                </p>
              </div>
              <Link
                to={feature.link}
                className="relative z-10 text-prefab-600 hover:text-prefab-800 inline-flex items-center font-semibold
                           transition-all duration-300 group-hover:tracking-wide"
              >
                Explore Solution <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;