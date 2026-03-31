"use client";

import { z } from "zod";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { toast } from "sonner";
import AdminActionButton from "@/components/admin/admin-action-button";
import { useUpdateAdminPasswordMutation } from "@/redux/api/profileApi";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const [updateAdminPassword, { isLoading }] =
    useUpdateAdminPasswordMutation();

  const handlePasswordChange = async (data: ChangePasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await updateAdminPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password updated successfully.");
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-primary-foreground text-center">
        Change Password
      </h3>

      <AForm<ChangePasswordFormValues>
        schema={changePasswordSchema}
        defaultValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={handlePasswordChange}
      >
        <AInput
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          required
        />
        <AInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          required
        />
        <AInput
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          required
        />
        <AdminActionButton
          disabled={isLoading}
          type="submit"
          className="h-[50px] w-full text-base font-medium sm:w-full"
        >
          {isLoading ? "Changing Password..." : "Save & Change"}
        </AdminActionButton>
      </AForm>
    </div>
  );
};

export default ChangePasswordForm;
