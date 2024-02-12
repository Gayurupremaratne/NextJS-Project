export interface EmergencyContactPayload {
  userId: string;
  countryCode?: string | null;
  name?: string | null;
  contactNumber?: string | null;
  contactNumberNationalityCode?: string | null;
  relationship?: string | null;
}

export interface EmergencyContactResponse {
  userId: string;
  countryCode: string;
  name: string;
  contactNumber: string;
  contactNumberNationalityCode: string;
  relationship: string;
  createdAt: string;
  updatedAt: string;
}
