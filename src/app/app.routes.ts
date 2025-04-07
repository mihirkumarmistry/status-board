import { Routes } from '@angular/router';
import { UnauthorizedComponent } from '@web/other/unauthorized/unauthorized.component';
import { GuestComponent } from '@layouts/guest/guest.component';
import { UserLayoutComponent } from '@layouts/user-layout/user-layout.component';
import { AppRoutes } from '@shared/routes/routes.model';
import { AuthGuard } from '@core/guards/auth.guard';

const appRoutes = AppRoutes;

export enum SystemUserType
{
  User = "USER",
  Admin = "ADMIN",
  Master = "MASTER"
}

export const routes: Routes = [
    {
      path: '',
      component: UserLayoutComponent,
      children: [
        {
          path: '',
          redirectTo: `/${appRoutes.Dashboard}`,
          pathMatch: 'full'
        },
        // general
        {
          path: appRoutes.Dashboard,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/dashboard/dashboard.component').then((c) => c.DefaultComponent)
        },
        {
          path: appRoutes.StatusUpdate,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/update-status/update-status.component').then((c) => c.UpdateStatusComponent)
        },
        {
          path: appRoutes.Schedule,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/schedule/schedule.component').then((c) => c.ScheduleComponent)
        },
        {
          path: 'sample-page',
          loadComponent: () => import('./web/other/sample-page/sample-page.component')
        },
      ]
    },
    {
      path: '',
      component: GuestComponent,
      children: [
        {
          path: appRoutes.Login,
          loadComponent: () => import('./authentication/login/login.component')
        },
        {
          path: appRoutes.Register,
          loadComponent: () => import('./authentication/register/register.component')
        }
      ]
    },
    {
      path: appRoutes.Unauthorized,
      component: UnauthorizedComponent
    }
  ];
