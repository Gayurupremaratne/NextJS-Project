import { Subject, UserActions } from '@/constants/userPermissions';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useUserAbilityStore } from '@/store/permission/useUserAbilityStore';
import { Can } from '@casl/react';
import { ReactNode } from 'react';
import Forbidden from '../forbidden/forbidden';

interface Props {
  a: Subject;
  I: UserActions;
  isForbidden?: boolean;
  children: ReactNode;
}

const CustomCan = ({ a, I, isForbidden = false, children }: Props) => {
  //CASL - Get user abilities
  const userAbilityState = useUserAbilityStore(state => state.abilities);
  const { userPermissionsFetched } = useAuthStore.getState();

  return (
    <>
      {userPermissionsFetched && (
        <>
          {isForbidden && (
            <Can a={a} ability={userAbilityState} I={I} not>
              <Forbidden />
            </Can>
          )}
          <Can a={a} ability={userAbilityState} I={I}>
            {children}
          </Can>
        </>
      )}
    </>
  );
};

export default CustomCan;
