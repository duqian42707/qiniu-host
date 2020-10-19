import {Component} from '@angular/core';
import {QiniuServerService} from './qiniu-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(private qiniuServerService: QiniuServerService) {
  }

}
