import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';
import { LastRegistrationTableCellContent } from './LastRegistrationTableCellContent';

interface CristinPersonListProps {
  personSearchHits: CristinPerson[];
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson) => void;
}

export const CristinPersonList = ({ personSearchHits, setSelectedPerson, selectedPerson }: CristinPersonListProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} sx={{ my: '0.5rem' }}>
      <Table size="medium">
        <caption style={visuallyHidden}>{t('registration.contributors.authors')}</caption>
        <TableHead>
          <TableRow>
            <TableCell>{t('registration.contributors.select_all')}</TableCell>
            <TableCell>{t('common.name')}</TableCell>
            <TableCell>{t('my_page.my_profile.heading.affiliations')}</TableCell>
            <TableCell>{t('common.result_registrations')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personSearchHits.map((cristinPerson) => (
            <CristinPersonTableRow
              key={cristinPerson.id}
              cristinPerson={cristinPerson}
              setSelectedPerson={setSelectedPerson}
              selectedPerson={selectedPerson}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface CristinPersonTableRowProps extends Omit<CristinPersonListProps, 'personSearchHits'> {
  cristinPerson: CristinPerson;
}

const CristinPersonTableRow = ({ cristinPerson, setSelectedPerson, selectedPerson }: CristinPersonTableRowProps) => {
  const { t } = useTranslation();
  const activeAffiliations = filterActiveAffiliations(cristinPerson.affiliations);
  const personIsSelected = cristinPerson.id === selectedPerson?.id;

  const selectedPersonAffiliationsCoversAll = !activeAffiliations.some(
    (affiliation) => !selectedPerson?.affiliations.some((a) => a.organization === affiliation.organization)
  );

  const hasSelectedAll = personIsSelected && selectedPersonAffiliationsCoversAll;

  return (
    <TableRow
      data-testid={dataTestId.registrationWizard.contributors.authorRadioButton}
      key={cristinPerson.id}
      selected={personIsSelected}>
      <TableCell>
        <IconButton
          onClick={() => setSelectedPerson({ ...cristinPerson, affiliations: activeAffiliations })}
          color="primary"
          disabled={hasSelectedAll}
          sx={{ bgcolor: 'white' }}
          title={t('registration.contributors.select_all')}>
          <ControlPointIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{getFullCristinName(cristinPerson.names)}</Typography>
          <IconButton
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
            sx={{ bgcolor: 'white' }}
            title={t('registration.contributors.select_person')}>
            <ControlPointIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>

      <TableCell>
        {activeAffiliations.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeAffiliations.map((affiliation, index) => (
              <Box
                key={affiliation.organization + index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.25rem',
                }}>
                <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                <IconButton
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
                  disabled={
                    !personIsSelected ||
                    selectedPerson?.affiliations.some((a) => a.organization === affiliation.organization)
                  }
                  sx={{ bgcolor: 'white' }}
                  title={t('registration.contributors.select_affiliation')}>
                  <ControlPointIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : (
          <i>{t('registration.contributors.no_affiliations_found')}</i>
        )}
      </TableCell>
      <TableCell>
        <LastRegistrationTableCellContent personId={cristinPerson.id} />
      </TableCell>
    </TableRow>
  );
};
