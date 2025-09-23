import { IAdminUser } from 'app/modules/admin/admin-user/common/admin-user.model'

export interface User extends IAdminUser
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}
