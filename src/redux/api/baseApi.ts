import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logOut } from "../slice/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // retrieve new token
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/admin/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data) {
      return baseQuery(args, api, extraOptions);
    }

    api.dispatch(logOut());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["auth", "dashboard", "user", "brand", "collection"],
  endpoints: () => ({}),
});
