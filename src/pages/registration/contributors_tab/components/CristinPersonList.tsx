import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';
import { LastRegistrationTableCellContent } from './LastRegistrationTableCellContent';

const radioHeadingId = 'selected-heading';

interface CristinPersonListProps {
  personSearch: SearchResponse<CristinPerson>;
  searchTerm?: string;
  onSelectContributor?: (selectedContributor: CristinPerson) => void;
  userId?: string;
}

export const CristinPersonList = ({
  personSearch,
  searchTerm,
  onSelectContributor,
  userId,
}: CristinPersonListProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      {searchTerm && (
        <Typography variant="subtitle1" component="p">
          {t('search_summary', { count: personSearch.size, searchTerm })}:
        </Typography>
      )}

      <TableContainer>
        <Table size="medium">
          <caption style={visuallyHidden}>{t('registration:contributors.authors')}</caption>
          <TableHead>
            <TableRow>
              <TableCell id={radioHeadingId} padding="checkbox">
                {t('common:selected')}
              </TableCell>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('profile:heading.affiliations')}</TableCell>
              <TableCell>{t('common:registrations')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personSearch.hits.map((cristinPerson) => {
              const activeAffiliations = filterActiveAffiliations(cristinPerson.affiliations);
              const isSelected = cristinPerson.id === userId;
              return (
                <TableRow
                  sx={{ cursor: 'pointer' }}
                  data-testid={dataTestId.registrationWizard.contributors.authorRadioButton}
                  key={cristinPerson.id}
                  hover
                  onClick={() => onSelectContributor?.(cristinPerson)}
                  selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Radio inputProps={{ 'aria-labelledby': radioHeadingId }} checked={isSelected} />
                  </TableCell>
                  <TableCell>
                    <Typography>{getFullCristinName(cristinPerson.names)}</Typography>
                  </TableCell>
                  <TableCell>
                    {activeAffiliations.length > 0 ? (
                      <>
                        {activeAffiliations.map(({ organization }) => (
                          <AffiliationHierarchy key={organization} unitUri={organization} commaSeparated />
                        ))}
                      </>
                    ) : (
                      <i>{t('profile:authority.no_affiliations_found')}</i>
                    )}
                  </TableCell>
                  <TableCell>
                    <LastRegistrationTableCellContent personId={cristinPerson.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
