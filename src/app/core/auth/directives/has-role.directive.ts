import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core'
import { AuthService } from '../auth.service'
import { UserService } from 'app/core/user/user.service'

@Directive({
  selector: '[hasPermissions]',
  standalone: true,
})
export class HasPermissionDirective {
  @Input() set hasPermissions(permissions: string[]) {
    this.userService.permissions$.subscribe((userSermissions) => {
      const hasPermission = userSermissions?.some((p: string) => permissions.includes(p))

      if (hasPermission) {
        this.vcr.createEmbeddedView(this.tpl)
      } else {
        this.vcr.clear()
      }
    })
  }

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService,
    private userService: UserService,
  ) {}
}
