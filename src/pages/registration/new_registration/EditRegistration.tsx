import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader';
import { SyledPageContent } from '../../../components/styled/Wrappers';
import { RegistrationForm } from '../RegistrationForm';
import { LinkRegistration } from './LinkRegistration';
import { StartEmptyRegistration } from './StartEmptyRegistration';
import { UploadRegistration } from './UploadRegistration';

enum PanelName {
  Link = 'link-panel',
  File = 'file-panel',
  Empty = 'empty-panel',
}

interface UrlParams {
  identifier: string;
}

const EditRegistration = () => {
  const { t } = useTranslation('registration');
  const { identifier } = useParams<UrlParams>();
  const [expanded, setExpanded] = useState<PanelName | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);

  // Open form only when we have an identifier in the URL
  useEffect(() => setShowForm(!!identifier), [identifier]);

  const handleChange = (panel: PanelName) => (_: ChangeEvent<unknown>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return !showForm ? (
    <SyledPageContent>
      <PageHeader>{t('new_registration')}</PageHeader>
      <Box
        sx={{
          maxWidth: '55rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
        <LinkRegistration expanded={expanded === PanelName.Link} onChange={handleChange(PanelName.Link)} />
        <UploadRegistration expanded={expanded === PanelName.File} onChange={handleChange(PanelName.File)} />
        <StartEmptyRegistration expanded={expanded === PanelName.Empty} onChange={handleChange(PanelName.Empty)} />
      </Box>
    </SyledPageContent>
  ) : (
    <SyledPageContent>
      <RegistrationForm identifier={identifier} />
    </SyledPageContent>
  );
};

export default EditRegistration;
