import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';

import disciplines from '../../../resources/disciplines.json';
import { NpiDiscipline } from '../../../types/publication.types';

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

  const searchResults: NpiDiscipline[] = disciplines
    .map((mainDiscipline) =>
      mainDiscipline.subdomains.map((subDiscipline) => ({
        title: t(`disciplines:${subDiscipline.name}`),
        mainDiscipline: t(`disciplines:${mainDiscipline.subjectArea}`),
        id: subDiscipline.id,
      }))
    )
    .flat();

  return (
    <Autocomplete
      options={searchResults}
      groupBy={(discipline) => discipline.mainDiscipline}
      onChange={(_: object, value: NpiDiscipline | null) => setValueFunction(value)}
      value={value}
      getOptionLabel={(option) => option.title || option.name || ''}
      getOptionSelected={(option, value) => value.id === option.id} // TODO: Remove?
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={t('publication:description.npi_disciplines')}
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
