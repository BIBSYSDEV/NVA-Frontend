import React from 'react';
import { AutoSearch } from './../../../components/AutoSearch';
import disciplines from './../../../utils/testfiles/disciplines_no.json';

interface DisciplineSeachProps {
  setFieldValue: (value: any) => void;
}

interface DisciplineType {
  title: string;
  mainDiscipline: string;
}

const DisciplineSearch: React.FC<DisciplineSeachProps> = ({ setFieldValue }) => {
  const searchResults = Object.values(disciplines)
    .map((mainDisciplines, index) =>
      mainDisciplines.map(discipline => ({
        title: discipline,
        mainDiscipline: Object.keys(disciplines)[index],
      }))
    )
    .flat();

  return (
    <AutoSearch
      searchResults={searchResults}
      setFieldValue={setFieldValue}
      formikFieldName="npi"
      label="NPI fagfelt"
      groupBy={(discipline: DisciplineType) => discipline.mainDiscipline}
    />
  );
};

export default DisciplineSearch;
