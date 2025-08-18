import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create message object
    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'unread' as const,
      type: 'contact_form' as const
    };

    // Store in localStorage (in real app, this would be sent to backend)
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    existingMessages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
        duration: 5000,
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat bg-center" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e2e8f0' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">Contact Us</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Have questions about our prefab solutions or need help with your project? 
              Our team is here to help. Reach out to us using any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white relative -mt-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Phone</h3>
                <p className="text-gray-600 mb-4">Call us during business hours</p>
                <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors">
                  0997-951-7188
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Email</h3>
                <p className="text-gray-600 mb-4">Send us an email anytime</p>
                <a href="mailto:info@prefabplus.com" className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors">
                  camcomegasales@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Office Location</h3>
                <p className="text-gray-600 mb-4">Visit our main office</p>
                <address className="text-orange-600 not-italic font-semibold">
                  Camco Prefabricated Structures<br />
                  Cagayan de Oro City<br />
                  Philippines
                </address>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Send Us a Message</h2>
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Subject *
                      </label>
                      <Select value={subject} onValueChange={setSubject} required>
                        <SelectTrigger className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                          <SelectValue placeholder="Select a subject for your message" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="quote">Request a Quote</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="career">Careers</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Write your message here... Please provide as much detail as possible to help us assist you better."
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-prefab-600 to-blue-600 hover:from-prefab-700 hover:to-blue-700 text-white w-full md:w-auto px-8 py-3 h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Location</h2>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.916202696478!2d124.61738977596039!3d8.437315893920475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3c6287d889f%3A0x4ccbb8a1ebd5c5e5!2sCamco%20Prefabricated%20Structures!5e0!3m2!1sen!2sus!4v1715240461509!5m2!1sen!2sus" 
                  width="100%" 
                  height="320" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Camco Prefabricated Structures Location">
                </iframe>
              </div>
              
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Connect With Us</h3>
                  <p className="text-gray-600 mb-6">
                    Follow us on social media to stay updated with our latest projects, 
                    design trends, and company news.
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Office Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Main Office
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="font-medium text-gray-700">Monday - Friday</span>
                      <span className="text-blue-600 font-semibold">9:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="font-medium text-gray-700">Saturday</span>
                      <span className="text-blue-600 font-semibold">10:00 AM - 2:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Sunday</span>
                      <span className="text-gray-500 font-semibold">Closed</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    Showroom
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="font-medium text-gray-700">Monday - Friday</span>
                      <span className="text-emerald-600 font-semibold">9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="font-medium text-gray-700">Saturday</span>
                      <span className="text-emerald-600 font-semibold">10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Sunday</span>
                      <span className="text-emerald-600 font-semibold">11:00 AM - 3:00 PM</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;