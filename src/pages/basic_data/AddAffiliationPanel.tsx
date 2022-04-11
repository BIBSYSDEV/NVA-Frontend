import { Autocomplete, Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { DatePicker } from '@mui/lab';
import { useSelector } from 'react-redux';
import { StyledCenterContainer } from '../../components/styled/Wrappers';
import { CristinApiPath } from '../../api/apiPaths';
import { LanguageString } from '../../types/common.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { datePickerTranslationProps } from '../../themes/mainTheme';
import { getNewDateValue } from '../../utils/registration-helpers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Organization } from '../../types/organization.types';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getSortedSubUnits } from '../../utils/institutions-helpers';

export interface Position {
  id: string;
  enabled: boolean;
  name: LanguageString;
}
interface PositionResponse {
  positions: Position[];
}

export const AddAffiliationPanel = () => {
  const { t } = useTranslation('basicData');
  const { setFieldValue } = useFormikContext();
  const user = useSelector((store: RootStore) => store.user);
  const [currentOrganization, isLoadingCurrentOrganization] = useFetchResource<Organization>(
    user?.topOrgCristinId ?? ''
  );
  const organizationOptions = currentOrganization ? getSortedSubUnits([currentOrganization]) : [];
  const [positionResponse, isLoadingPositions] = useFetch<PositionResponse>({ url: CristinApiPath.Position });

  const positions = (positionResponse?.positions ?? []).filter((position) => position.enabled); // TODO: fetch only active positions (NP-9070)

  return (
    <>
      <StyledCenterContainer>
        <LooksTwoIcon color="primary" fontSize="large" />
      </StyledCenterContainer>
      <Field name="affiliation.organization">
        {({ field }: FieldProps<string>) => (
          <Autocomplete
            value={organizationOptions.find((option) => option.id === field.value) ?? null}
            options={organizationOptions}
            getOptionLabel={(option) => getLanguageString(option.name)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {getLanguageString(option.name)}
              </li>
            )}
            loading={isLoadingCurrentOrganization}
            onChange={(_, value) => setFieldValue(field.name, value?.id)}
            renderInput={(params) => (
              <TextField {...params} label={t('common:institution')} variant="filled" fullWidth />
            )}
          />
        )}
      </Field>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <Field name="affiliation.type">
          {({ field }: FieldProps<Position>) => (
            <Autocomplete
              options={positions.sort((a, b) =>
                getLanguageString(a.name).toLowerCase() > getLanguageString(b.name).toLowerCase() ? 1 : -1
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {getLanguageString(option.name)}
                </li>
              )}
              onChange={(_, value) => setFieldValue(field.name, value?.id ?? '')}
              getOptionLabel={(option) => getLanguageString(option.name)}
              fullWidth
              loading={isLoadingPositions}
              renderInput={(params) => <TextField {...field} {...params} label={t('position')} variant="filled" />}
            />
          )}
        </Field>
        <Field name="affiliation.fullTimeEquivalentPercentage">
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              inputProps={{ min: '0', max: '100' }}
              variant="filled"
              label={t('position_percent')}
            />
          )}
        </Field>
      </Box>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <Field name="affiliation.startDate">
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <DatePicker
              {...datePickerTranslationProps}
              label={t('common:start_date')}
              value={field.value ?? null}
              onChange={(date: Date | null, keyboardInput) => {
                const newValue = getNewDateValue(date, keyboardInput);
                if (newValue !== null) {
                  setFieldValue(field.name, newValue);
                }
              }}
              inputFormat="dd.MM.yyyy"
              views={['year', 'month', 'day']}
              mask="__.__.____"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            />
          )}
        </Field>

        <Field name="affiliation.endDate">
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <DatePicker
              {...datePickerTranslationProps}
              label={t('common:end_date')}
              value={field.value ?? null}
              onChange={(date: Date | null, keyboardInput) => {
                const newValue = getNewDateValue(date, keyboardInput);
                if (newValue !== null) {
                  setFieldValue(field.name, newValue);
                }
              }}
              inputFormat="dd.MM.yyyy"
              views={['year', 'month', 'day']}
              mask="__.__.____"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            />
          )}
        </Field>
      </Box>
    </>
  );
};
