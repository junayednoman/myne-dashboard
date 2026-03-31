"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Upload, X } from "lucide-react";
import { z } from "zod";

import AdminActionButton from "@/components/admin/admin-action-button";
import AForm from "@/components/form/AForm";
import { ASelect } from "@/components/form/ASelect";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetBrandsQuery } from "@/redux/api/brandApi";
import { useGetModelsQuery } from "@/redux/api/modelApi";
import { useCreateAdminBagMutation } from "@/redux/api/adminBagApi";
import handleMutation from "@/utils/handleMutation";

type AddBagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const addBagSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(2, "Model must be at least 2 characters"),
});

type AddBagFormValues = z.infer<typeof addBagSchema>;

export default function AddBagDialog({
  open,
  onOpenChange,
}: AddBagDialogProps) {
  const [formKey, setFormKey] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { data: brandsData } = useGetBrandsQuery({ page: 1, limit: 200 });
  const { data: modelsData } = useGetModelsQuery({ page: 1, limit: 200 });
  const [createAdminBag] = useCreateAdminBagMutation();

  const brandOptions =
    brandsData?.data?.map((brand) => ({
      label: brand.brandName,
      value: brand._id,
    })) ?? [];
  const modelOptions =
    modelsData?.data?.map((model) => ({
      label: model.modelName,
      value: model._id,
    })) ?? [];

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
    setUploadFile(null);
  };

  const handleSubmit = (values: AddBagFormValues) => {
    if (!uploadFile) {
      setImageError("Bag image is required");
      return;
    }
    handleMutation(
      {
        bagBrand: values.brand,
        bagModel: values.model,
        bagImage: uploadFile,
      },
      createAdminBag,
      "Creating admin bag...",
      () => {
        reset();
        onOpenChange(false);
      },
    );
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
        className="w-full max-w-4xl rounded-lg border border-border bg-card/95 p-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
            aria-label="Close upload bag modal"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            Upload Bag
          </DialogTitle>
        </div>

        <AForm<AddBagFormValues>
          key={formKey}
          schema={addBagSchema}
          defaultValues={{ brand: "", model: "" }}
          onSubmit={handleSubmit}
          className="space-y-4 pt-2"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ASelect
              name="brand"
              label="Brand"
              required
              options={brandOptions}
              placeholder="Select brand"
            />

            <ASelect
              name="model"
              label="Model"
              required
              options={modelOptions}
              placeholder="Select model"
            />
          </div>

          <div className="pt-1">
            <label className="mb-2 block text-sm text-card-foreground">
              Bag Image
            </label>
            <label className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-background/60 px-4 py-8 text-center">
              {uploadPreviewUrl ? (
                <>
                  <Image
                    src={uploadPreviewUrl}
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
                      setImageError("");
                      setUploadFile(null);
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
                    Upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded Bag Image
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
                  setUploadPreviewUrl(nextPreview);
                  setUploadFileName(file.name);
                  setImageError("");
                  setUploadFile(file);
                }}
              />
            </label>
            {uploadFileName && (
              <p className="mt-2 truncate text-xs text-green-400">
                {uploadFileName}
              </p>
            )}
            {imageError && (
              <p className="mt-2 text-sm text-destructive">{imageError}</p>
            )}
          </div>

          <AdminActionButton
            type="submit"
            className="w-full justify-center text-sm font-semibold sm:w-full"
          >
            Upload Bag
          </AdminActionButton>
        </AForm>
      </DialogContent>
    </Dialog>
  );
}
