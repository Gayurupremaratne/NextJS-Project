export interface AccountDeleteConfirmResponse {
  statusCode: number;
  data: AccountDeleteConfirm;
}

export interface AccountDeleteConfirm {
  userId: string;
  token: string;
}
