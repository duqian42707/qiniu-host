import {NgModule} from '@angular/core';
import {NZ_ICONS} from 'ng-zorro-antd';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  DownloadOutline,
  UploadOutline,
  LockOutline,
  UnlockOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, UploadOutline, DownloadOutline, LockOutline, UnlockOutline
];

@NgModule({
  providers: [
    {provide: NZ_ICONS, useValue: icons}
  ]
})
export class IconsProviderModule {
}
