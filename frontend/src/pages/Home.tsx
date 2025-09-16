import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PhilippinesMapSection from "@/components/home/PhilippinesMapSection";
import PrefabVsContainerSection from "@/components/home/PrefabVsContainerSection";
import PrefabVsConventionalSection from "@/components/home/PrefabVsConventionalSection";
import TechnicalDataSection from "@/components/home/TechnicalDataSection";
import ContainerUnitDetailsSection from "@/components/home/ContainerUnitDetailsSection";
import CreativeDesignsCarousel from "@/components/home/CreativeDesignsCarousel";
import Layout from "@/components/Layout";
import StatisticsSection from "@/components/home/StatisticsSection";
import Banner from "@/components/home/Banner";
import Collections from "@/components/home/Collections";
import Section from "@/components/home/ElegantFeatureSection";
import ElegantFeaturesSection from "@/components/home/ElegantFeatureSection";
import Featured from "@/components/home/Featured";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen relative">
        {/* All content sections with smooth transitions */}
        <div className="animate-fade-in">
          <HeroSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Banner />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Featured />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatisticsSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CreativeDesignsCarousel />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Collections />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FeaturesSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <TechnicalDataSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <ContainerUnitDetailsSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <ElegantFeaturesSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <PrefabVsContainerSection />
        </div>

        <div className="flex w-full flex-col">
          <div className="card bg-base-300 rounded-box grid h-20 place-items-center"></div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <PrefabVsConventionalSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <TestimonialsSection />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "1.0s" }}>
          <CTASection />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
