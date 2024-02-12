export interface OnboardingGuidelineResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  countryCode: string;
  contactNumber: string;
  passportNumber: string;
  nicNumber: string;
  dateOfBirth: Date;
  profileImageKey: string;
  preferredLocaleId: string;
  registrationStatus: string;
  createdAt: Date;
  updatedAt: Date;
  loginAt: Date;
  roleId: number;
}
