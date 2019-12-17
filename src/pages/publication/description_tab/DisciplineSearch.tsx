import React from 'react';
import { useTranslation } from 'react-i18next';

import { AutoSearch } from '../../../components/AutoSearch';
import disciplines from '../../../utils/testfiles/disciplines_en.json';

interface DisciplineSearchProps {
  setValueFunction: (value: any) => void;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: React.FC<DisciplineSearchProps> = ({ setValueFunction }) => {
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
    <AutoSearch
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      label={t('publication:description.npi_disciplines')}
      groupBy={(discipline: DisciplineType) => discipline.mainDiscipline}
    />
  );
};

export default DisciplineSearch;
