import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { AuthGuard } from './services/auth/auth-guard.service';
import { CourseComponent } from './views/course/course.component';

const appRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'course',
        component: CourseComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'course/completed',
        data: { completed : true },
        component: CourseComponent,
        canActivate: [AuthGuard]
    }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
