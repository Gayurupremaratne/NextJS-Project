import { SelectedPermission } from '@/types/role/role.type';
import _ from 'lodash';
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

// check if two arrays of objects are equal
export function areArraysOfObjectsEqual(
  arr1: SelectedPermission[],
  arr2: SelectedPermission[],
): boolean {
  if (!_.isEqual(arr1, arr2)) {
    return false; // Different lengths, not the same
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].permissionId !== arr2[i].permissionId) {
      return false; // Different name values, not the same
    }
  }

  return true; // All names are the same
}
