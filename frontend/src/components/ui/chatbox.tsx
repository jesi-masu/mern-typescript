import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  User,
  Bot,
  Home,
  Calculator,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered";
}

interface ChatboxProps {
  className?: string;
}

const CAMCOLogo = () => (
  <svg width="32" height="32" viewBox="0 0 200 200" className="w-8 h-8">
    {/* Building structure */}
    <g fill="none" stroke="#2563eb" strokeWidth="4">
      {/* Back building */}
      <rect
        x="75"
        y="60"
        width="50"
        height="80"
        fill="#3b82f6"
        stroke="#1e40af"
        strokeWidth="2"
      />
      <rect
        x="85"
        y="70"
        width="30"
        height="25"
        fill="#60a5fa"
        stroke="#1e40af"
        strokeWidth="1"
      />

      {/* Front building */}
      <rect
        x="45"
        y="90"
        width="60"
        height="80"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="2"
      />
      <rect
        x="55"
        y="100"
        width="15"
        height="20"
        fill="#3b82f6"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <rect
        x="75"
        y="130"
        width="8"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <rect
        x="85"
        y="130"
        width="8"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />

      {/* Right extension */}
      <rect
        x="125"
        y="75"
        width="45"
        height="95"
        fill="#3b82f6"
        stroke="#1e40af"
        strokeWidth="2"
      />
      <rect
        x="135"
        y="85"
        width="12"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <rect
        x="150"
        y="85"
        width="12"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <rect
        x="135"
        y="105"
        width="12"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <rect
        x="150"
        y="105"
        width="12"
        height="15"
        fill="#ffffff"
        stroke="#1e40af"
        strokeWidth="1"
      />
    </g>
  </svg>
);

