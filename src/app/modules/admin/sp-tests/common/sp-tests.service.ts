import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ISpTests } from './sp-tests.model'

@Injectable({
  providedIn: 'root',
})
export class SpTestsService extends BaseCrudService<ISpTests> {
  constructor() {
    super('admin/sp-tests')
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpTestsGridService extends GridServiceMaterial<ISpTests> {
  constructor(private $api: SpTestsService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ISpTests>> {
    return this.$api.getAllPagination(params)
  }
}
