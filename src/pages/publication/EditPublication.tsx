import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkPublication from './new_publication/LinkPublication';
import LoadPublication from './new_publication/LoadPublication';
import PublicationForm from './PublicationForm';
import { PageHeader } from '../../components/PageHeader';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
`;

const EditPublication: FC = () => {
  const { identifier } = useParams();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);
  const { t } = useTranslation('publication');

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  return !showForm || !identifier ? (
    <>
      <PageHeader>{t('new_publication')}</PageHeader>
      <StyledEditPublication>
        <LinkPublication
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          openForm={handleClick}
        />
        <LoadPublication
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          openForm={() => setShowForm(true)}
        />
      </StyledEditPublication>
    </>
  ) : (
    <PublicationForm identifier={identifier} closeForm={() => setShowForm(false)} />
  );
};

export default EditPublication;
