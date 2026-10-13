import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clickedMenuItem: "",
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setClickedMenuItem: (state, action) => {
      state.clickedMenuItem = action.payload;
    },
  },
});

export const { setClickedMenuItem } = navigationSlice.actions;

export default navigationSlice.reducer;
