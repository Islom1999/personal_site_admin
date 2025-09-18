import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { AdminRoleFormComponent } from './admin-role-form/admin-role-form.component'
import { IAdminRole } from './common/admin-role.model'
import { AdminRoleService, AdminRoleGridService } from './common/admin-role.service'

@Component({
  selector: 'app-admin-role',
  imports: [MaterialGridComponent],
  templateUrl: './admin-role.component.html',
  styleUrl: './admin-role.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: AdminRoleGridService,
    },
  ],
})
export class AdminRoleComponent {
  private $service = inject(AdminRoleService)
  private $serviceGrid = inject(AdminRoleGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
    {
      field: 'name',
      header: 'name',
    },
    {
      field: 'description',
      header: 'description',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(AdminRoleFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: IAdminRole) {
    this.dialog
      .open(AdminRoleFormComponent, {
        data: { adminRole: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}
