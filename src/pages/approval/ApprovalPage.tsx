import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchApproval } from '../../api/hooks/useFetchApproval';
import { useFetchApprovalView } from '../../api/hooks/useFetchApprovalView';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { IdentifierParams } from '../../utils/urlPaths';
import { ApprovalLandingPage } from './ApprovalLandingPage';

const ApprovalPage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  const approvalViewQuery = useFetchApprovalView(identifier);
  const approvalQuery = useFetchApproval(identifier);

  return (
    <StyledPageContent>
      {approvalViewQuery.isPending ? (
        <PageSpinner aria-label={t('approval')} />
      ) : (
        approvalViewQuery.data && (
          <ApprovalLandingPage approvalView={approvalViewQuery.data} approval={approvalQuery.data} />
        )
      )}
    </StyledPageContent>
  );
};

export default ApprovalPage;
