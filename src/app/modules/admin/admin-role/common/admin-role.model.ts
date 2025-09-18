import { IBaseModel } from 'app/core/services/bace.model'
import { IAdminPermission } from '../../admin-permission/common/admin-parmission.model'

export interface IAdminRole extends IBaseModel {
  name: string
  description: string
  admin_role_permissions: IAdminRolePermission[]
}

export interface IAdminRolePermission extends IBaseModel {
  permission_id: string
  permission?: IAdminPermission
  admin_role_id?: string
  admin_role?: IAdminRole
}
