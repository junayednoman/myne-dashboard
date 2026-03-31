"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import JoditTextEditor from "@/components/form/ATextEditor";
import { toast } from "sonner";
import {
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsAndConditionsMutation,
} from "@/redux/api/legalApi";

interface ContentSection {
  id: string;
  title: string;
  content: string;
}

const SettingsTabsEditor = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      id: "terms",
      title: "Terms & Conditions",
      content: "",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content: "",
    },
  ]);

  const { data: termsData } = useGetTermsAndConditionsQuery();
  const { data: privacyData } = useGetPrivacyPolicyQuery();
  const [updateTermsAndConditions] = useUpdateTermsAndConditionsMutation();
  const [updatePrivacyPolicy] = useUpdatePrivacyPolicyMutation();

  useEffect(() => {
    if (!termsData?.data?.description) return;
    setContentSections((prev) =>
      prev.map((section) =>
        section.id === "terms"
          ? { ...section, content: termsData.data.description }
          : section,
      ),
    );
  }, [termsData?.data?.description]);

  useEffect(() => {
    if (!privacyData?.data?.description) return;
    setContentSections((prev) =>
      prev.map((section) =>
        section.id === "privacy"
          ? { ...section, content: privacyData.data.description }
          : section,
      ),
    );
  }, [privacyData?.data?.description]);

  const handleContentChange = (sectionId: string, content: string) => {
    setContentSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    );
    setSavedStates((prev) => ({ ...prev, [sectionId]: false }));
  };

  const handleSave = async (sectionId: string) => {
    const section = contentSections.find((s) => s.id === sectionId);
    if (!section) return;

    setSavingStates((prev) => ({ ...prev, [sectionId]: true }));

    try {
      if (sectionId === "terms") {
        await updateTermsAndConditions({ description: section.content }).unwrap();
      } else if (sectionId === "privacy") {
        await updatePrivacyPolicy({ description: section.content }).unwrap();
      }
      toast.success(`${section.title} updated successfully!`);

      setSavedStates((prev) => ({ ...prev, [sectionId]: true }));
      setTimeout(() => {
        setSavedStates((prev) => ({ ...prev, [sectionId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to save content:", err);
      toast.error(
        `Failed to save ${section.title.toLowerCase()}. Please try again.`,
      );
    } finally {
      setSavingStates((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          <TabsList className="grid h-14 w-full grid-cols-2 bg-card">
            <TabsTrigger
              value="terms"
              className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Privacy Policy
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col">
            {contentSections.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                className="flex-1 flex flex-col mt-0"
              >
                <div className="flex-1 flex flex-col">
                  <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-foreground">
                      {section.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Edit and manage your {section.title.toLowerCase()} content
                    </p>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="h-fit bg-background border border-border rounded-lg overflow-hidden">
                      <JoditTextEditor
                        content={section.content}
                        onChange={(content) =>
                          handleContentChange(section.id, content)
                        }
                        placeholder={`Enter your ${section.title.toLowerCase()} content here...`}
                      />
                    </div>
                  </div>

                  <div className="p-6 border-t border-border">
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave(section.id)}
                        disabled={
                          savingStates[section.id] || savedStates[section.id]
                        }
                        className="min-w-[140px] gap-2 bg-white text-black hover:bg-white/90"
                        size="lg"
                      >
                        {savingStates[section.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : savedStates[section.id] ? (
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
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsTabsEditor;
