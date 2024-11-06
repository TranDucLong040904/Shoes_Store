// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartProducts: {
    data: [],
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.cartProducts.data = action.payload;
    },
  },
});

export const { setProducts } = cartSlice.actions;
export const selectCart = (state) => state.cart;
export default cartSlice.reducer;
