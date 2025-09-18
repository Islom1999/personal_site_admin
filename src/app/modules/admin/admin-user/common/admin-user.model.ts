import { IBaseModel } from 'app/core/services/bace.model'
import { IAdminRole } from '../../admin-role/common/admin-role.model'

export interface IAdminUser extends IBaseModel {
  email: string
  name: string
  is_block: boolean
  password: string
  role_id: string
  role: IAdminRole
}
