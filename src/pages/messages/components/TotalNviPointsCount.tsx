import { useTranslation } from 'react-i18next';
import { HorizontalBox, MediumTypography } from '../../../components/styled/Wrappers';

interface TotalPointsCountProps {
  orgName: string;
  result: number;
  publicationPoints: number;
}

export const TotalNviPointsCount = ({ orgName, result, publicationPoints }: TotalPointsCountProps) => {
  const { t } = useTranslation();

  return (
    <HorizontalBox sx={{ mb: '0.5rem', gap: '1rem' }}>
      <MediumTypography sx={{ fontWeight: 'bold' }}>
        {t('tasks.nvi.total_for_organization', { orgName: orgName })}
      </MediumTypography>
      <MediumTypography>{t('tasks.nvi.result', { result: result })}</MediumTypography>
      <MediumTypography>
        {t('tasks.nvi.total_publication_points', { publicationPoints: publicationPoints })}
      </MediumTypography>
    </HorizontalBox>
  );
};
