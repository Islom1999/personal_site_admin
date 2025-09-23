import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { SpTestsFormComponent } from './sp-tests-form/sp-tests-form.component'
import { ISpTests } from './common/sp-tests.model'
import { SpTestsService, SpTestsGridService } from './common/sp-tests.service'

@Component({
  selector: 'app-sp-tests',
  imports: [MaterialGridComponent],
  templateUrl: './sp-tests.component.html',
  styleUrl: './sp-tests.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: SpTestsGridService,
    },
  ],
})
export class SpTestsComponent {
  private $service = inject(SpTestsService)
  private $serviceGrid = inject(SpTestsGridService)
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
      field: 'code',
      header: 'code',
    },
    {
      field: 'duration',
      header: 'duration (min)',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(SpTestsFormComponent, {
        data: {},
        width: '800px',
        maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: ISpTests) {
    this.dialog
      .open(SpTestsFormComponent, {
        data: { spTests: event },
        width: '800px',
        maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}