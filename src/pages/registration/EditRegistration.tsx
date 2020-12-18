import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkRegistration from './new_registration/LinkRegistration';
import UploadRegistration from './new_registration/UploadRegistration';
import RegistrationForm from './RegistrationForm';
import { PageHeader } from '../../components/PageHeader';

const StyledEditRegistration = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
`;

enum PanelName {
  Link = 'link-panel',
  File = 'file-panel',
}

interface UrlParams {
  identifier: string;
}
interface LocationState {
  isNewRegistration?: boolean;
}

const EditRegistration: FC = () => {
  const { t } = useTranslation('registration');
  const { identifier } = useParams<UrlParams>();
  const location = useLocation<LocationState>();
  const [expanded, setExpanded] = useState<PanelName | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);

  const handleChange = (panel: PanelName) => (_: ChangeEvent<unknown>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  const handleOpenForm = () => setShowForm(true);

  return !showForm ? (
    <>
      <PageHeader>{t('new_registration')}</PageHeader>
      <StyledEditRegistration>
        <LinkRegistration
          expanded={expanded === PanelName.Link}
          onChange={handleChange(PanelName.Link)}
          openForm={handleOpenForm}
        />
        <UploadRegistration
          expanded={expanded === PanelName.File}
          onChange={handleChange(PanelName.File)}
          openForm={handleOpenForm}
        />
      </StyledEditRegistration>
    </>
  ) : (
    <RegistrationForm
      identifier={identifier}
      isNewRegistration={!!location.state?.isNewRegistration}
      closeForm={() => setShowForm(false)}
    />
  );
};

export default EditRegistration;
