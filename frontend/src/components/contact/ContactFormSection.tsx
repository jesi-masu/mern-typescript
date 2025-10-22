import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";

// --- (Helper functions for limit are all correct) ---
const SUBMISSION_LIMIT = 5;
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "contactFormLimit";
type SubmissionData = {
  count: number;
  resetAt?: number;
};
const getSubmissionData = (): SubmissionData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { count: 0 };
  }
  const parsed: SubmissionData = JSON.parse(data);
  if (parsed.resetAt && Date.now() > parsed.resetAt) {
    localStorage.removeItem(STORAGE_KEY);
    return { count: 0 };
  }
  return parsed;
};
const incrementSubmissionCount = (): SubmissionData => {
  const currentData = getSubmissionData();
  const newCount = currentData.count + 1;
  const newData: SubmissionData = {
    count: newCount,
  };
  if (newCount >= SUBMISSION_LIMIT) {
    newData.resetAt = Date.now() + COOLDOWN_PERIOD;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
};
// --- (End of helper functions) ---

export const ContactFormSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    count: 0,
  });
  const isLimitReached = submissionData.count >= SUBMISSION_LIMIT;

  useEffect(() => {
    setSubmissionData(getSubmissionData());
  }, []);

  // ✏️ --- THIS FUNCTION IS NOW CORRECTED ---
  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Make async
    e.preventDefault();

    if (isLimitReached) {
      toast({
        title: "Limit Reached",
        description:
          "You have reached the submission limit. Please try again in 24 hours.",
        variant: "destructive",
      });
      return;
    }
    if (!subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject for your message.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    // 2. REPLACE localStorage logic with fetch
    try {
      const response = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 3. Send the state variables as JSON
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      // 4. Handle success
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });

      // 5. Increment limit on success
      const newSubData = incrementSubmissionCount();
      setSubmissionData(newSubData);

      // 6. Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      // 7. Always stop submitting
      setIsSubmitting(false);
    }
  };
  // ✏️ --- END OF CORRECTED FUNCTION ---

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Send Us a Message
      </h2>
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... (Your form JSX is all correct) ... */}
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
              disabled={isSubmitting || isLimitReached}
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
            {isLimitReached && (
              <p className="text-sm text-red-600 text-center font-medium">
                You have reached the submission limit. Please try again in 24
                hours.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
