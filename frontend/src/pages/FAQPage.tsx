import React, { useState } from "react";
import Layout from "@/components/Layout";
import { FAQHero } from "@/components/faq/FAQHero";
import Guides from "@/components/home/Guides";
import { FAQSearchFilter } from "@/components/faq/FAQSearchFilter";
import { FAQList } from "@/components/faq/FAQList";
import { FAQContact } from "@/components/faq/FAQContact";
import { HelpCircle, MessageSquare, Phone, Mail } from "lucide-react"; // Only need icons used in faqData

// Keep faqData definition here or move it to a separate data file
const faqData = [
  {
    category: "General Questions",
    icon: HelpCircle,
    color: "from-blue-500 to-indigo-600",
    questions: [
      {
        id: "q1",
        question: "What is Camco Prefab?",
        answer: "CamcoPrefab is...",
      },
      {
        id: "q2",
        question: "Are prefab containers comfortable...?",
        answer: "No, unlike...",
      },
      {
        id: "q3",
        question: "What types of projects...?",
        answer: "We offer versatile solutions...",
      },
      {
        id: "q4",
        question: "Do you serve areas outside...?",
        answer: "Yes, we serve clients...",
      },
    ],
  },
  {
    category: "Design & Customization",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-600",
    questions: [
      {
        id: "q5",
        question: "Do you offer customization?",
        answer: "Yes, we can...",
      },
      {
        id: "q6",
        question: "How customizable are your prefab structures?",
        answer: "Our structures are highly customizable...",
      },
      {
        id: "q7",
        question: "Whare the Specifications bare unit? ",
        answer: "Galvanized Steel Frame...",
      },
      {
        id: "q8",
        question: "Do you provide 3D visualizations of designs?",
        answer: "Yes, we provide detailed 3D renderings...",
      },
      {
        id: "q9",
        question: "How long will it last?",
        answer: "At least 20 years...",
      },
    ],
  },
  {
    category: "Pricing & Payment",
    icon: Phone,
    color: "from-purple-500 to-pink-600",
    questions: [
      {
        id: "q10",
        question: "How is pricing determined...?",
        answer: "Pricing depends on...",
      },
      {
        id: "q11",
        question: "Do you offer financing options?",
        answer: "We work with several financial partners...",
      },
      {
        id: "q12",
        question: "What is included in the project cost?",
        answer: "Our comprehensive pricing typically includes...",
      },
    ],
  },
  {
    category: "Installation & Delivery",
    icon: Mail,
    color: "from-orange-500 to-red-600",
    questions: [
      {
        id: "q13",
        question: "How are prefab structures delivered and installed?",
        answer: "We use specialized transport vehicles...",
      },
      {
        id: "q14",
        question: "What site preparation is required?",
        answer: "Site preparation typically includes...",
      },
      {
        id: "q15",
        question: "How long does it take to assemble?",
        answer: "Installation timeframes vary...",
      },
    ],
  },
  {
    category: "Technical Support",
    icon: HelpCircle,
    color: "from-cyan-500 to-blue-600",
    questions: [
      {
        id: "q16",
        question: "What warranty do you provide?",
        answer: "We offer comprehensive warranties...",
      },
      {
        id: "q17",
        question: "How do I get support after installation?",
        answer: "Our customer support team is available...",
      },
      {
        id: "q18",
        question: "Can I expand or modify my structure later?",
        answer: "Yes, our modular design philosophy allows...",
      },
    ],
  },
];

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const getFilteredQuestions = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            (activeCategory === "all" ||
              category.category === activeCategory) &&
            (searchQuery === "" ||
              q.question.toLowerCase().includes(lowerCaseQuery) ||
              q.answer.toLowerCase().includes(lowerCaseQuery))
        ),
      }))
      .filter((category) => category.questions.length > 0);
  };

  const filteredFAQs = getFilteredQuestions();

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  return (
    <Layout>
      <FAQHero faqData={faqData} />
      <Guides />
      <FAQSearchFilter
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        faqData={faqData} // Pass only needed parts for filters
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
      />
      <FAQList filteredFAQs={filteredFAQs} onResetFilters={resetFilters} />
      <FAQContact />
    </Layout>
  );
};

export default FAQPage;
