import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "calisthenics_admin_auth";

const defaultAuthState = {
  loggedInAs: false,
  userRole: null,
  email: null,
  token: null,
};

function readPersistedAuthState() {
  if (typeof sessionStorage === "undefined") {
    return { ...defaultAuthState };
  }

  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { ...defaultAuthState };
    }
    const parsed = JSON.parse(raw);
    return { ...defaultAuthState, ...parsed };
  } catch {
    return { ...defaultAuthState };
  }
}

function persistAuthState(authState) {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  if (!authState.loggedInAs) {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      loggedInAs: authState.loggedInAs,
      userRole: authState.userRole,
      email: authState.email,
      token: authState.token,
    })
  );
}

const initialState = {
  authState: readPersistedAuthState(),
};

const authSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, userRole, token } = action.payload;
      state.authState.loggedInAs = true;
      state.authState.email = email;
      state.authState.userRole = userRole;
      state.authState.token = token;
      persistAuthState(state.authState);
    },
    logout: (state) => {
      state.authState = { ...defaultAuthState };
      persistAuthState(state.authState);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
