export interface AccountDeleteRequest {
  statusCode: number;
  data: AccountDeleteResData;
}

export interface AccountDeleteReqData {
  email: string;
}

export interface AccountDeleteResData {
  userId: string;
}
