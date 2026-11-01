import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "eot_auth";

function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function saveSession(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); }
  catch { /* silent */ }
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); }
  catch { /* silent */ }
}

const persisted = loadSession();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: persisted?.user ?? null,
    token: persisted?.token ?? null,
    loginMethod: "email",
    authMethod: "password",
    isLoading: false,
    error: null,
    otpSent: false,
    otpResendCountdown: 0,
  },
  reducers: {
    setLoginMethod(state, { payload }) {
      state.loginMethod = payload;
      state.authMethod = "password";
      state.error = null;
      state.otpSent = false;
    },
    setAuthMethod(state, { payload }) {
      state.authMethod = payload;
      state.error = null;
      state.otpSent = false;
    },
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    otpSentSuccess(state) {
      state.otpSent = true;
      state.isLoading = false;
      state.error = null;
      state.otpResendCountdown = 60;
    },
    tickResendCountdown(state) {
      if (state.otpResendCountdown > 0) state.otpResendCountdown -= 1;
    },
    resetOtp(state) {
      state.otpSent = false;
      state.otpResendCountdown = 0;
    },
    loginSuccess(state, { payload }) {
      state.user = payload.user;
      state.token = payload.token;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      saveSession({ user: payload.user, token: payload.token });
    },
    loginFailure(state, { payload }) {
      state.error = payload;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      clearSession();
    },
  },
});

export const {
  setLoginMethod, setAuthMethod, setLoading, setError, clearError,
  otpSentSuccess, tickResendCountdown, resetOtp,
  loginSuccess, loginFailure, logout,
} = authSlice.actions;

// Selectors
export const selectUser = (s) => s.auth.user;
export const selectToken = (s) => s.auth.token;
export const selectIsAuthenticated = (s) => Boolean(s.auth.token);
export const selectLoginMethod = (s) => s.auth.loginMethod;
export const selectAuthMethod = (s) => s.auth.authMethod;
export const selectIsLoading = (s) => s.auth.isLoading;
export const selectError = (s) => s.auth.error;
export const selectOtpSent = (s) => s.auth.otpSent;
export const selectOtpCountdown = (s) => s.auth.otpResendCountdown;

// Thunks — TODO: replace mock delays with real API calls
export function loginWithPassword({ identifier, password, loginMethod }) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      await new Promise((r) => setTimeout(r, 1200));
      dispatch(loginSuccess({
        user: { id: "1", name: "EOT User", identifier, loginMethod },
        token: "mock-jwt-" + Date.now(),
      }));
    } catch (err) {
      dispatch(loginFailure(err?.message ?? "Login failed. Please try again."));
    }
  };
}

export function sendOtp({ identifier, loginMethod }) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      await new Promise((r) => setTimeout(r, 1000));
      dispatch(otpSentSuccess());
      const interval = setInterval(() => dispatch(tickResendCountdown()), 1000);
      setTimeout(() => clearInterval(interval), 61_000);
    } catch (err) {
      dispatch(setError(err?.message ?? "Failed to send OTP."));
    }
  };
}

export function verifyOtp({ identifier, otp, loginMethod }) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      await new Promise((r) => setTimeout(r, 1000));
      dispatch(loginSuccess({
        user: { id: "1", name: "EOT User", identifier, loginMethod },
        token: "mock-otp-" + Date.now(),
      }));
    } catch (err) {
      dispatch(loginFailure(err?.message ?? "Invalid OTP."));
    }
  };
}

export default authSlice.reducer;
