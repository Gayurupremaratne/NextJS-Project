import { RoleResponse } from '../role/role.type';

export type RegistrationStatus =
  | 'PENDING_ACCOUNT'
  | 'PENDING_VERIFICATION'
  | 'PENDING_EMERGENCY'
  | 'PENDING_CONSENT'
  | 'COMPLETE'
  | 'PENDING_SOCIAL_ACCOUNT';

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  countryCode: string;
  contactNumber: string;
  contactNumberNationalityCode: string;
  passportNumber: string;
  nicNumber: string;
  dateOfBirth: Date;
  isGoogle: boolean;
  isFacebook: boolean;
  isApple: boolean;
  profileImageKey?: string;
  preferredLocaleId: string;
  registrationStatus: RegistrationStatus;
  role: RoleResponse;
  createdAt: Date;
  updatedAt: Date;
  loginAt: Date;
  roleId: string;
  emailVerified?: boolean;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  countryCode?: string | null;
  contactNumber?: string | null;
  contactNumberNationalityCode?: string | null;
  passportNumber?: string | null;
  nicNumber?: string | null;
  dateOfBirth?: string | null;
  profileImageKey?: string;
  preferredLocaleId: string;
  role_id: string | undefined;
  emergencyContactNumber: string;
  emergencyContactNumberNationalityCode: string | null;
  emergencyContactFullName: string;
  emergencyContactCountryCode: string;
  emergencyContactRelationship: string;
}
export interface UserImageData {
  profileImageKey?: string;
  image?: File;
}
export interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  countryCode?: string | null;
  contactNumber?: string | null;
  contactNumberNationalityCode?: string | null;
  passportNumber?: string | null;
  nicNumber?: string | null;
  dateOfBirth?: string | null;
  profileImageKey?: string | null;
  preferredLocaleId: string;
  role_id?: string;
}
export interface UserPermission {
  id: number;
  action: string;
  permissionName: string;
  subject: string;
  inverted: boolean;
  conditions: string | null;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserRole {
  id: number;
  roleId: number;
  permissionId: number;
  permission: UserPermission;
}

export interface UserMe {
  apiData: UserResponse;
  userPermissions: UserRole[];
}

export interface UserEmail {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserTrailTrackingSummary {
  totalCompletedStages: number;
  totalDuration: number;
  totalDistanceTraveled: number;
  totalStages: number;
  totalAwardedBadges: number;
}
export interface UserChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
