import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggedIn: false,
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
