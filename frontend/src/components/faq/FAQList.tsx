import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  icon: React.ElementType;
  color: string;
  questions: FAQItem[];
}

interface FAQListProps {
  filteredFAQs: FAQCategory[];
  onResetFilters: () => void;
}

export const FAQList: React.FC<FAQListProps> = ({
  filteredFAQs,
  onResetFilters,
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-12">
            {filteredFAQs.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex} className="max-w-4xl mx-auto">
                  <div className="flex items-center mb-8">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {category.category}
                      </h2>
                      <div
                        className={`h-1 w-20 bg-gradient-to-r ${category.color} rounded-full mt-2`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faq.id} className="group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300" />
                          <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <Accordion type="single" collapsible>
                              <AccordionItem
                                value={faq.id}
                                className="border-0"
                              >
                                <AccordionTrigger className="px-8 py-6 hover:bg-gray-50/50 transition-colors group text-left">
                                  <div className="flex items-start">
                                    <div
                                      className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1`}
                                    >
                                      <span className="text-white font-semibold text-sm">
                                        {String(faqIndex + 1).padStart(2, "0")}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-prefab-600 transition-colors">
                                        {faq.question}
                                      </h3>
                                    </div>
                                  </div>
                                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-prefab-500 transition-colors ml-4 accordion-chevron" />
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-8">
                                  <div className="ml-12">
                                    <p className="text-gray-700 leading-relaxed text-base">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Results Found
            </h3>
            <p className="text-gray-600 mb-8">
              We couldn't find any FAQs matching your search criteria. Try
              different keywords or browse all categories.
            </p>
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="bg-white border-prefab-300 text-prefab-600 hover:bg-prefab-50"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
