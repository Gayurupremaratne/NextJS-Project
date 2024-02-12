export interface StaticContent {
  fileName?: string;
  contentType?: string;
  module?: string;
  fileSize?: number;
}

export interface SignedUrl {
  s3Url: string;
  filePath: string;
  uniqueFileName: string;
}
