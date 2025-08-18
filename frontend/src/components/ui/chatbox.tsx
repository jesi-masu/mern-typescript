import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle
} from "lucide-react";
// Utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered';
}

interface ChatboxProps {
  className?: string;
}

const CAMCOLogo = () => (
  <svg width="32" height="32" viewBox="0 0 200 200" className="w-8 h-8">
    {/* Building structure */}
    <g fill="none" stroke="#2563eb" strokeWidth="4">
      {/* Back building */}
      <rect x="75" y="60" width="50" height="80" fill="#3b82f6" stroke="#1e40af" strokeWidth="2"/>
      <rect x="85" y="70" width="30" height="25" fill="#60a5fa" stroke="#1e40af" strokeWidth="1"/>
      
      {/* Front building */}
      <rect x="45" y="90" width="60" height="80" fill="#ffffff" stroke="#1e40af" strokeWidth="2"/>
      <rect x="55" y="100" width="15" height="20" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/>
      <rect x="75" y="130" width="8" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
      <rect x="85" y="130" width="8" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
      
      {/* Right extension */}
      <rect x="125" y="75" width="45" height="95" fill="#3b82f6" stroke="#1e40af" strokeWidth="2"/>
      <rect x="135" y="85" width="12" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
      <rect x="150" y="85" width="12" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
      <rect x="135" y="105" width="12" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
      <rect x="150" y="105" width="12" height="15" fill="#ffffff" stroke="#1e40af" strokeWidth="1"/>
    </g>
  </svg>
);

const Chatbox = ({ className }: ChatboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to CAMCO Mega Sales Corp. How can I help you with your prefab construction needs today?',
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { text: "What are your house prices?", icon: Home, gradient: "from-emerald-500 to-teal-500" },
    { text: "Get a quote for my project", icon: Calculator, gradient: "from-blue-500 to-indigo-500" },
    { text: "What's included in the package?", icon: FileText, gradient: "from-purple-500 to-pink-500" },
    { text: "Do you deliver nationwide?", icon: MapPin, gradient: "from-orange-500 to-red-500" }
  ];

  const businessResponses = {
    pricing: [
      "Our prefab houses start from ₱1,500,000 for basic models. Prices vary based on size, design, and features. Would you like me to connect you with our sales team for a detailed quote?",
      "We offer flexible payment terms including installment options. Our houses range from ₱1.5M to ₱8M depending on specifications. What's your budget range?",
    ],
    quote: [
      "I'd be happy to help you get a quote! To provide accurate pricing, I'll need some details about your project. Our team will contact you within 24 hours with a comprehensive proposal.",
      "For a personalized quote, please share your location, preferred house size, and any specific requirements. Our design team will prepare a detailed estimate for you.",
    ],
    delivery: [
      "Yes, we deliver nationwide across the Philippines! Delivery costs vary by location. Metro Manila and nearby provinces have standard rates, while remote areas may have additional charges.",
      "We have successfully delivered projects from Luzon to Mindanao. Our logistics team ensures safe transportation and professional installation at your site.",
    ],
    timeline: [
      "Our prefab houses typically take 3-6 months from order to completion, including manufacturing and on-site assembly. Timeline depends on design complexity and site preparation.",
      "Manufacturing takes 6-8 weeks, while on-site assembly usually takes 2-3 weeks. We'll provide a detailed timeline once we assess your specific project requirements.",
    ],
    materials: [
      "We use high-quality steel frames, insulated panels, and weather-resistant materials. All our houses are designed to withstand Philippine weather conditions including typhoons.",
      "Our construction uses galvanized steel, fiber cement boards, and premium insulation. We also offer eco-friendly options with sustainable materials.",
    ],
    permits: [
      "We assist with building permits and ensure all our designs comply with Philippine building codes. Our team can guide you through the permit application process.",
      "Yes, we help with documentation including architectural plans, structural designs, and permit applications. We work with licensed engineers and architects.",
    ],
    customization: [
      "Absolutely! We offer full customization including layout modifications, material upgrades, and additional features. Our design team will work with your vision and budget.",
      "We can customize everything from floor plans to finishes. Popular additions include solar panels, upgraded kitchens, and extended outdoor spaces.",
    ],
    maintenance: [
      "Our prefab houses require minimal maintenance. We provide a comprehensive warranty and maintenance guide. Annual inspections are recommended for optimal performance.",
      "We offer post-installation support and maintenance services. Our houses are designed for durability with low maintenance requirements.",
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      return businessResponses.pricing[Math.floor(Math.random() * businessResponses.pricing.length)];
    }
    if (message.includes('quote') || message.includes('estimate')) {
      return businessResponses.quote[Math.floor(Math.random() * businessResponses.quote.length)];
    }
    if (message.includes('deliver') || message.includes('shipping') || message.includes('nationwide')) {
      return businessResponses.delivery[Math.floor(Math.random() * businessResponses.delivery.length)];
    }
    if (message.includes('time') || message.includes('duration') || message.includes('how long')) {
      return businessResponses.timeline[Math.floor(Math.random() * businessResponses.timeline.length)];
    }
    if (message.includes('material') || message.includes('quality') || message.includes('construction')) {
      return businessResponses.materials[Math.floor(Math.random() * businessResponses.materials.length)];
    }
    if (message.includes('permit') || message.includes('legal') || message.includes('documentation')) {
      return businessResponses.permits[Math.floor(Math.random() * businessResponses.permits.length)];
    }
    if (message.includes('custom') || message.includes('modify') || message.includes('design')) {
      return businessResponses.customization[Math.floor(Math.random() * businessResponses.customization.length)];
    }
    if (message.includes('maintenance') || message.includes('warranty') || message.includes('support')) {
      return businessResponses.maintenance[Math.floor(Math.random() * businessResponses.maintenance.length)];
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for your inquiry! Our construction specialists will get back to you shortly with detailed information.",
      "I'll connect you with our project consultant who can provide specific details about your prefab construction needs.",
      "That's a great question! Our technical team will provide you with comprehensive information within 24 hours.",
      "Let me forward your query to our design team. They'll contact you with detailed specifications and options."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);

    // Bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(textToSend),
        sender: 'bot',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ), botResponse]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-slate-400 animate-spin" />;
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-slate-400" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Interface */}
      {isOpen && (
        <div className={cn(
          "mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/50 backdrop-blur-sm transition-all duration-300 ease-out",
          isMinimized ? "h-16" : "h-[500px]"
        )}>
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
                <p className="text-xs text-blue-100">Online • Typically replies instantly</p>
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
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
                        <CAMCOLogo />
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-1">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm shadow-sm",
                          message.sender === 'user'
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                            : "bg-white border border-slate-200/60 text-slate-800 rounded-bl-md"
                        )}
                      >
                        <p className="leading-relaxed">{message.text}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs px-1",
                        message.sender === 'user' ? "justify-end text-slate-500" : "justify-start text-slate-500"
                      )}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                    {message.sender === 'user' && (
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
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                      <p className="text-xs text-slate-500 font-medium">Quick questions</p>
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
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="justify-start text-xs h-10 text-slate-700 hover:bg-slate-50 border-slate-200/60 rounded-xl transition-all duration-200 hover:shadow-sm group"
                          >
                            <div className={cn("p-1.5 rounded-lg bg-gradient-to-r mr-3 group-hover:scale-110 transition-transform", suggestion.gradient)}>
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
        <div className="absolute inset-0 rounded-full border border-blue-300 opacity-50 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </Button>
    </div>
  );
};

export default Chatbox;