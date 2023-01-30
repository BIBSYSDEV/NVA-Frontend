import { Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { Funding } from '../../types/registration.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { getNfrProjectUrl } from '../registration/description_tab/projects_field/projectHelpers';
import { fundingSourceIsNfr } from '../../utils/registration-helpers';
import { CristinApiPath } from '../../api/apiPaths';
import { FundingSources } from '../../types/project.types';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getPeriodString } from '../../utils/general-helpers';

interface PublicFundingsContentProps {
  fundings: Funding[];
}

export const PublicFundingsContent = ({ fundings }: PublicFundingsContentProps) => {
  const { t } = useTranslation();
  const [fundingSources, isLoadingFundingSources] = useFetchResource<FundingSources>(CristinApiPath.FundingSources);

  return (
    <>
      {fundings.map((funding, index) => {
        const isNfrSource = fundingSourceIsNfr(funding.source);
        return (
          <Box
            key={index}
            sx={{
              bgcolor: 'grey.400',
              borderRadius: '4px',
              p: '0.5rem',
              alignItems: 'center',
              display: 'grid',
              gridTemplateColumns: '2fr auto 2fr auto 1fr auto 1fr',
              gap: '1rem',
              ':not(:last-of-type)': { mb: '0.5rem' },
            }}>
            <Typography>{getLanguageString(funding.labels)}</Typography>
            <Divider component="span" orientation="vertical" />
            {isLoadingFundingSources ? (
              <Skeleton />
            ) : (
              <Typography>
                {getLanguageString(
                  fundingSources?.sources.find((fundingSource) => fundingSource.id === funding.source)?.name
                )}
              </Typography>
            )}
            <Divider component="span" orientation="vertical" />
            {isNfrSource ? (
              <>
                <Typography>{getPeriodString(funding.activeFrom, funding.activeTo)}</Typography>
                <Divider component="span" orientation="vertical" />
                <Button
                  sx={{ width: 'min-content', justifySelf: 'end' }}
                  size="small"
                  endIcon={<OpenInNewIcon />}
                  href={getNfrProjectUrl(funding.identifier)}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('common.open')}
                </Button>
              </>
            ) : (
              <Typography>
                {funding.fundingAmount?.amount} {funding.fundingAmount?.currency}
              </Typography>
            )}
          </Box>
        );
      })}
    </>
  );
};
