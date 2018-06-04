import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { AppointmentListComponent } from './cal-utils/appointment-list/appointment-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './core/auth.guard';
import { ChartsComponent } from './cal-utils/charts/charts.component'
import { ClientInputComponent } from './cal-utils/client/client-input/client-input.component';
import { ClientListComponent } from './cal-utils/client/client-list/client-list.component';
import { ClientAutofillComponent} from './cal-utils/client/client-autofill/client-autofill.component';


const routes: Routes = [
    { path: 'welcome', component: MyCalendarComponent, canActivate: [AuthGuard] },
    { path: 'ragister', component: AppointmentListComponent, canActivate: [AuthGuard] },
    { path: 'charts', component: ChartsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent },
    { path: 'clientEdit/:id', component: ClientInputComponent },
    { path: 'clientList', component: ClientListComponent },
    { path: 'clientAutofill', component: ClientAutofillComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full', canActivate: [AuthGuard] }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
