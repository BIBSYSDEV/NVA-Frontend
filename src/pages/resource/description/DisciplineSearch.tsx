import React from 'react';
import { AutoSearch } from './../../../components/AutoSearch';
import disciplines from './../../../utils/testfiles/disciplines_en.json';
import { useTranslation } from 'react-i18next';

interface DisciplineSeachProps {
  setFieldValue: (name: string, value: any) => void;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: React.FC<DisciplineSeachProps> = ({ setFieldValue }) => {
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
      setFieldValue={setFieldValue}
      formikFieldName="npi"
      label={t('resource_form.NPI_disciplines')}
      groupBy={(discipline: DisciplineType) => discipline.mainDiscipline}
    />
  );
};

export default DisciplineSearch;
