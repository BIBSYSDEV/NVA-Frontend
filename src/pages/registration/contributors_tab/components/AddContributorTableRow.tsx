import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
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
  setSelectedPerson: (selectedContributor: CristinPerson) => void;
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

  return (
    <TableRow selected={personIsSelected}>
      <TableCell>
        <IconButton
          data-testid={dataTestId.registrationWizard.contributors.selectEverythingForContributor}
          onClick={() => setSelectedPerson({ ...cristinPerson, affiliations: activeAffiliations })}
          color="primary"
          disabled={hasSelectedAll}
          title={t('registration.contributors.select_all')}>
          {hasSelectedAll ? <CheckCircleIcon color="info" /> : <ControlPointIcon />}
        </IconButton>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{getFullCristinName(cristinPerson.names)}</Typography>
          <IconButton
            data-testid={dataTestId.registrationWizard.contributors.selectPersonForContributor}
            onClick={() => {
              const personToAdd: CristinPerson = {
                ...cristinPerson,
                affiliations: [],
              };
              setSelectedPerson(personToAdd);
            }}
            color="primary"
            size="small"
            disabled={personIsSelected}
            title={t('registration.contributors.select_person')}>
            {personIsSelected ? (
              <CheckCircleOutlined fontSize="small" color="info" />
            ) : (
              <PersonAddOutlinedIcon fontSize="small" />
            )}
          </IconButton>
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
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}>
                  <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                  <IconButton
                    data-testid={dataTestId.registrationWizard.contributors.selectAffiliationForContributor}
                    onClick={() => {
                      if (!selectedPerson) {
                        return;
                      }
                      const personWithAffiliation: CristinPerson = {
                        ...selectedPerson,
                        affiliations: [...selectedPerson.affiliations, affiliation],
                      };
                      setSelectedPerson(personWithAffiliation);
                    }}
                    color="primary"
                    size="small"
                    disabled={!personIsSelected || affiliationIsSelected}
                    title={t('registration.contributors.select_affiliation')}>
                    {affiliationIsSelected ? (
                      <CheckCircleOutlined fontSize="small" color="info" />
                    ) : (
                      <AddBusinessOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
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
