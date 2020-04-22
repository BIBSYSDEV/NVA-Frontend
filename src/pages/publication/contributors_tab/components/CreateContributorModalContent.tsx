import React, { useState, FC } from 'react';
import { Formik, Form, Field, FieldProps, FormikValues } from 'formik';
import { emptyNewContributor } from '../../../../types/contributor.types';
import { Collapse, Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import NormalText from '../../../../components/NormalText';
import { createAuthority } from '../../../../api/authorityApi';
import { Authority } from '../../../../types/authority.types';
import Progress from '../../../../components/Progress';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledSmallButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledDescription = styled(NormalText)`
  white-space: pre-wrap;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 36rem;
  height: 16rem;
  padding: 2rem;
`;

interface CreateContributorModalContentProps {
  addAuthor: (author: Authority) => void;
  handleCloseModal: () => void;
}

const CreateContributorModalContent: FC<CreateContributorModalContentProps> = ({ addAuthor, handleCloseModal }) => {
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const toggleReadMore = () => setReadMore(!readMore);

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);
    const createdAuthority = await createAuthority(values.firstName, values.lastName);
    if (createdAuthority?.error) {
      dispatch(setNotification(createdAuthority.error, NotificationVariant.Error));
    } else {
      addAuthor(createdAuthority);
    }
    handleCloseModal();
  };

  return (
    <>
      {loading ? (
        <StyledProgressContainer>
          <Progress size={100} />
        </StyledProgressContainer>
      ) : (
        <Formik initialValues={emptyNewContributor} onSubmit={handleSubmit}>
          <Form>
            <Collapse in={readMore} collapsedHeight="4.5rem">
              <StyledDescription>{t('description_create_authority')}</StyledDescription>
            </Collapse>
            <StyledSmallButtonContainer>
              <Button color="primary" onClick={toggleReadMore}>
                {t(readMore ? 'read_less' : 'read_more')}
              </Button>
            </StyledSmallButtonContainer>
            <Field name="firstName">
              {({ field }: FieldProps) => (
                <TextField {...field} aria-label="first name" fullWidth label={t('first_name')} variant="outlined" />
              )}
            </Field>
            <Field name="lastName">
              {({ field }: FieldProps) => (
                <TextField {...field} aria-label="last name" fullWidth label={t('last_name')} variant="outlined" />
              )}
            </Field>
            <StyledButtonContainer>
              <Button type="submit" color="primary" variant="contained">
                {t('create_authority')}
              </Button>
            </StyledButtonContainer>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default CreateContributorModalContent;
