import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SetResourcePayload = {
  data: unknown;
  key: string;
};

interface ResourceState {
  [id: string]: unknown;
}

const initialState: ResourceState = {};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResource: (state, action: PayloadAction<SetResourcePayload>) => {
      state[action.payload.key] = action.payload.data;
    },
  },
});

export const { setResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
