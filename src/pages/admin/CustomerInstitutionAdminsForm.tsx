import React, { FC } from 'react';
import Card from '../../components/Card';
import { TextField, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledNewAdminRow = styled.div`
  display: flex;
`;

const StyledTextField = styled(TextField)`
  width: 20rem;
  margin-right: 2rem;
`;

const CustomerInstitutionAdminsForm: FC = () => {
  const { t } = useTranslation();
  // TODO: Fetch existing admins

  return (
    <Card>
      <StyledNewAdminRow>
        <StyledTextField variant="outlined" label={t('TODO.label')} />
        <Button color="primary" variant="contained">
          Legg til
        </Button>
      </StyledNewAdminRow>
    </Card>
  );
};

export default CustomerInstitutionAdminsForm;
