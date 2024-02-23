import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { Box, Chip, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../../types/user.types';
import { AreaOfResponsibility, AreaOfResponsibilityProps } from './AreaOfResponsibility';

export const rolesWithAreaOfResponsibility = [
  RoleName.DoiCurator,
  RoleName.PublishingCurator,
  RoleName.SupportCurator,
  RoleName.NviCurator,
];

const StyledChipLabelContainer = styled(Box)({
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
});

interface TasksFormSectionProps extends AreaOfResponsibilityProps {
  roles?: RoleName[];
  updateRoles: (roles: RoleName[]) => void;
}

export const TasksFormSection = ({
  roles = [],
  viewingScopes,
  updateViewingScopes,
  updateRoles,
}: TasksFormSectionProps) => {
  const { t } = useTranslation();
  const curatorRoleIsAdded = roles.some((rolename) => rolesWithAreaOfResponsibility.includes(rolename));

  const isThesisCurator = roles.includes(RoleName.CuratorThesis);
  const isThesisEmbargoCurator = roles.includes(RoleName.CuratorThesisEmbargo);

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

      {roles.includes(RoleName.PublishingCurator) && (
        <>
          <Typography sx={{ mt: '1rem', mb: '0.25rem' }}>
            {t('basic_data.person_register.degree_roles.degree_tasks')}
          </Typography>
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Chip
              color={isThesisCurator ? 'info' : 'primary'}
              variant={isThesisCurator ? 'filled' : 'outlined'}
              label={
                <StyledChipLabelContainer>
                  {t('basic_data.person_register.degree_roles.degree')}
                  <LocalOfferOutlinedIcon />
                </StyledChipLabelContainer>
              }
              onClick={() => {
                if (isThesisCurator) {
                  updateRoles(
                    roles.filter((role) => role !== RoleName.CuratorThesis && role !== RoleName.CuratorThesisEmbargo)
                  );
                } else {
                  updateRoles([...roles, RoleName.CuratorThesis]);
                }
              }}
            />
            <Chip
              color={isThesisEmbargoCurator ? 'info' : 'primary'}
              variant={isThesisEmbargoCurator ? 'filled' : 'outlined'}
              label={
                <StyledChipLabelContainer>
                  {t('basic_data.person_register.degree_roles.embargo')}
                  <LocalOfferIcon />
                </StyledChipLabelContainer>
              }
              onClick={() => {
                if (isThesisEmbargoCurator) {
                  updateRoles(roles.filter((role) => role !== RoleName.CuratorThesisEmbargo));
                } else {
                  updateRoles([...roles, RoleName.CuratorThesis, RoleName.CuratorThesisEmbargo]);
                }
              }}
            />
          </Box>
        </>
      )}
    </section>
  );
};
