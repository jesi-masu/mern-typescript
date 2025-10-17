import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";

interface UploadFormProps {
  selectedFile: File | null;
  recordType: string;
  description: string;
  recordTypes: { value: string; label: string }[];
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRecordTypeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpload: () => void;
  onClearFile: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  selectedFile,
  recordType,
  description,
  recordTypes,
  onFileSelect,
  onRecordTypeChange,
  onDescriptionChange,
  onUpload,
  onClearFile,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Records
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 ">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select File
              </label>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={onFileSelect}
                className="file:mr-4 file:py-2 file:px-4 h-15 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    {selectedFile.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={onClearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Record Type
              </label>
              <Select value={recordType} onValueChange={onRecordTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Add a description for this upload..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            Supported formats: CSV, Excel, JSON • Max size: 10MB
          </p>
          <Button onClick={onUpload} disabled={!selectedFile || !recordType}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Records
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
