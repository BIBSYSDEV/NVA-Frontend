import classnames from 'classnames';
import React, { ReactNode } from 'react';

export interface UserCardProps {
  headerLabel: string;
  subHeaderLabel?: string;
  className: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headerLabel, subHeaderLabel, className, children }) => (
  <div className={classnames('card', className)}>
    <div className="header">{headerLabel}</div>
    {subHeaderLabel && <div className="card__sub-header">{subHeaderLabel}</div>}
    {children && <div className="card-content">{children}</div>}
  </div>
);

export default UserCard;
