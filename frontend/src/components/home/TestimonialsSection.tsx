import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  category: "homeowner" | "contractor" | "architect";
}

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      name: "Daniel Padilla",
      role: "Homeowner",
      company: "Private Residence",
      content:
        "The 3D design tool made it so easy to visualize my dream home. The ordering process was simple and the prefab components arrived exactly as scheduled. The quality exceeded my expectations!",
      image:
        "https://i.pinimg.com/736x/03/df/1c/03df1c9315a8741a865120dfd04adc73.jpg",
      rating: 5,
      category: "homeowner",
    },
    {
      name: "John Lloyd Cruz",
      role: "Project Manager",
      company: "BuildRight Construction",
      content:
        "We've been using Camco Prefab for all our modular building projects. The platform has streamlined our ordering process and improved our project delivery timelines by 40%.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/d0/John_Lloyd_Cruz_by_Ronn_Tan%2C_April_2010.png",
      rating: 5,
      category: "contractor",
    },
    {
      name: "Joseph Marco",
      role: "Lead Architect",
      company: "Modern Spaces Architecture",
      content:
        "The integration between design and ordering is seamless. My clients love being able to see their projects in 3D before committing. It's revolutionized our workflow.",
      image:
        "https://www.goodnewspilipinas.com/wp-content/uploads/2019/12/Joseph_Marco.jpg",
      rating: 5,
      category: "architect",
    },
    {
      name: "Maria Santos",
      role: "Interior Designer",
      company: "Santos Design Studio",
      content:
        "The customization options are incredible. I can specify exact materials, finishes, and dimensions. The quality control is impeccable - every piece arrives perfect.",
      image:
        "https://ui-avatars.com/api/?name=Maria+Santos&background=6366f1&color=white&size=80",
      rating: 5,
      category: "architect",
    },
    {
      name: "Carlos Mendoza",
      role: "General Contractor",
      company: "Mendoza Construction Co.",
      content:
        "Fast delivery, excellent quality, and competitive pricing. We've completed 15 projects using Camco Prefab components and our clients are always impressed.",
      image:
        "https://ui-avatars.com/api/?name=Carlos+Mendoza&background=10b981&color=white&size=80",
      rating: 5,
      category: "contractor",
    },
    {
      name: "Ana Reyes",
      role: "Property Developer",
      company: "Reyes Properties",
      content:
        "The speed of construction using prefab components has allowed us to deliver projects 60% faster than traditional methods. The ROI is outstanding.",
      image:
        "https://ui-avatars.com/api/?name=Ana+Reyes&background=f59e0b&color=white&size=80",
      rating: 5,
      category: "contractor",
    },
    {
      name: "Robert Johnson",
      role: "Homeowner",
      company: "Private Residence",
      content:
        "Building our vacation home with Camco Prefab was stress-free. The timeline was predictable, the quality exceptional, and the support team was always available.",
      image:
        "https://ui-avatars.com/api/?name=Robert+Johnson&background=ef4444&color=white&size=80",
      rating: 5,
      category: "homeowner",
    },
    {
      name: "Lisa Chen",
      role: "Sustainable Building Consultant",
      company: "EcoDesign Solutions",
      content:
        "The environmental benefits are remarkable. Reduced waste, sustainable materials, and energy-efficient designs. Perfect for clients focused on green building.",
      image:
        "https://ui-avatars.com/api/?name=Lisa+Chen&background=8b5cf6&color=white&size=80",
      rating: 5,
      category: "architect",
    },
  ];

  const stats = [
    { icon: Users, value: "1,500+", label: "Happy Customers" },
    { icon: Award, value: "98%", label: "Satisfaction Rate" },
    { icon: TrendingUp, value: "90%", label: "Faster Delivery" },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "homeowner":
        return "from-blue-500 to-blue-600";
      case "contractor":
        return "from-green-500 to-green-600";
      case "architect":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "homeowner":
        return "";
      case "contractor":
        return "";
      case "architect":
        return "";
      default:
        return "";
    }
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
        >
          <defs>
            <pattern
              id="testimonial-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-prefab-600 to-prefab-700 rounded-2xl mb-6 shadow-lg">
            <Quote className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
            What Our Clients Say
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what some of our satisfied
            customers have to say about their experience with{" "}
            <span className="font-semibold text-prefab-600">Camco Prefab</span>.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-prefab-100 to-prefab-200 rounded-xl mb-2">
                  <stat.icon className="w-6 h-6 text-prefab-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className="group relative bg-white/70 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-white/40 hover:-translate-y-2 animate-fade-in"
              >
                {/* Category Badge */}
                <div className="absolute top-6 right-6 flex items-center space-x-2">
                  <span className="text-lg">
                    {getCategoryIcon(testimonial.category)}
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(
                      testimonial.category
                    )}`}
                  ></div>
                </div>

                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-8 h-8 text-gray-900" />
                </div>

                {/* Stars */}
                <div className="mt-8">{renderStars(testimonial.rating)}</div>

                {/* Content */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          testimonial.name
                        )}&background=6366f1&color=white&size=56`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getCategoryColor(
                    testimonial.category
                  )} opacity-0 group-hover:opacity-5 transition-all duration-500 -z-10`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-prefab-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Auto-play Controls */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-prefab-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:border-prefab-200 transition-all duration-300"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isAutoPlaying ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>{isAutoPlaying ? "Auto-play On" : "Auto-play Off"}</span>
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Join 1,500+ satisfied customers</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
