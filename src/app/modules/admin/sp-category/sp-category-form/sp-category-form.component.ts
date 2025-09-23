import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ISpCategory } from '../common/sp-category.model'
import { SpCategoryService } from '../common/sp-category.service'

@Component({
  selector: 'app-sp-category-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './sp-category-form.component.html',
  styleUrl: './sp-category-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCategoryFormComponent {
  private $service = inject(SpCategoryService)
  dialogRef = inject(MatDialogRef<SpCategoryFormComponent>)
  fb = inject(FormBuilder)

  primeIcons = [
    'home',
    'star',
    'heart',
    'user',
    'users',
    'cog',
    'bell',
    'envelope',
    'calendar',
    'clock',
    'map-marker',
    'phone',
    'mobile',
    'laptop',
    'desktop',
    'tablet',
    'camera',
    'video',
    'image',
    'file',
    'folder',
    'folder-open',
    'download',
    'upload',
    'cloud',
    'database',
    'server',
    'wifi',
    'globe',
    'link',
    'bookmark',
    'tag',
    'tags',
    'search',
    'filter',
    'sort',
    'list',
    'th-large',
    'table',
    'chart-bar',
    'chart-line',
    'chart-pie',
    'calculator',
    'money-bill',
    'credit-card',
    'shopping-cart',
    'shopping-bag',
    'gift',
    'trophy',
    'medal',
    'flag',
    'bookmark',
    'thumbs-up',
    'thumbs-down',
    'like',
    'share',
    'comment',
    'eye',
    'eye-slash',
    'lock',
    'unlock',
    'key',
    'shield',
    'check',
    'times',
    'plus',
    'minus',
    'pencil',
    'trash',
    'copy',
    'paste',
    'cut',
    'save',
    'print',
    'refresh',
    'sync',
    'undo',
    'redo',
    'forward',
    'backward',
    'play',
    'pause',
    'stop',
    'volume-up',
    'volume-down',
    'volume-off',
    'microphone',
    'headphones',
    'music',
    'book',
    'graduation-cap',
    'university',
    'building',
    'hospital',
    'car',
    'plane',
    'train',
    'ship',
    'bicycle',
    'motorcycle',
    'bus',
    'taxi',
    'truck',
    'gas-pump',
    'road',
    'map',
    'compass',
    'location-arrow',
    'sun',
    'moon',
    'cloud',
    'umbrella',
    'snowflake',
    'fire',
    'bolt',
    'leaf',
    'tree',
    'flower',
    'apple',
    'coffee',
    'glass',
    'beer',
    'pizza',
    'hamburger',
    'cutlery',
    'birthday-cake',
    'gamepad',
    'puzzle-piece',
    'dice',
    'chess',
    'football',
    'basketball',
    'baseball',
    'tennis',
    'golf',
    'swimming',
    'running',
    'walking',
    'cycling',
    'dumbbell',
    'weight',
    'heartbeat',
    'stethoscope',
    'pills',
    'syringe',
    'bandage',
    'first-aid',
    'ambulance',
    'wheelchair',
    'baby',
    'child',
    'female',
    'male',
    'elderly',
    'family',
    'couple',
    'friends',
    'team',
    'group',
    'community',
    'network',
    'organization',
    'company',
    'factory',
    'warehouse',
    'store',
    'shop',
    'market',
    'bank',
    'atm',
    'wallet',
    'coins',
    'dollar',
    'euro',
    'pound',
    'yen',
    'ruble',
    'bitcoin',
    'ethereum',
    'paypal',
    'stripe',
    'visa',
    'mastercard',
    'american-express'
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: { spCategory?: ISpCategory }) {
    if (data?.spCategory) {
      this.form.patchValue(data.spCategory)
    }
  }

  form = this.fb.group({
    icon: ['', Validators.required],
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
  })

  submit() {
    if (this.form.valid) {
      if (this.data.spCategory) {
        this.$service.update(this.data.spCategory.id, this.form.value).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(this.form.value).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (err) => {
            console.log(err)
          },
        })
      }
    }
  }

  delete() {
    if (this.data.spCategory) {
      this.$service.delete(this.data.spCategory.id).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.log(err)
        },
      })
    }
  }
}