import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFail: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFail: (state, action) => {
      // state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
    },
    logoutUserStart: (state) => {
      state.loading = true;
    },
    logoutUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    logoutUserFail: (state, action) => {
      // state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
    },
    errorReset: (state) => {
      state.error = null;
    },
  },
});

export const {
  signInFail,
  signInStart,
  signInSuccess,
  updateUserFail,
  updateUserSuccess,
  updateUserStart,
  errorReset,
  logoutUserFail,
  logoutUserStart,
  logoutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
