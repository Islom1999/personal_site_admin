import { IBaseModel } from 'app/core/services/bace.model'

export interface IAdminPermission extends IBaseModel {
  key: string
  name: string
}
