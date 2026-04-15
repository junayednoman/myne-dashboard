import BlogEditorForm from "../../_components/BlogEditorForm";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  return (
    <main className="space-y-6 p-6 md:p-10">
      <BlogEditorForm mode="edit" blogId={id} />
    </main>
  );
}
