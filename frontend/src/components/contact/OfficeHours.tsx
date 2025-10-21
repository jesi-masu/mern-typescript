import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail } from "lucide-react";

export const OfficeHours: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Office Hours
          </h2>
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
                    <span className="font-medium text-gray-700">
                      Monday - Friday
                    </span>
                    <span className="text-blue-600 font-semibold">
                      8:30 AM - 5:30 PM
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-blue-600 font-semibold">
                      8:30 AM - 12:00 PM
                    </span>{" "}
                    {/* Updated Time */}
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
                  Showroom (Example)
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-emerald-100">
                    <span className="font-medium text-gray-700">
                      Monday - Friday
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      9:30 AM - 5:30 PM
                    </span>{" "}
                    {/* Updated Time */}
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-emerald-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-emerald-600 font-semibold">
                      9:30 AM - 5:30 PM
                    </span>{" "}
                    {/* Updated Time */}
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="text-gray-500 font-semibold">Closed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
