import { Component } from '@angular/core'
import { Color } from './classes/color'

@Component({
  selector: 'cp-root',
  template: `
    <cp-ng2-color-picker [(ngModel)]="color"></cp-ng2-color-picker>
    <p [style.background]="color.toString()">--> {{ color?.toString() }}</p>
    <p [style.background]="color2.toString()">--> {{ color2?.toString() }}</p>
    <pre>{{ color | json }}</pre>
  `
})
export class AppRootComponent {
  color: Color = Color.fromHSL(123, 70, 80)
  color2: Color = Color.fromHSL(90, 70, 80)
}
