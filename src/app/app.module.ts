import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { Ng2ColorPickerComponent } from './ng2-color-picker.component';
import { AppRootComponent } from './app-root.component'


@NgModule({
  declarations: [
    AppRootComponent,
    Ng2ColorPickerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
