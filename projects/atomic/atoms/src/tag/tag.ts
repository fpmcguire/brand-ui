import { Component } from '@angular/core';

/** Small accent label. Content is projected; the tag has no inputs and no semantics of its own. */
@Component({
  selector: 'bui-tag',
  template: '<ng-content />',
  styleUrl: './tag.scss',
})
export class Tag {}
