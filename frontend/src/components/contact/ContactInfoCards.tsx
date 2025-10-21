import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export const ContactInfoCards: React.FC = () => {
  return (
    <section className="py-16 bg-white relative -mt-5">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
            <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Phone</h3>
              <p className="text-gray-600 mb-4">
                Call us during business hours
              </p>
              <a
                href="tel:+639979517188"
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
              >
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
              <a
                href="mailto:camcomegasales@gmail.com"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors break-all"
              >
                camcomegasales@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
            <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                Office Location
              </h3>
              <p className="text-gray-600 mb-4">Visit our main office</p>
              <address className="text-orange-600 not-italic font-semibold text-sm">
                Mastersons Ave., Upper Balulang Cagayan de Oro City,
                Philippines.
              </address>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
