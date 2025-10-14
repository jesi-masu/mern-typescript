import { ArrowRight, CheckCircle, Shield, Leaf, DollarSign, Clock, Award } from 'lucide-react';

const CubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <path d="M12.5 17.5L5.5 13L12.5 8.5L19.5 13L12.5 17.5Z" />
    <path d="M12.5 17.5L12.5 23.5" />
    <path d="M19.5 13L19.5 19L12.5 23.5" />
    <path d="M5.5 13L5.5 19L12.5 23.5" />
    <path d="M12.5 8.5L12.5 2.5L5.5 7L12.5 11.5L19.5 7L12.5 2.5Z" />
  </svg>
);

const BoltIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <path d="M13 3v7h6l-8 11v-7H5l8-11z" />
  </svg>
);

const FileCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

const features = [
  {
    icon: <CubeIcon />,
    title: "Cost-Effective Solutions",
    description: "Experience complete price certainty with our innovative construction approach. Our factory-controlled manufacturing eliminates costly overruns, reduces material waste by up to 70%, and accelerates timelines by 50%, delivering exceptional value and faster ROI for your investment.",
    stats: [
      { icon: <DollarSign className="w-4 h-4" />, label: "30% Cost Savings" },
      { icon: <Clock className="w-4 h-4" />, label: "50% Faster Build" }
    ],
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    link: "/features",
  },
  {
    icon: <BoltIcon />,
    title: "Superior Quality & Customization",
    description: "Combining structural excellence with unlimited design possibilities. Every unit undergoes rigorous quality control in our climate-controlled facility, ensuring precision engineering and durability that surpasses traditional construction methods.",
    stats: [
      { icon: <Shield className="w-4 h-4" />, label: "ISO Certified" },
      { icon: <Award className="w-4 h-4" />, label: "Premium Quality" }
    ],
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    link: "/features",
  },
  {
    icon: <FileCheckIcon />,
    title: "Sustainable & Eco-Friendly",
    description: "Building a greener future through responsible construction. By upcycling shipping containers and optimizing our manufacturing process, we reduce material waste by 70% and deliver energy-efficient designs that lower your carbon footprint and utility costs.",
    stats: [
      { icon: <Leaf className="w-4 h-4" />, label: "70% Less Waste" },
      { icon: <CheckCircle className="w-4 h-4" />, label: "Green Certified" }
    ],
    gradient: "from-green-500 to-green-600",
    lightBg: "bg-green-50",
    link: "/features",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-5 py-2.5 rounded-full mb-6 font-bold text-sm shadow-lg">
            <Award className="w-4 h-4" />
            INDUSTRY-LEADING EXCELLENCE
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            Why Choose
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Camco Prefab?
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            We deliver end-to-end prefabricated construction solutions that combine innovation, quality, and sustainability to exceed your expectations at every stage.
          </p>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:-translate-y-2"
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>

              {/* Card Content */}
              <div className="p-8">
                {/* Icon with Premium Background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 ${feature.lightBg} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {feature.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-2 px-4 py-2 ${feature.lightBg} rounded-full text-sm font-semibold text-slate-700`}
                    >
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Link */}
                <a
                  href={feature.link}
                  className={`inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all duration-300 group/link`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Decorative Corner Element */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Trusted by Industry Leaders</h3>
            <p className="text-slate-600 text-lg">Join hundreds of satisfied clients who chose excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Projects Completed" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "15+", label: "Years Experience" },
              { number: "50+", label: "Expert Team Members" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default FeaturesSection;