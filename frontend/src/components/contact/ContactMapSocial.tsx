import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Mail } from "lucide-react";
import { SiTiktok, SiYoutube } from "react-icons/si"; // Import new icons

export const ContactMapSocial: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Location</h2>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.916202696478!2d124.61738977596039!3d8.437315893920475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3c6287d889f%3A0x4ccbb8a1ebd5c5e5!2sCamco%20Prefabricated%20Structures!5e0!3m2!1sen!2sus!4v1715240461509!5m2!1sen!2sus" // Replace with your actual Google Maps embed src
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Camco Prefabricated Structures Location"
        ></iframe>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-8">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            Connect With Us
          </h3>
          <p className="text-gray-600 mb-6">
            Follow us on social media for updates.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/camcoprefab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="mailto:camcomegasales@gmail.com"
              aria-label="Email"
              className="w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@camcowarehouseracking1669"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
            >
              <SiYoutube size={20} />
            </a>
            {/* Add TikTok link if available */}
            <a
              href="https://tiktok.com/@camcocontainerhousecdo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white"
            >
              <SiTiktok size={20} />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
