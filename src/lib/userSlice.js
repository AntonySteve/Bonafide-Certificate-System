// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initializeCount: (state, action) => {
      state.count = action.payload || 0;
    },
    setUser: (state, action) => {
      const { email } = action.payload;
      state.email = email;
    },
  },
});

export const { initializeCount, setUser } = userSlice.actions;
export default userSlice.reducer;
