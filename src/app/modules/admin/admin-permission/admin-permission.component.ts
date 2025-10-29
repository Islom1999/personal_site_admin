import { Component, inject, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GridServiceMaterial, IColumn, MaterialGridComponent } from 'app/shared'
import { AdminPermissionFormComponent } from './admin-permission-form/admin-permission-form.component'
import { IAdminPermission } from './common/admin-parmission.model'
import {
  AdminPermissionService,
  AdminPermissionGridService,
} from './common/admin-parmission.service'

@Component({
  selector: 'app-admin-permission',
  imports: [MaterialGridComponent],
  templateUrl: './admin-permission.component.html',
  styleUrl: './admin-permission.component.scss',
  providers: [
    {
      provide: GridServiceMaterial,
      useExisting: AdminPermissionGridService,
    },
  ],
})
export class AdminPermissionComponent {
  private $service = inject(AdminPermissionService)
  private $serviceGrid = inject(AdminPermissionGridService)
  private dialog = inject(MatDialog)

  ngOnInit(): void {}

  columns: IColumn[] = [
    {
      field: 'key',
      header: 'key',
    },
    {
      field: 'name',
      header: 'name',
    },
  ]

  onClickAdd(event: any) {
    this.dialog
      .open(AdminPermissionFormComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }

  onRowSelect(event: IAdminPermission) {
    this.dialog
      .open(AdminPermissionFormComponent, {
        data: { adminPermission: event },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.$serviceGrid.onLoadPage(this.$serviceGrid.pageEvent)
        }
      })
  }
}
