import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization } from '../types/organization.types';
import { CristinProject } from '../types/project.types';
import { Journal, Publisher, Registration } from '../types/registration.types';

export type ResourceType = Journal | Publisher | Registration | CristinProject | Organization;

type SetResourcePayload = ResourceType & {
  reduxKey: string;
};

interface ResourceState {
  [id: string]: ResourceType;
}

const initialState: ResourceState = {};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResource: (state, action: PayloadAction<SetResourcePayload>) => {
      const { reduxKey, ...data } = action.payload;
      state[reduxKey] = data;
    },
  },
});

export const { setResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
