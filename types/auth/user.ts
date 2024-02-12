export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RecoveryCodePayload {
  code: string;
  email: string;
}
export interface ResetPasswordPayload {
  code: string;
  email: string;
  newPassword: string;
}

export class LoginResponseDto {
  userData?: User;

  keycloakTokens?: KeycloakTokensDto;
}

export interface KeycloakTokensDto {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  id_token?: string;
  token_type?: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string | null;
  countryCode: string | null;
  contactNumber: string | null;
  passportNumber: string | null;
  nicNumber: string | null;
  dateOfBirth: Date | null;
  emailOtpId: string | null;
  emailVerified: boolean;
  emailOtpSentAt: Date | null;
  passwordResetOtpId: string | null;
  googleToken: string | null;
  facebookToken: string | null;
  instagramToken: string | null;
  appleToken: string | null;
  profileImageKey: string | null;
  preferredLocaleId: string;
  registrationStatus: string;
  createdAt: Date;
  updatedAt: Date;
  loginAt: Date;
}

export interface RefreshTokenResponseDto {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface VerifyRecoveryCodeExpirationDto {
  emailOtpSentAt: string;
  emailOtpExpiresAt: string;
}

export interface VerifyCodeRecoveryResponseDto {
  verified: boolean;
  user?: User;
  expirationData: VerifyRecoveryCodeExpirationDto;
}
