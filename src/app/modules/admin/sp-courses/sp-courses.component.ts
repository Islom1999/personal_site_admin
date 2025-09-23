import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { SpCoursesFormComponent } from './sp-courses-form/sp-courses-form.component'
import { ISpCourses } from './common/sp-courses.model'
import { SpCoursesService, SpCoursesGridService } from './common/sp-courses.service'

@Component({
  selector: 'app-sp-courses',
  imports: [MaterialGridComponent],
  templateUrl: './sp-courses.component.html',
  styleUrl: './sp-courses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: SpCoursesGridService,
    },
  ],
})
export class SpCoursesComponent {
  private $service = inject(SpCoursesService)
  private $serviceGrid = inject(SpCoursesGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
    {
      field: 'name_uz',
      header: 'name_uz',
    },
    {
      field: 'code',
      header: 'code',
    },
    {
      field: 'instructor',
      header: 'instructor',
    },
    {
      field: 'duration',
      header: 'duration',
    },
    {
      field: 'rating',
      header: 'rating',
    },
    {
      field: 'premium_type',
      header: 'premium_type',
    },
    {
      field: 'price',
      header: 'price',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(SpCoursesFormComponent, {
        data: {},
        width: '1000px',
        maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: ISpCourses) {
    this.dialog
      .open(SpCoursesFormComponent, {
        data: { spCourses: event },
        width: '1000px',
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