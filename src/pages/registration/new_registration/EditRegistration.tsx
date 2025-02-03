import { Box } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { RegistrationForm } from '../RegistrationForm';
import { LinkRegistration } from './LinkRegistration';
import { StartEmptyRegistration } from './StartEmptyRegistration';

enum PanelName {
  LinkPanel,
  EmptyPanel,
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
        <LinkRegistration expanded={expanded === PanelName.LinkPanel} onChange={handleChange(PanelName.LinkPanel)} />
        <StartEmptyRegistration onChange={handleChange(PanelName.EmptyPanel)} />
      </Box>
    </StyledPageContent>
  ) : (
    <StyledPageContent>
      <RegistrationForm identifier={identifier} />
    </StyledPageContent>
  );
};

export default EditRegistration;
