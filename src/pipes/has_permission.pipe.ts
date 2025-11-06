import { inject, Pipe, PipeTransform } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { UserService } from 'app/core/user/user.service'

@Pipe({
  name: 'hasPermission',
  standalone: true,
})
export class HasPermissionPipe implements PipeTransform {
  private _userService = inject(UserService)
  private permissions = toSignal(this._userService.permissions$)
  private lastCheck: boolean = false
  private lastPermissions: string[] = []

  transform(requiredPermissions: string[] | string, mode: 'some' | 'every' = 'some'): boolean {
    // 🔹 Agar string kelsa, massivga o‘giramiz
    const required = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions]

    const userPermissions = this.permissions() // 🔹 signal yoki getter (massiv bo‘lishi kerak)

    if (!userPermissions || userPermissions.length === 0) return false
    if (!required || required.length === 0) return false

    if (mode === 'every') {
      this.lastCheck = required.every((perm) => userPermissions.includes(perm))
    } else {
      this.lastCheck = required.some((perm) => userPermissions.includes(perm))
    }

    return this.lastCheck
  }
}
