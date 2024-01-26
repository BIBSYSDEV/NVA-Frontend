import { Skeleton, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../../types/user.types';
import { AreaOfResponsibility } from './AreaOfResponsibility';
import { UserFormData } from './UserFormDialog';

interface TasksFormSectionProps {
  isLoadingUser: boolean;
}

const curatorRoles = [RoleName.DoiCurator, RoleName.PublishingCurator, RoleName.SupportCurator, RoleName.NviCurator];

export const TasksFormSection = ({ isLoadingUser }: TasksFormSectionProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<UserFormData>();
  const userIsCurator = values.user?.roles.some((role) => curatorRoles.includes(role.rolename));

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('editor.curators.area_of_responsibility')}
      </Typography>
      {isLoadingUser ? (
        <Skeleton sx={{ maxWidth: '15rem', height: '2rem' }} />
      ) : !userIsCurator ? (
        <Typography>{t('basic_data.person_register.must_be_curator_to_have_area_of_responsibility')}</Typography>
      ) : (
        <AreaOfResponsibility />
      )}
    </section>
  );
};
