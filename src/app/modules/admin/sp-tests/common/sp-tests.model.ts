import { IBaseModel } from 'app/core/services/bace.model'

export interface ISpTests extends IBaseModel {
  name_uz: string
  name_ru: string
  name_kr: string
  description_uz: string
  description_ru: string
  description_kr: string
  icon: string
  duration: number
  sp_category_id: string
  sp_level_id: string
  sp_tests_quessions: ISpTestsQuession[]
}

export interface ISpTestsQuession extends IBaseModel {
  question: string
  explanation: string
  sp_tests_id: string
  sp_quession_options: ISpQuessionOption[]
}

export interface ISpQuessionOption extends IBaseModel {
  text: string
  is_result: boolean
  sp_tests_quession_id: string
}
