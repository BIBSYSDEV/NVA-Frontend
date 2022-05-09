import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PositionResponse } from '../pages/basic_data/institution_admin/AddAffiliationPanel';
import { Organization } from '../types/organization.types';
import { CristinProject } from '../types/project.types';
import { Journal, Publisher, Registration } from '../types/registration.types';

export type ResourceType = Journal | Publisher | Registration | CristinProject | Organization | PositionResponse;

type SetResourcePayload = {
  data: ResourceType;
  key: string;
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
      state[action.payload.key] = action.payload.data;
    },
  },
});

export const { setResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
