import { LinkProps } from 'react-router';
import { NavigationIconButton } from '../../../components/_atoms/buttons/NavigationIconButton';
import { dataTestId as testIds } from '../../../utils/dataTestIds';

interface ListNavigationButtonBackProps extends Pick<LinkProps, 'to' | 'state' | 'replace'> {
  title: string;
  dataTestId?: string;
}

export const ListNavigationButtonBack = ({
  to,
  state,
  replace,
  title,
  dataTestId = testIds.tasksPage.previousItemButton,
}: ListNavigationButtonBackProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId}
      to={to}
      state={state}
      replace={replace}
      title={title}
      navigateTo={'previous'}
      sx={{
        position: 'absolute',
        top: '20rem',
        left: '-1rem',
      }}
    />
  );
};
