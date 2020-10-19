import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less'],
  animations: [
    trigger('contentPaddingAnimation', [ // 右侧内容内边距动画
      state('block', style({paddingLeft: '256px'})),
      state('none', style({paddingLeft: '80px'})),
      transition('none => block', animate('.15s ease-in')),
      transition('block => none', animate('.15s ease-out'))
    ]),
  ]
})
export class MainLayoutComponent implements OnInit {
  siderCollapseWidth = '256px';
  siderExpandWidth = '80px';
  isCollapsed = false;

  constructor() {
  }

  ngOnInit() {
  }

}
