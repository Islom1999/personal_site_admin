import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ActivatedRoute, Router } from '@angular/router'
import { FileType } from 'app/shared/enums/file_type'
import { UploadFileComponent, UploadFileData } from 'app/shared/components/upload-file/upload-file.component'
import { WrapperBasicComponent } from 'app/shared/components/wrapper-basic/wrapper-basic.component'
import { SpCategoryService } from '../../sp-category/common/sp-category.service'
import { SpLevelService } from '../../sp-level/common/sp-level.service'
import { ISpCourses } from '../common/sp-courses.model'
import { SpCoursesService } from '../common/sp-courses.service'

interface SpCoursesFormValue {
  name_uz: string
  name_kr: string
  name_ru: string
  description_uz: string
  description_kr: string
  description_ru: string
  instructor: string
  duration: string
  rating: string
  premium_type: string
  price: number
  tagsString: string
  code: string
  sp_category_id: string
  sp_level_id: string
  file_image_id: string
  sp_courses_modules: any[]
}

@Component({
  selector: 'app-sp-courses-form',
  imports: [
    WrapperBasicComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    UploadFileComponent,
  ],
  templateUrl: './sp-courses-form.component.html',
  styleUrl: './sp-courses-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCoursesFormComponent implements OnInit {
  private $service = inject(SpCoursesService)
  private $categoryService = inject(SpCategoryService)
  private $levelService = inject(SpLevelService)
  private $cdr = inject(ChangeDetectorRef)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  fb = inject(FormBuilder)

  isEditMode = false
  courseId: string | null = null
  breadcrumbs = [
    { label: 'Kurslar', routerLink: '/sp-courses' },
    { label: 'Yangi kurs', routerLink: '' }
  ]

  fileType = FileType
  selectedImageFiles: { id: string }[] = []
  selectedVideoFiles: { [key: string]: { id: string }[] } = {}

  categories = toSignal(this.$categoryService.getAll(), {
    initialValue: [],
  })

  levels = toSignal(this.$levelService.getAll(), {
    initialValue: [],
  })

  form = this.fb.group({
    name_uz: ['', Validators.required],
    name_kr: ['', Validators.required],
    name_ru: ['', Validators.required],
    description_uz: ['', Validators.required],
    description_kr: ['', Validators.required],
    description_ru: ['', Validators.required],
    instructor: ['', Validators.required],
    duration: ['', Validators.required],
    rating: ['', Validators.required],
    premium_type: ['free', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    tagsString: [''],
    code: ['', Validators.required],
    sp_category_id: ['', Validators.required],
    sp_level_id: ['', Validators.required],
    file_image_id: [''],
    sp_courses_modules: this.fb.array([]),
  })

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id')
    this.isEditMode = !!this.courseId
    
    if (this.isEditMode) {
      this.breadcrumbs[1].label = 'Kursni tahrirlash'
      this.loadCourse()
    }
  }

  private loadCourse() {
    if (this.courseId) {
      this.$service.getById(this.courseId).subscribe(course => {
        this.loadCourseData(course)
      })
    }
  }

  private loadCourseData(course: ISpCourses) {
    // Convert tags array to string
    const tagsString = course.tags ? course.tags.join(', ') : ''
    
    this.form.patchValue({
      ...course,
      tagsString,
    })
    
    // Set image file
    if (course.file_image_id) {
      this.selectedImageFiles = [{ id: course.file_image_id }]
    }

    // Load existing modules
    if (course.sp_courses_modules?.length) {
      course.sp_courses_modules.forEach(module => {
        const moduleGroup = this.fb.group({
          name_uz: [module.name_uz, Validators.required],
          name_kr: [module.name_kr, Validators.required],
          name_ru: [module.name_ru, Validators.required],
          duration: [module.duration, Validators.required],
          code: [module.code, Validators.required],
          sp_courses_module_parts: this.fb.array([])
        })

        // Load existing parts
        if (module.sp_courses_module_parts?.length) {
          const partsArray = moduleGroup.get('sp_courses_module_parts') as FormArray
          module.sp_courses_module_parts.forEach(part => {
            const partGroup = this.fb.group({
              name_uz: [part.name_uz, Validators.required],
              name_kr: [part.name_kr, Validators.required],
              name_ru: [part.name_ru, Validators.required],
              duration: [part.duration, Validators.required],
              type: [part.type, Validators.required],
              content: [part.content || ''],
              file_video_id: [part.file_video_id || '']
            })

            // Set video file if exists
            if (part.file_video_id) {
              const key = `${this.modulesArray.length}_${partsArray.length}`
              this.selectedVideoFiles[key] = [{ id: part.file_video_id }]
            }

            partsArray.push(partGroup)
          })
        }

        this.modulesArray.push(moduleGroup)
      })
    }
    
    this.$cdr.markForCheck()
  }

  get modulesArray() {
    return this.form.get('sp_courses_modules') as FormArray
  }

  onImageSelected(files: UploadFileData[]) {
    if (files.length > 0) {
      this.form.patchValue({
        file_image_id: files[0].uploadData.id
      })
      this.selectedImageFiles = [{ id: files[0].uploadData.id }]
    } else {
      this.form.patchValue({
        file_image_id: ''
      })
      this.selectedImageFiles = []
    }
  }

  onVideoSelected(files: UploadFileData[], moduleIndex: number, partIndex: number) {
    const key = `${moduleIndex}_${partIndex}`
    const partControl = this.getModulePartsArray(moduleIndex).at(partIndex)
    
    if (files.length > 0) {
      partControl.patchValue({
        file_video_id: files[0].uploadData.id
      })
      this.selectedVideoFiles[key] = [{ id: files[0].uploadData.id }]
    } else {
      partControl.patchValue({
        file_video_id: ''
      })
      this.selectedVideoFiles[key] = []
    }
  }

  getSelectedVideoFiles(moduleIndex: number, partIndex: number): { id: string }[] {
    const key = `${moduleIndex}_${partIndex}`
    return this.selectedVideoFiles[key] || []
  }

  getPartTypeValue(moduleIndex: number, partIndex: number): string {
    return this.getModulePartsArray(moduleIndex).at(partIndex)?.get('type')?.value || ''
  }

  addModule() {
    const moduleGroup = this.fb.group({
      name_uz: ['', Validators.required],
      name_kr: ['', Validators.required],
      name_ru: ['', Validators.required],
      duration: ['', Validators.required],
      code: ['', Validators.required],
      sp_courses_module_parts: this.fb.array([])
    })
    this.modulesArray.push(moduleGroup)
  }

  removeModule(index: number) {
    this.modulesArray.removeAt(index)
    // Clean up video files for this module
    Object.keys(this.selectedVideoFiles).forEach(key => {
      if (key.startsWith(`${index}_`)) {
        delete this.selectedVideoFiles[key]
      }
    })
  }

  getModulePartsArray(moduleIndex: number): FormArray {
    return this.modulesArray.at(moduleIndex).get('sp_courses_module_parts') as FormArray
  }

  addModulePart(moduleIndex: number) {
    const partGroup = this.fb.group({
      name_uz: ['', Validators.required],
      name_kr: ['', Validators.required],
      name_ru: ['', Validators.required],
      duration: ['', Validators.required],
      type: ['video', Validators.required],
      content: [''],
      file_video_id: ['']
    })
    this.getModulePartsArray(moduleIndex).push(partGroup)
  }

  removeModulePart(moduleIndex: number, partIndex: number) {
    this.getModulePartsArray(moduleIndex).removeAt(partIndex)
    // Clean up video file for this part
    const key = `${moduleIndex}_${partIndex}`
    delete this.selectedVideoFiles[key]
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value as SpCoursesFormValue
      const payload: Partial<ISpCourses> = { ...formValue }
      
      // Convert tags string to array
      if (formValue.tagsString) {
        payload.tags = formValue.tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      } else {
        payload.tags = []
      }
      delete (payload as any).tagsString
      
      if (this.isEditMode && this.courseId) {
        this.$service.update(this.courseId, payload).subscribe({
          next: () => {
            this.router.navigate(['/sp-courses'])
          },
          error: (err) => {
            console.log(err)
          },
        })
      } else {
        this.$service.create(payload).subscribe({
          next: () => {
            this.router.navigate(['/sp-courses'])
          },
          error: (err) => {
            console.log(err)
          },
        })
      }
    }
  }

  delete() {
    if (this.isEditMode && this.courseId) {
      this.$service.delete(this.courseId).subscribe({
        next: () => {
          this.router.navigate(['/sp-courses'])
        },
        error: (err) => {
          console.log(err)
        },
      })
    }
  }

  cancel() {
    this.router.navigate(['/sp-courses'])
  }
}