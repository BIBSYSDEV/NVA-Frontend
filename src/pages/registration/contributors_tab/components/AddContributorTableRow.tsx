import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';
import { LastRegistrationTableCellContent } from './LastRegistrationTableCellContent';
import { SelectAffiliationRadioButton } from './SelectAffiliationRadioButton';
import { SelectAffiliationsCheckbox } from './SelectAffiliationsCheckbox';

export enum SelectAffiliations {
  'MULTIPLE',
  'SINGLE',
  'NO_SELECT',
}

interface CristinPersonTableRowProps {
  cristinPerson: CristinPerson;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  selectAffiliations?: SelectAffiliations;
}

export const CristinPersonTableRow = ({
  cristinPerson,
  setSelectedPerson,
  selectedPerson,
  selectAffiliations = SelectAffiliations.MULTIPLE,
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
                  affiliations:
                    selectAffiliations === SelectAffiliations.SINGLE
                      ? activeAffiliations.length > 0
                        ? [activeAffiliations[0]]
                        : []
                      : selectAffiliations === SelectAffiliations.MULTIPLE
                        ? activeAffiliations
                        : [],
                });
              }
            }}
            color="primary"
            size="small"
            title={t('registration.contributors.select_person')}>
            {personIsSelected ? (
              <CheckCircle fontSize="small" color="secondary" />
            ) : (
              <CircleOutlined fontSize="small" />
            )}
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
                  {selectAffiliations === SelectAffiliations.SINGLE ||
                  selectAffiliations === SelectAffiliations.NO_SELECT ? (
                    <SelectAffiliationRadioButton
                      cristinPerson={cristinPerson}
                      affiliation={affiliation}
                      selectedPerson={selectedPerson}
                      setSelectedPerson={setSelectedPerson}
                      affiliationIsSelected={affiliationIsSelected}
                      disabled={selectAffiliations === SelectAffiliations.NO_SELECT}
                    />
                  ) : (
                    <SelectAffiliationsCheckbox
                      cristinPerson={cristinPerson}
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
