import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';
import { LastRegistrationTableCellContent } from './LastRegistrationTableCellContent';
import { SelectAffiliationCheckbox } from './SelectAffiliationCheckbox';
import { SelectAffiliationRadioButton } from './SelectAffiliationRadioButton';

interface CristinPersonTableRowProps {
  cristinPerson: CristinPerson;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  addProjectManager?: boolean;
}

export const CristinPersonTableRow = ({
  cristinPerson,
  setSelectedPerson,
  selectedPerson,
  addProjectManager = false,
}: CristinPersonTableRowProps) => {
  const { t } = useTranslation();
  const activeAffiliations = filterActiveAffiliations(cristinPerson.affiliations);
  const personIsSelected = cristinPerson.id === selectedPerson?.id;

  const resetPersonSelection = () => setSelectedPerson(undefined);

  return (
    <TableRow selected={personIsSelected}>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <IconButton
            data-testid={dataTestId.registrationWizard.contributors.selectPersonForContributor}
            onClick={() => {
              if (personIsSelected) {
                resetPersonSelection();
              } else {
                setSelectedPerson({
                  ...cristinPerson,
                  affiliations: addProjectManager ? [activeAffiliations[0]] : activeAffiliations,
                });
              }
            }}
            color="primary"
            size="small"
            title={t('registration.contributors.select_person')}>
            {personIsSelected ? <CheckCircle fontSize="small" color="info" /> : <CircleOutlined fontSize="small" />}
          </IconButton>
          <Typography>{getFullCristinName(cristinPerson.names)}</Typography>
        </Box>
      </TableCell>

      <TableCell>
        {activeAffiliations.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeAffiliations.map((affiliation, index) => {
              const affiliationIsSelected =
                personIsSelected &&
                selectedPerson.affiliations.some((a) => a.organization === affiliation.organization);

              return (
                <Box
                  key={affiliation.organization + index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}>
                  {addProjectManager ? (
                    <SelectAffiliationRadioButton
                      personIsSelected={personIsSelected}
                      affiliation={affiliation}
                      selectedPerson={selectedPerson}
                      setSelectedPerson={setSelectedPerson}
                      affiliationIsSelected={affiliationIsSelected}
                    />
                  ) : (
                    <SelectAffiliationCheckbox
                      personIsSelected={personIsSelected}
                      affiliation={affiliation}
                      selectedPerson={selectedPerson}
                      setSelectedPerson={setSelectedPerson}
                      affiliationIsSelected={affiliationIsSelected}
                    />
                  )}
                  <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography fontStyle="italic">{t('registration.contributors.no_affiliations_found')}</Typography>
        )}
      </TableCell>
      <TableCell>
        <LastRegistrationTableCellContent personId={cristinPerson.id} />
      </TableCell>
    </TableRow>
  );
};
