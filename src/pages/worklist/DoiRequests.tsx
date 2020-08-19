import React, { FC, useState, ChangeEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TablePagination,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import SubHeading from '../../components/SubHeading';
import useFetchDoiRequests from '../../utils/hooks/useFetchDoiRequests';
import Label from '../../components/Label';
import NormalText from '../../components/NormalText';
import { getTranslatedLabelForDisplayedRows } from '../../utils/pagination';
import { RoleName } from '../../types/user.types';

const DoiRequests: FC = () => {
  const { t } = useTranslation('workLists');
  const [doiRequests, isLoadingDoiRequests] = useFetchDoiRequests(RoleName.CURATOR);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return isLoadingDoiRequests ? (
    <CircularProgress />
  ) : doiRequests.length === 0 ? (
    <SubHeading>{t('no_pending_doi_requests')}</SubHeading>
  ) : (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Label>{t('publication_name')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('submitter')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('common:date')}</Label>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {doiRequests.map((doiRequest) => (
              <TableRow key={doiRequest.publicationIdentifier}>
                <TableCell component="th" scope="row">
                  <NormalText>{doiRequest.publicationTitle}</NormalText>
                </TableCell>
                <TableCell>
                  <NormalText>{doiRequest.publicationCreator}</NormalText>
                </TableCell>
                <TableCell>
                  <NormalText>{doiRequest.doiRequestDate}</NormalText>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to={`/publication/${doiRequest.publicationIdentifier}`}
                    data-testid={`open-publication-${doiRequest.publicationIdentifier}`}
                    variant="contained">
                    <NormalText>{t('common:open')}</NormalText>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { value: -1, label: t('common:all') }]}
        component="div"
        count={doiRequests.length}
        labelRowsPerPage={t('common:rows_per_page')}
        labelDisplayedRows={({ from, to, count }) => getTranslatedLabelForDisplayedRows(from, to, count)}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default DoiRequests;
