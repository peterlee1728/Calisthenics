import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "calisthenics_admin_auth";

const defaultAuthState = {
  loggedInAs: false,
  userRole: null,
  username: null,
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
      username: authState.username,
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
      const { username, userRole = "SA" } = action.payload;
      state.authState.loggedInAs = true;
      state.authState.username = username;
      state.authState.userRole = userRole;
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
