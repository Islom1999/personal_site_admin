import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FileType } from 'app/shared/enums/file_type'
import {
  UploadFileComponent,
  UploadFileData,
} from 'app/shared/components/upload-file/upload-file.component'
import { SpCategoryService } from '../../sp-category/common/sp-category.service'
import { SpLevelService } from '../../sp-level/common/sp-level.service'
import { ISpMaterials } from '../common/sp-materials.model'
import { SpMaterialsService } from '../common/sp-materials.service'
import { Constants } from 'app/core/config/constant.config'
import { environment } from 'environments/environment'

@Component({
  selector: 'app-sp-materials-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    UploadFileComponent,
  ],
  templateUrl: './sp-materials-form.component.html',
  styleUrl: './sp-materials-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpMaterialsFormComponent {
  private $service = inject(SpMaterialsService)
  private $categoryService = inject(SpCategoryService)
  private $levelService = inject(SpLevelService)
  dialogRef = inject(MatDialogRef<SpMaterialsFormComponent>)
  fb = inject(FormBuilder)

  fileType = FileType
  selectedFiles: { id: string }[] = []
  baseUploadFileUrl = `${environment.endpoint}/admin/sp-materials/upload/file`

  categories = toSignal(this.$categoryService.getAll(), {
    initialValue: [],
  })

  levels = toSignal(this.$levelService.getAll(), {
    initialValue: [],
  })

  primeIcons = Constants.PRIME_ICONS

  form = this.fb.group({
    icon: ['', Validators.required],
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
    description_uz: ['', Validators.required],
    description_kr: ['', Validators.required],
    description_ru: ['', Validators.required],
    sp_category_id: ['', Validators.required],
    sp_level_id: ['', Validators.required],
    file_id: [''],
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { spMaterials?: ISpMaterials }) {
    if (data?.spMaterials) {
      this.form.patchValue(data.spMaterials)

      // Agar fayl mavjud bo'lsa, selectedFiles'ga qo'shamiz
      if (data.spMaterials.file_id) {
        this.selectedFiles = [{ id: data.spMaterials.file_id }]
      }
    }
  }

  onFileSelected(files: UploadFileData[]) {
    if (files.length > 0) {
      this.form.patchValue({
        file_id: files[0].uploadData.id,
      })
      this.selectedFiles = [{ id: files[0].uploadData.id }]
    } else {
      this.form.patchValue({
        file_id: '',
      })
      this.selectedFiles = []
    }
  }

  submit() {
    if (this.form.valid) {
      const formData = { ...this.form.value }

      if (this.data.spMaterials) {
        this.$service.update(this.data.spMaterials.id, formData as any).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(formData as any).subscribe({
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
    if (this.data.spMaterials) {
      this.$service.delete(this.data.spMaterials.id).subscribe({
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
