import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  effect,
} from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { GridServiceMaterial } from './common/grid.service'
import { WrapperBasicComponent } from '../wrapper-basic/wrapper-basic.component'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { CommonModule, NgTemplateOutlet } from '@angular/common'
import { TranslocoPipe } from '@ngneat/transloco'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-grid',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    WrapperBasicComponent,
    NgTemplateOutlet,
    TranslocoPipe,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    tbody tr:hover {
      background-color: #f3f4f6; /* Tailwind’dagi gray-100 */
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
  `,
})
export class MaterialGridComponent<T> implements AfterViewInit {
  @Input() titleTemplate?: TemplateRef<any>
  @Input() templateFilters?: TemplateRef<any>

  @Input() title: string | TemplateRef<any>
  @Input() columns: { field: string; header: string }[] = []
  @Input() selectionMode: 'single' | 'multiple' = 'single'
  @Input() addButtonText = "Qo'shish"
  @Input() showAddButton = true
  @Input() showExportButton = false
  @Input() showExportButtons = false
  @Input() titleTopShow = true

  @Output() onClickAdd = new EventEmitter<void>()
  @Output() onRowSelect = new EventEmitter<T>()

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  dataSource = new MatTableDataSource<T>()

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.field)
  }

  constructor(public $data: GridServiceMaterial<T>) {
    effect(() => {
      this.dataSource.data = this.$data.data()
    })
  }

  ngAfterViewInit() {
    // pagination va sortni biriktirish
    this.paginator.page.subscribe((e) => this.$data.onLoadPage(e))

    if (this.sort) {
      this.sort.sortChange?.subscribe((e) => this.$data.onLoadPage(e))
    }

    // boshlang‘ich yuklash
    this.$data.onLoadPage({ pageIndex: 0, pageSize: 10, length: 0 })
  }

  handleRowClick(row: T) {
    this.onRowSelect.emit(row)
  }

  exportToExcel() {
    // Export logic if needed
  }

  isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef
  }
}
