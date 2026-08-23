"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Upload, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AInput } from "@/components/form/AInput";
import { ASelect } from "@/components/form/ASelect";
import AForm from "@/components/form/AForm";
import AdminActionButton from "@/components/admin/admin-action-button";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";
import { AdminBagItem } from "../types";
import { z } from "zod";

type AdminBagEditModalProps = {
  open: boolean;
  bag: AdminBagItem | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    id: string;
    bagColor: string[];
    material: string;
    hardwareColor: string;
    size: string;
    condition: string;
    variant: string;
    specialVariant: string;
    bagImage?: File;
    previewUrl: string;
  }) => void;
};

type EditFormValues = {
  brand?: string;
  model?: string;
  bagColor: string;
  leatherType: string;
  hardwareColor: string;
  size: string;
  condition: string;
  variant: string;
  specialVariant: string | null;
};

const editAdminBagSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  bagColor: z.string().trim().min(1, "Bag color is required"),
  leatherType: z.string().trim().min(1, "Leather type is required"),
  hardwareColor: z.string().trim().min(1, "Hardware color is required"),
  size: z.string().trim().min(1, "Size is required"),
  condition: z.string().trim().min(1, "Condition is required"),
  variant: z.string().trim().min(1, "Variant is required"),
  specialVariant: z.string().trim().nullable(),
});

const conditionOptions = [
  { label: "New", value: "New" },
  { label: "Excellent", value: "Excellent" },
  { label: "Very Good", value: "Very Good" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
];

const splitCommaSeparatedValues = (value?: string | null) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export default function AdminBagEditModal({
  open,
  bag,
  onOpenChange,
  onSave,
}: AdminBagEditModalProps) {
  const [formKey, setFormKey] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageCleared, setImageCleared] = useState(false);

  useEffect(() => {
    if (open && bag?.bagImage && !uploadPreviewUrl && !imageCleared) {
      setUploadPreviewUrl(bag.bagImage);
      setUploadFileName("Current image");
    }

    return () => {
      if (uploadPreviewUrl) {
        URL.revokeObjectURL(uploadPreviewUrl);
      }
    };
  }, [open, bag?.bagImage, uploadPreviewUrl, imageCleared]);

  const reset = () => {
    setFormKey((prev) => prev + 1);
    setUploadFileName("");
    setUploadPreviewUrl("");
    setUploadFile(null);
    setImageCleared(false);
  };

  const handleSubmit = (values: EditFormValues) => {
    if (!bag) return;

    const bagColor = splitCommaSeparatedValues(values.bagColor);
    if (bagColor.length === 0) {
      return;
    }

    onSave({
      id: bag.id,
      bagColor,
      material: values.leatherType.trim(),
      hardwareColor: values.hardwareColor.trim(),
      size: values.size,
      condition: values.condition.trim(),
      variant: values.variant.trim(),
      specialVariant: values.specialVariant?.trim() || "",
      bagImage: uploadFile || undefined,
      previewUrl: uploadPreviewUrl || bag.bagImage,
    });
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
        className="w-full !max-w-3xl rounded-lg border border-border bg-card/95 p-4 backdrop-blur-md"
      >
        <div className="max-w-[97%]!">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
              aria-label="Close admin bag modal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <DialogTitle className="text-xl font-semibold text-card-foreground">
              Edit Admin Bag
            </DialogTitle>
          </div>

          <AForm<EditFormValues>
            key={formKey}
            schema={editAdminBagSchema}
            defaultValues={{
              brand: bag?.brand ?? "",
              model: bag?.model ?? "",
              bagColor: bag?.bagColor ?? "",
              leatherType: bag?.leatherType ?? "",
              hardwareColor: bag?.hardwareColor ?? "",
              size: bag?.size ?? "",
              condition: bag?.condition ?? "",
              variant: bag?.variant ?? "",
              specialVariant: bag?.specialVariant ?? "",
            }}
            onSubmit={handleSubmit}
            className="space-y-4 pt-2"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AInput
                name="brand"
                label="Brand"
                placeholder="Brand name"
                disabled
              />
              <AInput
                name="model"
                label="Model"
                placeholder="Model name"
                disabled
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AInput
                name="bagColor"
                label="Bag Color"
                required
                placeholder="Enter bag colors separated by commas"
              />
              <AInput
                name="leatherType"
                label="Leather Type"
                required
                placeholder="Enter leather type"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AInput
                name="hardwareColor"
                label="Hardware Color"
                required
                placeholder="Enter hardware color"
              />
              <AInput
                name="size"
                label="Size"
                required
                placeholder="Enter bag size"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ASelect
                name="condition"
                label="Condition"
                required
                options={conditionOptions}
                placeholder="Select condition"
              />
              <AInput
                name="variant"
                label="Variant"
                required
                placeholder="Enter variant"
              />
            </div>

            <AInput
              name="specialVariant"
              label="Special Variant"
              placeholder="Enter special variant value"
            />

            <div className="pt-1">
              <label className="mb-2 block text-sm text-card-foreground">
                Image
              </label>
              <label className="relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-background/60 px-4 py-8 text-center">
                {uploadPreviewUrl ? (
                  <>
                    <Image
                      src={uploadPreviewUrl || PLACEHOLDER_IMAGE}
                      alt="Selected bag"
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
                        setUploadFile(null);
                        setImageCleared(true);
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
                    <p className="text-base font-semibold text-card-foreground">
                      Upload Image
                    </p>
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
                    setUploadFile(file);
                    setUploadPreviewUrl(nextPreview);
                    setUploadFileName(file.name);
                    setImageCleared(false);
                  }}
                />
              </label>
              {uploadFileName && (
                <p className="mt-2 truncate text-xs text-green-400">
                  {uploadFileName}
                </p>
              )}
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
                Save Changes
              </AdminActionButton>
            </div>
          </AForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
