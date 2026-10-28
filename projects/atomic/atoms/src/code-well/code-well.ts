import { Component } from '@angular/core';

/** Generic code well. The projected text is shown exactly as supplied. */
@Component({
  selector: 'bui-code-well',
  template: '<pre class="code"><code><ng-content /></code></pre>',
  styleUrl: './code-well.scss',
})
export class CodeWell {}
