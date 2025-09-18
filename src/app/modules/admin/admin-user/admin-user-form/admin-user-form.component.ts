import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { AdminPermissionService } from '../../admin-permission/common/admin-parmission.service'
import { IAdminUser } from '../common/admin-user.model'
import { AdminUserService } from '../common/admin-user.service'
import { AdminRoleService } from '../../admin-role/common/admin-role.service'

@Component({
  selector: 'app-admin-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss',
})
export class AdminUserFormComponent {
  private $service = inject(AdminUserService)
  private $AdminRoleService = inject(AdminRoleService)
  private $cdr = inject(ChangeDetectorRef)
  dialogRef = inject(MatDialogRef<AdminUserFormComponent>)
  fb = inject(FormBuilder)

  roles = toSignal(this.$AdminRoleService.getAll(), {
    initialValue: [],
  })

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    is_block: [false, Validators.required],
    password: [null],
    role_id: ['', Validators.required],
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { AdminUser?: IAdminUser }) {
    if (data?.AdminUser) {
      this.form.patchValue({
        ...data.AdminUser,
        password: null,
      })
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.data.AdminUser) {
        this.$service.update(this.data.AdminUser.id, this.form.value as any).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(this.form.value as any).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      }
    }
  }

  delete() {
    if (this.data.AdminUser) {
      this.$service.delete(this.data.AdminUser.id).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.log(err)
        },
      })
    }
  }
}
