import {Injectable} from '@angular/core';
import {Base64} from 'js-base64';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class QiniuServerService {

  constructor() {
  }

  private urlsafe(src: string): string {
    return src.replace(/\+/g, '-').replace(/\//, '_');
  }

  private urlsafe_base64_encode(src): string {
    return this.urlsafe(Base64.encode(src));
  }

  private hmac_sha1(src, key) {
    return CryptoJS.HmacSHA1(src, key).toString(CryptoJS.enc.Base64);
  }

  /**
   * 构造上传凭证
   * https://developer.qiniu.com/kodo/manual/1208/upload-token
   */
  generateToken(accessKey: string, secretKey: string, bucket: string): string {
    // 1.构造上传策略
    const putPolicy = {
      scope: bucket,
      deadline: 3600 + Math.floor(Date.now() / 1000),
    };
    // 2.将上传策略序列化成为JSON：
    const policyJson = JSON.stringify(putPolicy);

    // 3.对 JSON 编码的上传策略进行URL 安全的 Base64 编码，得到待签名字符串：
    const encodedPutPolicy = this.urlsafe_base64_encode(policyJson);

    // 4.使用访问密钥（AK/SK）对上一步生成的待签名字符串计算HMAC-SHA1签名：
    const sign = this.hmac_sha1(encodedPutPolicy, secretKey);

    // 5.对签名进行URL安全的Base64编码：
    const encodedSign = this.urlsafe(sign);

    // 6.将访问密钥（AK/SK）、encodedSign 和 encodedPutPolicy 用英文符号 : 连接起来：
    const uploadToken = accessKey + ':' + encodedSign + ':' + encodedPutPolicy;

    return uploadToken;
  }


}
