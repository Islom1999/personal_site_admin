import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ISpLevel } from '../common/sp-level.model'
import { SpLevelService } from '../common/sp-level.service'

@Component({
  selector: 'app-sp-level-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './sp-level-form.component.html',
  styleUrl: './sp-level-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpLevelFormComponent {
  private $service = inject(SpLevelService)
  dialogRef = inject(MatDialogRef<SpLevelFormComponent>)
  fb = inject(FormBuilder)

  constructor(@Inject(MAT_DIALOG_DATA) public data: { spLevel?: ISpLevel }) {
    if (data?.spLevel) {
      this.form.patchValue(data.spLevel)
    }
  }

  form = this.fb.group({
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
  })

  submit() {
    if (this.form.valid) {
      if (this.data.spLevel) {
        this.$service.update(this.data.spLevel.id, this.form.value).subscribe({
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
    if (this.data.spLevel) {
      this.$service.delete(this.data.spLevel.id).subscribe({
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