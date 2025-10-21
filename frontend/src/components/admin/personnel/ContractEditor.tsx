import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Save,
  Download,
  FileText,
  Eye,
  EyeOff,
  AlertCircle,
  Calendar,
  Check,
  X,
  FileSignature,
  Clock,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Strikethrough,
  Link,
  Indent,
  Outdent,
  Eraser,
  Type,
  Palette,
  GripVertical,
  Move,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContractEditorProps {
  contract: any;
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({
  contract,
  initialContent,
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current && initialContent && !isInitialized) {
      editorRef.current.innerHTML = initialContent;
      setContent(initialContent);
      setIsInitialized(true);
    }
  }, [initialContent, isInitialized]);

  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  }, [content]);

  useEffect(() => {
    setHasUnsavedChanges(content !== initialContent);
  }, [content, initialContent]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      showNotification("Contract template saved successfully", "success");

      // Keep focus on editor after saving
      if (editorRef.current) {
        editorRef.current.focus();
      }
    } catch (error) {
      showNotification("Failed to save contract", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const execCommand = (command: string, value: string = "") => {
    // Focus the editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }

    document.execCommand(command, false, value);

    // Update content after a short delay to ensure command is applied
    setTimeout(() => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }, 10);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const setFontSize = (size: string) => {
    execCommand("fontSize", "7");
    // Apply custom font size using inline style
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = size;
      range.surroundContents(span);
    }
    setShowFontSizeMenu(false);
    setTimeout(handleEditorInput, 10);
  };

  const setFontFamily = (font: string) => {
    execCommand("fontName", font);
    setShowFontFamilyMenu(false);
    setTimeout(handleEditorInput, 10);
  };

  const setTextColor = (color: string) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const setBackgroundColor = (color: string) => {
    execCommand("backColor", color);
    setShowBgColorPicker(false);
  };

  const clearFormatting = () => {
    execCommand("removeFormat");
    execCommand("unlink");
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          execCommand("italic");
          break;
        case "u":
          e.preventDefault();
          execCommand("underline");
          break;
        case "s":
          e.preventDefault();
          if (!isSaving && hasUnsavedChanges) {
            handleSave();
          }
          break;
        case "z":
          if (e.shiftKey) {
            e.preventDefault();
            execCommand("redo");
          } else {
            // Allow default Ctrl+Z (undo)
          }
          break;
        case "y":
          e.preventDefault();
          execCommand("redo");
          break;
        // Ctrl+A (Select All) - allow default behavior
        // Ctrl+C (Copy) - allow default behavior
        // Ctrl+V (Paste) - allow default behavior
        // Ctrl+X (Cut) - allow default behavior
        default:
          break;
      }
    }
  };

  const handleDownloadWord = () => {
    try {
      // Validate content
      if (!content || content.trim() === "") {
        showNotification(
          "No content to download. Please add content to the editor first.",
          "error"
        );
        return;
      }

      const wordHTML = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Contract ${contract.orderId}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; margin: 0; padding: 20mm; background: white; width: 210mm; }
  
  /* Layout */
  .max-w-4xl { max-width: 100%; margin: 0 auto; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  
  /* Grid - Two Column Layout */
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: 1fr; }
  .grid-cols-2, .md\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
  .gap-2 { gap: 0.5rem; }
  .gap-6 { gap: 1.5rem; }
  
  /* Colors */
  .bg-white { background-color: white; }
  .bg-blue-700 { background-color: #1d4ed8; color: white; padding: 1.5rem; text-align: center; }
  .bg-blue-100 { background-color: #dbeafe; }
  .text-white { color: white; }
  .text-blue-700 { color: #1d4ed8; }
  .text-green-700 { color: #15803d; }
  .text-orange-700 { color: #c2410c; }
  
  /* Typography */
  .text-2xl { font-size: 1.5rem; font-weight: 700; }
  .text-lg { font-size: 1.125rem; font-weight: 600; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-xs { font-size: 0.75rem; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-medium { font-weight: 500; }
  .italic { font-style: italic; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .whitespace-pre-line { white-space: pre-line; }
  
  /* Spacing */
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-8 { margin-top: 2rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mb-8 { margin-bottom: 2rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .p-6 { padding: 1.5rem; }
  .pb-2 { padding-bottom: 0.5rem; }
  
  /* Borders */
  .border { border: 1px solid #e5e7eb; }
  .border-b-2 { border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5rem; }
  .rounded { border-radius: 0.25rem; }
  .rounded-lg { border-radius: 0.5rem; }
  
  /* Tables - Auto-adjust for dynamic rows */
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; table-layout: auto; }
  th, td { border: 1px solid #e5e7eb; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; word-wrap: break-word; }
  th { background-color: #dbeafe; font-weight: 700; text-align: center; }
  tbody tr:nth-child(even) { background-color: #f9fafb; }
  td:first-child, th:first-child { text-align: center; min-width: 50px; }
  td:last-child, th:last-child { text-align: right; min-width: 100px; }
  
  /* Cards */
  .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; margin-bottom: 1rem; }
  .card-header { background-color: #1d4ed8; color: white; padding: 0.5rem 1rem; }
  .card-content { padding: 0.75rem 1rem; }
  .card-title { font-size: 0.875rem; font-weight: 600; }
  
  /* Special Boxes */
  .inclusion-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 1rem; margin: 0.75rem 0; border-radius: 0.25rem; }
  .exclusion-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 0.75rem 0; border-radius: 0.25rem; }
  .signature-box { border: 2px dashed #9ca3af; padding: 1.25rem; text-align: center; margin: 1rem 0; border-radius: 0.25rem; }
  .conforme-box { border: 2px dashed #9ca3af; padding: 1.25rem; margin: 1.25rem 0; border-radius: 0.25rem; }
  
  /* Page Break */
  .page-break { page-break-before: always; margin-top: 2rem; padding-top: 2rem; }
  
  /* Headings */
  h1 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5em; font-weight: 700; font-size: 1.5rem; margin: 1.5em 0 0.5em 0; }
  h2 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 0.3em; font-weight: 700; font-size: 1.25rem; margin: 1.5em 0 0.5em 0; }
  h3 { color: #1d4ed8; font-weight: 600; font-size: 1.125rem; margin: 1.2em 0 0.5em 0; }
  p { margin: 0.5em 0; line-height: 1.6; orphans: 3; widows: 3; }
  strong { font-weight: 700; }
  ul, ol { margin: 0.8em 0; padding-left: 2em; list-style-position: outside; }
  li { margin: 0.5em 0; line-height: 1.5; orphans: 2; widows: 2; }
  
  /* Auto-formatting for dynamic content */
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  
  /* Prevent awkward breaks */
  h1, h2, h3, h4, h5, h6 { page-break-after: avoid; orphans: 4; widows: 4; }
  table, figure, img { page-break-inside: avoid; }
  
  /* Auto-adjust grid on smaller content */
  @media print {
    .grid-cols-2 { grid-template-columns: 1fr 1fr; }
    table { font-size: 0.85rem; }
  }
  
  /* Ensure proper alignment for all text elements */
  div, section, article { box-sizing: border-box; }
  
  /* Auto-format lists with proper indentation */
  ul ul, ol ul { margin-top: 0.25em; margin-bottom: 0.25em; }
  ol ol, ul ol { margin-top: 0.25em; margin-bottom: 0.25em; }
</style>
</head>
<body>${content}</body>
</html>`;

      const blob = new Blob(["\ufeff", wordHTML], {
        type: "application/msword",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contract_${contract.orderId}_${
        new Date().toISOString().split("T")[0]
      }.doc`;

      // Use a more reliable download approach
      link.style.display = "none";
      document.body.appendChild(link);

      // Small delay to ensure the link is in the DOM
      setTimeout(() => {
        link.click();

        // Cleanup after a delay
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 0);

      showNotification("Word document downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading Word document:", error);
      showNotification(
        "Failed to download Word document. Please try again.",
        "error"
      );
    }
  };

  const handleDownloadPDF = async () => {
    const element = editorRef.current;
    if (!element) {
      showNotification("Contract content not found", "error");
      return;
    }

    try {
      showNotification("Generating PDF... Please wait", "info");

      // PDF settings for A4 size (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20; // 20mm margins
      const contentWidth = pageWidth - margin * 2; // 170mm
      const contentHeight = pageHeight - margin * 2; // 257mm

      // Create a temporary container with exact A4 dimensions
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = `${contentWidth}mm`; // Content width without margins
      tempContainer.style.minHeight = `${contentHeight}mm`; // Content height without margins
      tempContainer.style.background = "white";
      tempContainer.style.padding = "0";
      tempContainer.style.margin = "0";
      tempContainer.style.boxSizing = "content-box";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "11pt";
      tempContainer.style.lineHeight = "1.6";
      tempContainer.style.color = "#000";
      document.body.appendChild(tempContainer);

      // Clone the content
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.width = "100%";
      clonedElement.style.margin = "0";
      clonedElement.style.padding = "0";
      tempContainer.appendChild(clonedElement);

      // Find page breaks
      const pageBreaks = clonedElement.querySelectorAll(".page-break");
      const sections: HTMLElement[] = [];

      if (pageBreaks.length > 0) {
        // Split content by page breaks
        let currentSection = document.createElement("div");
        currentSection.style.background = "white";
        currentSection.style.width = "100%";
        currentSection.style.padding = "0";
        currentSection.style.margin = "0";

        Array.from(clonedElement.children).forEach((child) => {
          if (child.classList.contains("page-break")) {
            if (currentSection.children.length > 0) {
              sections.push(currentSection);
            }
            currentSection = document.createElement("div");
            currentSection.style.background = "white";
            currentSection.style.width = "100%";
            currentSection.style.padding = "0";
            currentSection.style.margin = "0";
          } else {
            currentSection.appendChild(child.cloneNode(true));
          }
        });

        if (currentSection.children.length > 0) {
          sections.push(currentSection);
        }
      } else {
        sections.push(clonedElement);
      }

      // Render each section to PDF
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        tempContainer.innerHTML = "";
        tempContainer.appendChild(section);

        // Convert mm to pixels at 96 DPI (1mm = 3.7795275591 pixels)
        const pixelWidth = Math.floor(contentWidth * 3.7795275591);

        const canvas = await html2canvas(section, {
          scale: 2, // Higher quality (2x resolution)
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: pixelWidth,
          width: pixelWidth,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);

        // Calculate image dimensions to fit A4 with margins
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        // Add image with proper margins
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      }

      // Clean up
      document.body.removeChild(tempContainer);

      // Save the PDF
      pdf.save(
        `Contract_${contract.orderId}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      showNotification("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to generate PDF. Please try again.", "error");
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "Never";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 px-8 py-5 rounded-xl shadow-2xl border-2 animate-in slide-in-from-top-4 backdrop-blur-sm ${
              notification.type === "success"
                ? "bg-green-500/95 border-green-400 text-white"
                : notification.type === "error"
                ? "bg-red-500/95 border-red-400 text-white"
                : "bg-blue-500/95 border-blue-400 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6" />
              <span className="font-semibold text-lg">
                {notification.message}
              </span>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden">
          <div className="px-10 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-blue-500/20 backdrop-blur-sm p-4 rounded-2xl border border-blue-400/30">
                  <FileSignature className="h-9 w-9 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Legal Contract Editor
                  </h1>
                  <p className="text-slate-300 text-base mt-2">
                    Professional Document Management System
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-amber-500/20 border-2 border-amber-400/40 rounded-xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-amber-300" />
                    <span className="text-base text-amber-100 font-semibold">
                      Unsaved Changes
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:text-white text-base px-6 py-6"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 px-10 py-6 border-t border-slate-600/50 backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-lg font-bold text-white mt-1">
                    #{contract.orderId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-400/30">
                  <Calendar className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-lg font-bold text-white mt-1">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 border-b border-slate-600/50 px-10 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                <CardTitle className="text-2xl font-bold text-white">
                  Document Workspace
                </CardTitle>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/30 text-base px-8 py-6 font-semibold"
                >
                  {isSaving ? (
                    <>
                      <div className="h-5 w-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Save Template
                    </>
                  )}
                </Button>

                <div className="h-8 w-px bg-slate-500" />

                <Button
                  variant="outline"
                  onClick={handleDownloadWord}
                  className="gap-3 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-400/50 bg-slate-700/50 border-slate-600 text-white text-base px-6 py-6 font-semibold"
                >
                  <Download className="h-5 w-5" />
                  Word (.doc)
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="gap-3 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50 bg-slate-700/50 border-slate-600 text-white text-base px-6 py-6 font-semibold"
                >
                  <Download className="h-5 w-5" />
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-slate-700/30 border-b border-slate-600/50 px-10 py-4">
                <TabsList className="bg-slate-800/80 border border-slate-600/50 p-2">
                  <TabsTrigger
                    value="edit"
                    className="text-base px-8 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Bold className="h-4 w-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="text-base px-8 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="m-0 p-0">
                <div className="flex flex-wrap gap-2 p-6 bg-slate-700/40 border-b border-slate-600/50">
                  {/* Undo/Redo */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={() => execCommand("undo")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("redo")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>

                  {/* Headings */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={() => execCommand("formatBlock", "<h1>")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Heading 1"
                    >
                      <Heading1 className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("formatBlock", "<h2>")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Heading 2"
                    >
                      <Heading2 className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("formatBlock", "<h3>")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Heading 3"
                    >
                      <Heading3 className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("formatBlock", "<p>")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Normal Paragraph"
                    >
                      <Type className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>

                  {/* Font Family */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFontFamilyMenu(!showFontFamilyMenu)}
                      className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
                      title="Font Family"
                    >
                      <Type className="h-5 w-5 text-slate-300" />
                      <span className="text-xs text-slate-300">Font</span>
                    </button>
                    {showFontFamilyMenu && (
                      <div className="absolute top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 min-w-[180px]">
                        {[
                          { name: "Arial", value: "Arial, sans-serif" },
                          {
                            name: "Times New Roman",
                            value: "Times New Roman, serif",
                          },
                          { name: "Georgia", value: "Georgia, serif" },
                          {
                            name: "Courier New",
                            value: "Courier New, monospace",
                          },
                          { name: "Verdana", value: "Verdana, sans-serif" },
                          { name: "Tahoma", value: "Tahoma, sans-serif" },
                          {
                            name: "Trebuchet MS",
                            value: "Trebuchet MS, sans-serif",
                          },
                          {
                            name: "Comic Sans MS",
                            value: "Comic Sans MS, cursive",
                          },
                        ].map((font) => (
                          <button
                            key={font.value}
                            onClick={() => setFontFamily(font.value)}
                            className="w-full px-4 py-2 text-left text-slate-300 hover:bg-blue-500/20 transition-colors text-sm"
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Size */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                      className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
                      title="Font Size"
                    >
                      <Type className="h-5 w-5 text-slate-300" />
                      <span className="text-xs text-slate-300">Size</span>
                    </button>
                    {showFontSizeMenu && (
                      <div className="absolute top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 min-w-[120px]">
                        {[
                          "10px",
                          "12px",
                          "14px",
                          "16px",
                          "18px",
                          "20px",
                          "24px",
                          "28px",
                          "32px",
                        ].map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className="w-full px-4 py-2 text-left text-slate-300 hover:bg-blue-500/20 transition-colors"
                            style={{ fontSize: size }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Text Formatting */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={() => execCommand("bold")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("italic")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("underline")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Underline (Ctrl+U)"
                    >
                      <Underline className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("strikeThrough")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                        title="Text Color"
                      >
                        <Palette className="h-5 w-5 text-slate-300" />
                      </button>
                      {showColorPicker && (
                        <div className="absolute top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 p-3">
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              "#000000",
                              "#1d4ed8",
                              "#dc2626",
                              "#16a34a",
                              "#ea580c",
                              "#9333ea",
                              "#0891b2",
                              "#ca8a04",
                              "#64748b",
                              "#ffffff",
                            ].map((color) => (
                              <button
                                key={color}
                                onClick={() => setTextColor(color)}
                                className="w-8 h-8 rounded border-2 border-slate-600 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                        className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                        title="Background Color"
                      >
                        <div className="relative">
                          <Palette className="h-5 w-5 text-slate-300" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                      </button>
                      {showBgColorPicker && (
                        <div className="absolute top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 p-3">
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              "transparent",
                              "#fef3c7",
                              "#dbeafe",
                              "#dcfce7",
                              "#fee2e2",
                              "#f3e8ff",
                              "#e0f2fe",
                              "#fef9c3",
                              "#f1f5f9",
                              "#ffffff",
                            ].map((color) => (
                              <button
                                key={color}
                                onClick={() => setBackgroundColor(color)}
                                className="w-8 h-8 rounded border-2 border-slate-600 hover:scale-110 transition-transform"
                                style={{
                                  backgroundColor:
                                    color === "transparent"
                                      ? "transparent"
                                      : color,
                                }}
                                title={color}
                              >
                                {color === "transparent" && (
                                  <span className="text-xs text-slate-400">
                                    ⊘
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lists */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={() => execCommand("insertUnorderedList")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Bullet List"
                    >
                      <List className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("insertOrderedList")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Numbered List"
                    >
                      <ListOrdered className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("indent")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Increase Indent"
                    >
                      <Indent className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("outdent")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Decrease Indent"
                    >
                      <Outdent className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>

                  {/* Alignment */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={() => execCommand("justifyLeft")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Align Left"
                    >
                      <AlignLeft className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyCenter")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Align Center"
                    >
                      <AlignCenter className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyRight")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Align Right"
                    >
                      <AlignRight className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyFull")}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Justify"
                    >
                      <AlignJustify className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>

                  {/* Link & Clear */}
                  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <button
                      onClick={insertLink}
                      className="p-3 hover:bg-blue-500/20 rounded border border-transparent hover:border-blue-400/50 transition-all"
                      title="Insert Link"
                    >
                      <Link className="h-5 w-5 text-slate-300" />
                    </button>
                    <button
                      onClick={clearFormatting}
                      className="p-3 hover:bg-red-500/20 rounded border border-transparent hover:border-red-400/50 transition-all"
                      title="Clear Formatting"
                    >
                      <Eraser className="h-5 w-5 text-slate-300" />
                    </button>
                  </div>
                </div>

                <div className="bg-white">
                  <style>{`
                    /* FormalContractDocument Styles for Editor */
                    .bg-blue-700 { background-color: #1d4ed8; color: white; padding: 1.5rem; text-align: center; }
                    .text-white { color: white; }
                    .text-2xl { font-size: 1.5rem; font-weight: 700; }
                    .text-xl { font-size: 1.25rem; font-weight: 700; }
                    .text-lg { font-size: 1.125rem; font-weight: 600; }
                    .text-base { font-size: 1rem; }
                    .text-sm { font-size: 0.875rem; }
                    .text-xs { font-size: 0.75rem; }
                    .text-blue-700 { color: #1d4ed8; }
                    .text-blue-600 { color: #2563eb; }
                    .text-green-700 { color: #15803d; }
                    .text-green-600 { color: #16a34a; }
                    .text-orange-700 { color: #c2410c; }
                    .text-orange-600 { color: #ea580c; }
                    .font-bold { font-weight: 700; }
                    .font-semibold { font-weight: 600; }
                    .font-medium { font-weight: 500; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .italic { font-style: italic; }
                    .flex { display: flex; }
                    .justify-between { justify-content: space-between; }
                    .items-start { align-items: flex-start; }
                    .items-center { align-items: center; }
                    .space-y-2 > * + * { margin-top: 0.5rem; }
                    .space-y-3 > * + * { margin-top: 0.75rem; }
                    .grid { display: grid; }
                    .grid-cols-1 { grid-template-columns: 1fr; }
                    .grid-cols-2, .md\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
                    .gap-2 { gap: 0.5rem; }
                    .gap-4 { gap: 1rem; }
                    .gap-6 { gap: 1.5rem; }
                    .gap-8 { gap: 2rem; }
                    .mb-2 { margin-bottom: 0.5rem; }
                    .mb-3 { margin-bottom: 0.75rem; }
                    .mb-4 { margin-bottom: 1rem; }
                    .mb-6 { margin-bottom: 1.5rem; }
                    .mb-8 { margin-bottom: 2rem; }
                    .mt-2 { margin-top: 0.5rem; }
                    .mt-3 { margin-top: 0.75rem; }
                    .mt-4 { margin-top: 1rem; }
                    .mt-8 { margin-top: 2rem; }
                    .p-3 { padding: 0.75rem; }
                    .p-6 { padding: 1.5rem; }
                    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                    .pt-6 { padding-top: 1.5rem; }
                    .pb-2 { padding-bottom: 0.5rem; }
                    .border { border: 1px solid #e5e7eb; }
                    .border-t { border-top: 1px solid #e5e7eb; }
                    .border-b-2 { border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5rem; }
                    .rounded { border-radius: 0.25rem; }
                    .rounded-lg { border-radius: 0.5rem; }
                    .bg-blue-100 { background-color: #dbeafe; }
                    .bg-gray-100 { background-color: #f3f4f6; }
                    .whitespace-pre-line { white-space: pre-line; }
                    
                    /* Tables */
                    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                    th, td { border: 1px solid #e5e7eb; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; }
                    th { background-color: #dbeafe; font-weight: 700; text-align: center; }
                    tbody tr:nth-child(even) { background-color: #f9fafb; }
                    
                    /* Cards */
                    .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; margin-bottom: 1rem; }
                    .card-header { background-color: #1d4ed8; color: white; padding: 0.5rem 1rem; }
                    .card-content { padding: 0.75rem 1rem; }
                    .card-title { font-size: 0.875rem; font-weight: 600; }
                    
                    /* Special Boxes */
                    .inclusion-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 1rem; margin: 0.75rem 0; border-radius: 0.25rem; }
                    .exclusion-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 0.75rem 0; border-radius: 0.25rem; }
                    .signature-box { border: 2px dashed #9ca3af; padding: 1.25rem; text-align: center; margin: 1rem 0; border-radius: 0.25rem; }
                    .conforme-box { border: 2px dashed #9ca3af; padding: 1.25rem; margin: 1.25rem 0; border-radius: 0.25rem; }
                    
                    /* Page Break */
                    .page-break { 
                      page-break-before: always; 
                      margin-top: 2rem; 
                      padding-top: 2rem; 
                      border-top: 2px dashed #cbd5e1;
                      position: relative;
                    }
                    .page-break::before {
                      content: '--- Page Break ---';
                      position: absolute;
                      top: -0.75rem;
                      left: 50%;
                      transform: translateX(-50%);
                      background: white;
                      padding: 0 1rem;
                      color: #94a3b8;
                      font-size: 0.75rem;
                      font-weight: 600;
                    }
                  `}</style>
                  <div className="bg-slate-50 p-8">
                    <div className="bg-white shadow-lg max-w-[210mm] mx-auto relative group">
                      {/* Drag Handle Indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                        <GripVertical className="h-6 w-6 text-blue-500/50" />
                      </div>

                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[297mm] p-[20mm] focus:outline-none focus:ring-4 focus:ring-blue-500/20 cursor-text hover:cursor-text draggable-content"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "11pt",
                          lineHeight: "1.6",
                          color: "#000",
                          width: "210mm",
                          boxSizing: "border-box",
                        }}
                        onInput={handleEditorInput}
                        onBlur={handleEditorInput}
                        onKeyDown={handleKeyDown}
                        onPaste={(e) => {
                          // Handle paste to clean up formatting if needed
                          setTimeout(handleEditorInput, 10);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="m-0 p-0">
                <div className="bg-slate-100 p-12">
                  <div className="bg-white shadow-2xl border border-slate-300 overflow-hidden max-w-[210mm] mx-auto">
                    <div
                      ref={contentRef}
                      className="p-[20mm] min-h-[297mm]"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11pt",
                        lineHeight: "1.6",
                        color: "#000",
                        width: "210mm",
                        boxSizing: "border-box",
                      }}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between text-base text-slate-300">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">Auto-Save Enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Secure Storage</span>
              </div>
            </div>
            <span className="text-slate-400 font-medium">
              Legal Contract System v2.0 Professional
            </span>
          </div>
        </div>
      </div>

      <style>{`
        /* Match FormalContractDocument styling */
        [contenteditable] {
          font-family: Arial, sans-serif;
        }
        
        [contenteditable] .bg-blue-700 {
          background-color: #1d4ed8;
          color: white;
          padding: 1.5rem;
          text-align: center;
        }
        
        [contenteditable] .text-white {
          color: white;
        }
        
        [contenteditable] .text-2xl {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        [contenteditable] .text-lg {
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        [contenteditable] .text-sm {
          font-size: 0.875rem;
        }
        
        [contenteditable] .text-blue-700 {
          color: #1d4ed8;
        }
        
        [contenteditable] .font-bold {
          font-weight: 700;
        }
        
        [contenteditable] .text-center {
          text-align: center;
        }
        
        [contenteditable] .text-right {
          text-align: right;
        }
        
        [contenteditable] .italic {
          font-style: italic;
        }
        
        [contenteditable] .border-b-2 {
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 0.5rem;
        }
        
        [contenteditable] table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        [contenteditable] th,
        [contenteditable] td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
        }
        
        [contenteditable] th {
          background-color: #dbeafe;
          font-weight: 700;
          text-align: center;
        }
        
        [contenteditable] .bg-blue-100 {
          background-color: #dbeafe;
        }
        
        [contenteditable] .inclusion-box {
          background-color: #dcfce7;
          border-left: 4px solid #22c55e;
          padding: 1rem;
          margin: 0.75rem 0;
        }
        
        [contenteditable] .exclusion-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          margin: 0.75rem 0;
        }
        
        [contenteditable] .text-green-700 {
          color: #15803d;
        }
        
        [contenteditable] .text-orange-700 {
          color: #c2410c;
        }
        
        [contenteditable] h1 {
          color: #1d4ed8;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 0.5em;
          font-weight: 700;
          font-size: 1.5rem;
          margin: 1.5em 0 0.5em 0;
        }
        
        [contenteditable] h2 {
          color: #1d4ed8;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 0.3em;
          font-weight: 700;
          font-size: 1.25rem;
          margin: 1.5em 0 0.5em 0;
        }
        
        [contenteditable] h3 {
          color: #1d4ed8;
          font-weight: 600;
          font-size: 1.125rem;
          margin: 1.2em 0 0.5em 0;
        }
        
        [contenteditable] p {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        
        [contenteditable] strong {
          font-weight: 700;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.8em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
        }
        
        [contenteditable] .page-break {
          page-break-before: always;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px dashed #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default ContractEditor;
