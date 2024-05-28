import { Box, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { NationalIdNumberField } from '../../../../components/NationalIdNumberField';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { Employment } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { convertToFlatCristinPerson, isActiveEmployment } from '../../../../utils/user-helpers';
import { UserFormData } from './userFormHelpers';

interface PersonFormSectionProps {
  externalEmployments: Employment[];
}

export const PersonFormSection = ({ externalEmployments }: PersonFormSectionProps) => {
  const { t } = useTranslation();

  const { values } = useFormikContext<UserFormData>();
  if (!values.person) {
    return null;
  }

  const { firstName, lastName, orcid, nationalId } = convertToFlatCristinPerson(values.person);

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('common.person')}
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
        {externalEmployments.some(isActiveEmployment) && (
          <div>
            <Typography variant="h3">{t('basic_data.person_register.other_employments')}</Typography>
            <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
              {externalEmployments.filter(isActiveEmployment).map((affiliation) => (
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
