import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { IAdminRole } from './admin-role.model'

@Injectable({
  providedIn: 'root',
})
export class AdminRoleService extends BaseCrudService<IAdminRole> {
  constructor() {
    super('admin/admin-role')
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminRoleGridService extends GridServiceMaterial<IAdminRole> {
  constructor(private $api: AdminRoleService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<IAdminRole>> {
    return this.$api.getAllPagination(params)
  }
}
