import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Daniel Padilla",
      role: "Homeowner",
      content: "The 3D design tool made it so easy to visualize my dream home. The ordering process was simple and the prefab components arrived exactly as scheduled.",
      image: "https://i.pinimg.com/736x/03/df/1c/03df1c9315a8741a865120dfd04adc73.jpg",
      rating: 5
    },
    {
      name: "John lloyd Cruz",
      role: "Project Manager, BuildRight Construction",
      content: "We've been using CamcoPrefab for all our modular building projects. The platform has streamlined our ordering process and improved our project delivery timelines.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/John_Lloyd_Cruz_by_Ronn_Tan%2C_April_2010.png",
      rating: 5
    },
    {
      name: "Joseph Marco",
      role: "Architect, Modern Spaces",
      content: "The integration between design and ordering is seamless. My clients love being able to see their projects in 3D before committing.",
      image: "https://www.goodnewspilipinas.com/wp-content/uploads/2019/12/Joseph_Marco.jpg",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
            What Our Clients Say
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what some of our satisfied customers have to say about their experience with{' '}
            <span className="font-semibold text-gray-900">Camco Prefab</span>.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-4"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white/70 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-white/40 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Stars */}
              {renderStars(testimonial.rating)}
              
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
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=6366f1&color=white&size=56`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.role}</p>
                </div>
              </div>
              
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500 -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Join 1,000+ satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;