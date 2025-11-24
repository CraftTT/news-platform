import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  authenticated: boolean;
};

const initialState: AuthState = {
  authenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
    },
    logout(state) {
      state.authenticated = false;
    },
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;