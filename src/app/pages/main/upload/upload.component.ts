import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {QiniuServerService} from '../../../qiniu-server.service';
import * as qiniu from 'qiniu-js';
import {SettingService} from '../../../core/setting.service';
import {HostConfigModel} from '../../../core/config.model';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  fileGraging = 0;
  process: number;
  src: string;
  markdownStr: string;
  config: HostConfigModel;

  constructor(private qiniuServerService: QiniuServerService,
              private router: Router,
              private nzMessageService: NzMessageService,
              private nzModalService: NzModalService,
              private settingService: SettingService) {
  }

  ngOnInit() {
    this.config = this.settingService.getConfig();
    if (this.config == null) {
      this.nzModalService.warning({
        nzTitle: '提示',
        nzContent: '请先进行相关配置',
        nzOnOk: () => {
          this.router.navigateByUrl('/setting');
        }
      });
    }

    // 绑定粘贴事件
    document.onpaste = (event: any) => {
      console.log('粘贴了', event);
      let isChrome = false;
      if (event.clipboardData || event.originalEvent) {
        // not for ie11  某些chrome版本使用的是event.originalEvent
        const clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData.items) {
          // for chrome
          const items = clipboardData.items;
          const len = items.length;
          let blob = null;
          isChrome = true;
          // items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
          // 如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
          // 如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
          // 如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
          // console.log('len:' + len);
          // console.log(items[0]);
          // console.log(items[1]);
          // console.log( 'items[0] kind:', items[0].kind );
          // console.log( 'items[0] MIME type:', items[0].type );
          // console.log( 'items[1] kind:', items[1].kind );
          // console.log( 'items[1] MIME type:', items[1].type );

          // 阻止默认行为即不让剪贴板内容在div中显示出来
          event.preventDefault();

          // 在items里找粘贴的image,据上面分析,需要循环
          for (let i = 0; i < len; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              // console.log(items[i]);
              // console.log( typeof (items[i]));

              // getAsFile() 此方法只是living standard firefox ie11 并不支持
              blob = items[i].getAsFile();
            }
          }
          if (blob !== null) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              // event.target.result 即为图片的Base64编码字符串
              const base64Str = e.target.result;
              // 可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
              this.uploadImgFromPaste(base64Str, 'paste', isChrome);
            };
            reader.readAsDataURL(blob);
          }
        } else {
          // for firefox
          setTimeout(() => {
            // 设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
            const imgList = document.querySelectorAll('#tar_box img') as any;
            const len = imgList.length;
            let srcStr = '';
            let i;
            for (i = 0; i < len; i++) {
              if (imgList[i].className !== 'my_img') {
                // 如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                srcStr = imgList[i].src;
              }
            }
            this.uploadImgFromPaste(srcStr, 'paste', isChrome);
          }, 1);
        }
      } else {
        // for ie11
        setTimeout(() => {
          const imgList = document.querySelectorAll('#tar_box img') as any;
          const len = imgList.length;
          let srcStr = '';
          let i;
          for (i = 0; i < len; i++) {
            if (imgList[i].className !== 'my_img') {
              srcStr = imgList[i].src;
            }
          }
          this.uploadImgFromPaste(srcStr, 'paste', isChrome);
        }, 1);
      }
    };
  }

  ngOnDestroy() {
    document.onpaste = null;
  }

  fileButtonClick() {
    this.fileInput.nativeElement.click();
  }

  // 选择文件上传
  fileChange(evt) {
    const file = evt.target.files[0];
    const key = this.generateFileKey(file.name);
    this.upload(file, key);
  }

  ondragover(evt) {
    // 阻止默认的事件
    evt.preventDefault();
  }

  ondragenter(evt) {
    evt.preventDefault();
    this.fileGraging++;
  }


  dragleave(evt) {
    evt.preventDefault();
    this.fileGraging--;
  }

  // 拖动文件上传
  ondrop(evt) {
    evt.preventDefault();
    this.fileGraging = 0;
    // 获取到第一个上传的文件对象
    const file = evt.dataTransfer.files[0];
    const key = this.generateFileKey(file.name);
    this.upload(file, key);
  }

  // 从剪贴板粘贴上传
  uploadImgFromPaste(fileStr, type, isChrome) {
    console.log('pasteUpload');
    const fileKey = this.generateFileKey();
    const file = this.convertBase64UrlToBlob(fileStr, fileKey);
    this.upload(file, fileKey);
  }

  generateFileKey(originName?: string): string {
    let suffix = '.png';
    if (originName && originName.lastIndexOf('.') > -1) {
      const index = originName.lastIndexOf('.');
      suffix = originName.substring(index);
    }
    const fileName = new Date().getTime() + suffix;
    const key = this.config.folder + '/' + this.dateFormat() + '/' + fileName;
    return key;
  }

  /**
   * 将以base64的图片url数据转换为Blob
   * @param urlData
   *            用url方式表示的base64图片数据
   */
  convertBase64UrlToBlob(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  upload(file: File, key: string) {
    const token = this.qiniuServerService.generateToken(this.config.accessKey, this.config.secretKey, this.config.bucket);
    const putExtra = {};
    const config = {};

    const observable = qiniu.upload(file, key, token, putExtra, config);
    const that = this;
    const subscription = observable.subscribe({
      next(res) {
        that.process = res.total.percent;
      },
      error(err) {
      },
      complete(res) {
        that.src = that.config.protocol + that.config.domain + '/' + res.key;
        that.markdownStr = `![](${that.src})`;
      }
    });
  }

  dateFormat() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = month < 10 ? '0' + month : '' + month;
    const day = date.getDate();
    const dayStr = day < 10 ? '0' + day : '' + day;
    return [year, monthStr, dayStr].join('/');
  }

  cpSuccess() {
    this.nzMessageService.success('复制成功');
  }

  openUrl() {
    window.open(this.src);
  }

}
