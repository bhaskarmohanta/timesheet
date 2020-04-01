import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewtsComponent } from './viewts/viewts.component';
import { EmpLeaveComponent } from './emp-leave/emp-leave.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'viewts',
        component: ViewtsComponent,
        children: [
          { path: '', redirectTo: '/dashboard/viewts', pathMatch: 'full' }
        ]
      },
      {
        path: 'empleave',
        component: EmpLeaveComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
