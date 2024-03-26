import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeideUser, RoleName, User } from '../types/user.types';

const getStringValue = (text: string | undefined | null) => (text ? (text === 'null' ? '' : text) : '');

const initialState = null as User | null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FeideUser>) => {
      const firstName = action.payload['custom:firstName'] ?? '';
      const lastName = action.payload['custom:lastName'] ?? '';
      const customerId = getStringValue(action.payload['custom:customerId']);
      const cristinId = getStringValue(action.payload['custom:cristinId']);
      const nationalIdNumber = action.payload['custom:feideIdNin'] ?? action.payload['custom:nin'] ?? '';
      const nvaUsername = getStringValue(action.payload['custom:nvaUsername']);
      const topOrgCristinId = getStringValue(action.payload['custom:topOrgCristinId']);
      const feideId = getStringValue(action.payload['custom:feideId']);
      const rolesString = getStringValue(action.payload['custom:roles']);
      const allowedCustomersString = getStringValue(action.payload['custom:allowedCustomers']);

      const roleItems = rolesString.split(',').map((roleItem) => roleItem.split('@') as [RoleName, string]);
      const roles = roleItems.filter(([, thisCustomerId]) => thisCustomerId === customerId).map(([role]) => role);
      const allowedCustomers = allowedCustomersString.split(',').filter((customer) => customer);

      const user: User = {
        givenName: firstName,
        familyName: lastName,
        nationalIdNumber,
        feideId,
        cristinId,
        nvaUsername,
        customerId,
        roles,
        topOrgCristinId,
        allowedCustomers,
        isCreator: !!customerId && roles.includes(RoleName.Creator),
        isAppAdmin: !!customerId && roles.includes(RoleName.AppAdmin),
        isInternalImporter: !!customerId && roles.includes(RoleName.InternalImporter),
        isInstitutionAdmin: !!customerId && roles.includes(RoleName.InstitutionAdmin),
        isDoiCurator: !!customerId && roles.includes(RoleName.DoiCurator),
        isPublishingCurator: !!customerId && roles.includes(RoleName.PublishingCurator),
        isSupportCurator: !!customerId && roles.includes(RoleName.SupportCurator),
        isThesisCurator: !!customerId && roles.includes(RoleName.CuratorThesis),
        isEmbargoThesisCurator: !!customerId && roles.includes(RoleName.CuratorThesisEmbargo),
        isEditor: !!customerId && roles.includes(RoleName.Editor),
        isNviCurator: !!customerId && roles.includes(RoleName.NviCurator),
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
      return state;
    },
  },
});

export const { setUser, setPartialUser, logoutSuccess } = userSlice.actions;
export default userSlice.reducer;
