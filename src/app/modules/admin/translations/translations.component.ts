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
      is_filter: true,
    },
    {
      field: 'name_uz',
      header: 'name_uz',
      is_filter: true,
    },
    {
      field: 'name_ru',
      header: 'name_ru',
      is_filter: true,
    },
    {
      field: 'name_kr',
      header: 'name_kr',
      is_filter: true,
    },
    {
      field: 'translation_type',
      header: 'translation_type',
      is_filter: true,
    },
    {
      field: 'is_use',
      header: 'is_use',
      is_filter: true,
      filterType: 'boolean',
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
