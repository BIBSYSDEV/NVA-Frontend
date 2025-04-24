import { Registration } from '../../types/registration.types';

export const useShouldDisableFieldsDueToChannelClaims = (registration: Registration) => {
  /*
   * TODO:
   * 1) Find channel ID that should take precendence for this registration
   * 2) Check if the channel with precendence has a channel claim
   * 3) Check if the potentially claim is for the category that is used for the registration
   *    a) How handle cases where user changes the category of the registration?
   * 4) Disable fields in wizard if user do not have any curator roles that overrides it
   */
  return false;
};
