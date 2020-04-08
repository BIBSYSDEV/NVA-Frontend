import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AutoLookup from '../../../components/AutoLookup';
import disciplines from '../../../resources/disciplines.json';

interface DisciplineSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: any;
  placeholder?: string;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: FC<DisciplineSearchProps> = ({ dataTestId, setValueFunction, value, placeholder }) => {
  const { t } = useTranslation();

  const searchResults = disciplines
    .map((mainDiscipline) =>
      mainDiscipline.subdomains.map((subDiscipline) => ({
        title: t(`disciplines:${subDiscipline.name}`),
        mainDiscipline: t(`disciplines:${mainDiscipline.subjectArea}`),
        id: subDiscipline.id,
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
