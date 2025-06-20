import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Concert } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { toDateString } from '../../../../../../utils/date-helpers';
import { DeleteIconButton } from '../../../../../messages/components/DeleteIconButton';
import { EditIconButton } from '../../../../../messages/components/EditIconButton';
import { useState } from 'react';

interface ConcertExpandableRowProps {
  open: boolean;
}

const ConcertExpandableRow = ({ open }: ConcertExpandableRowProps) => {
  return (
    <TableRow>
      <Collapse in={open}>
        <h1>HELLO</h1>
      </Collapse>
    </TableRow>
  );
};

interface ConcertTableProps {
  manifestations: Concert[];
}
export const ConcertTable = ({ manifestations }: ConcertTableProps) => {
  const { t } = useTranslation();
  const [openCollapsable, setOpenCollapsable] = useState(false);

  return (
    <Table sx={{ '& th,td': { borderBottom: 1 } }}>
      <TableHead sx={{ bgcolor: '#fefbf4' }}>
        <TableRow>
          <TableCell>{t('common.order')}</TableCell>
          <TableCell>{t('common.place')}</TableCell>
          <TableCell>{t('common.description')}</TableCell>
          <TableCell>{t('registration.resource_type.date_from')}</TableCell>
          <TableCell>{t('registration.resource_type.date_to')}</TableCell>
          <TableCell>{t('registration.resource_type.artistic.extent_in_minutes')}</TableCell>
          <TableCell>{t('common.edit')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ bgcolor: 'secondary.light' }}>
        {manifestations.map((concert) => {
          return (
            <>
              <TableRow key={concert.sequence}>
                <TableCell>Move</TableCell>
                <TableCell>{concert.place?.name}</TableCell>
                <TableCell>{concert.concertSeries}</TableCell>
                <TableCell>
                  {concert.time?.type === 'Instant'
                    ? toDateString(concert.time.value)
                    : concert.time?.type === 'Period'
                      ? toDateString(concert.time.from)
                      : null}
                </TableCell>
                <TableCell>{concert.time?.type === 'Period' ? toDateString(concert.time.to) : null}</TableCell>
                <TableCell>{concert.extent}</TableCell>
                <TableCell sx={{ display: 'flex', gap: '1rem' }}>
                  <EditIconButton />
                  <DeleteIconButton />
                  <IconButton
                    title={openCollapsable ? t('common.show_fewer_options') : t('common.show_more_options')}
                    onClick={() => setOpenCollapsable(!openCollapsable)}
                    data-testid={dataTestId.registrationWizard.files.expandFileRowButton}>
                    {openCollapsable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
              {concert.concertProgramme.length > 0 &&
                concert.concertProgramme.map((event, index) => {
                  return <ConcertExpandableRow key={index} open={openCollapsable} />;
                })}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
};
