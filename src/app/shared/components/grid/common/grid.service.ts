import { inject, Injectable, signal } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { FuseLoadingService } from '@fuse/services/loading'
import { GridResponse } from './grid.model'

interface PageEvent {
  pageIndex: number
  pageSize: number
  length: number
}

@Injectable()
export abstract class GridServiceMaterial<T = any> {
  // Loading skeletonlar uchun boshlang‘ich
  public data = signal<T[]>(Array.from({ length: 0 }).map((_, i) => ({ loading: true }) as T))
  public totalRecords: number
  public parentId: string

  // Sahifalash
  public pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  }

  // Sort va filterlar
  public filterSort: {
    sortActive: string
    sortDirection: string
    filters: { [key: string]: any }
  }

  // Router
  protected $route = inject(ActivatedRoute)
  protected $router = inject(Router)
  protected _fuseProgressBarService = inject(FuseLoadingService)

  routes: any[] = []
  params: { [key: string]: any } = {}

  constructor() {
    this.makeFiltersFromQueryParams()
  }

  abstract getAllData(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    filters?: string
  }): Observable<GridResponse<T>>

  private makeFiltersFromQueryParams() {
    const filters = this.$route.snapshot.queryParams
    Object.keys(filters).forEach((key) => {
      this.filterSort.filters[key] = filters[key]
    })
  }

  onLoadPage(event?: PageEvent | Sort) {
    if (!event) return

    if ('pageIndex' in event) {
      this.pageEvent.pageIndex = event.pageIndex
      this.pageEvent.pageSize = event.pageSize
    }

    if ('active' in event) {
      this.filterSort.sortActive = event.active
      this.filterSort.sortDirection = event.direction
    }

    this._fuseProgressBarService.show()

    this.getAllData({
      page: this.pageEvent.pageIndex,
      limit: 10,
      // size: this.pageEvent.pageSize,
      // sort: this.sortActive,
      // order: this.sortDirection,
      // filters: JSON.stringify(this.filters),
    }).subscribe((res) => {
      if (!res?.data) {
        this.data.set([])
        this.totalRecords = 0
        this._fuseProgressBarService.hide()
        return
      }
      this.data.set(res.data)
      this.totalRecords = res.count
      this._fuseProgressBarService.hide()
    })

    this.navigateWithFilters()
  }

  public navigateWithFilters() {
    const queryParams = { ...(this.filterSort?.filters ?? {}) }
    this.$router.navigate(this.routes, {
      relativeTo: this.$route,
      queryParams,
    })
  }

  // Faqat navbatdagi sahifaga o‘tish (agar kerak bo‘lsa)
  next() {
    this.pageEvent.pageIndex++
    this.onLoadPage({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      length: 0,
    })
  }

  prev() {
    this.pageEvent.pageIndex = Math.max(0, this.pageEvent.pageIndex - 1)
    this.onLoadPage({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      length: 0,
    })
  }
}
