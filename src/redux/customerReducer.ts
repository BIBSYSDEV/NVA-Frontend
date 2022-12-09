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
  },
});

export const { setCustomer } = customerSlice.actions;
export default customerSlice.reducer;
