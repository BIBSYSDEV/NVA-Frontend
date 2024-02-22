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
import { Dispatch, SetStateAction } from 'react';
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
  selectedAffiliations: string[];
  setSelectedAffiliations: Dispatch<SetStateAction<string[]>>;
}

export const CristinPersonList = ({
  personSearchHits,
  setSelectedPerson,
  selectedPerson,
  selectedAffiliations,
  setSelectedAffiliations,
}: CristinPersonListProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} sx={{ my: '0.5rem' }}>
      <Table size="medium">
        <caption style={visuallyHidden}>{t('registration.contributors.authors')}</caption>
        <TableHead>
          <TableRow>
            <TableCell>{t('registration.contributors.select_all')}</TableCell>
            <TableCell>{t('common.name')}</TableCell>
            <TableCell>{t('registration.contributors.select_person')}</TableCell>
            <TableCell>{t('my_page.my_profile.heading.affiliations')}</TableCell>
            <TableCell>{t('common.result_registrations')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personSearchHits.map((cristinPerson) => (
            <CristinPersonTableRow
              cristinPerson={cristinPerson}
              setSelectedPerson={setSelectedPerson}
              selectedPerson={selectedPerson}
              selectedAffiliations={selectedAffiliations}
              setSelectedAffiliations={setSelectedAffiliations}
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

const CristinPersonTableRow = ({
  cristinPerson,
  setSelectedPerson,
  selectedPerson,
  setSelectedAffiliations,
  selectedAffiliations,
}: CristinPersonTableRowProps) => {
  const { t } = useTranslation();
  const activeAffiliations = filterActiveAffiliations(cristinPerson.affiliations);
  const personIsSelected = cristinPerson.id === selectedPerson?.id;

  const selectedAffiliationsCoversAll = !activeAffiliations.some(
    (affiliation) => !selectedAffiliations.includes(affiliation.organization)
  );
  const selectedPersonAffiliationsCoversAll = !activeAffiliations.some(
    (affiliation) => !selectedPerson?.affiliations.some((a) => a.organization === affiliation.organization)
  );

  const hasSelectedAll = personIsSelected && (selectedAffiliationsCoversAll || selectedPersonAffiliationsCoversAll);

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
        <Typography>{getFullCristinName(cristinPerson.names)}</Typography>
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            const personToAdd: CristinPerson = {
              ...cristinPerson,
              affiliations: selectedPerson?.affiliations ?? [],
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
      </TableCell>
      <TableCell>
        {activeAffiliations.length > 0 ? (
          <>
            {activeAffiliations.map(({ organization }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}>
                <AffiliationHierarchy key={organization} unitUri={organization} commaSeparated />
                <IconButton
                  onClick={() => {
                    setSelectedAffiliations((state) => [...state, organization]);
                  }}
                  color="primary"
                  size="small"
                  disabled={
                    selectedAffiliations.includes(organization) ||
                    selectedPerson?.affiliations.some((affiliation) => affiliation.organization === organization)
                  }
                  sx={{ bgcolor: 'white' }}
                  title={t('registration.contributors.select_affiliation')}>
                  <ControlPointIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </>
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
