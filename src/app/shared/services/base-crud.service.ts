import { inject, Injectable } from '@angular/core'
import { IPagination } from 'app/core/services/bace.model'
import { BaseApiService } from 'app/core/services/base.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService<T> {
  public baseApi = inject(BaseApiService)

  constructor(
    // protected baseApi: BaseApiService,
    public endpoint: string, // <-- dinamik endpoint
  ) {}

  getAll(): Observable<T[]> {
    return this.baseApi.get<T[]>(`${this.endpoint}`)
  }

  getAllPagination(params: any): Observable<IPagination<T>> {
    return this.baseApi.get<IPagination<T>>(`${this.endpoint}/pagination`, { params })
  }

  getById(id: string): Observable<T> {
    return this.baseApi.get<T>(`${this.endpoint}/${id}`)
  }

  create(data: Partial<T>): Observable<T> {
    return this.baseApi.post<T>(`${this.endpoint}`, data)
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.baseApi.put<T>(`${this.endpoint}/${id}`, data)
  }

  delete(id: string): Observable<T> {
    return this.baseApi.delete<T>(`${this.endpoint}/${id}`)
  }

  repair(id: string): Observable<T> {
    return this.baseApi.get<T>(`${this.endpoint}/repair/${id}`)
  }
}
