import { baseApi } from "./baseApi";

export type AdminUser = {
  _id: string;
  accountStatus: "active" | "blocked";
  role: string;
  name: string;
  createdAt: string;
  avatar: string;
  email: string;
};

export type AdminUsersResponse = {
  success: boolean;
  status: number;
  message: string;
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AdminUsersQuery = {
  page: number;
  limit: number;
  sortBy: number;
};

export type ChangeUserStatusPayload = {
  id: string;
  accountStatus: "active" | "blocked";
};

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUsersResponse, AdminUsersQuery>({
      query: ({ page, limit, sortBy }) => ({
        url: "/admin/users",
        method: "GET",
        params: { page, limit, sortBy },
      }),
      providesTags: ["user"],
    }),
    changeUserStatus: builder.mutation<unknown, ChangeUserStatusPayload>({
      query: ({ id, accountStatus }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { accountStatus },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetAdminUsersQuery, useChangeUserStatusMutation } = userApi;
