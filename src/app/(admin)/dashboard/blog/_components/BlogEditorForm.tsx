"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import AdminActionButton from "@/components/admin/admin-action-button";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import JoditTextEditor from "@/components/form/ATextEditor";

const blogSchema = z.object({
  title: z.string().min(3, "Blog title must be at least 3 characters"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

type BlogEditorFormProps = {
  mode: "create" | "edit";
  initialValues?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export default function BlogEditorForm({
  mode,
  initialValues,
}: BlogEditorFormProps) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState(
    initialValues?.image ?? "",
  );
  const [imageError, setImageError] = useState("");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [descriptionError, setDescriptionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormKey((prev) => prev + 1);
    setUploadPreviewUrl(initialValues?.image ?? "");
    setUploadFileName("");
    setDescription(initialValues?.description ?? "");
    setImageError("");
    setDescriptionError("");
  }, [
    initialValues?.description,
    initialValues?.image,
    initialValues?.title,
    mode,
  ]);

  const plainDescription = useMemo(
    () => description.replace(/<[^>]+>/g, "").trim(),
    [description],
  );

  const handleSubmit = async (values: BlogFormValues) => {
    void values;
    if (!uploadPreviewUrl) {
      setImageError("Blog image is required");
      return;
    }

    if (plainDescription.length < 20) {
      setDescriptionError("Blog description must be at least 20 characters");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(
      mode === "create"
        ? "Blog created successfully."
        : "Blog updated successfully.",
    );
    setIsSubmitting(false);
    router.push("/dashboard/blog");
  };

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
        <button
          onClick={() => router.push("/dashboard/blog")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
          aria-label="Back to blogs"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-2xl font-bold text-card-foreground">
          {mode === "create" ? "Write New Blog" : "Update Blog"}
        </h2>
      </div>

      <AForm<BlogFormValues>
        key={formKey}
        schema={blogSchema}
        defaultValues={{ title: initialValues?.title ?? "" }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="mb-2 block text-sm text-card-foreground">
            Blog Image
          </label>
          <label className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-background/60 px-4 py-8 text-center">
            {uploadPreviewUrl ? (
              <>
                <Image
                  src={uploadPreviewUrl}
                  alt="Selected blog"
                  fill
                  className="object-contain p-4"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (uploadPreviewUrl.startsWith("blob:")) {
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
                <p className="text-3xl font-semibold text-card-foreground">
                  Upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Store receipts, authentication certificates, and purchase
                  documents
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
                if (uploadPreviewUrl.startsWith("blob:")) {
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
            <p className="mt-2 truncate text-xs text-green-400">
              {uploadFileName}
            </p>
          )}
          {imageError && (
            <p className="mt-2 text-sm text-destructive">{imageError}</p>
          )}
        </div>

        <AInput
          name="title"
          label="Blog Title"
          required
          placeholder="Enter your blog title"
        />

        <div>
          <label className="mb-2 block text-sm text-card-foreground">
            Blog Description
          </label>
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <JoditTextEditor
              content={description}
              onChange={(value) => {
                setDescription(value);
                setDescriptionError("");
              }}
              placeholder="Enter your blog description..."
            />
          </div>
          {descriptionError && (
            <p className="mt-2 text-sm text-destructive">{descriptionError}</p>
          )}
        </div>

        <AdminActionButton
          disabled={isSubmitting}
          type="submit"
          className="h-11 w-full justify-center text-sm font-semibold sm:w-full"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Upload" : "Update"}
        </AdminActionButton>
      </AForm>
    </section>
  );
}
