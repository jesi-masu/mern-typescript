import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AwardsShowcase from "@/components/home/AwardsShowcase";
import Guides from "@/components/home/Guides";

const About = () => {
  const teamMembers = [
    {
      name: "Alexandra Kim",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in architecture and construction, Alexandra founded CamcoPrefab to revolutionize the prefabricated building industry through technology.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      name: "Marcus Johnson",
      role: "Chief Technology Officer",
      bio: "Marcus leads our technology team, bringing expertise in 3D modeling, VR/AR, and software development to create our innovative design and ordering platform.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      name: "Sophia Chen",
      role: "Director of Design",
      bio: "An award-winning architect, Sophia ensures all our prefab modules combine aesthetics and functionality with a focus on sustainability and innovative space utilization.",
      image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      name: "David Patel",
      role: "Director of Operations",
      bio: "David oversees manufacturing and logistics, ensuring every prefab module meets our exacting quality standards and is delivered on schedule worldwide.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    }
  ];

  const values = [
    {
      title: "Innovation",
      icon: "💡",
      description: "Pioneering new technologies and design approaches in prefabricated construction to deliver cutting-edge solutions."
    },
    {
      title: "Sustainability",
      icon: "🌿",
      description: "Committed to environmentally responsible practices, from material selection to energy-efficient designs."
    },
    {
      title: "Excellence",
      icon: "✨",
      description: "Rigorous standards in design and manufacturing ensure durable, precision-crafted structures that surpass expectations."
    },
    {
      title: "Integrity",
      icon: "🤝",
      description: "Upholding the highest ethical standards and fostering transparent, trust-based relationships with all stakeholders."
    }
  ];

  const partnerLogos = [
    {
      name: "EcoBuild Solutions",
      logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNXx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1MzB8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1542831371-d3493b0b7596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMHx8ZW52aXJvbm1lbnRhbCUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3MTc1NTU0Mjl8MA&ixlib=rb-4.0.3&q=80&w=400",
      description: "Leading in sustainable building materials and green construction methodologies."
    },
    {
      name: "Global Materials Inc.",
      logo: "https://images.unsplash.com/photo-1629904853716-f076755106d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxOHx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1MzB8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1510511459019-5da70949e217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxtYXRlcmlhbHMlMjBzdXBwbHl8ZW53MHx8fHwxNzE3NTU1MzU2fDA&ixlib=rb-4.0.3&q=80&w=400",
      description: "Premier supplier of high-quality, ethically sourced construction materials worldwide."
    },
    {
      name: "Urban Innovators",
      logo: "https://images.unsplash.com/photo-1588661646736-2187f544f80e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMXx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1MzB8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1502672260266-fe495817c768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHx1cmJhbiUyMGRldmVsb3BtZW50fGVufDB8fHx8MTcxNzU1NTM5MHww&ixlib=rb-4.0.3&q=80&w=400",
      description: "Specializing in smart city infrastructure and modern urban development projects."
    },
    {
      name: "Future Structures",
      logo: "https://images.unsplash.com/photo-1621251347648-c8df81c85d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMnx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1MzB8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1460598822558-75177a6dd24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8ZnV0dXJlJTIwY29uc3RydWN0aW9ufGVufDB8fHx8MTcxNzU1NTQ0MHww&ixlib=rb-4.0.3&q=80&w=400",
      description: "Innovating structural engineering with a focus on resilience and advanced analytics."
    },
    {
      name: "Precision Robotics",
      logo: "https://images.unsplash.com/photo-1630663473434-2e2101375d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyNnx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1NTF8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1533535928669-79c29f451f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMHx8cm9ib3RpY3N8ZW53MHx8fHwxNzE3NTU1NDUxfDA&ixlib=rb-4.0.3&q=80&w=400",
      description: "Leading provider of robotic automation for high-precision manufacturing."
    },
    {
      name: "ArchiDesign Group",
      logo: "https://images.unsplash.com/photo-1549605333-e99d3e5e492f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyNHx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1MzB8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1517457375823-ce69a6f1d2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNHx8YXJjaGl0ZWN0dXJlJTIwZGVzaWdufGVufDB8fHx8MTcxNzU1NTQ2Mnww&ixlib=rb-4.0.3&q=80&w=400",
      description: "Renowned for innovative and aesthetic architectural designs in commercial spaces."
    },
    {
      name: "Smart Grid Systems",
      logo: "https://images.unsplash.com/photo-1606771146747-d31e9c2f6d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzM3x8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU2MjF8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1507679799977-c918365812f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMXx8c21hcnQlMjBncmlkJTIwZW5lcmd5fGVufDB8fHx8MTcxNzU1NTQ4Mnww&ixlib=rb-4.0.3&q=80&w=400",
      description: "Developing intelligent energy solutions for self-sufficient modular buildings."
    },
    {
      name: "TerraScape Landscaping",
      logo: "https://images.unsplash.com/photo-1582299723555-d4b6c31e6b34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzMHx8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHx8fDE3MTc1NTU1ODF8MA&ixlib=rb-4.0.3&q=80&w=200",
      image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8bGFuZHNjYXBpbmclMjBhcmNoaXRlY3R1cmV8ZW53MHx8fHwxNzE3NTU1NDk0fDA&ixlib=rb-4.0.3&q=80&w=400",
      description: "Specialists in integrating sustainable and beautiful landscape architecture."
    },
  ];

  const timelineEvents = [
    {
      year: "2018",
      title: "Company Founding & Vision Inception",
      description: "CamcoPrefab was founded with a clear vision to revolutionize construction through advanced modular building techniques, driven by a commitment to efficiency and sustainability."
    },
    {
      year: "2019",
      title: "First Modular Prototype & R&D Facility",
      description: "Successfully developed and tested our initial modular prototype. Established our dedicated Research & Development facility to continuously innovate designs and materials."
    },
    {
      year: "2020",
      title: "Proprietary Platform Launch",
      description: "Launched our innovative online platform, enabling clients to visualize, customize, and manage their modular projects with unparalleled ease and transparency."
    },
    {
      year: "2021",
      title: "Expansion into Commercial Projects",
      description: "Expanded our portfolio to include large-scale commercial and institutional projects, showcasing the versatility and scalability of our prefabricated solutions."
    },
    {
      year: "2022",
      title: "Sustainability Certification & Green Initiatives",
      description: "Achieved leading industry sustainability certifications. Implemented new green manufacturing processes, significantly reducing waste and energy consumption."
    },
    {
      year: "2023",
      title: "Global Partnership & International Reach",
      description: "Formed strategic international partnerships, extending our reach and delivering modular solutions to clients in new global markets."
    },
    {
      year: "2024",
      title: "AI-Powered Design Integration",
      description: "Integrated AI into our design processes, enhancing efficiency, optimizing material use, and allowing for even more complex and custom architectural solutions."
    },
    {
      year: "Present",
      title: "Pioneering the Future of Construction",
      description: "Continuing to push the boundaries of modular construction, focusing on smart building technologies and resilient, adaptable structures for tomorrow's world."
    },
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section with Video Background and Formal Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://cdn.pixabay.com/video/2024/03/30/206221_tiny.mp4" type="video/mp4" />
            {/* Fallback image */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Construction site"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-800/75 to-blue-900/70"></div>

          {/* Animated overlay pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Content Container - Left Aligned */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl text-left"> {/* Changed to max-w-4xl and text-left */}
            {/* Header Section */}
            <div className="mb-12">
              {/* Elegant badge */}
              <div className="inline-flex items-center px-6 py-3 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-medium shadow-2xl">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                Industry Leaders Since 2018
                <span className="ml-3 px-2 py-1 bg-blue-500/30 rounded-full text-xs">Award Winning</span>
              </div>

              {/* Main heading with formal typography */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight mb-6 leading-tight text-white tracking-tight"> {/* Adjusted leading */}
                <span className="block font-thin text-white/90">Pioneering</span>
                <span className="block font-bold bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Modular Excellence
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-extralight text-white/95 mt-2">
                  in Modern <em className="font-bold not-italic text-blue-300">Construction</em>
                </span>
              </h1>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl"> {/* Adjusted max-width for text */}
              {/* Enhanced subtitle */}
              <p className="text-xl md:text-2xl lg:text-2xl text-gray-200 mb-10 leading-relaxed font-light"> {/* Adjusted font size and margin */}
                Redefining construction through innovative modular solutions that seamlessly blend{' '}
                <span className="text-blue-300 font-semibold bg-blue-900/20 px-2 py-1 rounded">quality</span>,{' '}
                <span className="text-blue-300 font-semibold bg-blue-900/20 px-2 py-1 rounded">efficiency</span>, and{' '}
                <span className="text-blue-300 font-semibold bg-blue-900/20 px-2 py-1 rounded">sustainability</span>,
                setting new benchmarks for the built environment.
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-20"> {/* Changed to items-start */}
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-white to-blue-50 text-gray-900 hover:from-blue-50 hover:to-white px-10 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 border-2 border-white/20"
                >
                  <Link to="/contact" className="flex items-center">
                    <span>Inquire Now</span> {/* Changed text for formality */}
                    <span className="ml-2 text-2xl">→</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/40 text-gray hover:bg-white/20 backdrop-blur-md px-10 py-5 text-xl font-semibold rounded-full transition-all duration-500 hover:border-white/60"
                >
                  <Link to="/projects" className="flex items-center">
                    <span>Discover Our Projects</span> {/* Changed text for formality */}
                    <span className="ml-2 opacity-70">↗</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Scroll indicator - repositioned to fit new layout */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block">
              <div className="flex flex-col items-center text-white/70">
                <div className="w-0.5 h-20 bg-gradient-to-b from-white/70 to-transparent relative">
                  <div className="absolute top-0 w-3 h-3 bg-white/70 rounded-full -left-1 animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced floating geometric elements */}
        <div className="absolute top-1/4 left-12 w-32 h-32 border-2 border-white/10 rotate-45 animate-pulse hidden lg:block backdrop-blur-sm"></div>
        <div className="absolute bottom-1/3 right-20 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rotate-12 animate-pulse hidden lg:block backdrop-blur-sm rounded-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce hidden lg:block backdrop-blur-sm"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-blue-400/30 rotate-45 animate-ping hidden lg:block"></div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="CamcoPrefab manufacturing facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end p-8">
                  <span className="text-white text-sm font-medium">Our state-of-the-art manufacturing facility</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Our Heritage</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Established in 2018, CamcoPrefab emerged from a vision to transform traditional construction through modular excellence. Our founders recognized the untapped potential of prefabrication to deliver superior quality, reduced timelines, and enhanced sustainability.
                </p>
                <p>
                  What began as an innovative concept has grown into an industry leader, serving discerning clients across residential, commercial, and institutional sectors. Our journey reflects our commitment to pushing boundaries while maintaining uncompromising standards.
                </p>
                <p>
                  Today, we stand at the forefront of the prefabrication revolution, with a proprietary platform that seamlessly integrates 3D visualization, customization, and project management—empowering clients to realize their architectural visions with unprecedented clarity and confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Company Timeline Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="diagonal-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M-1 1L11 11M-1 5L5 11M5 -1L11 5" stroke="#E0F2F7" strokeWidth="2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Our <span className="text-blue-700">Journey</span> Through Innovation
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              Explore the key milestones that have shaped CamcoPrefab into a leader in modular construction.
            </p>
          </div>

          <div className="relative border-l-4 border-blue-300 space-y-16 pl-8 md:pl-16 ml-4 md:ml-8">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-12 md:-left-20 top-0 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-125">
                  <span className="font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="absolute -left-4 md:-left-8 top-0 mt-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full"></div> {/* Smaller dot on line */}

                <Card className="bg-white shadow-xl rounded-lg p-6 md:p-8 ml-4 border-t-4 border-blue-500 transform hover:scale-[1.01] transition-transform duration-300">
                  <CardContent className="p-0">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-2">{event.year}</h3>
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">{event.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Enhanced Mission & Vision */}
      <section className="py-24 bg-gradient-to-br from-gray-100 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle background pattern */}
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20H20V0Z" fill="white" fillOpacity="0.05"/>
              <path d="M0 0H20V0H0Z" fill="white" fillOpacity="0.05"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <circle cx="50%" cy="50%" r="40%" fill="url(#radial-gradient)" opacity="0.1"/>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Our <span className="text-blue-700">Purpose</span> & <span className="text-blue-700">Direction</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              We are driven by a clear set of principles that define who we are and what we aspire to become.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <Card className="border-t-4 border-blue-600 shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 bg-white group">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-800 transition-colors duration-300">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To deliver exceptional prefabricated building solutions that set new benchmarks for quality, efficiency, and environmental responsibility—transforming how structures are conceived and constructed, fostering a more sustainable future.
                </p>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="border-t-4 border-purple-600 shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 bg-white group">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="bg-purple-100 text-purple-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
                  <span className="text-4xl">🔭</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-800 transition-colors duration-300">Our Vision</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To lead the global evolution toward smarter construction—where modular precision, sustainable practices, and technological innovation converge to create spaces that inspire, endure, and positively impact communities worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      ---

      {/* Enhanced Values */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 opacity-50 -skew-y-3"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Our <span className="text-blue-700">Driving</span> Principles
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              These core values are the bedrock of our culture, shaping every decision and interaction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden h-full transform hover:-translate-y-2 group bg-white/95 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                  <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 text-blue-500">{value.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">{value.title}</h3>
                  <p className="text-gray-700 text-base leading-relaxed flex-grow">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      -

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Executive Leadership</h2>
            <p className="text-xl text-gray-600">
              The experienced professionals guiding CamcoPrefab toward continued innovation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <Card className="border-0 shadow-sm group-hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden h-full">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* How We Work Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Our Process
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight">
              How We 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Work</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Our proven methodology ensures exceptional results through collaborative partnerships and meticulous attention to every detail
            </p>
          </div>

          {/* Process Steps */}
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Step 1 - Consultation */}
              <div className="group">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          01
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          Consultation
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Our team communicates openly, understanding the project's complexity. Creating a solution that supports our client's vision through comprehensive analysis and strategic planning.
                        </p>
                        <div className="mt-6 flex items-center text-blue-600 font-semibold">
                          <span className="text-sm">Discovery & Planning</span>
                          <span className="ml-2">→</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2 - Design */}
              <div className="group lg:mt-12">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          02
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                          Design & Customization
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          A collaborative partnership ensures co-created solutions exceeding expectations. Transparent communication and mutual brainstorming reflect unique project requirements.
                        </p>
                        <div className="mt-6 flex items-center text-purple-600 font-semibold">
                          <span className="text-sm">Creative Collaboration</span>
                          <span className="ml-2">→</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 - Delivery */}
              <div className="group">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          03
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                          Schedule Delivery & Installation
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Timely, secure delivery of prefabricated structures, followed by expert installation. A meticulous approach guarantees structural integrity and customer satisfaction from transportation to setup.
                        </p>
                        <div className="mt-6 flex items-center text-green-600 font-semibold">
                          <span className="text-sm">Precision Execution</span>
                          <span className="ml-2">→</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 4 - Quality Control */}
              <div className="group lg:mt-12">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          04
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                          Quality Control
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Following strict guidelines in all aspects, including material selection and final inspection. Products always meet high standards through unwavering dedication to quality and modern testing techniques.
                        </p>
                        <div className="mt-6 flex items-center text-orange-600 font-semibold">
                          <span className="text-sm">Excellence Assured</span>
                          <span className="ml-2">✓</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Process Flow Visualization */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="hidden lg:flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">Consult</span>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">Design</span>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">Deliver</span>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-orange-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  4
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">Control</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
              <p className="text-xl mb-8 opacity-90">Let's discuss how our proven process can bring your vision to life</p>
              <Button 
                asChild 
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/contact">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Awards section to About page*/}

    

      <div>
      <AwardsShowcase />
      </div>


    </Layout>
  );
};

export default About;