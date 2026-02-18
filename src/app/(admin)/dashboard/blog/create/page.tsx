import BlogEditorForm from "../_components/BlogEditorForm";

export default function CreateBlogPage() {
  return (
    <main className="space-y-6 p-6 md:p-10">
      <BlogEditorForm mode="create" />
    </main>
  );
}

