import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerInstitution } from '../types/customerInstitution.types';

const initialState = null as CustomerInstitution | null;

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<CustomerInstitution>) => {
      state = action.payload;
      return state;
    },
    setPartialCustomer: (state, action: PayloadAction<Partial<CustomerInstitution>>) => {
      if (!state) {
        state = null;
      } else {
        state = { ...state, ...action.payload };
      }
      return state;
    },
  },
});

export const { setCustomer, setPartialCustomer } = customerSlice.actions;
export default customerSlice.reducer;
