import { ReactNode } from 'react';
import { TasksPageLayout } from './TasksPageLayout';

interface NviSearchPageLayoutProps {
  headline: string;
  headtitle?: string;
  children?: ReactNode;
}

export const NviSearchPageLayout = ({ headline, headtitle, children }: NviSearchPageLayoutProps) => {
  return (
    <TasksPageLayout headline={headline} headtitle={headtitle}>
      {children}
    </TasksPageLayout>
  );
};
