import {NgModule} from '@angular/core';

import {MainRoutingModule} from './main-routing.module';
import {SharedModule} from '../../shared.module';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {UploadComponent} from './upload/upload.component';
import {ViewComponent} from './view/view.component';
import {SettingComponent} from './setting/setting.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    UploadComponent,
    ViewComponent,
    SettingComponent,
  ],
  imports: [
    SharedModule,
    MainRoutingModule
  ],

})
export class MainModule {
}
