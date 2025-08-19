import { Typography, useMediaQuery } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { BackgroundDiv } from '../styled/Wrappers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';

export const MergeResultsWizardContent = () => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <BackgroundDiv
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
        gap: '0.5rem',
        mt: '2rem',
        alignItems: 'center',
      }}>
      {!isMobile && (
        <>
          <Typography variant="h2">{t('basic_data.central_import.import_candidate')}</Typography>
          <Typography variant="h2" sx={{ gridColumn: 3 }}>
            {t('published_result')}
          </Typography>
        </>
      )}

      {activeTab === RegistrationTab.Description ? (
        <MergeResultsWizardDescriptionTab />
      ) : activeTab === RegistrationTab.ResourceType ? (
        <p>{t('registration.heading.resource_type')}: TODO</p>
      ) : activeTab === RegistrationTab.Contributors ? (
        <p>{t('registration.heading.contributors')}: TODO</p>
      ) : activeTab === RegistrationTab.FilesAndLicenses ? (
        <p>{t('registration.heading.files_and_license')}: TODO</p>
      ) : null}
    </BackgroundDiv>
  );
};
