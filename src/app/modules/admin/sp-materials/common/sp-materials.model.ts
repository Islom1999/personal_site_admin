import { IBaseModel } from 'app/core/services/bace.model'

export interface ISpMaterials extends IBaseModel {
  file_id: string
  name_uz: string
  name_ru: string
  name_kr: string
  description_uz: string
  description_ru: string
  description_kr: string
  download_count: number
  file_size: number
  icon: string
  sp_category_id: string
  sp_level_id: string
}
