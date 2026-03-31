"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useGetAdminProfileQuery } from "@/redux/api/profileApi";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";
import { Loader2 } from "lucide-react";

const ProfileContainer = () => {
  const [activeTab, setActiveTab] = useState("edit-profile");
  const { data, isLoading, isError, error } = useGetAdminProfileQuery();
  const profile = data?.data;
  const errorMessage = (() => {
    if (!isError) return "";
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "data" in error) {
      const dataError = (error as { data?: { message?: string } }).data;
      if (dataError?.message) return dataError.message;
    }
    return "Failed to load profile data.";
  })();

  return (
    <div className="min-h-screen bg-card p-6 rounded-lg">
      <div className="max-w-2xl mx-auto space-y-8">
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm">Loading profile...</span>
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            {errorMessage}
          </div>
        ) : (
          <ProfileHeader
            name={profile?.name || "User Name"}
            role="Admin"
            avatar={profile?.avatar || PLACEHOLDER_IMAGE}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="edit-profile"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent pb-2 text-muted-foreground text-[16px]"
            >
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="change-password"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent pb-2 text-muted-foreground text-[16px]"
            >
              Change Password
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="edit-profile" className="mt-0">
              <EditProfileForm
                defaultValues={{
                  name: profile?.name || "",
                  email: profile?.email || "",
                  phone: profile?.phone || "",
                  location: profile?.location || "",
                }}
              />
            </TabsContent>

            <TabsContent value="change-password" className="mt-0">
              <ChangePasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileContainer;
