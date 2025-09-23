import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { SpMaterialsFormComponent } from './sp-materials-form/sp-materials-form.component'
import { ISpMaterials } from './common/sp-materials.model'
import { SpMaterialsService, SpMaterialsGridService } from './common/sp-materials.service'

@Component({
  selector: 'app-sp-materials',
  imports: [MaterialGridComponent],
  templateUrl: './sp-materials.component.html',
  styleUrl: './sp-materials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: SpMaterialsGridService,
    },
  ],
})
export class SpMaterialsComponent {
  private $service = inject(SpMaterialsService)
  private $serviceGrid = inject(SpMaterialsGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
    {
      field: 'icon',
      header: 'icon',
    },
    {
      field: 'name_uz',
      header: 'name_uz',
    },
    {
      field: 'name_kr',
      header: 'name_kr',
    },
    {
      field: 'name_ru',
      header: 'name_ru',
    },
    {
      field: 'download_count',
      header: 'download_count',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(SpMaterialsFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: ISpMaterials) {
    this.dialog
      .open(SpMaterialsFormComponent, {
        data: { spMaterials: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}