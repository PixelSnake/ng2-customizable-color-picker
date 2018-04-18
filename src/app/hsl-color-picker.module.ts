import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'


import { HSLColorPickerComponent } from './hsl-color-picker.component'
import { AppRootComponent } from './app-root.component'
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    AppRootComponent,
    HSLColorPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    HSLColorPickerComponent
  ],
  providers: [],
  bootstrap: [AppRootComponent]
})
export class HSLColorPickerModule {
}
