import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeideUser, RoleName, User } from '../types/user.types';

const initialState = null as User | null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FeideUser>) => {
      const customerId = action.payload['custom:customerId']?.endsWith('/customer/None')
        ? ''
        : action.payload['custom:customerId'];
      const roleItems =
        action.payload['custom:roles']?.split(',').map((roleItem) => roleItem.split('@') as [RoleName, string]) ?? [];
      const roles = roleItems.filter(([_, thisCustomerId]) => thisCustomerId === customerId).map(([role]) => role);
      const firstName = action.payload['custom:firstName'] ?? '';
      const lastName = action.payload['custom:lastName'] ?? '';
      const cristinId = action.payload['custom:cristinId'] ?? '';
      const allowedCustomers = action.payload['custom:allowedCustomers']?.split(',') ?? [];
      const nationalIdNumber = action.payload['custom:feideIdNin'] ?? action.payload['custom:nin'] ?? '';

      const user: User = {
        name: `${firstName} ${lastName}`.trim(),
        givenName: firstName,
        familyName: lastName,
        nationalIdNumber,
        id: action.payload['custom:feideId'] ?? '',
        cristinId,
        username: action.payload['custom:nvaUsername'] ?? '',
        customerId,
        roles,
        topOrgCristinId: action.payload['custom:topOrgCristinId'],
        isCreator: !!customerId && roles.includes(RoleName.Creator),
        isAppAdmin: !!customerId && roles.includes(RoleName.AppAdmin),
        isInstitutionAdmin: !!customerId && roles.includes(RoleName.InstitutionAdmin),
        isCurator: !!customerId && roles.includes(RoleName.Curator),
        isEditor: !!customerId && roles.includes(RoleName.Editor),
        allowedCustomers,
      };
      state = user;
      return state;
    },
    setPartialUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state) {
        state = null;
      } else {
        state = { ...state, ...action.payload };
      }
      return state;
    },
    logoutSuccess: (state) => {
      state = null;
    },
  },
});

export const { setUser, setPartialUser, logoutSuccess } = userSlice.actions;
export default userSlice.reducer;
