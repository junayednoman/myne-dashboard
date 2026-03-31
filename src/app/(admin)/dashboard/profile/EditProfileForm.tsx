"use client";

import { z } from "zod";
import { AInput } from "@/components/form/AInput";
import AForm from "@/components/form/AForm";
import AdminActionButton from "@/components/admin/admin-action-button";

import { toast } from "sonner";
import { useUpdateAdminProfileMutation } from "@/redux/api/profileApi";

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  defaultValues?: Partial<EditProfileFormValues>;
}

const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const [updateAdminProfile, { isLoading }] = useUpdateAdminProfileMutation();
  const formKey = JSON.stringify({
    name: defaultValues?.name ?? "",
    email: defaultValues?.email ?? "",
    phone: defaultValues?.phone ?? "",
    location: defaultValues?.location ?? "",
  });

  const handleEditProfile = async (data: EditProfileFormValues) => {
    try {
      await updateAdminProfile({
        name: data.name,
        phone: data.phone,
        location: data.location,
      }).unwrap();
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-primary-foreground text-center">
        Edit Your Profile
      </h3>

      <AForm<EditProfileFormValues>
        key={formKey}
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
        <AInput
          name="phone"
          label="Phone"
          placeholder="Enter your phone number"
          required
        />
        <AInput
          name="location"
          label="Location"
          placeholder="Enter your location"
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
