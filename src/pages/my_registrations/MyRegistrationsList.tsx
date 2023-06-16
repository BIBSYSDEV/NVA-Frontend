import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@mui/material';
import { Registration, RegistrationPreview, emptyRegistration } from '../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { RegistrationList } from '../../components/RegistrationList';

interface MyRegistrationsListProps {
  registrations: RegistrationPreview[];
  refetchRegistrations: () => void;
}

export const MyRegistrationsList = ({ registrations, refetchRegistrations }: MyRegistrationsListProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => setPage(0), [registrations]); // Reset page if user changes focus between Published and Unpublished

  useEffect(() => {
    if (registrations.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [registrations, page, rowsPerPage]);

  const registrationsOnPage = registrations.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const registrationsCopy = registrationsOnPage.map((registrationPreview) => {
    const { identifier, id, contributors, mainTitle, publicationInstance, status } = registrationPreview;
    return {
      ...emptyRegistration,
      identifier,
      id,
      status,
      entityDescription: {
        mainTitle,
        contributors,
        reference: { publicationInstance: { type: publicationInstance?.type ?? '' } },
      },
    } as Registration;
  });

  return (
    <>
      {registrationsCopy.length > 0 ? (
        <>
          <RegistrationList
            registrations={registrationsCopy}
            canEditRegistration={true}
            refetchRegistrations={refetchRegistrations}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, { value: registrations.length, label: t('common.all') }]}
            component="div"
            count={registrations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </>
  );
};
