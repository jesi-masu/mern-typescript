import React from 'react';
import { Quote, CreditCard, Calendar, Wrench, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

const ManualOrderProcess = () => {
  const steps = [
    {
      id: 1,
      title: "Consultation & Quote",
      description: "Experience our white-glove service with personalized consultation and detailed project assessment by our master craftsmen.",
      icon: Quote,
      gradient: "from-amber-400 via-yellow-500 to-amber-600",
      shadowColor: "shadow-amber-500/20"
    },
    {
      id: 2,
      title: "Payment Selection",
      description: "Choose from our curated selection of premium payment solutions, tailored to your financial preferences and requirements.",
      icon: CreditCard,
      gradient: "from-emerald-400 via-teal-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/20"
    },
    {
      id: 3,
      title: "Schedule Installation",
      description: "Coordinate with our concierge team to schedule your installation at a time that perfectly aligns with your lifestyle.",
      icon: Calendar,
      gradient: "from-violet-400 via-purple-500 to-violet-600",
      shadowColor: "shadow-violet-500/20"
    },
    {
      id: 4,
      title: "Installation",
      description: "Our certified artisans deliver flawless installation with meticulous attention to detail and uncompromising quality standards.",
      icon: Wrench,
      gradient: "from-rose-400 via-pink-500 to-rose-600",
      shadowColor: "shadow-rose-500/20"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-32 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-white/30 to-slate-50/50"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/20 to-transparent"></div>
      </div>
      
      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-200 to-white rounded-full mb-8 shadow-lg ring-1 ring-slate-200">
            <Sparkles className="w-8 h-8 text-slate-700" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-8 tracking-tight">
            Manual Order Process
          </h2>
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full mx-4"></div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
          </div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            Elevate your experience with our bespoke manual order process. Our dedicated specialists provide 
            personalized attention and expert guidance throughout your luxury journey.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Elegant connecting line */}
          <div className="hidden lg:block absolute top-40 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 rounded-2xl`}></div>
                
                {/* Step Card */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:border-slate-300/80 transition-all duration-700 ease-out transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-slate-500/10 group">
                  {/* Card Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-slate-50/90 rounded-2xl"></div>
                  
                  <div className="relative p-10">
                    {/* Step Number with Luxury Styling */}
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-white rounded-full mb-8 mx-auto shadow-lg ring-1 ring-slate-200/60 group-hover:shadow-xl group-hover:ring-slate-300/80 transition-all duration-500">
                      <span className="text-2xl font-bold bg-gradient-to-br from-slate-700 to-slate-800 bg-clip-text text-transparent">
                        {step.id}
                      </span>
                    </div>
                    
                    {/* Premium Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mb-8 mx-auto shadow-lg ${step.shadowColor} group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-center font-light">
                      {step.description}
                    </p>
                  </div>

                  {/* Elegant Footer */}
                  <div className="px-10 pb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${step.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`}></div>
                    </div>
                  </div>
                </div>

                {/* Premium Desktop Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-40 -right-3 transform -translate-y-1/2 z-20">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:border-slate-300/80 transition-all duration-500">
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-6">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-full flex items-center justify-center shadow-lg mb-3">
                        <ChevronRight className="w-4 h-4 text-slate-600 rotate-90" />
                      </div>
                      <div className="w-px h-12 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
            
      </div>
    </div>
  );
};

export default ManualOrderProcess;