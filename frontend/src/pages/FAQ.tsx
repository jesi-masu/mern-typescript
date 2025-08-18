import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Search, HelpCircle, MessageSquare, Phone, Mail, ChevronDown } from "lucide-react";
import Guides from "@/components/home/Guides";


// FAQ data grouped by categories
const faqData = [
  {
    category: "General Questions",
    icon: HelpCircle,
    color: "from-blue-500 to-indigo-600",
    questions: [
      {
        id: "q1",
        question: "What is CamcoPrefab?",
        answer: "CamcoPrefab is a leading provider of high-quality prefabricated structures in the Philippines. We specialize in modern, sustainable, and cost-effective building solutions for residential, commercial, and industrial applications using advanced manufacturing techniques."
      },
      {
        id: "q2",
        question: "How does the prefab ordering process work?",
        answer: "Our streamlined process includes: 1) Initial consultation to understand your needs, 2) Custom design and 3D visualization, 3) Detailed quotation and contract signing, 4) Manufacturing with quality control, 5) Professional delivery and installation. We guide you through every step."
      },
      {
        id: "q3",
        question: "What types of projects can I build with CamcoPrefab?",
        answer: "We offer versatile solutions including residential homes, office buildings, retail spaces, warehouses, educational facilities, healthcare centers, and specialized structures. Our modular approach allows for complete customization to meet your specific requirements."
      },
      {
        id: "q4",
        question: "Do you serve areas outside Cagayan de Oro?",
        answer: "Yes, we serve clients throughout Northern Mindanao and other regions in the Philippines. Delivery costs and logistics vary by location. Contact us for specific information about serving your area and associated costs."
      }
    ]
  },
  {
    category: "Design & Customization",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-600",
    questions: [
      {
        id: "q5",
        question: "How customizable are your prefab structures?",
        answer: "Our structures are highly customizable. You can modify layouts, choose from various materials and finishes, adjust dimensions, add specialized features, and integrate custom fixtures. We work closely with you to achieve your vision while maintaining structural integrity."
      },
      {
        id: "q6",
        question: "Can I design my own prefab building from scratch?",
        answer: "Absolutely! Our design team can work from your concepts, architectural plans, or specific requirements to create a completely custom solution. We also offer design consultation services to help optimize your ideas for prefab construction."
      },
      {
        id: "q7",
        question: "Do you provide 3D visualizations of designs?",
        answer: "Yes, we provide detailed 3D renderings and visualizations for all projects. This helps you see exactly how your structure will look before construction begins, allowing for adjustments and ensuring complete satisfaction with the final design."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    icon: Phone,
    color: "from-purple-500 to-pink-600",
    questions: [
      {
        id: "q8",
        question: "How is pricing determined for prefab projects?",
        answer: "Pricing depends on structure size, materials selected, customization level, site conditions, and location. We provide transparent, detailed quotations that break down all costs including manufacturing, delivery, and installation."
      },
      {
        id: "q9",
        question: "Do you offer financing options?",
        answer: "We work with several financial partners to provide flexible payment terms and financing solutions. Options vary based on project size, timeline, and individual circumstances. Contact us to discuss financing arrangements that work for your budget."
      },
      {
        id: "q10",
        question: "What is included in the project cost?",
        answer: "Our comprehensive pricing typically includes design development, manufacturing, quality control, delivery to site, basic installation, and initial warranty. Additional services like site preparation, utilities connection, and extended warranties are available separately."
      }
    ]
  },
  {
    category: "Installation & Delivery",
    icon: Mail,
    color: "from-orange-500 to-red-600",
    questions: [
      {
        id: "q11",
        question: "How are prefab structures delivered and installed?",
        answer: "We use specialized transport vehicles and professional installation teams. The process includes site preparation verification, precise module placement using cranes, connection of utilities, final assembly, and quality inspection. Our team manages the entire installation process."
      },
      {
        id: "q12",
        question: "What site preparation is required?",
        answer: "Site preparation typically includes foundation work, utility rough-ins, access road preparation, and obtaining necessary permits. We provide detailed site preparation guidelines and can recommend qualified local contractors for these services."
      },
      {
        id: "q13",
        question: "How long does the installation process take?",
        answer: "Installation timeframes vary by project complexity. Simple structures may be completed in 1-3 days, while larger or more complex projects can take 1-2 weeks. Weather conditions and site accessibility can affect timelines. We provide realistic schedules during planning."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: HelpCircle,
    color: "from-cyan-500 to-blue-600",
    questions: [
      {
        id: "q14",
        question: "What warranty do you provide?",
        answer: "We offer comprehensive warranties including 10-year structural warranty, 5-year materials warranty, and 2-year fixtures and finishes warranty. Extended warranty options are available. All warranty terms are clearly outlined in your contract."
      },
      {
        id: "q15",
        question: "How do I get support after installation?",
        answer: "Our customer support team is available via phone, email, and on-site visits when necessary. We provide maintenance guidelines, troubleshooting assistance, and can arrange professional service calls for complex issues."
      },
      {
        id: "q16",
        question: "Can I expand or modify my structure later?",
        answer: "Yes, our modular design philosophy allows for future expansions and modifications. Additional modules can be integrated, and interior renovations are possible. We recommend consulting with our team to ensure any changes maintain structural integrity and compliance."
      }
    ]
  }
];


const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter questions based on search and category
  const getFilteredQuestions = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = faqData
      .map(category => {
        const filteredQuestions = category.questions.filter(q => 
          (activeCategory === "all" || category.category === activeCategory) && 
          (searchQuery === "" || 
           q.question.toLowerCase().includes(lowerCaseQuery) || 
           q.answer.toLowerCase().includes(lowerCaseQuery))
        );
        
        return {
          ...category,
          questions: filteredQuestions
        };
      })
      .filter(category => category.questions.length > 0);

    return filtered;
  };

  const filteredFAQs = getFilteredQuestions();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-prefab-300/20 to-prefab-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-700" />

        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-prefab-300 to-prefab-400 rounded-2xl mb-8 shadow-2xl">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-prefab-300 to-prefab-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find comprehensive answers to common questions about our prefabricated solutions, 
            design process, installation, and services. Get the information you need to make informed decisions.
          </p>
        </div>
      </section>
       
      {/* Guides Section */}
      <div>
      <Guides/>
      </div>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-prefab-300/20 to-prefab-400/20 rounded-2xl blur-xl" />
              <div className="relative bg-white rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-sm">
                <div className="flex items-center p-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-prefab-300 to-prefab-400 rounded-xl ml-2">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for questions, keywords, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 text-lg bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                className={`group relative overflow-hidden transition-all duration-300 ${
                  activeCategory === "all" 
                    ? "bg-gradient-to-r from-prefab-400 to-prefab-500 text-white shadow-lg hover:shadow-xl border-0" 
                    : "bg-white border-gray-200 hover:border-prefab-300 hover:bg-prefab-50"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                <div className="relative z-10 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  All Categories
                </div>
              </Button>
              
              {faqData.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={index}
                    variant={activeCategory === category.category ? "default" : "outline"}
                    className={`group relative overflow-hidden transition-all duration-300 ${
                      activeCategory === category.category 
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl border-0` 
                        : "bg-white border-gray-200 hover:border-prefab-300 hover:bg-prefab-50"
                    }`}
                    onClick={() => setActiveCategory(category.category)}
                  >
                    <div className="relative z-10 flex items-center">
                      <IconComponent className="w-4 h-4 mr-2" />
                      {category.category}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <div key={categoryIndex} className="max-w-4xl mx-auto">
                    {/* Category Header */}
                    <div className="flex items-center mb-8">
                      <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-3xl font-bold text-gray-900">{category.category}</h2>
                        <div className={`h-1 w-20 bg-gradient-to-r ${category.color} rounded-full mt-2`} />
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faq.id} className="group">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300" />
                            <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
                              <Accordion type="single" collapsible>
                                <AccordionItem value={faq.id} className="border-0">
                                  <AccordionTrigger className="px-8 py-6 hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex items-start text-left">
                                      <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1`}>
                                        <span className="text-white font-semibold text-sm">
                                          {String(faqIndex + 1).padStart(2, '0')}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-prefab-600 transition-colors">
                                          {faq.question}
                                        </h3>
                                      </div>
                                    </div>
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-prefab-500 transition-colors ml-4" />
                                  </AccordionTrigger>
                                  <AccordionContent className="px-8 pb-8">
                                    <div className="ml-12">
                                      <div className={`w-1 h-full bg-gradient-to-b ${category.color} rounded-full absolute left-12 top-0 opacity-20`} />
                                      <p className="text-gray-700 leading-relaxed text-base">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Results Found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any FAQs matching your search criteria. Try different keywords or browse all categories.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="bg-white border-prefab-300 text-prefab-600 hover:bg-prefab-50"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-prefab-600 via-prefab-700 to-prefab-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-xl text-prefab-100 mb-12 leading-relaxed">
              Can't find what you're looking for? Our expert team is ready to provide personalized assistance 
              for your prefabricated construction needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link to="/contact">
                <Button className="w-full bg-white text-prefab-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 py-4 text-lg font-semibold group">
                  <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Contact Us
                </Button>
              </Link>
              
              <a href="tel:+63-997-951-7188">
                <Button variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-prefab-700 transition-all duration-300 py-4 text-lg font-semibold group">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Call: 0997-951-7188
                </Button>
              </a>
            </div>
            
            <div className="mt-8 text-prefab-200">
              <p>Available Monday - Friday, 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
    
    
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;