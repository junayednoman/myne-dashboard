"use client";

import { useState } from "react";
import { z } from "zod";
import { AInput } from "@/components/form/AInput";
import AForm from "@/components/form/AForm";
import AdminActionButton from "@/components/admin/admin-action-button";

import { toast } from "sonner";

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  defaultValues?: Partial<EditProfileFormValues>;
}

const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = async (data: EditProfileFormValues) => {
    void data;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Profile updated locally.");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-primary-foreground text-center">
        Edit Your Profile
      </h3>

      <AForm<EditProfileFormValues>
        schema={editProfileSchema}
        defaultValues={defaultValues as EditProfileFormValues | undefined}
        onSubmit={handleEditProfile}
      >
        <AInput
          name="name"
          label="User Name"
          placeholder="Enter your name"
          required
        />
        <AInput
          name="email"
          label="Email"
          type="email"
          disabled
          placeholder="Enter your email"
          required
        />
        <AdminActionButton
          disabled={isLoading}
          type="submit"
          className="h-[50px] w-full text-base font-medium sm:w-full"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </AdminActionButton>
      </AForm>
    </div>
  );
};

export default EditProfileForm;
