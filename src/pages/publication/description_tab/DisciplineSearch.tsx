import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AutoLookup from '../../../components/AutoLookup';
import disciplines from '../../../utils/testfiles/disciplines_en.json';

interface DisciplineSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: string;
  placeholder?: string;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: FC<DisciplineSearchProps> = ({ dataTestId, setValueFunction, value, placeholder }) => {
  const { t } = useTranslation();

  const searchResults = Object.values(disciplines)
    .map((mainDisciplines, index) =>
      mainDisciplines.map(discipline => ({
        title: t(`disciplines:${discipline}`),
        mainDiscipline: t(`disciplines:${Object.keys(disciplines)[index]}`),
      }))
    )
    .flat();

  return (
    <AutoLookup
      dataTestId={dataTestId}
      label={t('publication:description.npi_disciplines')}
      options={searchResults}
      setValueFunction={setValueFunction}
      groupBy={(discipline: DisciplineType) => discipline.mainDiscipline}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default DisciplineSearch;
