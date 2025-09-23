import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
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
  private router = inject(Router)

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
    this.router.navigate(['add'], { relativeTo: this.router.routerState.root.firstChild })
  }

  onRowSelect(event: ISpCourses) {
    this.router.navigate(['edit', event.id], { relativeTo: this.router.routerState.root.firstChild })
  }
}