import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { Sector } from '../../../types/customerInstitution.types';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const [textExpanded, setTextExpanded] = useState(false);
  const detailsId = 'publication-points-details';

  const mockData: Array<{
    id: string;
    institution: string;
    sector: Sector;
    approved: number;
    total: number;
    rejected: number;
    publicationPoints: number;
  }> = [
    {
      id: 'test1',
      institution: 'Test institusjon 1',
      sector: Sector.Uhi,
      approved: 1,
      total: 24,
      rejected: 15,
      publicationPoints: 31.45,
    },
    {
      id: 'test2',
      institution: 'Test institusjon 2',
      sector: Sector.Uhi,
      approved: 10,
      total: 14,
      rejected: 2,
      publicationPoints: 67.31,
    },
    {
      id: 'test3',
      institution: 'Test institusjon 3',
      sector: Sector.Health,
      approved: 7,
      total: 12,
      rejected: 1,
      publicationPoints: 13.57,
    },
    {
      id: 'test4',
      institution: 'Test institusjon 4',
      sector: Sector.Uhi,
      approved: 8,
      total: 240,
      rejected: 13,
      publicationPoints: 12,
    },
    {
      id: 'test5',
      institution: 'Test institusjon 5',
      sector: Sector.Uhi,
      approved: 55,
      total: 56,
      rejected: 1,
      publicationPoints: 98.49,
    },
  ];

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.publication_points_status')}
      topView={
        <Box sx={{ mb: '1rem' }}>
          <Typography>{t('publication_points_description')}</Typography>
          <Button
            variant="text"
            onClick={() => setTextExpanded((prev) => !prev)}
            aria-expanded={textExpanded}
            aria-controls={detailsId}
            endIcon={textExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textDecoration: 'underline', justifyContent: 'flex-start', p: 0, minWidth: 0, my: '0.5rem' }}>
            {textExpanded ? t('common.read_less') : t('common.read_more')}
          </Button>
          {textExpanded && <Typography id={detailsId}>{t('publication_points_description_more')}</Typography>}
        </Box>
      }>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
              <TableCell>{t('common.institution')}</TableCell>
              <TableCell>{t('sector')}</TableCell>
              <TableCell align="center">{t('approved')}</TableCell>
              <TableCell align="center">{t('publication_points')}</TableCell>
              <TableCell align="center">{t('percentage_controlled')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((obj) => {
              const controlled = obj.total > 0 ? (obj.approved + obj.rejected) / obj.total : 0;
              return (
                <TableRow key={obj.id} sx={{ height: '4rem' }}>
                  <TableCell>{obj.institution}</TableCell>
                  <TableCell>{t(`basic_data.institutions.sector_values.${obj.sector}`)}</TableCell>
                  <TableCell align="center">{obj.approved}</TableCell>
                  <TableCell align="center">{obj.publicationPoints}</TableCell>
                  <TableCell align="center" sx={{ py: 0 }}>
                    <HorizontalBox sx={{ justifyContent: 'center' }}>
                      <PercentageWithIcon
                        warningThresholdMinimum={30}
                        successThresholdMinimum={100}
                        displayPercentage={Math.round(controlled * 100)}
                        alternativeIfZero={'-'}
                      />
                    </HorizontalBox>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </NviStatusWrapper>
  );
};
