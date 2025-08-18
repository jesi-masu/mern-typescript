import { useState } from "react";

// Simulated Button component
const Button = ({ children, size, variant, className, onClick, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const sizeStyles = size === "lg" ? "h-11 px-8 text-base" : "h-10 px-4 py-2";
  const variantStyles = variant === "outline" 
    ? "border border-input hover:bg-accent hover:text-accent-foreground" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  return (
    <button 
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const HeroSection = () => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    console.log('Video failed to load, switching to fallback image');
    setVideoError(true);
  };

  // Navigation handlers using window.location
  const handleBrowseProducts = () => {
    window.location.href = '/shop';
  };

  const handleViewProjects = () => {
    window.location.href = '/projects';
  };

  const fallbackImageStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%'
  };

  return (
    <>
      {/* CSS Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .hero-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translateX(-50%) translateY(-50%);
          object-fit: cover;
        }

        /* Responsive video scaling */
        @media (max-aspect-ratio: 16/9) {
          .hero-video {
            width: 100%;
            height: auto;
          }
        }

        @media (min-aspect-ratio: 16/9) {
          .hero-video {
            width: auto;
            height: 100%;
          }
        }

        /* Button hover effects */
        .hero-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        /* Container responsive */
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        @media (min-width: 640px) {
          .hero-container {
            padding: 0 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-container {
            padding: 0 2rem;
          }
        }
      `}</style>

      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0">
          {!videoError ? (
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can play')}
            >
              {/* Primary video source */}
              <source src="https://cdn.pixabay.com/video/2024/02/12/200276-912384794_tiny.mp4" type="video/mp4" />
              {/* Fallback video source */}
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              {/* Browser fallback message */}
              Your browser does not support the video tag.
            </video>
          ) : (
            /* Fallback background image */
            <div 
              className="w-full h-full"
              style={fallbackImageStyle}
              role="img"
              aria-label="Container building background"
            />
          )}
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-700" />
        </div>

        {/* Content */}
        <div className="hero-container relative py-20 md:py-32 flex items-center min-h-screen">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 transform transition-all duration-700 hover:scale-105">
              Transforming Containers into Your Dream Spaces
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 transition-opacity duration-500 leading-relaxed">
              Our innovative platform helps you visualize, customize and manage your prefabricated building projects from concept to completion with 3D design integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Using onClick handlers with window.location */}
              <Button 
                size="lg"
                variant
                className="hero-button bg-blue-600 hover:bg-blue-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={handleBrowseProducts}
              >
                Browse Products
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="hero-button border-white text-white hover:bg-white hover:text-gray-900 transform transition-all duration-300 hover:scale-105"
                onClick={handleViewProjects}
              >
                View Projects
              </Button>
            </div>
            
            {/* Additional info */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>3D Visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Custom Design</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator for video */}
        {!videoError && (
          <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black bg-opacity-50 px-2 py-1 rounded">
            {videoError ? 'Image Mode' : 'Video Loading...'}
          </div>
        )}
      </section>
    </>
  );
};

export default HeroSection;