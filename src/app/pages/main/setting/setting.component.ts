import {Component, OnInit} from '@angular/core';
import {SettingService} from '../../../core/setting.service';
import {HostConfigModel} from '../../../core/config.model';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {

  locked = true;
  validateForm: FormGroup;

  beforeUpload = (file: any): boolean => {
    // 新建一个FileReader来读取文件
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt: any) => { // 读取完文件之后会回来这里
      const fileString = evt.target.result; // 读取文件内容
      let config = null;
      try {
        config = JSON.parse(fileString);
        this.settingService.saveConfig(config);
        this.validateForm.patchValue(config);
        this.changeLockStatus(true);
        this.nzMessageService.success(`导入成功！`);
      } catch (e) {
        console.log('导入配置失败：', e);
        this.nzMessageService.warning(`导入失败！`);
      }
    };
    return false;
  };

  constructor(private fb: FormBuilder,
              private nzMessageService: NzMessageService,
              private settingService: SettingService) {
    this.validateForm = this.fb.group({
      accessKey: [null, [Validators.required]],
      secretKey: [null, [Validators.required]],
      bucket: [null, [Validators.required]],
      folder: [null],
      protocol: ['http://', [Validators.required]],
      domain: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    const config = this.settingService.getConfig();
    if (config != null) {
      this.validateForm.patchValue(config);
      this.changeLockStatus(true);
    } else {
      this.changeLockStatus(false);
    }
  }

  submitForm() {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }
    const config = this.validateForm.value;
    this.settingService.saveConfig(config);
    this.nzMessageService.success('保存成功！');
    this.changeLockStatus(true);
  }

  exportConfig() {
    const config = this.settingService.getConfig();
    if (config == null) {
      this.nzMessageService.error('当前无配置信息可以导出');
      return;
    }
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(config)]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    link.click();
  }

  changeLockStatus(locked: boolean) {
    // 动态设置formControl的disable状态
    for (const key in this.validateForm.controls) {
      if (locked) {
        this.validateForm.controls[key].disable();
      } else {
        this.validateForm.controls[key].enable();
      }
    }
    this.locked = locked;
  }


}
