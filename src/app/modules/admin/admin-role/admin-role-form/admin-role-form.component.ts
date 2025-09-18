import { ChangeDetectorRef, Component, effect, inject, Inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { IAdminRole } from '../common/admin-role.model'
import { AdminRoleService } from '../common/admin-role.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { AdminPermissionService } from '../../admin-permission/common/admin-parmission.service'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'

@Component({
  selector: 'app-admin-role-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './admin-role-form.component.html',
  styleUrl: './admin-role-form.component.scss',
})
export class AdminRoleFormComponent {
  private $service = inject(AdminRoleService)
  private $adminPermissionService = inject(AdminPermissionService)
  private $cdr = inject(ChangeDetectorRef)
  dialogRef = inject(MatDialogRef<AdminRoleFormComponent>)
  fb = inject(FormBuilder)

  permissions = toSignal(this.$adminPermissionService.getAll(), {
    initialValue: [],
  })

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    admin_role_permissions: this.fb.array([], Validators.required),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { adminRole?: IAdminRole }) {
    if (data?.adminRole) {
      this.form.patchValue({
        ...data.adminRole,
      })

      const array = this.form.get('admin_role_permissions') as FormArray
      array.clear()

      if (data?.adminRole?.admin_role_permissions?.length) {
        data.adminRole.admin_role_permissions.forEach((item) => {
          array.push(
            this.fb.group({
              permission_id: [item.permission_id, Validators.required],
            }),
          )
        })
        console.log(array)

        this.$cdr.markForCheck()
      }
    }
  }

  onPermissionSelect(event: MatSelectChange) {
    const selected = event.value as string[]
    const formArray = this.form.get('admin_role_permissions') as FormArray
    formArray.clear()

    for (const id of selected) {
      formArray.push(this.fb.group({ permission_id: [id] }))
    }
  }

  getSelectedPermissionIds(): string[] {
    const formArray = this.form.get('admin_role_permissions') as FormArray
    return formArray.controls.map((ctrl) => ctrl.value.permission_id)
  }

  submit() {
    if (this.form.valid) {
      if (this.data.adminRole) {
        this.$service.update(this.data.adminRole.id, this.form.value as any).subscribe({
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
    if (this.data.adminRole) {
      this.$service.delete(this.data.adminRole.id).subscribe({
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
