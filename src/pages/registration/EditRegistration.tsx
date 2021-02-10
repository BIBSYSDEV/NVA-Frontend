import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundDiv from '../../components/BackgroundDiv';
import { PageHeader } from '../../components/PageHeader';
import LinkRegistration from './new_registration/LinkRegistration';
import UploadRegistration from './new_registration/UploadRegistration';
import RegistrationForm from './RegistrationForm';

const StyledEditRegistration = styled.div`
  margin-top: 2rem;
  max-width: 55rem;

  > :not(:last-child) {
    margin-bottom: 2rem;
  }
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

  // Open form only when we have an identifier in the URL
  useEffect(() => setShowForm(!!identifier), [identifier]);

  const handleChange = (panel: PanelName) => (_: ChangeEvent<unknown>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return !showForm ? (
    <BackgroundDiv>
      <PageHeader>{t('new_registration')}</PageHeader>
      <StyledEditRegistration>
        <LinkRegistration expanded={expanded === PanelName.Link} onChange={handleChange(PanelName.Link)} />
        <UploadRegistration expanded={expanded === PanelName.File} onChange={handleChange(PanelName.File)} />
      </StyledEditRegistration>
    </BackgroundDiv>
  ) : (
    <RegistrationForm identifier={identifier} isNewRegistration={!!location.state?.isNewRegistration} />
  );
};

export default EditRegistration;
