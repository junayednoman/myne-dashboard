"use client";

import { useState } from "react";
import { z } from "zod";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { toast } from "sonner";
import AdminActionButton from "@/components/admin/admin-action-button";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (data: ChangePasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Password changed locally.");
    setIsLoading(false);
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
