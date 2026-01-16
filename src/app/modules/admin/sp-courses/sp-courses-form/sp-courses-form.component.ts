import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ActivatedRoute, Router } from '@angular/router'
import { FileType } from 'app/shared/enums/file_type'
import {
  UploadFileComponent,
  UploadFileData,
} from 'app/shared/components/upload-file/upload-file.component'
import { WrapperBasicComponent } from 'app/shared/components/wrapper-basic/wrapper-basic.component'
import { SpCategoryService } from '../../sp-category/common/sp-category.service'
import { SpLevelService } from '../../sp-level/common/sp-level.service'
import { ISpCourses } from '../common/sp-courses.model'
import { SpCoursesService } from '../common/sp-courses.service'
import { environment } from 'environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { UploadFileService } from 'app/shared/components/upload-file/common/upload-file.service'

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
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './sp-courses-form.component.html',
  styleUrl: './sp-courses-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCoursesFormComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA]
  private $service = inject(SpCoursesService)
  private $categoryService = inject(SpCategoryService)
  private $levelService = inject(SpLevelService)
  private $cdr = inject(ChangeDetectorRef)
  private sanitizer = inject(DomSanitizer)
  private uploadFileService = inject(UploadFileService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  fb = inject(FormBuilder)

  isEditMode = false
  courseId: string | null = null
  breadcrumbs = [
    { label: 'Kurslar', routerLink: '/sp-courses' },
    { label: 'Yangi kurs', routerLink: '' },
  ]
  baseUploadFileUrl = `${environment.endpoint}/admin/sp-courses/upload/image`
  baseUploadFileVideoUrl = `${environment.endpoint}/admin/sp-courses/upload/file`

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
    tags: [[] as string[]],
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

  get tags(): string[] {
    return this.form.get('tags')?.value || []
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (value) {
      this.form.get('tags')?.setValue([...this.tags, value])
    }
    event.chipInput!.clear()
  }

  removeTag(tag: string): void {
    this.form.get('tags')?.setValue(this.tags.filter((t: string) => t !== tag))
  }

  private loadCourse() {
    if (this.courseId) {
      this.$service.getById(this.courseId).subscribe((course) => {
        this.loadCourseData(course)
        console.log(course)
      })
    }
  }

  private loadCourseData(course: ISpCourses) {
    if (course.file_image_id) {
      this.selectedImageFiles = [{ id: course.file_image_id }]
    }

    this.form.patchValue({
      name_uz: course.name_uz,
      name_kr: course.name_kr,
      name_ru: course.name_ru,
      description_uz: course.description_uz,
      description_kr: course.description_kr,
      description_ru: course.description_ru,
      instructor: course.instructor,
      duration: course.duration,
      rating: course.rating,
      premium_type: course.premium_type,
      price: course.price,
      tags: course.tags || [],
      sp_category_id: course.sp_category_id,
      sp_level_id: course.sp_level_id,
      file_image_id: course.file_image_id,
    })

    // Load existing modules
    if (course.sp_courses_modules?.length) {
      course.sp_courses_modules.forEach((module) => {
        const moduleGroup = this.fb.group({
          name_uz: [module.name_uz, Validators.required],
          name_kr: [module.name_kr, Validators.required],
          name_ru: [module.name_ru, Validators.required],
          duration: [module.duration, Validators.required],
          sp_courses_module_parts: this.fb.array([]),
        })

        // Load existing parts
        if (module.sp_courses_module_parts?.length) {
          const partsArray = moduleGroup.get('sp_courses_module_parts') as FormArray
          module.sp_courses_module_parts.forEach((part) => {
            const contentValue = part.content || ''
            const youtubeValue = part.youtube_link || ''
            const isYoutubeUrl =
              (part.type === 'youtube' || part.type === 'gibrid') &&
              (this.isProbablyUrl(youtubeValue) || this.isProbablyUrl(contentValue))
            const partGroup = this.fb.group({
              name_uz: [part.name_uz, Validators.required],
              name_kr: [part.name_kr, Validators.required],
              name_ru: [part.name_ru, Validators.required],
              duration: [part.duration, Validators.required],
              type: [part.type, Validators.required],
              content: [part.type === 'text' ? contentValue : ''],
              youtube_link: [
                this.isProbablyUrl(youtubeValue)
                  ? youtubeValue
                  : isYoutubeUrl
                    ? contentValue
                    : '',
              ],
              file_video_id: [part.file_video_id || ''],
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
        file_image_id: files[0].uploadData.id,
      })
      this.selectedImageFiles = [{ id: files[0].uploadData.id }]
    } else {
      this.form.patchValue({
        file_image_id: '',
      })
      this.selectedImageFiles = []
    }
  }

  onVideoSelected(files: UploadFileData[], moduleIndex: number, partIndex: number) {
    const key = `${moduleIndex}_${partIndex}`
    const partControl = this.getModulePartsArray(moduleIndex).at(partIndex)

    if (files.length > 0) {
      partControl.patchValue({
        file_video_id: files[0].uploadData.id,
      })
      this.selectedVideoFiles[key] = [{ id: files[0].uploadData.id }]
    } else {
      partControl.patchValue({
        file_video_id: '',
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
      sp_courses_module_parts: this.fb.array([]),
    })
    this.modulesArray.push(moduleGroup)
  }

  removeModule(index: number) {
    this.modulesArray.removeAt(index)
    // Clean up video files for this module
    Object.keys(this.selectedVideoFiles).forEach((key) => {
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
      youtube_link: [''],
      file_video_id: [''],
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
      const formValue = this.form.value as ISpCourses
      const payload: Partial<ISpCourses> = {
        ...formValue,
        sp_courses_modules: (formValue.sp_courses_modules || []).map((module: any) => ({
          ...module,
          sp_courses_module_parts: (module.sp_courses_module_parts || []).map((part: any) => {
            const normalized = { ...part }
            if (normalized.type !== 'text') normalized.content = ''
            if (normalized.type === 'video') normalized.youtube_link = ''
            if (normalized.type === 'youtube') normalized.file_video_id = ''
            if (normalized.type === 'text') {
              normalized.youtube_link = ''
              normalized.file_video_id = ''
            }
            return normalized
          }),
        })),
      }

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

  getServerVideoUrl(moduleIndex: number, partIndex: number): string | null {
    const key = `${moduleIndex}_${partIndex}`
    const partControl = this.getModulePartsArray(moduleIndex).at(partIndex)
    const selectedId = this.selectedVideoFiles[key]?.[0]?.id
    const formId = partControl?.get('file_video_id')?.value
    const id = selectedId || formId
    if (!id) return null
    return `${this.uploadFileService.baseFileUrl}/${id}/stream`
  }

  getYoutubeEmbedUrl(moduleIndex: number, partIndex: number): SafeResourceUrl | null {
    const partControl = this.getModulePartsArray(moduleIndex).at(partIndex)
    const raw = (partControl?.get('youtube_link')?.value || '').trim()
    if (!raw) return null
    const videoId = this.extractYoutubeId(raw)
    if (!videoId) return null
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    )
  }

  private extractYoutubeId(value: string): string | null {
    const match = value.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
    )
    return match ? match[1] : null
  }

  private isProbablyUrl(value: string): boolean {
    return /^https?:\/\//i.test(value)
  }
}
