import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const requiredPermissions = route.data['permissions'] as string[]

    return this.userService.permissions$.pipe(
      map((userPermissions: string[]) => {
        const hasPermission = userPermissions?.some((p: string) => requiredPermissions.includes(p))

        if (hasPermission) {
          return true
        } else {
          // agar ruxsat bo‘lmasa login yoki 403 pagega yuborish
          return this.router.parseUrl('/403')
        }
      }),
    )
  }
}