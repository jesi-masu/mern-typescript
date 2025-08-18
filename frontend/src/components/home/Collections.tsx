import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Zap, Eye, Heart, ShoppingCart } from 'lucide-react';

const StunningPrefabCollections = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const callouts = [
    {
      id: 1,
      name: 'Prefab Container Unit',
      description: 'Premium modular container solutions for modern living and commercial spaces',
      imageSrc: 'https://camcoprefabricatedstructures.com/wp-content/uploads/2024/10/Lorem-ipsun-8.gif',
      imageAlt: 'Modern prefab container unit with sleek design',
      href: '#',
      category: 'Commercial',
      rating: 4.9,
      reviews: 127,
      gradientFrom: '#3b82f6',
      gradientTo: '#06b6d4'
    },
    {
      id: 2,
      name: 'Prefab Camhouse',
      description: 'Luxury portable housing with premium finishes and modern amenities',
      imageSrc: 'https://camcoprefabricatedstructures.com/wp-content/uploads/2024/10/Lorem-ipsun-5.gif',
      imageAlt: 'Elegant prefab camhouse with contemporary design',
      href: '#',
      category: 'Residential',
      rating: 4.8,
      reviews: 89,
      gradientFrom: '#10b981',
      gradientTo: '#22c55e'
    },
    {
      id: 3,
      name: 'Portable Toilet',
      description: 'High-quality sanitation solutions with advanced features and durability',
      imageSrc: 'https://camcoprefabricatedstructures.com/wp-content/uploads/2024/10/Lorem-ipsun-7.gif',
      imageAlt: 'Premium portable toilet facilities',
      href: '#',
      category: 'Sanitation',
      rating: 4.7,
      reviews: 203,
      gradientFrom: '#8b5cf6',
      gradientTo: '#6366f1'
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-200 opacity-25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div 
              className={`w-4 h-4 ${i % 2 === 0 ? 'rounded-full' : 'transform rotate-45'}`}
              style={{
                backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#10b981' : '#8b5cf6'
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 tracking-tight">
            Best Seller Prefab Collections
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our premium collection of innovative prefabricated structures, designed for modern living and built to exceed expectations
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 font-semibold">4.8 Average Rating</span>
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="text-gray-600 font-semibold">419+ Happy Customers</span>
          </div>
        </div>

        {/* Premium Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {callouts.map((callout, index) => (
            <div
              key={callout.id}
              className={`group relative transform transition-all duration-700 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredItem(callout.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${callout.gradientFrom}, ${callout.gradientTo})`
                }}
              ></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    alt={callout.imageAlt}
                    src={callout.imageSrc}
                    className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}></div>
                  
                  {/* Category Badge */}
                  <div 
                    className="absolute top-4 left-4 px-3 py-1 text-white text-sm font-semibold rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${callout.gradientFrom}, ${callout.gradientTo})`
                    }}
                  >
                    {callout.category}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white">
                      <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
                    </button>
                    <button className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white" style={{ transitionDelay: '75ms' }}>
                      <Eye className="w-5 h-5 text-gray-700 hover:text-blue-500 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{callout.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({callout.reviews} reviews)</span>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{
                        background: `linear-gradient(135deg, ${callout.gradientFrom}, ${callout.gradientTo})`
                      }}
                    ></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {callout.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {callout.description}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={callout.href}
                    className="group/btn relative inline-flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${callout.gradientFrom}, ${callout.gradientTo})`
                    }}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Explore Details</span>
                      <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-all duration-700"></div>
                  </a>
                </div>

                {/* Animated Border */}
                <div 
                  className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    borderImage: `linear-gradient(45deg, transparent, ${callout.gradientFrom}, transparent) 1`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Custom Solutions Available</span>
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Need something specific? Our expert team can create custom prefab solutions tailored to your exact requirements.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
        `
      }} />
    </section>
  );
};

export default StunningPrefabCollections;