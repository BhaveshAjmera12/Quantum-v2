import { configureStore } from '@reduxjs/toolkit';import productReducer from './Slices/productSlice';

export const store = configureStore({
    reducer: {
        product: productReducer
    }
})