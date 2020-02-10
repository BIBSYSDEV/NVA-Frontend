import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import PublicationList from './PublicationList';

export interface DummyPublicationListElement {
  id: string;
  title: string;
  createdDate: string;
  status: string;
}

const MyPublications: FC = () => {
  const { t } = useTranslation();

  //TODO: to be replaced by data from api in NP-471
  let dummyElement: DummyPublicationListElement = {
    id: '5843058934095834905.',
    title: 'Qualitative research practice: A guide for social science students and researchers.',
    status: 'Kladd',
    createdDate: '02.09.2010',
  };
  let dummyElementList = [dummyElement, dummyElement, dummyElement, dummyElement, dummyElement];

  return (
    <FormCard>
      <FormCardHeading>{t('workLists:my_publications')}</FormCardHeading>
      <PublicationList publications={dummyElementList} />
    </FormCard>
  );
};

export default MyPublications;
