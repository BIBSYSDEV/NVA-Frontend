import React from 'react';
import { useTranslation } from 'react-i18next';

import AutoLookup from '../../../components/AutoLookup';
import disciplines from '../../../utils/testfiles/disciplines_en.json';

interface DisciplineSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: string;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: React.FC<DisciplineSearchProps> = ({ dataTestId, setValueFunction, value }) => {
  const { t } = useTranslation();

  const searchResults = Object.values(disciplines)
    .map((mainDisciplines, index) =>
      mainDisciplines.map(discipline => ({
        title: t(`disciplines:${discipline}`),
        mainDiscipline: Object.keys(disciplines)[index],
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
    />
  );
};

export default DisciplineSearch;
