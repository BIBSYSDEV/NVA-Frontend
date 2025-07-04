import NotesIcon from '@mui/icons-material/Notes';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ProtectedResultParam } from '../../api/searchApi';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NavigationList } from '../../components/PageWithSideMenu';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const ResultsPortfolioNavigationListAccodion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { status } = useRegistrationsQueryParams();
  const selectedStatuses = status ?? [];

  return (
    <NavigationListAccordion
      dataTestId={dataTestId.editor.resultsPortfolioAccordion}
      title={t('common.result_portfolio')}
      startIcon={<NotesIcon sx={{ bgcolor: 'white', padding: '0.1rem' }} />}
      accordionPath={UrlPathTemplate.InstitutionPortfolio}
      defaultPath={`${UrlPathTemplate.InstitutionPortfolio}?${ProtectedResultParam.Status}=${RegistrationStatus.Published}`}>
      <NavigationList component="div">
        <FormGroup
          sx={{ mx: '1rem' }}
          onChange={(event: ChangeEvent<any>) => {
            const clickedStatus = event.target.value as RegistrationStatus;
            const statusAlreadySelected = selectedStatuses.includes(clickedStatus);

            const syncedParams = syncParamsWithSearchFields(queryParams);
            const newStatuses = statusAlreadySelected
              ? selectedStatuses.filter((status) => status !== clickedStatus)
              : [...selectedStatuses, clickedStatus];

            if (newStatuses.length === 0) {
              syncedParams.delete(ProtectedResultParam.Status);
            } else {
              syncedParams.set(ProtectedResultParam.Status, newStatuses.join(','));
            }
            navigate({ search: syncedParams.toString() });
          }}>
          <FormControlLabel
            data-testid={dataTestId.editor.resultsPortfolioPublishedCheckbox}
            control={
              <Checkbox
                size="small"
                checked={selectedStatuses.includes(RegistrationStatus.Published)}
                value={RegistrationStatus.Published}
              />
            }
            label={t('registration.status.PUBLISHED')}
          />
          <FormControlLabel
            data-testid={dataTestId.editor.resultsPortfolioUnpublishedCheckbox}
            control={
              <Checkbox
                size="small"
                checked={selectedStatuses.includes(RegistrationStatus.Unpublished)}
                value={RegistrationStatus.Unpublished}
              />
            }
            label={t('registration.status.UNPUBLISHED')}
          />
          <FormControlLabel
            data-testid={dataTestId.editor.resultsPortfolioDeletedCheckbox}
            control={
              <Checkbox
                size="small"
                checked={selectedStatuses.includes(RegistrationStatus.Deleted)}
                value={RegistrationStatus.Deleted}
              />
            }
            label={t('registration.status.DELETED')}
          />
        </FormGroup>
      </NavigationList>
    </NavigationListAccordion>
  );
};
