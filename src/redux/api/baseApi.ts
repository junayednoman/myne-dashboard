import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { logOut } from "../slice/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://10.10.10.28:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const myneAccessToken = Cookies.get("myneAccessToken");

    // If user have a token set it in the state
    if (myneAccessToken) {
      headers.set("authorization", `Bearer ${myneAccessToken}`);
    }
    return headers;
  },
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
  tagTypes: ["auth", "dashboard", "user"],
  endpoints: () => ({}),
});
