import React, { FC, useState, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';
import Axios, { CancelTokenSource } from 'axios';

import {
  FormikInstitutionUnit,
  FormikInstitutionUnitFieldNames,
  RecursiveInstitutionUnit,
} from '../../types/institution.types';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import { useDispatch } from 'react-redux';
import { getDepartment } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import NormalText from '../NormalText';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import InstitutionAutocomplete from './InstitutionAutocomplete';

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

const StyledLoadingInfo = styled.div`
  margin: 1rem;
`;

interface SelectInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

const SelectInstitution: FC<SelectInstitutionProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [selectedInstitutionSubunits, setSelectedInstitutionSubunits] = useState<RecursiveInstitutionUnit[]>();
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();

  // Allow cancellation of fetching department
  const cancelSourceRef = useRef<CancelTokenSource>();

  const fetchDepartment = async (institutionId: string) => {
    setIsLoadingDepartment(true);

    // Create new source to allow cancellation of this request if a newer is initiated later
    const cancelSource = Axios.CancelToken.source();
    cancelSourceRef.current = cancelSource;

    const response = await getDepartment(institutionId, cancelSource.token);
    if (!response) {
      // No response means request has been cancelled. Return without resetting isLoadingDepartment since
      // this might override loading state set by a newer request
      return;
    } else if (response.error) {
      dispatch(setNotification(response.error, NotificationVariant.Error));
    } else {
      setSelectedInstitutionSubunits(response.subunits);
    }
    setIsLoadingDepartment(false);
  };

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { setFieldValue, isSubmitting } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionAutocomplete
                institutions={institutions}
                isLoading={isLoadingInstitutions}
                value={value}
                onChange={(value) => {
                  if (isLoadingDepartment) {
                    // Cancel potential previous request in progress
                    cancelSourceRef.current?.cancel();
                  }
                  setSelectedInstitutionSubunits(undefined);
                  if (value) {
                    fetchDepartment(value.id);
                  } else {
                    setIsLoadingDepartment(false);
                  }
                  setFieldValue(name, value);
                }}
              />

              {isLoadingDepartment && (
                <StyledLoadingInfo>
                  <NormalText>{t('institution:loading_department')}</NormalText>
                  <CircularProgress />
                </StyledLoadingInfo>
              )}

              {selectedInstitutionSubunits && (
                <InstitutionSelector
                  units={selectedInstitutionSubunits}
                  fieldNamePrefix={name}
                  label={t('institution:department')}
                />
              )}

              <StyledButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={!value || isLoadingDepartment || isSubmitting}
                data-testid="institution-add-button">
                {t('add')}
              </StyledButton>

              {onClose && (
                <StyledButton
                  onClick={() => {
                    onClose();
                  }}
                  data-testid="institution-cancel-button"
                  variant="contained">
                  {t('cancel')}
                </StyledButton>
              )}
            </StyledInstitutionSearchContainer>
          )}
        </Field>
      </Form>
    </Formik>
  );
};

export default SelectInstitution;
