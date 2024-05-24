import * as Yup from 'yup';
import { CristinPerson, InstitutionUser } from '../../../../types/user.types';
import { personDataValidationSchema } from '../../../../utils/validation/basic_data/addEmployeeValidation';

export enum UserFormFieldName {
  Employments = 'person.employments',
  Roles = 'user.roles',
  ViewingScope = 'user.viewingScope.includedUnits',
}

export const validationSchema = Yup.object().shape({
  person: personDataValidationSchema,
});

export interface UserFormData {
  person?: CristinPerson;
  user?: InstitutionUser;
}
