import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {UploadComponent} from './upload/upload.component';
import {ViewComponent} from './view/view.component';
import {SettingComponent} from './setting/setting.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/upload', pathMatch: 'full'},
      {path: 'upload', component: UploadComponent},
      {path: 'view', component: ViewComponent},
      {path: 'setting', component: SettingComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
