import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { FundingSources } from '../../types/project.types';
import { Funding } from '../../types/registration.types';
import { getPeriodString } from '../../utils/general-helpers';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../utils/translation-helpers';
import { fundingSourceIsNfr, getNfrProjectUrl } from '../registration/description_tab/projects_field/projectHelpers';

interface PublicFundingsContentProps {
  fundings: Funding[];
}

export const PublicFundingsContent = ({ fundings }: PublicFundingsContentProps) => {
  const { t } = useTranslation();
  const [fundingSources, isLoadingFundingSources] = useFetchResource<FundingSources>(CristinApiPath.FundingSources);

  return (
    <>
      {fundings.map((funding, index) => (
        <Box
          key={index}
          sx={{
            bgcolor: 'grey.400',
            borderRadius: '4px',
            p: '0.75rem 1rem',
            alignItems: 'center',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr auto 3fr auto 2fr auto 1fr' },
            columnGap: '1rem',
            ':not(:last-of-type)': { mb: '0.5rem' },
          }}>
          <Typography>{getLanguageString(funding.labels)}</Typography>
          <Divider orientation="vertical" />
          {isLoadingFundingSources ? (
            <Skeleton />
          ) : (
            <Typography>
              {getLanguageString(
                fundingSources?.sources.find((fundingSource) => fundingSource.id === funding.source)?.name
              )}
            </Typography>
          )}
          <Divider orientation="vertical" />
          {fundingSourceIsNfr(funding.source) ? (
            <>
              <Typography>{getPeriodString(funding.activeFrom, funding.activeTo)}</Typography>
              <Divider orientation="vertical" />
              {funding.identifier && (
                <Button
                  sx={{ width: 'min-content', justifySelf: { md: 'end' } }}
                  size="small"
                  endIcon={<OpenInNewIcon />}
                  href={getNfrProjectUrl(funding.identifier)}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('common.open')}
                </Button>
              )}
            </>
          ) : (
            <Typography>
              {funding.fundingAmount?.amount} {funding.fundingAmount?.currency}
            </Typography>
          )}
        </Box>
      ))}
    </>
  );
};
