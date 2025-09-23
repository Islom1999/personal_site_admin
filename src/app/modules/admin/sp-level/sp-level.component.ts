import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { SpLevelFormComponent } from './sp-level-form/sp-level-form.component'
import { ISpLevel } from './common/sp-level.model'
import { SpLevelService, SpLevelGridService } from './common/sp-level.service'

@Component({
  selector: 'app-sp-level',
  imports: [MaterialGridComponent],
  templateUrl: './sp-level.component.html',
  styleUrl: './sp-level.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: SpLevelGridService,
    },
  ],
})
export class SpLevelComponent {
  private $service = inject(SpLevelService)
  private $serviceGrid = inject(SpLevelGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
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
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(SpLevelFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: ISpLevel) {
    this.dialog
      .open(SpLevelFormComponent, {
        data: { spLevel: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}