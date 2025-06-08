import { createSlice } from "@reduxjs/toolkit";

const storedAuth = localStorage.getItem("auth");
const user = storedAuth ? JSON.parse(storedAuth).user : null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: user,
      token: null,
    },
    reducers: {
      setCredentials: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
      }
    }
});
  
export default authSlice.reducer;

export const { 
    setCredentials,
    logout
} = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;