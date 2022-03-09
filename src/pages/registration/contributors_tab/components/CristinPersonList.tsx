import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { CristinUser } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';

interface CristinPersonListProps {
  personSearch: SearchResponse<CristinUser>;
  searchTerm?: string;
  onSelectContributor?: (selectedContributor: CristinUser) => void;
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
              <TableCell id="selected-heading" padding="checkbox">
                {t('common:selected')}
              </TableCell>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('profile:heading.affiliations')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personSearch.hits.map((cristinUser) => {
              const activeAffiliations = filterActiveAffiliations(cristinUser.affiliations);
              return (
                <TableRow
                  sx={{ cursor: 'pointer' }}
                  data-testid={dataTestId.registrationWizard.contributors.authorRadioButton}
                  key={cristinUser.id}
                  hover
                  onClick={() => onSelectContributor?.(cristinUser)}
                  selected={cristinUser.id === userId}>
                  <TableCell padding="checkbox">
                    <Radio inputProps={{ 'aria-labelledby': 'selected-heading' }} checked={cristinUser.id === userId} />
                  </TableCell>
                  <TableCell>
                    <Typography>{getFullCristinName(cristinUser.names)}</Typography>
                  </TableCell>
                  <TableCell>
                    {activeAffiliations.length > 0 ? (
                      <>
                        {activeAffiliations.map(({ organization }) => (
                          <AffiliationHierarchy unitUri={organization} commaSeparated />
                        ))}
                      </>
                    ) : (
                      <i>{t('profile:authority.no_affiliations_found')}</i>
                    )}
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
