import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { RegistrationForm } from '../RegistrationForm';
import { LinkRegistration } from './LinkRegistration';
import { StartEmptyRegistration } from './StartEmptyRegistration';

enum PanelName {
  Link = 'link-panel',
  Empty = 'empty-panel',
}

const EditRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const [expanded, setExpanded] = useState<PanelName | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);

  // Open form only when we have an identifier in the URL
  useEffect(() => setShowForm(!!identifier), [identifier]);

  const handleChange = (panel: PanelName) => (_: ChangeEvent<unknown>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return !showForm ? (
    <StyledPageContent>
      <PageHeader>{t('registration.new_registration')}</PageHeader>
      <Box
        sx={{
          maxWidth: '55rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
        <LinkRegistration expanded={expanded === PanelName.Link} onChange={handleChange(PanelName.Link)} />
        <StartEmptyRegistration onChange={handleChange(PanelName.Empty)} />
      </Box>
    </StyledPageContent>
  ) : (
    <StyledPageContent>
      <RegistrationForm identifier={identifier} />
    </StyledPageContent>
  );
};

export default EditRegistration;
