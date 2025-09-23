import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ISpCategory } from '../common/sp-category.model'
import { SpCategoryService } from '../common/sp-category.service'

@Component({
  selector: 'app-sp-category-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './sp-category-form.component.html',
  styleUrl: './sp-category-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCategoryFormComponent {
  private $service = inject(SpCategoryService)
  dialogRef = inject(MatDialogRef<SpCategoryFormComponent>)
  fb = inject(FormBuilder)

  constructor(@Inject(MAT_DIALOG_DATA) public data: { spCategory?: ISpCategory }) {
    if (data?.spCategory) {
      this.form.patchValue(data.spCategory)
    }
  }

  form = this.fb.group({
    icon: ['', Validators.required],
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
  })

  submit() {
    if (this.form.valid) {
      if (this.data.spCategory) {
        this.$service.update(this.data.spCategory.id, this.form.value).subscribe({
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
    if (this.data.spCategory) {
      this.$service.delete(this.data.spCategory.id).subscribe({
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