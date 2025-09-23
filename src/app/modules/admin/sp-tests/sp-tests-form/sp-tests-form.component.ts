import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ActivatedRoute, Router } from '@angular/router'
import { WrapperBasicComponent } from 'app/shared/components/wrapper-basic/wrapper-basic.component'
import { SpCategoryService } from '../../sp-category/common/sp-category.service'
import { SpLevelService } from '../../sp-level/common/sp-level.service'
import { ISpTests } from '../common/sp-tests.model'
import { SpTestsService } from '../common/sp-tests.service'

@Component({
  selector: 'app-sp-tests-form',
  imports: [
    WrapperBasicComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './sp-tests-form.component.html',
  styleUrl: './sp-tests-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpTestsFormComponent implements OnInit {
  private $service = inject(SpTestsService)
  private $categoryService = inject(SpCategoryService)
  private $levelService = inject(SpLevelService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  fb = inject(FormBuilder)

  isEditMode = false
  testId: string | null = null
  breadcrumbs = [
    { label: 'Testlar', routerLink: '/sp-tests' },
    { label: 'Yangi test', routerLink: '' }
  ]

  categories = toSignal(this.$categoryService.getAll(), {
    initialValue: [],
  })

  levels = toSignal(this.$levelService.getAll(), {
    initialValue: [],
  })

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

  form = this.fb.group({
    icon: ['', Validators.required],
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
    description_uz: ['', Validators.required],
    description_kr: ['', Validators.required],
    description_ru: ['', Validators.required],
    duration: [0, [Validators.required, Validators.min(1)]],
    code: ['', Validators.required],
    sp_category_id: ['', Validators.required],
    sp_level_id: ['', Validators.required],
    sp_tests_quessions: this.fb.array([]),
  })

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id')
    this.isEditMode = !!this.testId
    
    if (this.isEditMode) {
      this.breadcrumbs[1].label = 'Testni tahrirlash'
      this.loadTest()
    }
  }

  private loadTest() {
    if (this.testId) {
      this.$service.getById(this.testId).subscribe(test => {
        this.loadTestData(test)
      })
    }
  }

  private loadTestData(test: ISpTests) {
    this.form.patchValue(test)
    
    // Load existing questions
    if (test.sp_tests_quessions?.length) {
      test.sp_tests_quessions.forEach(question => {
        const questionGroup = this.fb.group({
          question: [question.question, Validators.required],
          explanation: [question.explanation],
          sp_quession_options: this.fb.array([])
        })

        // Load existing options
        if (question.sp_quession_options?.length) {
          const optionsArray = questionGroup.get('sp_quession_options') as FormArray
          question.sp_quession_options.forEach(option => {
            optionsArray.push(this.fb.group({
              text: [option.text, Validators.required],
              is_result: [option.is_result, Validators.required]
            }))
          })
        }

        this.questionsArray.push(questionGroup)
      })
    }
  }

  get questionsArray() {
    return this.form.get('sp_tests_quessions') as FormArray
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      explanation: [''],
      sp_quession_options: this.fb.array([])
    })
    this.questionsArray.push(questionGroup)
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index)
  }

  getOptionsArray(questionIndex: number): FormArray {
    return this.questionsArray.at(questionIndex).get('sp_quession_options') as FormArray
  }

  addOption(questionIndex: number) {
    const optionGroup = this.fb.group({
      text: ['', Validators.required],
      is_result: [false, Validators.required]
    })
    this.getOptionsArray(questionIndex).push(optionGroup)
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptionsArray(questionIndex).removeAt(optionIndex)
  }

  submit() {
    if (this.form.valid) {
      const formData = { ...this.form.value }
      
      if (this.isEditMode && this.testId) {
        this.$service.update(this.testId, formData as any).subscribe({
          next: () => {
            this.router.navigate(['/sp-tests'])
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(formData as any).subscribe({
          next: () => {
            this.router.navigate(['/sp-tests'])
          },
          error: (err) => {
            console.log(err)
          },
        })
      }
    }
  }

  delete() {
    if (this.isEditMode && this.testId) {
      this.$service.delete(this.testId).subscribe({
        next: () => {
          this.router.navigate(['/sp-tests'])
        },
        error: (err) => {
          console.log(err)
        },
      })
    }
  }

  cancel() {
    this.router.navigate(['/sp-tests'])
  }
}