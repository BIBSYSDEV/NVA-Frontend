import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Sector } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';

/* Read and manipulate the value of the url parameter "sector" */
export const NviSectorSelector = (props: Partial<TextFieldProps>) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const options = [
    { value: 'ALL', label: t('common.show_all') },
    ...Object.values(Sector).map((sector) => ({
      value: sector,
      label: t(`basic_data.institutions.sector_values.${sector}`),
    })),
  ];

  const selectedSector = searchParams.get('sector') || 'ALL';

  return (
    <TextField
      {...props}
      select
      data-testid={dataTestId.nviFilterSector}
      size="small"
      label={t('sector')}
      value={selectedSector}
      onChange={(event) => {
        const value = event.target.value;
        const nextParams = new URLSearchParams(location.search);
        if (value === 'ALL') {
          nextParams.delete('sector');
        } else {
          nextParams.set('sector', value);
        }
        navigate({ search: nextParams.toString() });
      }}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
