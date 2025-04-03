import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  code: 'USD',
  symbol: '$',
  rate: 1,
  lastUpdated: null,
  isDetecting: false
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const currencyData = action.payload;
      state.code = currencyData.code;
      state.symbol = currencyData.symbol;
      state.rate = currencyData.rate;
      state.lastUpdated = new Date().toISOString();
    },
    startDetection: (state) => {
      state.isDetecting = true;
    },
    endDetection: (state) => {
      state.isDetecting = false;
    }
  }
});

export const { setCurrency, startDetection, endDetection } = currencySlice.actions;

export default currencySlice.reducer;