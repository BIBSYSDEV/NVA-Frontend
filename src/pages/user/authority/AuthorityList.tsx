import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import {
  Radio,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { Authority } from '../../../types/authority.types';
import { AlmaRegistration } from '../../../types/registration.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { AlmaApiPath } from '../../../api/apiPaths';
import { dataTestId } from '../../../utils/dataTestIds';
import { TruncatableTypography } from '../../../components/TruncatableTypography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  minWidth: '12rem',
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
  },
}));

interface AuthorityListProps {
  authorities: Authority[];
  searchTerm?: string;
  onSelectAuthority?: (authority: Authority) => void;
  selectedArpId?: string;
}

export const AuthorityList = ({ authorities, searchTerm, onSelectAuthority, selectedArpId }: AuthorityListProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      {searchTerm && (
        <Typography variant="subtitle1" component="p">
          {t('search_summary', { count: authorities?.length ?? 0, searchTerm })}:
        </Typography>
      )}

      <TableContainer>
        <Table size="medium">
          <caption>
            <span style={visuallyHidden}>{t('registration:contributors.authors')}</span>
          </caption>
          <TableHead>
            <TableRow>
              <TableCell id="selected-heading" padding="checkbox">
                {t('common:selected')}
              </TableCell>
              <StyledTableCell data-testid="author-name-column">{t('name')}</StyledTableCell>
              <StyledTableCell data-testid="author-last-registration-column">
                {t('profile:authority.example_publication')}
              </StyledTableCell>
              <StyledTableCell data-testid="author-organizations-column">
                {t('profile:heading.affiliations')}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authorities.map((authority) => (
              <TableRow
                sx={{ cursor: 'pointer' }}
                data-testid={dataTestId.registrationWizard.contributors.authorRadioButton}
                key={authority.id}
                hover
                onClick={() => onSelectAuthority?.(authority)}
                selected={authority.id === selectedArpId}>
                <TableCell padding="checkbox">
                  <Radio
                    inputProps={{ 'aria-labelledby': 'selected-heading' }}
                    checked={authority.id === selectedArpId}
                  />
                </TableCell>
                <TableCell>
                  <Typography>{authority.name}</Typography>
                </TableCell>
                <TableCell>
                  <LastAlmaRegistrationCell authority={authority} />
                </TableCell>
                <TableCell>
                  {authority.orgunitids.length > 0 ? (
                    <>
                      <AffiliationHierarchy unitUri={authority.orgunitids[0]} boldTopLevel={false} />
                      {authority.orgunitids.length > 1 && (
                        <i>{t('profile:authority.other_affiliations', { count: authority.orgunitids.length - 1 })}</i>
                      )}
                    </>
                  ) : (
                    <i>{t('profile:authority.no_affiliations_found')}</i>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface LastAlmaRegistrationCellProps {
  authority: Authority;
}

const LastAlmaRegistrationCell = ({ authority }: LastAlmaRegistrationCellProps) => {
  const { t } = useTranslation('profile');

  const systemControlNumber = authority.id.split('/').pop();
  const [almaPublication, isLoadingAlmaPublication] = useFetch<AlmaRegistration>({
    url:
      systemControlNumber && authority.name
        ? encodeURI(`${AlmaApiPath.Alma}/?scn=${systemControlNumber}&creatorname=${authority.name}`)
        : '',
    errorMessage: t('feedback:error.get_last_registration'),
  });

  return (
    <>
      {isLoadingAlmaPublication ? (
        <Skeleton />
      ) : almaPublication?.title ? (
        <TruncatableTypography>{almaPublication.title}</TruncatableTypography>
      ) : (
        <i>{t('authority.no_registrations_found')}</i>
      )}
    </>
  );
};
