import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { RootState } from '../../../redux/store';
import { ExportNviStatusButton } from './ExportNviStatusButton';
import { NviYearSelector } from './NviYearSelector';
import { NviVisibilitySelector } from './NviVisibilitySelector';
import { VerticalBox } from '../../../components/styled/Wrappers';

interface NviStatusWrapperProps {
  children?: ReactNode;
  headline: string;
  yearSelector?: boolean;
}

export const NviStatusWrapper = ({ children, headline, yearSelector }: NviStatusWrapperProps) => {
  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');

  return (
    <VerticalBox sx={{ gap: '1rem', alignItems: 'start' }}>
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {headline}
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {yearSelector && <NviYearSelector sx={{ minWidth: '10rem' }} />}
          <NviVisibilitySelector sx={{ minWidth: '15rem' }} />
        </Box>
        <ExportNviStatusButton acronym={organizationQuery.data?.acronym ?? ''} />
      </Box>
      {children}
    </VerticalBox>
  );
};
