import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ITranslations } from './translations.model'

@Injectable({
  providedIn: 'root',
})
export class TranslationsService extends BaseCrudService<ITranslations> {
  constructor() {
    super('admin/translation')
  }
}

@Injectable({
  providedIn: 'root',
})
export class TranslationsGridService extends GridServiceMaterial<ITranslations> {
  constructor(private $api: TranslationsService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ITranslations>> {
    return this.$api.getAllPagination(params)
  }
}
