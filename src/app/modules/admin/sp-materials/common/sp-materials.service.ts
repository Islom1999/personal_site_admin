import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ISpMaterials } from './sp-materials.model'

@Injectable({
  providedIn: 'root',
})
export class SpMaterialsService extends BaseCrudService<ISpMaterials> {
  constructor() {
    super('admin/sp-materials')
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpMaterialsGridService extends GridServiceMaterial<ISpMaterials> {
  constructor(private $api: SpMaterialsService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ISpMaterials>> {
    return this.$api.getAllPagination(params)
  }
}
