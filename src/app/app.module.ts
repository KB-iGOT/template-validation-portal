import { NgModule } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import your custom modules
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { TemplateModule } from './modules/template/template.module';
import { MaterialModule } from './material.module';

// Import Angular Material components
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// Import third-party modules
import { ToastrModule } from 'ngx-toastr';

// Import your components
import { AppComponent } from './app.component';
// import { TemplateSolutionListComponent } from './modules/template/template-solution-list/template-solution-list.component';

@NgModule({
  declarations: [
    AppComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    TemplateModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatTableModule, // Import MatTableModule if not already included
    MatPaginatorModule, // Import MatPaginatorModule here
    ToastrModule.forRoot({ 
      positionClass: 'toast-top-center'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
