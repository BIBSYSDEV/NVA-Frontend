import NotesIcon from '@mui/icons-material/Notes';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CustomerResultParam } from '../../api/searchApi';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NavigationList } from '../../components/PageWithSideMenu';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const ResultsPortfolioNavigationListAccodion = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const selectedStatuses = (queryParams.get(CustomerResultParam.Status)?.split(',') ?? []) as RegistrationStatus[];

  return (
    <NavigationListAccordion
      dataTestId={dataTestId.editor.resultsPortfolioAccordion}
      title={t('common.result_portfolio')}
      startIcon={<NotesIcon sx={{ bgcolor: 'white', padding: '0.1rem' }} />}
      accordionPath={UrlPathTemplate.InstitutionPortfolio}
      defaultPath={`${UrlPathTemplate.InstitutionPortfolio}?${CustomerResultParam.Status}=${RegistrationStatus.Published}`}>
      <NavigationList component="div">
        <FormGroup
          sx={{ mx: '1rem' }}
          onChange={(event: ChangeEvent<any>) => {
            const clickedStatus = event.target.value as RegistrationStatus;
            const statusAlreadySelected = selectedStatuses.includes(clickedStatus);

            const newStatuses = statusAlreadySelected
              ? selectedStatuses.filter((status) => status !== clickedStatus)
              : [...selectedStatuses, clickedStatus];

            if (newStatuses.length === 0) {
              queryParams.delete(CustomerResultParam.Status);
            } else {
              queryParams.set(CustomerResultParam.Status, newStatuses.join(','));
            }
            history.push({ search: queryParams.toString() });
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
