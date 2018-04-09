import { Component } from '@angular/core'
import { Color } from './classes/color'

@Component({
  selector: 'cp-root',
  template: '<cp-ng2-color-picker [(ngModel)]="color"></cp-ng2-color-picker><p>--> {{ color?.toString() }}</p>'
})
export class AppRootComponent {
  color: Color = Color.fromHSL(123, 46, 13)
}
