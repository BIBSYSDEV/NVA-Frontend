import { Box, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NationalIdNumberField } from '../../../../components/NationalIdNumberField';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { RootState } from '../../../../redux/store';
import { Employment } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { convertToFlatCristinPerson, isActiveEmployment } from '../../../../utils/user-helpers';
import { UserFormData } from './UserFormDialog';

export const PersonFormSection = () => {
  const { t } = useTranslation();
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);

  const { values } = useFormikContext<UserFormData>();
  if (!values.person) {
    return null;
  }

  const { firstName, lastName, employments, orcid, nationalId } = convertToFlatCristinPerson(values.person);

  const topOrgCristinIdentifier = topOrgCristinId ? getIdentifierFromId(topOrgCristinId) : '';

  const employmentsInThisInstitution: Employment[] = [];
  const employmentsInOtherInstitutions: Employment[] = [];
  const targetOrganizationIdStart = `${topOrgCristinIdentifier?.split('.')[0]}.`;

  employments.forEach((employment) => {
    const organizationIdentifier = employment.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      employmentsInThisInstitution.push(employment);
    } else {
      employmentsInOtherInstitutions.push(employment);
    }
  });

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        Person
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          variant="filled"
          disabled
          value={firstName}
          label={t('common.first_name')}
          data-testid={dataTestId.basicData.personAdmin.firstName}
        />
        <TextField
          variant="filled"
          disabled
          value={lastName}
          label={t('common.last_name')}
          data-testid={dataTestId.basicData.personAdmin.lastName}
        />
        <NationalIdNumberField nationalId={nationalId} />
        {orcid && <TextField variant="filled" disabled value={orcid} label={t('common.orcid')} />}
        {employmentsInOtherInstitutions.some(isActiveEmployment) && (
          <div>
            <Typography variant="h3">{t('basic_data.person_register.other_employments')}</Typography>
            <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
              {employmentsInOtherInstitutions.filter(isActiveEmployment).map((affiliation) => (
                <li key={affiliation.organization}>
                  <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                  </Box>
                </li>
              ))}
            </Box>
          </div>
        )}
      </Box>
    </section>
  );
};
