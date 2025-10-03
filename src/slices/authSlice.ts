import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): AuthState => {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    try {
      const decoded: any = jwtDecode(storedToken);
        console.log(decoded);
      return {
        token: storedToken,
        role: decoded.role || null,
        userId: decoded.id || null,
      };
    } catch (error) {
      console.error('Invalid token in storage:', error);
      localStorage.removeItem('authToken');
      return initialState;
    }
  }
  return initialState;
};

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const decoded: any = jwtDecode(action.payload);
      state.role = decoded.role; // Assume backend includes role in token
      state.userId = decoded.id; // Assume backend includes id in token
      // Persist token to localStorage
      localStorage.setItem('authToken', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null;
      // Clear from localStorage
      localStorage.removeItem('authToken');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;