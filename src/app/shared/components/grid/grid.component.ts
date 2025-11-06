import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  effect,
  inject,
} from '@angular/core'
import { CommonModule, NgTemplateOutlet } from '@angular/common'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { GridServiceMaterial } from './common/grid.service'
import { IColumn } from './common/column.model'
import { WrapperBasicComponent } from '../wrapper-basic/wrapper-basic.component'
import { TranslocoPipe } from '@ngneat/transloco'

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    WrapperBasicComponent,
    NgTemplateOutlet,
    TranslocoPipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    tbody tr:hover {
      background-color: #f3f4f6;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
  `,
})
export class MaterialGridComponent<T> implements AfterViewInit, OnChanges, OnDestroy {
  @Input() titleTemplate?: TemplateRef<any>
  @Input() templateFilters?: TemplateRef<any>

  @Input() title: string | TemplateRef<any>
  @Input() columns: IColumn[] = []
  @Input() selectionMode: 'single' | 'multiple' = 'single'
  @Input() addButtonText = "Qo'shish"
  @Input() addButtonIcon?: string
  @Input() showAddButton = true
  @Input() showExportButton = false
  @Input() showExportButtons = false

  @Output() onClickAdd = new EventEmitter<void>()
  @Output() onRowSelect = new EventEmitter<T>()

  @ViewChild(MatPaginator) paginator?: MatPaginator
  @ViewChild(MatSort) sort?: MatSort

  dataSource = new MatTableDataSource<T>()

  private readonly fb = inject(FormBuilder)
  private readonly destroyRef = inject(DestroyRef)

  filterForm: FormGroup = this.fb.group({})
  filterableColumns: IColumn[] = []
  private filterChangesSub?: Subscription

  constructor(public $data: GridServiceMaterial<T>) {
    effect(() => {
      this.dataSource.data = this.$data.data()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.filterableColumns = (this.columns || []).filter(
        (column) => column.is_filter === true && !!column.field,
      )
      this.buildFilterForm()
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator
      this.paginator.page
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => this.$data.onLoadPage(event))
    }

    if (this.sort) {
      this.dataSource.sort = this.sort
      this.sort.sortChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => this.$data.onLoadPage(event))
    }

    this.$data.onLoadPage({
      pageIndex: this.$data.pageEvent.pageIndex,
      pageSize: this.$data.pageEvent.pageSize,
      length: this.$data.totalRecords,
    })
  }

  ngOnDestroy(): void {
    this.filterChangesSub?.unsubscribe()
  }

  get displayedColumns(): string[] {
    return this.columns.map((column) => column.field)
  }

  get hasActiveFilters(): boolean {
    if (!this.filterableColumns.length) {
      return false
    }

    const activeFilters = this.$data.filterSort.filters || {}
    return this.filterableColumns.some((column) => {
      const value = activeFilters[column.field]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    })
  }

  handleRowClick(row: T): void {
    this.onRowSelect.emit(row)
  }

  exportToExcel(): void {
    // Export logic if needed
  }

  isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef
  }

  getFilterLabel(column: IColumn): string {
    return column.filterPlaceholder || column.header || column.field
  }

  clearSingleFilter(field: string): void {
    const control = this.filterForm.get(field) as FormControl | null
    if (!control) {
      return
    }
    if (control.value === '' || control.value === undefined || control.value === null) {
      return
    }
    control.setValue('', { emitEvent: true })
  }

  resetFilters(): void {
    if (!this.filterableColumns.length) {
      return
    }

    const resetPayload: Record<string, any> = {}
    this.filterableColumns.forEach((column) => {
      resetPayload[column.field] = ''
    })

    this.filterForm.patchValue(resetPayload, { emitEvent: false })
    this.$data.clearFilters()
  }

  private buildFilterForm(): void {
    this.filterChangesSub?.unsubscribe()

    if (!this.filterableColumns.length) {
      this.filterForm = this.fb.group({})
      return
    }

    const controls: Record<string, FormControl<any>> = {}
    const activeFilters = this.$data.filterSort.filters || {}

    this.filterableColumns.forEach((column) => {
      const initialValue = activeFilters[column.field] ?? ''
      controls[column.field] = this.fb.control(initialValue)
    })

    this.filterForm = this.fb.group(controls)

    this.filterChangesSub = this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => this.$data.applyFilters(value))
  }
}
