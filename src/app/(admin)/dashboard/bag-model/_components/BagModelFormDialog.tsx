"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Upload, X } from "lucide-react";
import { z } from "zod";

import AdminActionButton from "@/components/admin/admin-action-button";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { ASelect } from "@/components/form/ASelect";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const bagModelSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  modelName: z.string().min(2, "Model name must be at least 2 characters"),
});

export type BagModelFormValues = z.infer<typeof bagModelSchema>;

type BagModelFormDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: Partial<BagModelFormValues>;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BagModelFormValues, imagePreviewUrl: string) => void;
};

export default function BagModelFormDialog({
  open,
  mode,
  initialValues,
  onOpenChange,
  onSubmit,
}: BagModelFormDialogProps) {
  const [formKey, setFormKey] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) {
        URL.revokeObjectURL(uploadPreviewUrl);
      }
    };
  }, [uploadPreviewUrl]);

  const reset = () => {
    setFormKey((prev) => prev + 1);
    setUploadFileName("");
    setUploadPreviewUrl("");
    setImageError("");
  };

  useEffect(() => {
    if (open) {
      setFormKey((prev) => prev + 1);
    }
  }, [open, mode]);

  const handleSubmit = (values: BagModelFormValues) => {
    if (!uploadPreviewUrl) {
      setImageError("Bag image is required");
      return;
    }
    onSubmit(values, uploadPreviewUrl);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-lg border border-border bg-card/95 p-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
            aria-label="Close bag model modal"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            {mode === "add" ? "Add Model" : "Edit Model"}
          </DialogTitle>
        </div>

        <AForm<BagModelFormValues>
          key={formKey}
          schema={bagModelSchema}
          defaultValues={{
            brand: initialValues?.brand ?? "",
            modelName: initialValues?.modelName ?? "",
          }}
          onSubmit={handleSubmit}
          className="space-y-4 pt-2"
        >
          <ASelect
            name="brand"
            label="Brand"
            required
            options={[
              { label: "Hermes", value: "Hermes" },
              { label: "Chanel", value: "Chanel" },
              { label: "Dior", value: "Dior" },
              { label: "Gucci", value: "Gucci" },
            ]}
            placeholder="Select brand"
          />

          <AInput
            name="modelName"
            label="Model name"
            required
            placeholder="Enter model name here.."
          />

          <div className="pt-1">
            <label className="mb-2 block text-sm text-card-foreground">Image</label>
            <label className="relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-background/60 px-4 py-8 text-center">
              {uploadPreviewUrl ? (
                <>
                  <Image
                    src={uploadPreviewUrl}
                    alt="Selected model"
                    fill
                    className="object-contain p-4"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (uploadPreviewUrl) {
                        URL.revokeObjectURL(uploadPreviewUrl);
                      }
                      setUploadPreviewUrl("");
                      setUploadFileName("");
                      setImageError("");
                    }}
                    className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-black/60 text-white"
                    aria-label="Remove uploaded image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-base font-semibold text-card-foreground">Upload Image</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (uploadPreviewUrl) {
                    URL.revokeObjectURL(uploadPreviewUrl);
                  }
                  const nextPreview = URL.createObjectURL(file);
                  setUploadPreviewUrl(nextPreview);
                  setUploadFileName(file.name);
                  setImageError("");
                }}
              />
            </label>
            {uploadFileName && (
              <p className="mt-2 truncate text-xs text-green-400">{uploadFileName}</p>
            )}
            {imageError && <p className="mt-2 text-sm text-destructive">{imageError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-md border border-border bg-background/40 text-sm font-medium text-card-foreground hover:bg-background/60"
            >
              Cancel
            </button>
            <AdminActionButton
              type="submit"
              className="h-11 w-full justify-center rounded-md text-sm font-semibold sm:w-full"
            >
              {mode === "add" ? "Upload" : "Update"}
            </AdminActionButton>
          </div>
        </AForm>
      </DialogContent>
    </Dialog>
  );
}

