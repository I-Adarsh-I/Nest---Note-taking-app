import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface searchState {
  isOpen: boolean;
};

const initialState: searchState = {
  isOpen: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { onOpen, onClose, toggle } = searchSlice.actions;

export const selectSearch = (state: RootState) => state.search.isOpen;

export default searchSlice.reducer;
