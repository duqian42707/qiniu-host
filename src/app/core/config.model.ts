export interface HostConfigModel {
  accessKey: string;
  secretKey: string;
  bucket: string;
  folder: string;
  protocol: 'http://' | 'https://';
  domain: string;
}
