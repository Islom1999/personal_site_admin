import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MaterialGridComponent, GridServiceMaterial, IColumn } from 'app/shared'
import { AdminUserFormComponent } from './admin-user-form/admin-user-form.component'
import { IAdminUser } from './common/admin-user.model'
import { AdminUserGridService, AdminUserService } from './common/admin-user.service'

@Component({
  selector: 'app-admin-user',
  imports: [MaterialGridComponent],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss',
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: AdminUserGridService,
    },
  ],
})
export class AdminUserComponent {
  private $service = inject(AdminUserService)
  private $serviceGrid = inject(AdminUserGridService)
  private dialog = inject(MatDialog)

  columns: IColumn[] = [
    {
      field: 'name',
      header: 'name',
    },
    {
      field: 'email',
      header: 'email',
    },
    {
      field: 'role.name',
      header: 'role.name',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(AdminUserFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: IAdminUser) {
    this.dialog
      .open(AdminUserFormComponent, {
        data: { AdminUser: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}
