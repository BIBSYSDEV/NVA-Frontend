import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { NVI_REPORTING_INSTRUCTIONS_URL } from '../../../utils/externalLinks';
import { HelperTextModal } from '../../registration/HelperTextModal';

export enum NviPointsModalVariant {
  Admin = 'admin',
  Curator = 'curator',
}

const variantData = {
  [NviPointsModalVariant.Admin]: {
    modalTestId: dataTestId.nviAdminPublicationPointsHelpModal,
    buttonTestId: dataTestId.nviAdminPublicationPointsHelpButton,
    i18nKey: 'points_for_reporting_admin_modal_text',
  },
  [NviPointsModalVariant.Curator]: {
    modalTestId: dataTestId.nviPublicationPointsHelpModal,
    buttonTestId: dataTestId.nviPublicationPointsHelpButton,
    i18nKey: 'points_for_reporting_modal_text',
  },
} as const;

interface NviPublicationPointsHelperModalProps {
  variant: NviPointsModalVariant;
}

export const NviPointsQuestionIcon = ({ variant }: NviPublicationPointsHelperModalProps) => {
  const { t } = useTranslation();
  const data = variantData[variant];

  return (
    <HelperTextModal
      modalTitle={t('points_for_reporting')}
      modalDataTestId={data.modalTestId}
      buttonDataTestId={data.buttonTestId}>
      <VerticalBox>
        <VerticalBox sx={{ gap: '1rem' }}>
          <Trans t={t} i18nKey={data.i18nKey} components={{ p: <Typography /> }} />
        </VerticalBox>
        <HorizontalBox sx={{ gap: '0.5rem', mb: '1rem' }}>
          <OpenInNewLink href={NVI_REPORTING_INSTRUCTIONS_URL} data-testid={dataTestId.nviPublicationPointsHelpLink}>
            {t('view_the_reporting_instructions')}
          </OpenInNewLink>
        </HorizontalBox>
      </VerticalBox>
    </HelperTextModal>
  );
};
