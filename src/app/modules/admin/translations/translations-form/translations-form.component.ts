import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
} from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ITranslations, TranslationType, TranslationTypeText } from '../common/translations.model'
import { TranslationsService } from '../common/translations.service'

@Component({
  selector: 'app-translations-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './translations-form.component.html',
  styleUrl: './translations-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsFormComponent {
  private $service = inject(TranslationsService)
  private $cdr = inject(ChangeDetectorRef)
  dialogRef = inject(MatDialogRef<TranslationsFormComponent>)
  fb = inject(FormBuilder)

  translationTypes = Object.values(TranslationType)
  translationTypeText = TranslationTypeText

  form = this.fb.group({
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
    key: ['', Validators.required],
    is_use: [false, Validators.required],
    translation_type: ['', Validators.required],
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { Translations?: ITranslations }) {
    if (data?.Translations) {
      this.form.patchValue({
        ...data.Translations,
      })
    }
  }

  submit() {
    if (this.form.valid) {
      const payload = { ...this.form.value }

      Object.keys(payload).forEach((key) => {
        if (payload[key] == '' || payload[key] == null) {
          delete payload[key]
        }
      })

      if (this.data.Translations) {
        this.$service.update(this.data.Translations.id, payload as any).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(payload as any).subscribe({
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
    if (this.data.Translations) {
      this.$service.delete(this.data.Translations.id).subscribe({
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
