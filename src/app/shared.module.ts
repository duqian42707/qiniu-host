import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ClipboardModule} from 'ngx-clipboard';


// 自定义管道
const CUSTOM_PIPES = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ClipboardModule
  ],
  declarations: [
    ...CUSTOM_PIPES
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ClipboardModule,
    ...CUSTOM_PIPES
  ]
})
export class SharedModule {

}
