import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store";

type TAuthType = {
  user: null | { email: string; role: "admin" };
  token: null | string;
  resetToken: null | string;
};

const initialState: TAuthType = {
  user: null,
  token: null,
  resetToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;

      // set cookie for middleware access
      Cookies.set("myneAccessToken", token, { path: "/" });
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.resetToken = null;
      // Remove token for cookies
      Cookies.remove("myneAccessToken", { path: "/" });
    },
    setResetToken: (state, action) => {
      state.resetToken = action.payload;
    },
    clearResetToken: (state) => {
      state.resetToken = null;
    },
  },
});

export const { setUser, logOut, setResetToken, clearResetToken } =
  authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectResetToken = (state: RootState) => state.auth.resetToken;
