import { Registration } from '../../../types/registration.types';
import { userCanTerminateRegistration } from '../../../utils/registration-helpers';

interface TerminateRegistrationProps {
  registration: Registration;
}

export const TerminateRegistration = ({ registration }: TerminateRegistrationProps) => {
  const userCanTerminate = userCanTerminateRegistration(registration);

  if (!userCanTerminate) {
    return null;
  }

  return <p>Show terminate actions</p>;
};
