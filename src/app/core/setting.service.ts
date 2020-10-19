import {Injectable} from '@angular/core';
import {HostConfigModel} from './config.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  configSaveKey = '_config_';

  constructor() {
  }

  saveConfig(config: HostConfigModel) {
    localStorage.setItem(this.configSaveKey, JSON.stringify(config));
  }

  getConfig(): HostConfigModel {
    const str = localStorage.getItem(this.configSaveKey);
    if (str) {
      return JSON.parse(str);
    } else {
      return null;
    }
  }

}
