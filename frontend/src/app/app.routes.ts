import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './shared/components/public-layout.component';
import { AdminShellComponent } from './features/admin/shell/admin-shell.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component';
import { TeamSectionComponent } from './features/landing/team-section.component';
import { ProjectsSectionComponent } from './features/landing/projects-section.component';
import { AlliancesSectionComponent } from './features/landing/alliances-section.component';
import { ApplicationFormComponent } from './features/postulacion/application-form.component';
import { MyApplicationsComponent } from './features/mis-postulaciones/my-applications.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { ApplicationsListComponent } from './features/admin/applications-list/applications-list.component';
import { ApplicationDetailComponent } from './features/admin/application-detail/application-detail.component';
import { MetricsComponent } from './features/admin/metrics/metrics.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DIRECTOR_ROLES } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'ingresar', component: LoginComponent },
      { path: 'registrarse', component: RegisterComponent },
      { path: 'verificar-correo', component: VerifyEmailComponent },
      { path: 'olvide-contrasena', component: ForgotPasswordComponent },
      { path: 'restablecer-contrasena', component: ResetPasswordComponent },
      { path: 'equipo', component: TeamSectionComponent },
      { path: 'proyectos', component: ProjectsSectionComponent },
      { path: 'alianzas', component: AlliancesSectionComponent },
      { path: 'postular', component: ApplicationFormComponent, canActivate: [roleGuard(['POSTULANTE'])] },
      {
        path: 'mis-postulaciones',
        component: MyApplicationsComponent,
        canActivate: [roleGuard(['POSTULANTE'])],
      },
      { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [roleGuard(DIRECTOR_ROLES)],
    children: [
      { path: '', component: ApplicationsListComponent },
      { path: 'postulaciones/:id', component: ApplicationDetailComponent },
      { path: 'metricas', component: MetricsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
