import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { IAdminUser } from './admin-user.model'

@Injectable({
  providedIn: 'root',
})
export class AdminUserService extends BaseCrudService<IAdminUser> {
  constructor() {
    super('admin/admin-user')
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserGridService extends GridServiceMaterial<IAdminUser> {
  constructor(private $api: AdminUserService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<IAdminUser>> {
    return this.$api.getAllPagination(params)
  }
}
