import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IAdminPermission } from '../common/admin-parmission.model'
import { AdminPermissionService } from '../common/admin-parmission.service'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

@Component({
  selector: 'app-admin-permission-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './admin-permission-form.component.html',
  styleUrl: './admin-permission-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPermissionFormComponent {
  private $service = inject(AdminPermissionService)
  dialogRef = inject(MatDialogRef<AdminPermissionFormComponent>)
  fb = inject(FormBuilder)

  constructor(@Inject(MAT_DIALOG_DATA) public data: { adminPermission?: IAdminPermission }) {
    if (data?.adminPermission) {
      this.form.patchValue(data.adminPermission)
    }
  }

  form = this.fb.group({
    key: ['', Validators.required],
    name: ['', Validators.required],
  })

  submit() {
    if (this.form.valid) {
      if (this.data.adminPermission) {
        this.$service.update(this.data.adminPermission.id, this.form.value).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(this.form.value).subscribe({
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
    if (this.data.adminPermission) {
      this.$service.delete(this.data.adminPermission.id).subscribe({
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
