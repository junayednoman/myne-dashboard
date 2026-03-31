"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";
import { useUpdateAdminAvatarMutation } from "@/redux/api/profileApi";
interface ProfileHeaderProps {
  name: string;
  role: string;
  avatar?: string;
}

const ProfileHeader = ({ name, role, avatar }: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState(
    avatar || PLACEHOLDER_IMAGE,
  );
  const [updateAdminAvatar, { isLoading }] = useUpdateAdminAvatarMutation();

  useEffect(() => {
    setPreviewAvatar(
      avatar || PLACEHOLDER_IMAGE,
    );
  }, [avatar]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or JPG.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB.");
      return;
    }
    setPreviewAvatar(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateAdminAvatar(formData).unwrap();
      toast.success("Profile image updated successfully.");
    } catch (error) {
      console.error("Failed to update profile image:", error);
      toast.error("Failed to update profile image. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Image
            src={previewAvatar}
            alt={name}
            width={120}
            height={120}
            unoptimized
            className="rounded-full object-cover border-4 border-background"
          />
          <Button
            size="icon"
            className="absolute bottom-0 right-0 h-10 w-10 rounded-full border border-white/50 bg-white text-black hover:bg-white/90 shadow-lg"
            onClick={handleEditClick}
            disabled={isLoading}
          >
            <Camera className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-foreground">{name}</h2>
          <p className="text-lg text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
