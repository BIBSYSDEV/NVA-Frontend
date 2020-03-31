import React, { FC, useState, useEffect } from 'react';
import InstitutionCard from './InstitutionCard';
import { FormikInstitutionUnit } from '../../../types/institution.types';
import NormalText from '../../../components/NormalText';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { getParentUnits } from '../../../api/institutionApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { useTranslation } from 'react-i18next';

interface InstitutionCardListProps {
  onEdit: () => void;
  open: boolean;
}

const InstitutionCardList: FC<InstitutionCardListProps> = ({ onEdit, open }) => {
  const authority = useSelector((state: RootStore) => state.user.authority);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const [units, setUnits] = useState<FormikInstitutionUnit[]>([]);

  useEffect(() => {
    const getUnitsForUser = async () => {
      let units: FormikInstitutionUnit[] = [];
      if (authority) {
        for (let orgunitid in authority.orgunitids) {
          const currentSubunitid = authority.orgunitids[orgunitid];
          const unit = await getParentUnits(currentSubunitid);
          if (!unit.error) {
            units.push(unit);
          }
        }
        if (authority.orgunitids.length > 0 && units.length === 0) {
          dispatch(setNotification(t('feedback:error.get_parent_units'), NotificationVariant.Error));
        }
      }
      setUnits(units);
    };
    if (authority && authority.orgunitids?.length > 0) {
      getUnitsForUser();
    } else {
      setUnits([]);
    }
  }, [authority, dispatch, t]);

  return (
    <>
      {units.length > 0
        ? units.map((unit: FormikInstitutionUnit, index: number) => (
            <InstitutionCard key={index} unit={unit} onEdit={onEdit} />
          ))
        : !open && <NormalText>{t('organization.no_institutions_found')}</NormalText>}
    </>
  );
};

export default InstitutionCardList;
