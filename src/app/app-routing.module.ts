import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'template',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/template/template.module').then(m => m.TemplateModule)
  },
  {
    path: '',
    redirectTo: window['env' as any]['customAuth' as any] ? 'template' : 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: window['env' as any]['customAuth' as any] ? 'template' : 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
