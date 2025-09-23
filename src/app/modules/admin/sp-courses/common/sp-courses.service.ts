import { Injectable } from '@angular/core'
import { BaseCrudService, GridResponse, GridServiceMaterial } from 'app/shared'
import { Observable } from 'rxjs'
import { ISpCourses } from './sp-courses.model'

@Injectable({
  providedIn: 'root',
})
export class SpCoursesService extends BaseCrudService<ISpCourses> {
  constructor() {
    super('admin/sp-courses')
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpCoursesGridService extends GridServiceMaterial<ISpCourses> {
  constructor(private $api: SpCoursesService) {
    super()
  }

  getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<ISpCourses>> {
    return this.$api.getAllPagination(params)
  }
}
