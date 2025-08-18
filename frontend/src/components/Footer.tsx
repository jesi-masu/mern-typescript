import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Create newsletter subscription object
    const subscription = {
      id: Date.now().toString(),
      email,
      timestamp: new Date().toISOString(),
      status: 'subscribed' as const,
      type: 'newsletter' as const,
      source: 'footer'
    };

    // Store in localStorage (in real app, this would be sent to backend)
    const existingSubscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    existingSubscriptions.push(subscription);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(existingSubscriptions));

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Subscribed Successfully",
        description: "Thank you for subscribing to our newsletter!",
        duration: 3000,
      });
      setEmail("");
    }, 1000);
  };
  
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-prefab-300 via-prefab-400 to-prefab-500" />
      
      <div className="relative container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-prefab-300 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-gradient-to-br from-prefab-300 to-prefab-400 p-3 rounded-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CamcoPrefab
                </h3>
                <div className="h-0.5 w-full bg-gradient-to-r from-prefab-300 to-transparent mt-1" />
              </div>
            </div>
            
            <p className="text-gray-300 mb-10 leading-relaxed">
              Elevating Spaces, Redefining Standards with modern prefabricated structures for residential, commercial, and industrial applications.
            </p>
            
            <div className="flex space-x-3">
              {[
                { href: "https://www.facebook.com/CAMCOContainerHouseCDO", icon: Facebook, label: "Facebook" },
                { href: "https://www.instagram.com/camcocontainerhousecdo/", icon: Instagram, label: "Instagram" },
                { href: "mailto:camcomegasales@gmail.com", icon: Mail, label: "Email" },
                { 
                  href: "https://www.tiktok.com/@camcocontainerhousecdo", 
                  icon: () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  ),
                  label: "TikTok" 
                }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : "_blank"}
                  rel={social.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                  className="group relative"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-prefab-300 to-prefab-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
                  <div className="relative bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 p-3.5 rounded-xl hover:border-prefab-300/50 transition-all duration-300 group-hover:transform group-hover:scale-110">
                    <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xl font-semibold mb-8 relative">
              <span className="relative z-10">Explore</span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-prefab-300 to-prefab-400" />
            </h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/projects", label: "Projects" },
                { to: "/contact", label: "Contact" },
                { to: "/about", label: "About Us" },
                { to: "/faq", label: "FAQ" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-prefab-300 transition-all duration-300 hover:translate-x-2 inline-block relative group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-prefab-300 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-semibold mb-8 relative">
              <span className="relative z-10">Contact Us</span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-prefab-300 to-prefab-400" />
            </h3>
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className="relative mt-1 flex-shrink-0">
                    <div className="absolute inset-0 bg-prefab-300 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-slate-700/50 border border-slate-600/50 p-2.5 rounded-lg">
                      <Mail className="h-4 w-4 text-prefab-300" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Email</p>
                    <a 
                      href="mailto:camcomegasales@gmail.com" 
                      className="text-gray-300 hover:text-prefab-300 transition-colors"
                    >
                      camcomegasales@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className="relative mt-1 flex-shrink-0">
                    <div className="absolute inset-0 bg-prefab-300 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-slate-700/50 border border-slate-600/50 p-2.5 rounded-lg">
                      <MapPin className="h-4 w-4 text-prefab-300" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Address</p>
                    <p className="text-gray-300 leading-relaxed">
                      Mastersons Ave., Upper Balulang<br />
                      Cagayan de Oro City, Philippines
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className="relative mt-1 flex-shrink-0">
                    <div className="absolute inset-0 bg-prefab-300 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-slate-700/50 border border-slate-600/50 p-2.5 rounded-lg">
                      <Phone className="h-4 w-4 text-prefab-300" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Phone</p>
                    <div className="space-y-1">
                      <p className="text-gray-300">0997-951-7188</p>
                      <p className="text-gray-300">0905-794-6233</p>
                      <p className="text-gray-300">0953-615-0966</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stay in the Loop */}
          <div>
            <h3 className="text-xl font-semibold mb-8 relative">
              <span className="relative z-10">Stay in the Loop</span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-prefab-300 to-prefab-400" />
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Subscribe to our newsletter for updates on new products, promotions, and industry insights.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mb-8">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 text-white px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-prefab-300/50 focus:border-prefab-300/50 transition-all duration-300 pr-14"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-prefab-400 to-prefab-500 text-white p-2.5 rounded-lg hover:from-prefab-300 hover:to-prefab-400 transition-all duration-300 disabled:opacity-50 group"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <div className="relative rounded-xl overflow-hidden border border-slate-600/50 bg-slate-700/30 backdrop-blur-sm">
              <iframe
                title="Google Maps"
                className="w-full h-[140px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.916202696478!2d124.61738977596039!3d8.437315893920475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3c6287d889f%3A0x4ccbb8a1ebd5c5e5!2sCamco%20Prefabricated%20Structures!5e0!3m2!1sen!2sus!4v1715240461509!5m2!1sen!2sus"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>
            
            <div className="text-right mt-3">
              <a 
                href="https://www.google.com/maps/place/Camco+Prefabricated+Structures/@8.437316,124.619911,16z/data=!4m6!3m5!1s0x32fff3c6287d889f:0x4ccbb8a1ebd5c5e5!8m2!3d8.437316!4d124.619911!16s%2Fg%2F11q3rjd2fh?hl=en&entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 text-sm hover:text-prefab-300 transition-colors inline-flex items-center group"
              >
                <span>View on Google Maps</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-16 pt-10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-br from-prefab-300 to-prefab-400 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                © {currentYear} CamcoPrefab. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-conditions", label: "Terms of Service" },
                { to: "/sitemap", label: "Sitemap" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="text-gray-400 text-sm hover:text-prefab-300 transition-colors relative group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-prefab-300 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;