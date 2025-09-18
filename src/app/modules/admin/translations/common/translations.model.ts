import { IBaseModel } from 'app/core/services/bace.model'

export enum TranslationType {
  admin = 'admin',
  client_mobile = 'client_mobile',
  client_web = 'client_web',
  tg_bot = 'tg_bot',
}

export const TranslationTypeText = {
  [TranslationType.admin]: 'Admin Panel',
  [TranslationType.client_mobile]: 'Mobile ilova',
  [TranslationType.client_web]: 'Frontent site',
  [TranslationType.tg_bot]: 'Telegram Bot',
}

export interface ITranslations extends IBaseModel {
  key: string
  name_uz: string
  name_ru: string
  name_kr: string
  translation_type: TranslationType
  is_use: boolean
}
