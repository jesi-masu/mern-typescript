import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, Phone } from "lucide-react";

export const FAQContact: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-prefab-600 via-prefab-700 to-prefab-800 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-prefab-100 mb-12 leading-relaxed">
            Can't find what you're looking for? Our expert team is ready to
            provide personalized assistance for your prefabricated construction
            needs.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/contact">
              <Button className="w-full bg-white text-prefab-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 py-4 text-lg font-semibold group">
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Contact Us
              </Button>
            </Link>
            <a href="tel:+63-997-951-7188">
              <Button
                variant="outline"
                className="w-full bg-white/90 text-prefab-700 hover:bg-gray-50 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 py-4 text-lg font-semibold group"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Call: 0997-951-7188
              </Button>
            </a>
          </div>

          <div className="mt-8 text-prefab-200">
            <p>Available Monday - Friday, 8:30 AM - 5:30 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};
