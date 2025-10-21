import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"; // Corrected path

export const ContactFormSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject for your message.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: "unread" as const,
      type: "contact_form" as const,
    };

    const existingMessages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]"
    );
    existingMessages.push(contactMessage);
    localStorage.setItem("contactMessages", JSON.stringify(existingMessages));

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
        duration: 5000,
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Send Us a Message
      </h2>
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Your Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                Subject *
              </label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                  <SelectValue placeholder="Select a subject for your message" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="quote">Request a Quote</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                Message *
              </label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors rounded-lg"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-prefab-600 to-blue-600 hover:from-prefab-700 hover:to-blue-700 text-white w-full md:w-auto px-8 py-3 h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>{" "}
                  Sending...
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
