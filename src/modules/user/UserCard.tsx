import React, { ReactNode } from 'react';
import classnames from 'classnames';

export interface UserCardProps {
  headerLabel: string;
  subHeaderLabel?: string;
  className: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headerLabel, subHeaderLabel, className, children }) => (
  <div className={classnames('card', className)}>
    <h2>{headerLabel}</h2>
    {subHeaderLabel && <h3>{subHeaderLabel}</h3>}
    {children && <div className="card-content">{children}</div>}
  </div>
);

export default UserCard;
