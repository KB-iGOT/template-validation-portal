import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { TemplateModule } from './modules/template/template.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    SharedModule,
    TemplateModule,
    MaterialModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTableModule, 
    MatPaginatorModule,
    ToastrModule.forRoot({ 
      positionClass: 'toast-top-center'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
