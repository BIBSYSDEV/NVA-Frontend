import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../../types/user.types';
import { AreaOfResponsibility, AreaOfResponsibilityProps } from './AreaOfResponsibility';

export const rolesWithAreaOfResponsibility = [
  RoleName.DoiCurator,
  RoleName.PublishingCurator,
  RoleName.SupportCurator,
  RoleName.NviCurator,
];

interface TasksFormSectionProps extends AreaOfResponsibilityProps {
  roles?: RoleName[];
}

export const TasksFormSection = ({ roles = [], viewingScopes, updateViewingScopes }: TasksFormSectionProps) => {
  const { t } = useTranslation();
  const curatorRoleIsAdded = roles.some((rolename) => rolesWithAreaOfResponsibility.includes(rolename));

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('editor.curators.area_of_responsibility')}
      </Typography>
      {!curatorRoleIsAdded ? (
        <Typography>{t('basic_data.person_register.must_be_curator_to_have_area_of_responsibility')}</Typography>
      ) : (
        <AreaOfResponsibility viewingScopes={viewingScopes} updateViewingScopes={updateViewingScopes} />
      )}
    </section>
  );
};
