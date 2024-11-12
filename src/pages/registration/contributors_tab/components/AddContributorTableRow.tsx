import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';
import { LastRegistrationTableCellContent } from './LastRegistrationTableCellContent';

interface CristinPersonTableRowProps {
  cristinPerson: CristinPerson;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
}

export const CristinPersonTableRow = ({
  cristinPerson,
  setSelectedPerson,
  selectedPerson,
}: CristinPersonTableRowProps) => {
  const { t } = useTranslation();
  const activeAffiliations = filterActiveAffiliations(cristinPerson.affiliations);
  const personIsSelected = cristinPerson.id === selectedPerson?.id;

  const selectedPersonHasAllAffiliations = !activeAffiliations.some(
    (affiliation) => !selectedPerson?.affiliations.some((a) => a.organization === affiliation.organization)
  );

  const hasSelectedAll = personIsSelected && selectedPersonHasAllAffiliations;

  const resetPersonSelection = () => setSelectedPerson(undefined);

  return (
    <TableRow selected={personIsSelected}>
      <TableCell>
        <IconButton
          data-testid={dataTestId.registrationWizard.contributors.selectEverythingForContributor}
          onClick={() => {
            if (hasSelectedAll) {
              resetPersonSelection();
            } else {
              setSelectedPerson({ ...cristinPerson, affiliations: activeAffiliations });
            }
          }}
          color="primary"
          title={t('registration.contributors.select_all')}>
          {hasSelectedAll ? <CheckCircle color="info" fontSize="large" /> : <ControlPointIcon fontSize="large" />}
        </IconButton>
      </TableCell>
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
                  affiliations: [],
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
                  <IconButton
                    data-testid={dataTestId.registrationWizard.contributors.selectAffiliationForContributor}
                    onClick={() => {
                      if (!selectedPerson) {
                        return;
                      }
                      const newAffiliations = affiliationIsSelected
                        ? selectedPerson.affiliations.filter((a) => a.organization !== affiliation.organization)
                        : [...selectedPerson.affiliations, affiliation];

                      const personWithAffiliation: CristinPerson = {
                        ...selectedPerson,
                        affiliations: newAffiliations,
                      };
                      setSelectedPerson(personWithAffiliation);
                    }}
                    color="primary"
                    size="small"
                    disabled={!personIsSelected}
                    title={t('registration.contributors.select_affiliation')}>
                    {affiliationIsSelected ? (
                      <CheckCircle fontSize="small" color="info" />
                    ) : (
                      <CircleOutlined fontSize="small" />
                    )}
                  </IconButton>
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
