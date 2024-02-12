// eslint-disable-next-line import/no-extraneous-dependencies
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserMe, UserRole } from '@/types/user/user.type';
import { AdminPermissionId } from '@/constants/userPermissions';

/**
 * @param userPermissions contains details about logged in user permissions
 */
export const defineAbilitiesFor = (userPermissions: UserRole[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  userPermissions.forEach(userPermission => {
    can(userPermission.permission.action, userPermission.permission.subject);
  });

  return build();
};

export const hasAdminPortalAccessPermission = (
  userPermissions?: UserMe['userPermissions'],
) => {
  return userPermissions?.some(
    permission =>
      permission.permissionId === AdminPermissionId.All ||
      permission.permissionId === AdminPermissionId.AdminPortalManage,
  );
};
