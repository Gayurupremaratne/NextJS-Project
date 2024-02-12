import { IGetUserBadges } from '@/types/badge/badge.type';
import * as yup from 'yup';

export const assignBadgeToUserValidation = (
  specialBadgesData: IGetUserBadges[],
) => {
  const schema = yup.object().shape({
    badgeId: yup
      .string()
      .trim()
      .test('valid badge', 'Badge already assigned', async function (value) {
        if (value) {
          for (let i = 0; i < specialBadgesData.length; i++) {
            if (specialBadgesData[i].badgeId === value) {
              return false; // Badge is already assigned
            }
          }
        }
        return true;
      })
      .required('Please select a badge'),
  });

  return schema;
};
