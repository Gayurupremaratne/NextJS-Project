import { ModifiedPermission, SelectedPermission } from '@/types/role/role.type';
import * as yup from 'yup';

//create role form validation
export const createRoleValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z0-9_-]*$/,
      'Role name should only contain letters, numbers, hyphens, and underscores',
    )
    .required('Please enter a role name'),
});

// if id is 1 then disable all the checkboxes related to all the subjects and uncheck them
// because this is the super admin role

export const SUPER_ADMIN_ROLE_ID = 1;

export const handleSuperAdminRoleChange = (
  permissionId: number,
  selectedPermissions: SelectedPermission[],
  setSelectedPermissions: (selectedPermissions: SelectedPermission[]) => void,
  allPermissions: ModifiedPermission[] | undefined,
) => {
  if (permissionId !== SUPER_ADMIN_ROLE_ID) {
    return;
  }

  if (
    selectedPermissions.some(
      selectedPermission =>
        selectedPermission.permissionId === SUPER_ADMIN_ROLE_ID,
    )
  ) {
    setSelectedPermissions([]);
    setSelectedPermissions([{ permissionId: SUPER_ADMIN_ROLE_ID }]);

    allPermissions?.map(perm => {
      const newPerm = { ...perm };

      if (newPerm.manage.id !== SUPER_ADMIN_ROLE_ID) {
        newPerm.manage.active = false;
      }

      newPerm.read.active = false;
      newPerm.create.active = false;
      newPerm.update.active = false;
      newPerm.delete.active = false;

      return newPerm;
    });

    return;
  }

  allPermissions?.map(perm => {
    const newPerm = { ...perm };

    newPerm.manage.active = true;
    newPerm.read.active = true;
    newPerm.create.active = true;
    newPerm.update.active = true;
    newPerm.delete.active = true;

    return newPerm;
  });
};

// if any of the read, create, update, delete is checked that is related to this permission
// then uncheck them, because manage is checked (manage has all the permissions)
// and disable them by making permission.manage.active = false,
// and if manage is unchecked, then enable them by making permission.manage.active = true

export const handleManageCheckboxChange = (
  permission: ModifiedPermission,
  selectedPermissions: SelectedPermission[],
  setSelectedPermissions: React.Dispatch<
    React.SetStateAction<SelectedPermission[]>
  >,
) => {
  const isSelected = selectedPermissions.some(
    selectedPermission =>
      selectedPermission.permissionId === permission.manage.id,
  );

  if (!isSelected) {
    permission.read.active = true;
    permission.create.active = true;
    permission.update.active = true;
    permission.delete.active = true;
    return;
  }

  permission.read.active = false;
  permission.create.active = false;
  permission.update.active = false;
  permission.delete.active = false;

  if (
    selectedPermissions.some(
      selectedPermission =>
        selectedPermission.permissionId === permission.read.id ||
        selectedPermission.permissionId === permission.create.id ||
        selectedPermission.permissionId === permission.update.id ||
        selectedPermission.permissionId === permission.delete.id,
    )
  ) {
    setSelectedPermissions(prevState =>
      prevState.filter(
        selectedPermission =>
          selectedPermission.permissionId !== permission.read.id &&
          selectedPermission.permissionId !== permission.create.id &&
          selectedPermission.permissionId !== permission.update.id &&
          selectedPermission.permissionId !== permission.delete.id,
      ),
    );
  }
};
