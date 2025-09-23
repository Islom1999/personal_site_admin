import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ISpLevel } from './sp-level.model'

@Injectable({
  providedIn: 'root',
})
export class SpLevelService extends BaseCrudService<ISpLevel> {
  constructor() {
    super('admin/sp-level')
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpLevelGridService extends GridServiceMaterial<ISpLevel> {
  constructor(private $api: SpLevelService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ISpLevel>> {
    return this.$api.getAllPagination(params)
  }
}
