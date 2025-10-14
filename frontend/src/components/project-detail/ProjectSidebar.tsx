// src/components/project-detail/ProjectSidebar.tsx

import { Link } from "react-router-dom";
import { Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Project } from "@/types";

interface ProjectSidebarProps {
  project: Project;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* ✅ UPDATED HIGHLIGHTS CARD */}
      {/* This now uses the dedicated 'highlights' array */}
      {Array.isArray(project.highlights) && project.highlights.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
          <h3 className="text-xl font-semibold mb-6 text-slate-900">
            Project Highlights
          </h3>
          <div className="space-y-4">
            {project.highlights.map(
              (
                highlight,
                index // <-- CHANGED from project.features.slice()
              ) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-slate-700">{highlight}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* FAQ Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
        <h3 className="text-xl font-semibold mb-6 text-slate-900">
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-slate-200">
            <AccordionTrigger className="text-left hover:no-underline">
              What are the benefits of modular construction?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              Modular construction offers faster build times, reduced waste,
              consistent quality control, and lower overall costs compared to
              traditional construction methods.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-slate-200">
            <AccordionTrigger className="text-left hover:no-underline">
              How long does assembly take?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              On-site assembly typically takes 2-4 weeks depending on the
              project size, which is significantly faster than conventional
              construction.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-slate-200">
            <AccordionTrigger className="text-left hover:no-underline">
              Are modules customizable?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              Yes, all our prefabricated modules can be customized to meet
              specific requirements for layout, finishes, and features while
              maintaining the efficiency of modular construction.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">
          Interested in Similar Project?
        </h3>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Contact our team to discuss your project requirements and learn how
          our prefab solutions can work for you.
        </p>
        <div className="space-y-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium">
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Project Consultation</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-slate-600">
                Our experts will help you explore how our prefab solutions can
                bring your vision to life.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Contact Sales Team
                </Button>
                <Button variant="outline" className="w-full">
                  Download Project Brief
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-slate-400 text-slate-300 hover:bg-white/10"
            >
              Get In Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
