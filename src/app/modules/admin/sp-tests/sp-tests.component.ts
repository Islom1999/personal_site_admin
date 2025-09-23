import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
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
  private router = inject(Router)

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
    this.router.navigate(['/sp-tests/add'], { relativeTo: this.router.routerState.root.firstChild })
  }

  onRowSelect(event: ISpTests) {
    this.router.navigate(['/sp-tests/edit', event.id], {
      relativeTo: this.router.routerState.root.firstChild,
    })
  }
}
