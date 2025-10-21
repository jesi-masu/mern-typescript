import React from "react";
import Layout from "@/components/Layout";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactMapSocial } from "@/components/contact/ContactMapSocial";
import { OfficeHours } from "@/components/contact/OfficeHours";

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <ContactHero />
      <ContactInfoCards />

      <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ContactFormSection />
            <ContactMapSocial />
          </div>
        </div>
      </section>

      <OfficeHours />
    </Layout>
  );
};

export default ContactPage;
