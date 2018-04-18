import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { Ng2ColorPickerComponent } from './hsl-color-picker.component';
import { AppRootComponent } from './app-root.component'
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    AppRootComponent,
    Ng2ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    Ng2ColorPickerComponent
  ],
  providers: [],
  bootstrap: [AppRootComponent]
})
export class HSLColorPickerModule { }