const Chatbox = ({ className }: ChatboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to CAMCO Mega Sales Corp. How can I help you with your prefab construction needs today?",
      sender: "bot",
      timestamp: new Date(),
      status: "delivered",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    {
      text: "What are your house prices?",
      icon: Home,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      text: "Get a quote for my project",
      icon: Calculator,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      text: "What's included in the package?",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      text: "How long does construction take?",
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const businessResponses = {
    pricing: [
      "Our prefab houses start from ₱350,000 for basic models. Prices vary based on size, design, and features. Would you like me to connect you with our sales team for a detailed quote?",
      "We offer flexible payment terms including installment options. Our houses range from ₱1.5M to ₱8M depending on specifications. What's your budget range?",
      "Container units start at ₱150,000 while custom prefab homes range from ₱1M-₱2M. We also offer commercial structures and office spaces. Let me know what type of project you're interested in!",
    ],
    quote: [
      "I'd be happy to help you get a quote! To provide accurate pricing, I'll need some details about your project. Our team will contact you within 24 hours with a comprehensive proposal.",
      "For a personalized quote, please share your location, preferred house size, and any specific requirements. Our design team will prepare a detailed estimate for you.",
      "Let's get you a quote! I'll need: 1) Project location, 2) Desired size/layout, 3) Timeline expectations. You can also visit our shop page to browse our models and request quotes directly.",
    ],
    delivery: [
      "Yes, we deliver nationwide across the Philippines! Delivery costs vary by location. Metro Manila and nearby provinces have standard rates, while remote areas may have additional charges.",
      "We have successfully delivered projects from Luzon to Mindanao. Our logistics team ensures safe transportation and professional installation at your site.",
      "We handle complete logistics including transportation, crane services, and on-site assembly. Delivery to Metro Manila takes 1-2 weeks, provincial areas 2-4 weeks depending on accessibility.",
    ],
    timeline: [
      "Our prefab houses typically take 1-3 months from order to completion, including manufacturing and on-site assembly. Timeline depends on design complexity and site preparation.",
      "Manufacturing takes 6-8 weeks, while on-site assembly usually takes 2-3 weeks. We'll provide a detailed timeline once we assess your specific project requirements.",
      "Container units can be ready in 4-8 weeks, custom homes in 3-5 months. We work efficiently while maintaining quality standards. Rush orders may be accommodated with additional fees.",
    ],
    materials: [
      "We use high-quality steel frames, insulated panels, and weather-resistant materials. All our houses are designed to withstand Philippine weather conditions including typhoons.",
      "Our construction uses galvanized steel, fiber cement boards, and premium insulation. We also offer eco-friendly options with sustainable materials.",
      "All materials are sourced from certified suppliers. We use: galvanized steel frames (anti-rust), fiber cement walls, vinyl flooring, double-glazed windows, and premium roofing materials rated for 200kph winds.",
    ],
    permits: [
      "We assist with building permits and ensure all our designs comply with Philippine building codes. Our team can guide you through the permit application process.",
      "Yes, we help with documentation including architectural plans, structural designs, and permit applications. We work with licensed engineers and architects.",
      "Our in-house licensed architects and engineers prepare all necessary documents for building permits. We coordinate with local government units to expedite the approval process.",
    ],
    customization: [
      "Absolutely! We offer full customization including layout modifications, material upgrades, and additional features. Our design team will work with your vision and budget.",
      "We can customize everything from floor plans to finishes. Popular additions include solar panels, upgraded kitchens, and extended outdoor spaces.",
      "Full customization available! Modify layouts, choose premium finishes, add smart home features, solar panels, or expand spaces. Our 3D design team will visualize your dream home before construction.",
    ],
    maintenance: [
      "Our prefab houses require minimal maintenance. We provide a comprehensive warranty and maintenance guide. Annual inspections are recommended for optimal performance.",
      "We offer post-installation support and maintenance services. Our houses are designed for durability with low maintenance requirements.",
      "We provide a 2-year structural warranty and 1-year warranty on fixtures. Maintenance is minimal - annual roof inspection, gutter cleaning, and repainting every 5-7 years. We offer maintenance packages too!",
    ],
    packages: [
      "Our packages include: structural framework, roofing, walls, windows, doors, electrical wiring, plumbing rough-in, and flooring. Turnkey packages add fixtures, kitchen cabinets, and bathroom fittings.",
      "Basic Package: Structure + utilities rough-in. Standard Package: + fixtures and finishes. Premium Package: + upgraded materials and appliances. All packages include installation and warranty.",
      "Every package includes: steel structure, insulated walls, roofing, windows, doors, electrical system, and flooring. We can customize packages based on your needs and budget.",
    ],
    financing: [
      "We offer flexible payment terms: 50% down payment, 40% Before Delivery, 10% upon completion. Bank financing is available through our partner banks with terms up to 2 years.",
      "Payment options include: Full Payment (with discount), Installment (50% down payment, 40% Before Delivery, 10% upon completion.), Just sending your proof of payment to our system or contact us directly also for payment verification.",
      "We work with major banks for housing loans. Requirements: proof of income, valid IDs, and down payment. Interest rates start at 6-8% annually. In-house financing also available for qualified buyers.",
    ],
    warranty: [
      "We provide a comprehensive 2-year structural warranty covering framework and major components. 1-year warranty on electrical, plumbing, and fixtures. Extended warranties available.",
      "Our warranty covers: structural integrity (5 years), waterproofing (3 years), fixtures and fittings (1 year). We also offer paid extended warranty programs for added peace of mind.",
    ],
    sizes: [
      "We offer various sizes: Studio (18-25 sqm), 1-Bedroom (30-40 sqm), 2-Bedroom (50-70 sqm), 3-Bedroom (80-120 sqm). Custom sizes available based on your lot and requirements.",
      "Container units: 20ft (15 sqm) and 40ft (30 sqm). Standard homes: 50-150 sqm. We can design larger structures for commercial or multi-family use. What size are you considering?",
    ],
    location: [
      "Our main office and showroom is in Cagayan De Oro City. We have completed projects across Luzon, Visayas, and Mindanao. You can visit our showroom to see actual units and discuss your project.",
      "We're based in Metro Manila but serve the entire Philippines. Our team conducts free site visits nationwide to assess your location and provide accurate quotations.",
    ],
    advantages: [
      "Prefab advantages: 50% faster construction, 30% cost savings, better quality control, minimal site waste, weather-independent manufacturing, and immediate occupancy after installation.",
      "Benefits of choosing CAMCO: Typhoon-resistant design, energy-efficient insulation, modern aesthetics, flexible layouts, faster ROI, and comprehensive after-sales support.",
    ],
    commercial: [
      "Yes! We build commercial structures: offices, retail spaces, dormitories, clinics, restaurants, and warehouses. Our commercial units are designed for durability and functionality.",
      "Commercial projects include: modular offices, pop-up stores, guard houses, site offices, and multi-story buildings. We can customize for your specific business needs.",
    ],
    sustainability: [
      "Our prefab construction is eco-friendly: reduced construction waste, energy-efficient insulation, optional solar panels, rainwater harvesting systems, and recyclable materials.",
      "We offer green building options: solar power systems, LED lighting, low-VOC paints, natural ventilation design, and water-saving fixtures. Sustainable construction is our priority!",
    ],
    comparison: [
      "Prefab vs Traditional: Prefab is 50% faster, 20-30% cheaper, better quality control, less weather delays, and cleaner construction. Traditional offers more on-site flexibility but takes longer.",
      "Our prefab homes match or exceed traditional construction quality while being faster and more cost-effective. Plus, you can relocate them if needed!",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Greeting responses
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey") ||
      message.includes("good morning") ||
      message.includes("good afternoon")
    ) {
      return "Hello! Welcome to CAMCO Mega Sales Corp. I'm here to help you with your prefab construction needs. What would you like to know about our houses?";
    }

    // Pricing and cost
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("budget") ||
      message.includes("how much")
    ) {
      return businessResponses.pricing[
        Math.floor(Math.random() * businessResponses.pricing.length)
      ];
    }

    // Quote and estimate
    if (message.includes("quote") || message.includes("estimate")) {
      return businessResponses.quote[
        Math.floor(Math.random() * businessResponses.quote.length)
      ];
    }

    // Delivery and shipping
    if (
      message.includes("deliver") ||
      message.includes("shipping") ||
      message.includes("nationwide") ||
      message.includes("transport")
    ) {
      return businessResponses.delivery[
        Math.floor(Math.random() * businessResponses.delivery.length)
      ];
    }

    // Timeline and duration
    if (
      message.includes("time") ||
      message.includes("duration") ||
      message.includes("how long") ||
      message.includes("fast") ||
      message.includes("quick")
    ) {
      return businessResponses.timeline[
        Math.floor(Math.random() * businessResponses.timeline.length)
      ];
    }

    // Materials and quality
    if (
      message.includes("material") ||
      message.includes("quality") ||
      message.includes("construction") ||
      message.includes("built") ||
      message.includes("strong")
    ) {
      return businessResponses.materials[
        Math.floor(Math.random() * businessResponses.materials.length)
      ];
    }

    // Permits and legal
    if (
      message.includes("permit") ||
      message.includes("legal") ||
      message.includes("documentation") ||
      message.includes("building code")
    ) {
      return businessResponses.permits[
        Math.floor(Math.random() * businessResponses.permits.length)
      ];
    }

    // Customization and design
    if (
      message.includes("custom") ||
      message.includes("modify") ||
      message.includes("design") ||
      message.includes("change") ||
      message.includes("personalize")
    ) {
      return businessResponses.customization[
        Math.floor(Math.random() * businessResponses.customization.length)
      ];
    }

    // Maintenance and warranty
    if (
      message.includes("maintenance") ||
      message.includes("warranty") ||
      message.includes("support") ||
      message.includes("after sales")
    ) {
      return businessResponses.maintenance[
        Math.floor(Math.random() * businessResponses.maintenance.length)
      ];
    }

    // Packages and inclusions
    if (
      message.includes("package") ||
      message.includes("include") ||
      message.includes("what's in") ||
      message.includes("comes with")
    ) {
      return businessResponses.packages[
        Math.floor(Math.random() * businessResponses.packages.length)
      ];
    }

    // Financing and payment
    if (
      message.includes("payment") ||
      message.includes("financing") ||
      message.includes("loan") ||
      message.includes("installment") ||
      message.includes("pag-ibig") ||
      message.includes("bank")
    ) {
      return businessResponses.financing[
        Math.floor(Math.random() * businessResponses.financing.length)
      ];
    }

    // Sizes and dimensions
    if (
      message.includes("size") ||
      message.includes("sqm") ||
      message.includes("square meter") ||
      message.includes("big") ||
      message.includes("small") ||
      message.includes("bedroom")
    ) {
      return businessResponses.sizes[
        Math.floor(Math.random() * businessResponses.sizes.length)
      ];
    }

    // Location and showroom
    if (
      message.includes("location") ||
      message.includes("where") ||
      message.includes("showroom") ||
      message.includes("visit") ||
      message.includes("office")
    ) {
      return businessResponses.location[
        Math.floor(Math.random() * businessResponses.location.length)
      ];
    }

    // Advantages and benefits
    if (
      message.includes("advantage") ||
      message.includes("benefit") ||
      message.includes("why prefab") ||
      message.includes("why choose")
    ) {
      return businessResponses.advantages[
        Math.floor(Math.random() * businessResponses.advantages.length)
      ];
    }

    // Commercial projects
    if (
      message.includes("commercial") ||
      message.includes("office") ||
      message.includes("business") ||
      message.includes("store") ||
      message.includes("warehouse")
    ) {
      return businessResponses.commercial[
        Math.floor(Math.random() * businessResponses.commercial.length)
      ];
    }

    // Sustainability and eco-friendly
    if (
      message.includes("eco") ||
      message.includes("green") ||
      message.includes("sustainable") ||
      message.includes("environment") ||
      message.includes("solar")
    ) {
      return businessResponses.sustainability[
        Math.floor(Math.random() * businessResponses.sustainability.length)
      ];
    }

    // Comparison with traditional
    if (
      message.includes("vs") ||
      message.includes("versus") ||
      message.includes("traditional") ||
      message.includes("compare") ||
      message.includes("difference")
    ) {
      return businessResponses.comparison[
        Math.floor(Math.random() * businessResponses.comparison.length)
      ];
    }

    // Container units
    if (
      message.includes("container") ||
      message.includes("shipping container")
    ) {
      return "Our container units are perfect for various uses! Starting at ₱800,000, they're ideal for homes, offices, or commercial spaces. They're durable, mobile, and can be customized to your needs. Would you like to see our container unit designs?";
    }

    // Contact information
    if (
      message.includes("contact") ||
      message.includes("phone") ||
      message.includes("email") ||
      message.includes("reach")
    ) {
      return "You can reach us through: 📞 Phone: (available on our website), 📧 Email: info@camcoprefab.com, or visit our showroom in Metro Manila. Our team is available Monday-Saturday, 8AM-6PM. Would you like to schedule a consultation?";
    }

    // Default responses
    const defaultResponses = [
      "Thank you for your inquiry! Our construction specialists will get back to you shortly with detailed information. Is there anything specific about our prefab houses you'd like to know?",
      "I'll connect you with our project consultant who can provide specific details about your prefab construction needs. Meanwhile, feel free to browse our shop page!",
      "That's a great question! Our technical team will provide you with comprehensive information within 24 hours. Would you like to know about our pricing, packages, or timeline?",
      "Let me forward your query to our design team. They'll contact you with detailed specifications and options. In the meantime, what type of project are you planning?",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    // Bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(textToSend),
        sender: "bot",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [
        ...prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" as const }
            : msg
        ),
        botResponse,
      ]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-slate-400 animate-spin" />;
      case "sent":
        return <CheckCircle className="h-3 w-3 text-slate-400" />;
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Interface */}
      {isOpen && (
        <div
          className={cn(
            "mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/50 backdrop-blur-sm transition-all duration-300 ease-out",
            isMinimized ? "h-16" : "h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <CAMCOLogo />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="font-semibold text-sm">CAMCO Support</span>
                <p className="text-xs text-blue-100">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 bg-gradient-to-b from-slate-50/30 to-white">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-300",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
                        <CAMCOLogo />
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-1">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm shadow-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                            : "bg-white border border-slate-200/60 text-slate-800 rounded-bl-md"
                        )}
                      >
                        <p className="leading-relaxed">{message.text}</p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs px-1",
                          message.sender === "user"
                            ? "justify-end text-slate-500"
                            : "justify-start text-slate-500"
                        )}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === "user" &&
                          getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
                      <CAMCOLogo />
                    </div>
                    <div className="bg-white border border-slate-200/60 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                      <p className="text-xs text-slate-500 font-medium">
                        Quick questions
                      </p>
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestions.map((suggestion, index) => {
                        const IconComponent = suggestion.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSuggestionClick(suggestion.text)
                            }
                            className="justify-start text-xs h-10 text-slate-700 hover:bg-slate-50 border-slate-200/60 rounded-xl transition-all duration-200 hover:shadow-sm group"
                          >
                            <div
                              className={cn(
                                "p-1.5 rounded-lg bg-gradient-to-r mr-3 group-hover:scale-110 transition-transform",
                                suggestion.gradient
                              )}
                            >
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                            {suggestion.text}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-200/60 rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="pr-12 border-slate-300/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-slate-50/50 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  <span className="inline-flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    Our experts typically reply within minutes
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <MessageCircle className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-200" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount}
          </Badge>
        )}

        {/* Floating rings animation */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-75 animate-ping"></div>
        <div
          className="absolute inset-0 rounded-full border border-blue-300 opacity-50 animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </Button>
    </div>
  );
};

export default Chatbox;
