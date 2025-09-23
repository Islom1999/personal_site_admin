import { IBaseModel } from 'app/core/services/bace.model'
import { values } from 'lodash'

export enum PremiumType {
  free = 'free',
  premium = 'premuim',
}

export const PremiumTypeList = [
  { label: PremiumType.free, value: PremiumType.free },
  // { label: PremiumType.premium, value: PremiumType.premium },
]

export enum LessonType {
  text = 'text',
  video_youtube = 'video_youtube',
  video_server = 'video_server',
  gibrid = 'gibrid',
}

export interface ISpCourses extends IBaseModel {
  file_image_id: string
  name_uz: string
  name_ru: string
  name_kr: string
  description_uz: string
  description_ru: string
  description_kr: string
  instructor: string
  duration: string
  rating: string
  premium_type: PremiumType
  price: number
  tags: string[]
  sp_category_id: string
  sp_level_id: string
  sp_courses_modules: ISpCoursesModule[]
}

export interface ISpCoursesModule extends IBaseModel {
  name_uz: string
  name_ru: string
  name_kr: string
  duration: string
  sp_courses_id: string
  sp_courses_module_parts: ISpCoursesModulePart[]
}

export interface ISpCoursesModulePart extends IBaseModel {
  file_video_id: string
  name_uz: string
  name_ru: string
  name_kr: string
  duration: string
  type: LessonType
  content?: string
  sp_courses_module_id: string
}
