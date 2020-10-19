// L I B R E R Í A S __ A D I C I O N A L E S
// Importación de librería con clases de la extensión ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';
import { FileSelectDirective } from 'ng2-file-upload';
// Importación de forms, para el input y submiteo del archivo.
import { FormsModule } from '@angular/forms';
// Animación de Intercambio
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// Material Input y Field
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
// I M P O R T A C I O N E S __  I N I C I A L E S
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// C O M P O N E N T E S
import { AppComponent } from './app.component';
import { DespachadorComponent } from './despachador/despachador.component';
@NgModule({
  declarations: [
    AppComponent,
    DespachadorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
