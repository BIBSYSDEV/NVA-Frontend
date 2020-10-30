import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';

import { NpiDiscipline } from '../../../types/registration.types';
import { disciplineOptions, getNpiDiscipline } from '../../../utils/npiDisciplines';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface DisciplineSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: any;
  placeholder?: string;
}

const DisciplineSearch: FC<DisciplineSearchProps> = ({ dataTestId, setValueFunction, value, placeholder }) => {
  const { t } = useTranslation();

  return (
    <Autocomplete
      options={disciplineOptions}
      groupBy={(discipline) => discipline.mainDiscipline}
      onChange={(_: object, value: NpiDiscipline | null) => setValueFunction(value)}
      value={getNpiDiscipline(value)}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={t('registration:description.npi_disciplines')}
          fullWidth
          variant="outlined"
          autoComplete="false"
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: <StyledSearchIcon />,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
        />
      )}
    />
  );
};

export default DisciplineSearch;
