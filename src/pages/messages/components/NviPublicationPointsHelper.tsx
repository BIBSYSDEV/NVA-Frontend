import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { NVI_REPORTING_INSTRUCTIONS_URL } from '../../../utils/externalLinks';
import { HelperTextModal } from '../../registration/HelperTextModal';

export const NviPublicationPointsHelper = () => {
  const { t } = useTranslation();
  return (
    <HelperTextModal
      modalTitle={t('points_for_reporting')}
      modalDataTestId={dataTestId.nviPublicationPointsHelpModal}
      buttonDataTestId={dataTestId.nviPublicationPointsHelpButton}>
      <VerticalBox>
        <VerticalBox sx={{ gap: '1rem' }}>
          <Trans t={t} i18nKey="points_for_reporting_modal_text" components={{ p: <Typography /> }} />
        </VerticalBox>
        <HorizontalBox sx={{ gap: '0.5rem', mb: '1rem' }}>
          <OpenInNewLink href={NVI_REPORTING_INSTRUCTIONS_URL}>{t('view_the_reporting_instructions')}</OpenInNewLink>
        </HorizontalBox>
      </VerticalBox>
    </HelperTextModal>
  );
};
