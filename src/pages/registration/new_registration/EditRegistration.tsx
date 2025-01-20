import { Box } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { RegistrationForm } from '../RegistrationForm';
import { LinkRegistration } from './LinkRegistration';
import { StartEmptyRegistration } from './StartEmptyRegistration';
import { UploadRegistration } from './UploadRegistration';
import { IdentifierParams } from '../../../utils/urlPaths';

enum PanelName {
  Link = 'link-panel',
  File = 'file-panel',
  Empty = 'empty-panel',
}

const EditRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const [expanded, setExpanded] = useState<PanelName | false>(false);

  const handleChange = (panel: PanelName) => (_: ChangeEvent<unknown>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return !identifier ? (
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
        <UploadRegistration expanded={expanded === PanelName.File} onChange={handleChange(PanelName.File)} />
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
