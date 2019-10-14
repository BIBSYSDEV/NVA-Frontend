import '../../styles/user.scss';

import React, { useEffect, useState } from 'react';
import { RoleName } from '../../types/user.types';
import { useTranslation } from 'react-i18next';
import { Icon } from '@material-ui/core';

export interface IconLabelTextLineProps {
  role: RoleName;
  dataCy?: string;
}

const IconLabelTextLine: React.FC<IconLabelTextLineProps> = ({ role, dataCy }) => {
  const { t } = useTranslation();
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (role === RoleName.PUBLISHER) {
      setIcon('create');
      setDescription(
        'Utgiver er den tilgangen ansatte på institusjonen har. Gir tilgang til å registrere egne publikasjoner'
      );
    } else if (role === RoleName.CURATOR) {
      setIcon('all_inbox');
      setDescription('Kurator er tilgangen alle som kan godkjenne og publisere for andre har');
    }
  }, [role]);

  return (
    <div className="line">
      <Icon>{icon}</Icon>
      <div className="icon"></div>
      <div className="label" data-cy={dataCy}>
        {t(role)}
      </div>
      <div className="value">{description}</div>
    </div>
  );
};
export default IconLabelTextLine;
