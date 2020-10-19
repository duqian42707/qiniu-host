import {Injectable, APP_INITIALIZER, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import {preloaderFinished} from './preloader/preloader';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor() {
  }

  load(): Promise<any> {
    preloaderFinished();
    return new Promise<any>((resolve, reject) => resolve(true));
  }

}


// Provider 工厂
export function StartupServiceFactory(startupService: StartupService): () => void {
  return () => startupService.load();
}


// Provier认证服务集合->注入了工厂->工厂又调用了load()->load调用代理的auth() 完成初始化认证操作
export const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];
