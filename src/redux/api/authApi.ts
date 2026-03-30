import { baseApi } from "./baseApi";

export type AdminLoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type ForgetPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  otp: string;
  token: string;
};

export type ResendOtpPayload = {
  token: string;
};

export type ResetPasswordPayload = {
  password: string;
  token: string;
};

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (payload: AdminLoginPayload) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/auth/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
    forgetPassword: builder.mutation({
      query: (payload: ForgetPasswordPayload) => ({
        url: "/auth/recover/find",
        method: "POST",
        body: payload,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ otp, token }: VerifyOtpPayload) => ({
        url: "/auth/recover/verify",
        method: "POST",
        body: { otp },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    resendOtp: builder.mutation({
      query: ({ token }: ResendOtpPayload) => ({
        url: "/auth/recover/resend",
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ password, token }: ResetPasswordPayload) => ({
        url: "/auth/recover/reset",
        method: "PATCH",
        body: { password },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;
