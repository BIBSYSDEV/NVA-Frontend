import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { CreateProjectAccordion } from './CreateProjectAccordion';

export const NFRProject = () => {
  const { t } = useTranslation();
  return (
    <CreateProjectAccordion
      headline={t('project.form.start_with_nfr_financing')}
      description={t('project.form.start_with_nfr_financing_details')}
      testId={dataTestId.newProjectPage.createNFRProjectAccordion}
      icon={<PaidOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      test
    </CreateProjectAccordion>
  );
};
