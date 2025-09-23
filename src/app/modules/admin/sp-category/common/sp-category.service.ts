import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ISpCategory } from './sp-category.model'

@Injectable({
  providedIn: 'root',
})
export class SpCategoryService extends BaseCrudService<ISpCategory> {
  constructor() {
    super('admin/sp-category')
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpCategoryGridService extends GridServiceMaterial<ISpCategory> {
  constructor(private $api: SpCategoryService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ISpCategory>> {
    return this.$api.getAllPagination(params)
  }
}
