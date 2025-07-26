import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios'

// Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/cart/add', {productId: product._id}, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Add to cart failed");
    }
  }
);

export const increaseQty = createAsyncThunk('cart/increaseQty', async (productId) => {
  const res = await axiosInstance.patch(`/cart/increase/${productId}`, {}, { withCredentials: true });
  return res.data;
});

export const decreaseQty = createAsyncThunk('cart/decreaseQty', async (productId) => {
  const res = await axiosInstance.patch(`/cart/decrease/${productId}`, {}, { withCredentials: true });
  return res.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId) => {
  const res = await axiosInstance.delete(`/cart/remove/${productId}`, { withCredentials: true });
  return res.data;
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  const res = await axiosInstance.delete('/cart/clear', { withCredentials: true });
  return res.data;
});

export const showCart = createAsyncThunk('cart/showCart', async () => {
  const res = await axiosInstance.get('/cart/show', { withCredentials: true });
  return res.data; // assuming it returns { cartItems: [...] }
  // console.log(res.data)
});

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
   // Add to cart
    .addCase(addToCart.fulfilled, (state, action) => {
      state.items = action.payload.cart?.products || [];
    })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Show cart
    .addCase(showCart.fulfilled, (state, action) => {
      state.items = action.payload.cart?.products || [];
    })
    // Increase quantity
    .addCase(increaseQty.fulfilled, (state, action) => {
      state.items = action.payload.cart?.products || [];
    })
    // Decrease quantity
    .addCase(decreaseQty.fulfilled, (state, action) => {
      state.items = action.payload.cart?.products || [];
    })
    // Remove item
    .addCase(removeFromCart.fulfilled, (state, action) => {
      state.items = action.payload.cart?.products || [];
    })
    // Clear cart
    .addCase(clearCart.fulfilled, (state) => {
      state.items = [];
    });

  },
});

export default cartSlice.reducer;
