import { notFound } from "next/navigation";

import { DUMMY_BLOGS } from "../../constants";
import BlogEditorForm from "../../_components/BlogEditorForm";

type EditBlogPageProps = {
  params: { id: string };
};

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = params;
  const blog = DUMMY_BLOGS.find((item) => item.id === id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6 md:p-10">
      <BlogEditorForm
        mode="edit"
        initialValues={{
          title: blog.title,
          description: blog.content,
          image: blog.image,
        }}
      />
    </main>
  );
}
