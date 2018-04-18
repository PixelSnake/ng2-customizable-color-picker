import { Component } from '@angular/core'
import { Color } from './classes/color'

@Component({
  selector: 'cp-root',
  template: `
    <hsl-color-picker [(ngModel)]="color"></hsl-color-picker>
    <p [style.background]="color.toString()">--> {{ color?.toString() }}</p>
    <p [style.background]="color2.toString()">--> {{ color2?.toString() }}</p>
    <pre>{{ color | json }}</pre>
  `
})
export class AppRootComponent {
  color: Color = Color.fromRGB(255, 0, 0)
  color2: Color = Color.fromHSL(90, 70, 80)
}
