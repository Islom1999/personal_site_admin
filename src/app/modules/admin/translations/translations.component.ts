import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MaterialGridComponent, GridServiceMaterial, IColumn } from 'app/shared'
import { ITranslations } from './common/translations.model'
import { TranslationsGridService, TranslationsService } from './common/translations.service'
import { TranslationsFormComponent } from './translations-form/translations-form.component'

@Component({
  selector: 'app-translations',
  imports: [MaterialGridComponent],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: TranslationsGridService,
    },
  ],
})
export class TranslationsComponent {
  private $service = inject(TranslationsService)
  private $serviceGrid = inject(TranslationsGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
    {
      field: 'key',
      header: 'key',
    },
    {
      field: 'name_uz',
      header: 'name_uz',
    },
    {
      field: 'name_ru',
      header: 'name_ru',
    },
    {
      field: 'name_kr',
      header: 'name_kr',
    },
    {
      field: 'translation_type',
      header: 'translation_type',
    },
    {
      field: 'is_use',
      header: 'is_use',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(TranslationsFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: ITranslations) {
    this.dialog
      .open(TranslationsFormComponent, {
        data: { Translations: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}
