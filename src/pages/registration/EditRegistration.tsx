import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkRegistration from './new_registration/LinkRegistration';
import UploadRegistration from './new_registration/UploadRegistration';
import RegistrationForm from './RegistrationForm';
import { PageHeader } from '../../components/PageHeader';

const StyledEditRegistration = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
`;

const EditRegistration: FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);
  const { t } = useTranslation('registration');

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  return !showForm || !identifier ? (
    <>
      <PageHeader>{t('new_registration')}</PageHeader>
      <StyledEditRegistration>
        <LinkRegistration
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          openForm={handleClick}
        />
        <UploadRegistration
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          openForm={() => setShowForm(true)}
        />
      </StyledEditRegistration>
    </>
  ) : (
    <RegistrationForm identifier={identifier} closeForm={() => setShowForm(false)} />
  );
};

export default EditRegistration;
