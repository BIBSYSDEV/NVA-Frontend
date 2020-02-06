import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';

const MyPublications: FC = () => {
  const { t } = useTranslation();

  return (
    <FormCard>
      <FormCardHeading>{t('workLists:my_publications')}</FormCardHeading>
    </FormCard>
  );
};

export default MyPublications;
