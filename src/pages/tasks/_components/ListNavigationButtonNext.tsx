import { LinkProps } from 'react-router';
import { NavigationIconButton } from '../../../components/_atoms/buttons/NavigationIconButton';
import { dataTestId as testIds } from '../../../utils/dataTestIds';

interface ListNavigationButtonNextProps extends Pick<LinkProps, 'to' | 'state' | 'replace'> {
  title: string;
  dataTestId?: string;
}

export const ListNavigationButtonNext = ({
  to,
  state,
  replace,
  title,
  dataTestId = testIds.tasksPage.nextItemButton,
}: ListNavigationButtonNextProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId}
      to={to}
      state={state}
      replace={replace}
      title={title}
      navigateTo={'next'}
      sx={{
        position: 'absolute',
        top: '20rem',
        right: '-1rem',
      }}
    />
  );
};
