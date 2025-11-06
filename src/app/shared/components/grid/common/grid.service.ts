import { inject, Injectable, signal } from '@angular/core'
import { Sort } from '@angular/material/sort'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { FuseLoadingService } from '@fuse/services/loading'
import { GridResponse } from './grid.model'

interface PageEvent {
  pageIndex: number
  pageSize: number
  length: number
}

export type GridRequestParams = {
  [key: string]: any
  page: number
  limit: number
  sort?: string
  order?: string
}

@Injectable()
export abstract class GridServiceMaterial<T = any> {
  public data = signal<T[]>([])
  public totalRecords = 0

  public pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  }

  public filterSort: {
    sortActive: string
    sortDirection: string
    filters: Record<string, any>
  } = {
    sortActive: '',
    sortDirection: '',
    filters: {},
  }

  protected $route = inject(ActivatedRoute)
  protected $router = inject(Router)
  protected _fuseProgressBarService = inject(FuseLoadingService)

  routes: any[] = []
  params: { [key: string]: any } = {}

  constructor() {
    this.makeFiltersFromQueryParams()
  }

  abstract getAllData(params: GridRequestParams): Observable<GridResponse<T>>

  private makeFiltersFromQueryParams() {
    const queryParams = this.$route.snapshot.queryParams || {}
    const { page, limit, sort, order, ...rest } = queryParams

    if (page) {
      const parsedPage = Number(page)
      this.pageEvent.pageIndex = Number.isFinite(parsedPage)
        ? Math.max(parsedPage - 1, 0)
        : this.pageEvent.pageIndex
    }

    if (limit) {
      const parsedLimit = Number(limit)
      this.pageEvent.pageSize = Number.isFinite(parsedLimit)
        ? Math.max(parsedLimit, 1)
        : this.pageEvent.pageSize
    }

    if (typeof sort === 'string') {
      this.filterSort.sortActive = sort
    }

    if (typeof order === 'string') {
      this.filterSort.sortDirection = order
    }

    this.filterSort.filters = this.sanitizeFilters(rest)
  }

  private sanitizeFilters(filters: Record<string, any> | undefined) {
    if (!filters) {
      return {} as Record<string, any>
    }

    return Object.entries(filters).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value === undefined || value === null) {
        return acc
      }

      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (trimmed === '') {
          return acc
        }
        acc[key] = trimmed
        return acc
      }

      if (Array.isArray(value) && value.length === 0) {
        return acc
      }

      acc[key] = value
      return acc
    }, {})
  }

  private areFiltersEqual(a: Record<string, any>, b: Record<string, any>) {
    const aEntries = Object.entries(a)
    const bEntries = Object.entries(b)
    if (aEntries.length !== bEntries.length) {
      return false
    }

    return aEntries.every(([key, value]) => {
      if (!(key in b)) {
        return false
      }
      const other = b[key]
      return JSON.stringify(value) === JSON.stringify(other)
    })
  }

  onLoadPage(event?: PageEvent | Sort) {
    if (!event) {
      return
    }

    if ('pageIndex' in event) {
      this.pageEvent.pageIndex = event.pageIndex
      this.pageEvent.pageSize = event.pageSize
    }

    if ('active' in event) {
      this.filterSort.sortActive = event.active
      this.filterSort.sortDirection = event.direction
    }

    this.filterSort.filters = this.sanitizeFilters(this.filterSort.filters)

    const requestParams: GridRequestParams = {
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      ...this.filterSort.filters,
    }

    if (this.filterSort.sortActive) {
      requestParams.sort = this.filterSort.sortActive
    }

    if (this.filterSort.sortDirection) {
      requestParams.order = this.filterSort.sortDirection
    }

    this._fuseProgressBarService.show()

    this.getAllData(requestParams).subscribe({
      next: (res) => {
        if (!res?.data) {
          this.data.set([])
          this.totalRecords = 0
          this._fuseProgressBarService.hide()
          return
        }

        this.data.set(res.data)
        this.totalRecords = res.count
        this._fuseProgressBarService.hide()
      },
      error: () => {
        this.data.set([])
        this.totalRecords = 0
        this._fuseProgressBarService.hide()
      },
    })

    this.navigateWithFilters()
  }

  applyFilters(filters: Record<string, any>) {
    const sanitized = this.sanitizeFilters(filters)
    if (this.areFiltersEqual(this.filterSort.filters, sanitized)) {
      return
    }

    this.filterSort.filters = sanitized
    this.pageEvent.pageIndex = 0
    this.onLoadPage({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      length: this.totalRecords,
    })
  }

  clearFilters() {
    this.applyFilters({})
  }

  public navigateWithFilters() {
    const queryParams: Record<string, any> = {
      ...this.filterSort.filters,
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
    }

    if (this.filterSort.sortActive) {
      queryParams.sort = this.filterSort.sortActive
    }

    if (this.filterSort.sortDirection) {
      queryParams.order = this.filterSort.sortDirection
    }

    this.$router.navigate(this.routes, {
      relativeTo: this.$route,
      queryParams,
    })
  }

  next() {
    this.pageEvent.pageIndex++
    this.onLoadPage({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      length: this.totalRecords,
    })
  }

  prev() {
    this.pageEvent.pageIndex = Math.max(0, this.pageEvent.pageIndex - 1)
    this.onLoadPage({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      length: this.totalRecords,
    })
  }
}
