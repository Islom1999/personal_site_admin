import { Route } from '@angular/router'
import { initialDataResolver } from 'app/app.resolvers'
import { AuthGuard } from 'app/core/auth/guards/auth.guard'
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'
import { LayoutComponent } from 'app/layout/layout.component'
import { PermissionGuard } from './core/auth/guards/permission.guard'

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'admin-user' },

  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'admin-user' },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes'),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes'),
      },
      {
        path: 'unlock-session',
        loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes'),
      },
    ],
  },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      // {
      //   path: 'home',
      //   loadChildren: () => import('app/modules/landing/home/home.routes'),
      // },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: 'admin-permission',
        loadChildren: () => import('app/modules/admin/admin-permission/admin-permission.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'admin-role',
        loadChildren: () => import('app/modules/admin/admin-role/admin-role.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'admin-user',
        loadChildren: () => import('app/modules/admin/admin-user/admin-user.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'sp-level',
        loadChildren: () => import('app/modules/admin/sp-level/sp-level.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'sp-category',
        loadChildren: () => import('app/modules/admin/sp-category/sp-category.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'sp-materials',
        loadChildren: () => import('app/modules/admin/sp-materials/sp-materials.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'sp-courses',
        loadChildren: () => import('app/modules/admin/sp-courses/sp-courses.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'sp-tests',
        loadChildren: () => import('app/modules/admin/sp-tests/sp-tests.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
      {
        path: 'translation',
        loadChildren: () => import('app/modules/admin/translations/translations.routes'),
        canActivate: [PermissionGuard],
        data: {
          permissions: ['super'],
        },
      },
    ],
  },
]
