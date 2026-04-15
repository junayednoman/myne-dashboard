import { baseApi } from "./baseApi";

export type BlogItemResponse = {
  _id: string;
  blogDescription: string;
  blogImage: string;
  blogTitle: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogListResponse = {
  success: boolean;
  status: number;
  message: string;
  data: BlogItemResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type BlogResponse = {
  success: boolean;
  status: number;
  message: string;
  data: BlogItemResponse;
};

export type BlogListQuery = {
  page: number;
  limit: number;
};

export type CreateBlogPayload = {
  blogTitle: string;
  blogDescription: string;
  blogImage: File;
};

export type UpdateBlogPayload = {
  id: string;
  blogTitle: string;
  blogDescription: string;
  blogImage?: File;
};

export type DeleteBlogPayload = {
  id: string;
};

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogListResponse, BlogListQuery>({
      query: ({ page, limit }) => ({
        url: "/admin/blogs",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["blog"],
    }),
    getBlogById: builder.query<BlogResponse, string>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation<BlogResponse, CreateBlogPayload>({
      query: ({ blogTitle, blogDescription, blogImage }) => {
        const formData = new FormData();
        formData.append("blogTitle", blogTitle);
        formData.append("blogDescription", blogDescription);
        formData.append("blogImage", blogImage);

        return {
          url: "/admin/blogs",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["blog"],
    }),
    updateBlog: builder.mutation<BlogResponse, UpdateBlogPayload>({
      query: ({ id, blogTitle, blogDescription, blogImage }) => {
        const formData = new FormData();
        formData.append("blogTitle", blogTitle);
        formData.append("blogDescription", blogDescription);
        if (blogImage) {
          formData.append("blogImage", blogImage);
        }

        return {
          url: `/admin/blogs/${id}`,
          method: blogImage ? "PUT" : "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["blog"],
    }),
    deleteBlog: builder.mutation<unknown, DeleteBlogPayload>({
      query: ({ id }) => ({
        url: `/admin/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
