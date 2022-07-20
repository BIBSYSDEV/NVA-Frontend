import * as Yup from 'yup';
import { CustomerInstitution, CustomerInstitutionFieldNames } from '../../types/customerInstitution.types';
import i18n from '../../translations/i18n';
import { YupShape } from './validationHelpers';

const customerErrorMessage = {
  displayNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('admin:display_name') }),
  institutionRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('common:institution') }),
  shortNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('admin:short_name') }),
  rorInvalid: i18n.t('basicData:institutions.invalid_ror_format'),
};

export const customerInstitutionValidationSchema = Yup.object<YupShape<CustomerInstitution>>({
  [CustomerInstitutionFieldNames.Name]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DisplayName]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.ShortName]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ArchiveName]: Yup.string(),
  [CustomerInstitutionFieldNames.FeideOrganizationDomain]: Yup.string(),
  [CustomerInstitutionFieldNames.RorId]: Yup.string().matches(
    /^https?:\/\/ror\.org\/([a-z0-9]{9})/,
    customerErrorMessage.rorInvalid
  ),
});
