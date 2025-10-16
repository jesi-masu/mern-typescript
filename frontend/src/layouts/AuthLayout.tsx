import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle: string;
  promptLink: React.ReactNode;
  formComponent: React.ReactNode;
  sideContent?: React.ReactNode; // Optional additional content
}

export const AuthLayout = ({
  title,
  subtitle,
  promptLink,
  formComponent,
  sideContent,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 via-blue-500 to-blue-300 flex items-center relative overflow-hidden font-inter">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side content */}
        <div className="p-4 lg:p-8 flex flex-col justify-center transform transition-all duration-1000 ease-out animate-in slide-in-from-left-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-xl text-white/90 font-light">{subtitle}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent rounded-full transition-all duration-500 hover:w-32"></div>
            </div>
            <div className="space-y-4">
              {promptLink}
              <p className="text-white/80 text-lg leading-relaxed">
                Smart Homes, Smart Choice.
                <span className="block text-blue-100 font-medium">
                  Effortless Living Starts Here.
                </span>
              </p>
            </div>
            <Link to="/" className="w-fit group">
              <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group-hover:border-white/30"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            {/* Optional content area for login page demo accounts */}
            {sideContent && <div className="pt-8">{sideContent}</div>}
          </div>
        </div>

        {/* Right side form */}
        <div className="flex justify-center p-4 transform transition-all duration-1000 ease-out animate-in slide-in-from-right-10 delay-300">
          {formComponent}
        </div>
      </div>
    </div>
  );
};
