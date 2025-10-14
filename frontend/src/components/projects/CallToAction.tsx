import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-indigo-800 dark:to-purple-900 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative animate-fade-in-up">
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <circle cx="20" cy="80" r="15" fill="white" opacity="0.1" />
          <circle cx="80" cy="20" r="20" fill="white" opacity="0.1" />
          <rect
            x="10"
            y="10"
            width="30"
            height="30"
            fill="white"
            opacity="0.05"
            transform="rotate(45 25 25)"
          />
        </svg>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white leading-tight">
          Ready to Bring Your Vision to Life?
        </h2>
        <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
          Our portfolio showcases our expertise. Let our dedicated team turn
          your ideas into reality with innovative, high-quality prefabricated
          construction solutions that meet your exact specifications and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-indigo-50 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Request Consultation
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 hover:border-white/80 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Download Brochure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
