"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import JoditTextEditor from "@/components/form/ATextEditor";

interface ContentEditorProps {
  title: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: (content: string) => void;
}

const ContentEditor = ({
  title,
  content,
  onContentChange,
  onSave,
}: ContentEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
    onContentChange(newContent);
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(currentContent);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-fit">
      {/* Title */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">
          Edit and manage your {title.toLowerCase()} content
        </p>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <div className="h-fit bg-background border border-border rounded-lg overflow-hidden">
          <JoditTextEditor
            content={currentContent}
            onChange={handleContentChange}
            placeholder={`Enter your ${title.toLowerCase()} content here...`}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 border-t border-border">
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="min-w-[120px] gap-2"
            size="lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
