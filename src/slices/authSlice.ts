import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const decoded: any = jwtDecode(action.payload);
      state.role = decoded.role; // Assume backend includes role in token
      state.userId = decoded._id; // Assume backend includes id in token
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;